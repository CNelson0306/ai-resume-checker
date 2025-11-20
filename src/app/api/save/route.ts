import { NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { importJWK, jwtVerify } from "jose";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

// Fetch Cognito JWKS for verification
const JWKS_URL = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`;

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const jwks = await fetch(JWKS_URL).then((res) => res.json());

    // Verify the token signature and extract the payload
    const { payload } = await jwtVerify(
      token,
      await importJWK(jwks.keys[0], "RS256") // first key from Cognito
    );

    const userId = payload.sub;
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });
    }

    const { resumeText, jobDescription, analysis } = await req.json();
    const id = uuidv4();

    const item = {
      userId,
      id,
      timestamp: new Date().toISOString(),
      resumeText,
      jobDescription,
      analysis,
    };

    await docClient.send(
      new PutCommand({
        TableName: process.env.DYNAMO_TABLE!,
        Item: item,
      })
    );

    return NextResponse.json({ ok: true, id });
  } catch (error: any) {
    console.error("Error saving analysis:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
