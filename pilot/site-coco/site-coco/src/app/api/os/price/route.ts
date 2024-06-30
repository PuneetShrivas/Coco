import { NextRequest, NextResponse } from 'next/server';

const ELASTICSEARCH_URL = 'https://7c7e5c92fe80441ea115529f473aafbb.us-central1.gcp.cloud.es.io';
const ELASTICSEARCH_API_KEY = "Zk1MT1pwQUJ6T3h4dnZHVlB2VmM6Vy10Y0M5Ql9UcldPaDdCM0t5TVBmUQ=="; // Replace with your actual API key

const INDEX_NAME = 'price';

interface PriceData {
    vendor_number: number;
    price: number;
    game: number;
    number: number;
}

export async function POST(request: NextRequest) {
    try {
        const newPriceData: PriceData = await request.json();

        // Input Validation (You might want to uncomment this in production)
        if (
            !newPriceData.vendor_number || 
            !newPriceData.price || 
            !newPriceData.game || 
            !newPriceData.number 
        ) {
            return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        // Find the existing document for this vendor_number (if it exists)
        const searchResponse = await fetch(`${ELASTICSEARCH_URL}/${INDEX_NAME}/_search?q=vendor_number:${newPriceData.vendor_number}`, {
            headers: {
                'Authorization': `ApiKey ${ELASTICSEARCH_API_KEY}`,
            }
        });

        const searchData = await searchResponse.json();

        let docId = null; // Will hold the document ID if it's found
        if (searchData.hits.hits.length > 0) {
            docId = searchData.hits.hits[0]._id; 
        }

        // Use _update API to update existing doc or create a new one if it doesn't exist
        const endpoint = docId 
            ? `${ELASTICSEARCH_URL}/${INDEX_NAME}/_update/${docId}`
            : `${ELASTICSEARCH_URL}/${INDEX_NAME}/_doc`;

        const response = await fetch(endpoint, {
            method: docId ? 'POST' : 'PUT', // Use POST for _update, PUT for _create
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `ApiKey ${ELASTICSEARCH_API_KEY}`,
            },
            body: JSON.stringify(
                docId 
                    ? { doc: newPriceData }  // Update existing document
                    : newPriceData          // Create new document
            ),
        });

        if (response.ok) {
            return NextResponse.json({ message: 'Price data updated/saved successfully' }, { status: 200 }); // Status 200 for update
        } else {
            throw new Error(`Elasticsearch ${docId ? 'Update' : 'Create'} Error: ${response.status} ${response.statusText}`);
        }

    } catch (error) {
        console.error("Error updating/saving price data:", error);
        return new NextResponse(JSON.stringify({ error: "Failed to update/save price data" }), { status: 500 });
    }
}


// GET handler
export async function GET(request: NextRequest) {
    try {
        const vendorNumber = request.nextUrl.searchParams.get("vendor_number") as string; // Get vendor_number from query parameter

        // Fetch price data from Elasticsearch for the given vendor_number
        const response = await fetch(`${ELASTICSEARCH_URL}/${INDEX_NAME}/_search?q=vendor_number:${vendorNumber}`, {
            headers: {
                'Authorization': `ApiKey ${ELASTICSEARCH_API_KEY}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return NextResponse.json(data.hits.hits); // Return an array of matching documents
        } else {
            throw new Error(`Elasticsearch GET Error: ${response.status} ${response.statusText}`);
        }

    } catch (error) {
        console.error("Error fetching price data:", error);
        return new NextResponse(JSON.stringify({ error: "Failed to fetch price data" }), { status: 500 });
    }
}
