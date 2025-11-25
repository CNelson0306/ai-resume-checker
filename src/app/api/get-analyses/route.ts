import { NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { verifyCognitoToken } from "../../../../lib/verifyCognitoToken"; // helper from before

const client = new DynamoDBClient({
  region: process.env.NEXT_REGION,
});

const docClient = DynamoDBDocumentClient.from(client);

export async function GET(req: Request) {
  try {
    // 🔹 Check for and verify Cognito JWT
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const user = await verifyCognitoToken(token);

    if (!user || !user.sub) {
      return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });
    }

    const userId = user.sub;

    // 🔹 Query user’s analyses from DynamoDB
    const command = new QueryCommand({
      TableName: process.env.DYNAMO_TABLE!,
      KeyConditionExpression: "userId = :u",
      ExpressionAttributeValues: {
        ":u": userId,
      },
    });

    const response = await docClient.send(command);
    const items = response.Items || [];

    // 🔹 Sort by most recent
    items.sort(
      (a: any, b: any) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({ ok: true, items });
  } catch (error: any) {
    console.error("Error fetching analyses:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
