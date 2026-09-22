import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "./src/ai/prompt.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function test() {
  const result = await ai.interactions.create({
    model: "gemini-3.6-flash",
    input: "I want to check my booking MAH-9921",
    system_instruction: SYSTEM_PROMPT,
  });

  console.log(result.output_text);
}

test().catch(console.error);