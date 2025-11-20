// lib/resumeParser.ts
import mammoth from "mammoth";
import { Buffer } from "buffer";

export async function parseResume(buffer: Buffer, mimeType: string): Promise<string> {
  try {
    if (mimeType.includes("pdf")) {
      // Dynamically import pdf-parse to avoid Next.js bundler issues
      const pdfParse = (await import("pdf-parse")).default || (await import("pdf-parse"));
      const data = await (pdfParse as any)(buffer);
      return data.text;
    }

    if (mimeType.includes("word") || mimeType.includes("docx")) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    return buffer.toString("utf8");
  } catch (err: any) {
    console.error("Error parsing resume:", err);
    throw new Error("Failed to parse resume file");
  }
}
