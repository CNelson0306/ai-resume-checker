import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";

export async function testAWSConnection() {
  try {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    // Use the proper command object
    const command = new ListTablesCommand({});
    const result = await client.send(command);

    console.log("✅ AWS Connection OK! DynamoDB tables:", result.TableNames);
    return { ok: true, tables: result.TableNames };
  } catch (error) {
    console.error("❌ AWS connection failed:", error);
    return { ok: false, error: String(error) };
  }
}
