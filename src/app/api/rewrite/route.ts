import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
    try {
        const { resumeText, jobDescription } = await req.json()

        if (!resumeText || !jobDescription) {
            return NextResponse.json({ ok: false, error: "Missing inputs."})
        }

        const prompt = `
        You are an expert resume writer and ATS optimization assistant.
        Rewrite the following resume to better match the given job description.
        Preserve the user's tone and structure but optimize:
        - Keywords relevant to the job
        - Clarity and impact of bullet points
        - Professional tone
        - ATS readability

        Return only the rewritten resume text.

        Do not include anything that the user is not familiar with or has no experience in.

        Resume:
        ${resumeText}

        Job Description:
        ${jobDescription}
        `;

        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        })

        const rewritten = completion.choices[0].message.content;

        return NextResponse.json({ ok: true, rewritten })
    } catch (error: any) {
        console.error("Rewrite API error:", error)
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }
}