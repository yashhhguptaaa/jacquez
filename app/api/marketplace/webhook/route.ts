import { NextRequest, NextResponse } from "next/server";

function log(level: string, message: string, data: any = null) {
  const timestamp = new Date().toISOString();
  const enableDetailedLogging = process.env.ENABLE_DETAILED_LOGGING === "true";

  if (enableDetailedLogging || level === "ERROR") {
    console.log(
      `[${timestamp}] ${level}: ${message}`,
      data ? JSON.stringify(data, null, 2) : ""
    );
  } else {
    console.log(`[${timestamp}] ${level}: ${message}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    log("INFO", "GitHub Marketplace webhook received");

    const formData = await request.formData();
    
    const data: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    log("INFO", "Marketplace webhook data", data);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    log("ERROR", "Marketplace webhook processing failed", {
      error: error.message,
      stack: error.stack,
    });
    
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
