// app/api/evaluate-candidate/route.ts
import { NextResponse } from "next/server";
import { callGeminiAI } from "@/lib/geminiClient";

const PROMPT_HEADER = `You are an AI interviewer. Evaluate the performance of a candidate based on the following information:

Your task is to provide a final evaluation and score for the candidate.

### INPUT FIELDS:
* Job Name
* Job Description
* Candidate Resume (resume_raw_data)
* Chat History (Questions and Answers)

### OUTPUT FORMAT:
{
  "ai_evaluation": "string (paragraph summarizing candidate performance, strengths, weaknesses, and suitability)",
  "ai_score": number (marks out of 100)
}

### RULES:
1. Analyze the candidate’s answers in relation to the job requirements.
2. Provide a single paragraph evaluation.
3. Provide an overall score out of 100.
4. Respond strictly in JSON only. No explanations, no Markdown, no extra text.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { job_name, job_description, resume_raw_data, chat_history } = body;

    if (!job_name || !job_description || !resume_raw_data || !chat_history) {
      return NextResponse.json(
        { error: "Missing job_name, job_description, resume_raw_data, or chat_history in request" },
        { status: 400 }
      );
    }

    const input = `Job Name: ${job_name}\nJob Description: ${job_description}\nResume Raw Data: ${resume_raw_data}\nChat History: ${JSON.stringify(chat_history)}`;

    const aiOutput = await callGeminiAI(`${PROMPT_HEADER}\n\nINPUT:\n${input}`);

    try {
      const parsed = JSON.parse(aiOutput);
      return NextResponse.json({ data: parsed });
    } catch (err) {
      return NextResponse.json(
        { error: "Could not parse JSON from AI output", modelOutput: aiOutput },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
