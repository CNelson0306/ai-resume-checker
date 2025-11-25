import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({ region: process.env.NEXT_REGION });
const docClient = DynamoDBDocumentClient.from(client);

export async function saveAnalysis(data: any) {
  const id = uuidv4();
  const item = {
    userId: data.userId,
    id,
    timestamp: new Date().toISOString(),
    resumeText: data.resumeText,
    job_description: data.jobDescription,
    match_score: data.match_score || data.analysis?.match_score,
    feedback: data.feedback || data.analysis?.feedback,
    missing_keywords: data.missing_keywords || data.analysis?.missing_keywords,
    rewritten: data.rewritten || data.analysis?.rewritten,
  };

  await docClient.send(
    new PutCommand({
      TableName: process.env.DYNAMO_TABLE!,
      Item: item,
    })
  );

  return item;
}
