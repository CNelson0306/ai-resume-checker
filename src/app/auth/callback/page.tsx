"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleAuth() {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (!code) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          `https://${process.env.NEXT_PUBLIC_COGNITO_DOMAIN!}/oauth2/token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
              redirect_uri: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI!,
              code,
            }),
          }
        );

        const data = await response.json();
        console.log("Tokens:", data);

        if (data.id_token) {
          localStorage.setItem("idToken", data.id_token);
          localStorage.setItem("accessToken", data.access_token);
        }

        router.push("/dashboard");
      } catch (error) {
        console.error("Auth error:", error);
        router.push("/login");
      }
    }

    handleAuth();
  }, [router]);

  return (
    <main style={{ textAlign: "center", marginTop: "4rem" }}>
      <h2>Logging you in...</h2>
    </main>
  );
}
