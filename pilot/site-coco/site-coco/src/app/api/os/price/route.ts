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

        // // Input Validation
        // if (
        //     !newPriceData.vendor_number || 
        //     !newPriceData.price ||  
        //     !newPriceData.number 
        // ) {
        //     return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        // }

        // Save to Elasticsearch (Direct API Call)
        const response = await fetch(`${ELASTICSEARCH_URL}/${INDEX_NAME}/_doc`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `ApiKey ${ELASTICSEARCH_API_KEY}`, 
            },
            body: JSON.stringify(newPriceData),
        });

        if (response.ok) {
            return NextResponse.json({ message: 'Price data saved successfully' }, { status: 201 });
        } else {
            throw new Error(`Elasticsearch POST Error: ${response.status} ${response.statusText}`);
        }

    } catch (error) {
        console.error("Error saving price data:", error);
        return new NextResponse(JSON.stringify({ error: "Failed to save price data" }), { status: 500 });
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
