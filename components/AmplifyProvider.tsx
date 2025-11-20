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
      Amplify.configure(awsConfig);
      configured = true;
    }
  }, []);

  return <>{children}</>;
}
