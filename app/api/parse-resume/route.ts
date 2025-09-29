// app/api/parse-resume/route.ts
import { NextResponse } from "next/server";
import { callGeminiAI } from "@/lib/geminiClient";

const PROMPT_HEADER = `You will receive a raw string of text extracted from a resume PDF (extracted by a PDF reader). 
Return EXACTLY ONE valid JSON object with this schema (no explanations, no markdown):

{
  "name": "",
  "email": "",
  "phone": "",
  "education": [],
  "experience": [],
  "achievement": [],
  "certification": [],
  "projects": [],
  "skills": []
}

Rules:
- Output ONLY the JSON object.
- Use arrays for multiple items.
- Normalize email and phone if possible.
- Keep output valid JSON.
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text: string = body?.text ?? "";

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing text in request" }, { status: 400 });
    }

    // Call the helper
    const aiOutput = await callGeminiAI(`${PROMPT_HEADER}\n\nINPUT_TEXT:\n${text}`);

    // Try to parse AI output as JSON
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
