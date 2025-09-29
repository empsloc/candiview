// lib/geminiClient.ts
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GIMINI_API_KEY!,
});

export async function callGeminiAI(inputText: string) {
  const model = "gemini-2.0-flash";
  const contents = [
    {
      role: "user",
      parts: [{ text: inputText }],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    contents,
    config: {
      temperature: 0,
    },
  });

  let fullText = "";
  for await (const chunk of response) {
    if (typeof chunk.text === "string") {
      fullText += chunk.text;
    }
  }
 // Clean up Markdown-style code fences if present
 fullText = fullText.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();

  return fullText;
}
