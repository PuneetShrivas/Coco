import { NextRequest, NextResponse } from 'next/server';

const ELASTICSEARCH_URL = 'https://7c7e5c92fe80441ea115529f473aafbb.us-central1.gcp.cloud.es.io';
const ELASTICSEARCH_API_KEY = "Zk1MT1pwQUJ6T3h4dnZHVlB2VmM6Vy10Y0M5Ql9UcldPaDdCM0t5TVBmUQ==";

const INDEX_NAME = 'transactions';

interface Transaction {
    vendor_number: string;
    phone_number: string;
    price: number;
    gamified: 0 | 1 | 2; 
}

export async function POST(request: NextRequest) {
  try {
    const newTransaction: Transaction = await request.json();

    // Input Validation
    if (!newTransaction.vendor_number || !newTransaction.phone_number || !newTransaction.price) {
        return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Save to Elasticsearch (Direct API Call)
    const response = await fetch(`${ELASTICSEARCH_URL}/${INDEX_NAME}/_doc`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `ApiKey ${ELASTICSEARCH_API_KEY}`, 
        },
        body: JSON.stringify(newTransaction)
    });

    if (response.ok) {
        return NextResponse.json({ message: 'Transaction saved successfully' }, {status: 201});
    } else {
        throw new Error(`Elasticsearch POST Error: ${response.status} ${response.statusText}`);
    }

  } catch (error) {
    console.error("Error saving transaction:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to save transaction" }), { status: 500 });
  }
}

// GET handler (if needed)
export async function GET(request: NextRequest) {
  try {
      const vendorNumber = request.nextUrl.searchParams.get("vendor_number") as string;

      // Query Elasticsearch (Direct API Call)
      const response = await fetch(`${ELASTICSEARCH_URL}/${INDEX_NAME}/_search?q=vendor_number:${vendorNumber}`, {
          headers: {
              'Authorization': `ApiKey ${ELASTICSEARCH_API_KEY}`, 
          }
      });

      if (response.ok) {
          const result = await response.json();
          return NextResponse.json(result.hits.hits); 
      } else {
          throw new Error(`Elasticsearch GET Error: ${response.status} ${response.statusText}`);
      }

    } catch (error) {
      console.error("Error fetching transactions:", error);
      return new NextResponse(JSON.stringify({ error: "Failed to fetch transactions" }), { status: 500 });
    }
}
