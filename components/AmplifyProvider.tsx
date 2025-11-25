"use client";

import { useEffect } from "react";
import { Amplify } from "aws-amplify";
import awsConfig from "../src/aws-export";

let configured = false;

export default function AmplifyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!configured) {
      // Check required env vars at runtime
      const { region, userPoolId, userPoolWebClientId } = awsConfig.Auth;

      if (!region || !userPoolId || !userPoolWebClientId) {
        console.error("Missing required Amplify environment variables:", {
          region,
          userPoolId,
          userPoolWebClientId,
        });
      } else {
        Amplify.configure(awsConfig);
        configured = true;
      }
    }
  }, []);

  return <>{children}</>;
}
