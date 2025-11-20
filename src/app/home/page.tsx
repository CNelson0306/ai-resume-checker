"use client";

import AmplifyProvider from "../../../components/AmplifyProvider";
import HomePage from "../page";

export default function Page() {
  return (
    <AmplifyProvider>
      <HomePage />
    </AmplifyProvider>
  );
}
