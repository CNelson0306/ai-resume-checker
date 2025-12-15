import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // ✅ Create client at runtime (not build time)
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

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
  "missing_keywords": ["keyword1", "keyword2"],
  "feedback": "short paragraph"
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
      messages: [{ role: "user", content: prompt }],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const analysis = JSON.parse(raw);

    return NextResponse.json({ ok: true, ...analysis });
  } catch (err: any) {
    console.error("AI analysis error:", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Failed to analyze resume" },
      { status: 500 }
    );
  }
}
