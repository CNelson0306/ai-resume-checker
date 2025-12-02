import { NextResponse } from "next/server";
import OpenAI from "openai";

console.log("OPENAI KEY ON SERVER:", process.env.OPENAI_API_KEY ? "YES" : "NO");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { ok: false, error: "Missing resume text or job description" },
        { status: 400 }
      );
    }

    const prompt = `
You are an expert ATS (Applicant Tracking System) and career coach.
Compare the following resume and job description, then provide structured feedback.

Return a JSON object with:
{
  "match_score": (0-100),
  "missing_keywords": ["keyword1", "keyword2", ...],
  "feedback": "short paragraph of actionable advice"
}

Resume:
"""
${resumeText}
"""

Job Description:
"""
${jobDescription}
"""
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }]
    });

    const raw = completion.choices[0]?.message?.content || "{}";

    let analysis;
    try {
      analysis = JSON.parse(raw);
    } catch (e) {
      console.error("JSON parse failed. Raw output:", raw);
      throw new Error("Invalid JSON from model.");
    }

    return NextResponse.json({ ok: true, ...analysis });

  } catch (err: any) {
    console.error("AI analysis error:", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Failed to analyze resume" },
      { status: 500 }
    );
  }
}
