import { NextResponse } from "next/server";
import { saveAnalysis } from "../../../../lib/dynamo";
import { verifyCognitoToken } from "../../../../lib/verifyCognitoToken";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const user = await verifyCognitoToken(token);

    if (!user || !user.sub) {
      return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });
    }

    // Parse incoming data
    const data = await req.json();

    // Attach required fields
    data.userId = user.sub;
    data.timestamp = Date.now(); // ← REQUIRED FIX (consistently named)

    const saved = await saveAnalysis(data);

    return NextResponse.json({ ok: true, saved });
  } catch (error: any) {
    console.error("Error saving analysis:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
