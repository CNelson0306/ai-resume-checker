import { NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { verifyCognitoToken } from "../../../../lib/verifyCognitoToken";

const client = new DynamoDBClient({
  region: process.env.NEXT_REGION,
});

const docClient = DynamoDBDocumentClient.from(client);

export async function POST(req: Request) {
  try {
    // Authenticate user
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const user = await verifyCognitoToken(token);

    if (!user || !user.sub) {
      return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });
    }

    const { id } = await req.json();
    const userId = user.sub;

    if (!id) {
      return NextResponse.json({ ok: false, error: "Missing ID" }, { status: 400 });
    }

    // Correct DynamoDB Key (must include BOTH userId + id)
    const params = {
      TableName: process.env.DYNAMO_TABLE!,
      Key: {
        userId,
        id,
      },
    };

    await docClient.send(new DeleteCommand(params));

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({ ok: false, error: error.message });
  }
}
