import { CognitoJwtVerifier } from "aws-jwt-verify";

export async function verifyCognitoToken(token: string) {
  if (!process.env.COGNITO_USER_POOL_ID || !process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID) {
    console.error("Missing Cognito env vars at runtime");
    return null;
  }

  const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
    tokenUse: "id",
  });

  try {
    return await verifier.verify(token);
  } catch (err) {
    console.error("JWT validation failed:", err);
    return null;
  }
}
