import { CognitoJwtVerifier } from "aws-jwt-verify";

// 🔹 Create a verifier for ID tokens
export const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID!,  
  tokenUse: "id",                                   // verify ID token
clientId: process.env.COGNITO_CLIENT_ID!,
});

export async function verifyCognitoToken(token: string) {
  try {
    const payload = await verifier.verify(token); // throws if invalid
    return payload;
  } catch (err) {
    console.error("JWT validation failed:", err);
    return null;
  }
}
