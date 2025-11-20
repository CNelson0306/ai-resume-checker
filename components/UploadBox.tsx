"use client";

import React, { useState, ChangeEvent } from "react";

interface UploadBoxProps {
  onTextReady: (text: string) => void;
}

export default function UploadBox({ onTextReady }: UploadBoxProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!data.ok) throw new Error(data.error || "Upload failed");
      onTextReady(data.text);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="upload-box">
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="mb-3"
      />
      {uploading && <p>⏳ Parsing your resume…</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
