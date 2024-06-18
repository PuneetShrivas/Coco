// app/api/mixpanel/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const mixpanelUrl = "https://api.mixpanel.com/track?ip=1"; // Or other Mixpanel endpoints

  try {
    const mixpanelResponse = await fetch(mixpanelUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(await req.json()), // Parse the JSON body
    });

    if (!mixpanelResponse.ok) {
      throw new Error(
        `Mixpanel API request failed with status ${mixpanelResponse.status}`
      );
    }

    const mixpanelData = await mixpanelResponse.json();

    return NextResponse.json(mixpanelData); // Use NextResponse.json() to return JSON data
  } catch (error) {
    console.error("Error proxying to Mixpanel:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to proxy request" }), {
      status: 500,
    });
  }
}
