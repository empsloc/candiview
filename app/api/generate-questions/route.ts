
// app/api/generate-questions/route.ts
import { NextResponse } from "next/server";
import { callGeminiAI } from "@/lib/geminiClient";

const PROMPT_HEADER = `You are an AI interview question generator.

I will provide you with:

* Job Name
* Job Description
* Candidate Resume (resume_raw_data)

Your task is to generate 6 interview questions in strict JSON format with the following rules:

### JSON Format:
{
  "q1": {
    "question": "string",
    "time_alloted": "number (seconds)",
    "difficulty": "easy | medium | hard",
    "answer": ""
  },
  "q2": { ... },
  "q3": { ... },
  "q4": { ... },
  "q5": { ... },
  "q6": { ... }
}

### Rules:
1. Generate 6 questions only.
2. Difficulty distribution:
   - q1 and q2: easy, time_alloted = 20 seconds
   - q3 and q4: medium, time_alloted = 40 seconds
   - q5 and q6: hard, time_alloted = 60 seconds
3. The "answer" field must always be empty ("").
4. Focus on relevance: use the Job Name, Job Description, and resume_raw_data for crafting the questions.
5. Respond with only valid JSON (no explanations, no Markdown, no extra text).`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { jobName, jobDescription, resume_raw_data } = body;

    if (!jobName || !jobDescription || !resume_raw_data) {
      return NextResponse.json(
        { error: "Missing jobName, jobDescription, or resume_raw_data in request" },
        { status: 400 }
      );
    }

    const input = `Job Name: ${jobName}\nJob Description: ${jobDescription}\nResume Raw Data: ${resume_raw_data}`;
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

