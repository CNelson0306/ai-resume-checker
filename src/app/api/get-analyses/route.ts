import { NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { verifyCognitoToken } from "../../../../lib/verifyCognitoToken";

// Validate required environment variables
const { NEXT_REGION, DYNAMO_TABLE } = process.env;
if (!NEXT_REGION || !DYNAMO_TABLE) {
  console.error("Missing required environment variables!");
}

const client = new DynamoDBClient({
  region: NEXT_REGION,
  credentials: undefined,
});
const docClient = DynamoDBDocumentClient.from(client);

export async function GET(req: Request) {
  try {
    // 🔹 Authorization check
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const user = await verifyCognitoToken(token);

    if (!user || !user.sub) {
      return NextResponse.json(
        { ok: false, error: "Invalid token payload" },
        { status: 401 }
      );
    }

    const userId = user.sub;

    // 🔹 DynamoDB Query (fixed)
    let response;
    try {
      const command = new QueryCommand({
        TableName: DYNAMO_TABLE,
        KeyConditionExpression: "userId = :u AND begins_with(id, :p)",
        ExpressionAttributeValues: {
          ":u": userId,
          ":p": "", // match ALL ids
        },
      });

      response = await docClient.send(command);
    } catch (dbError) {
      console.error("DynamoDB query failed:", dbError);
      return NextResponse.json(
        { ok: false, error: "Failed to fetch analyses" },
        { status: 500 }
      );
    }

    const items = (response.Items || []).sort(
      (a: any, b: any) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({ ok: true, items });
  } catch (error: any) {
    console.error("Unexpected error in GET /get-analyses:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
