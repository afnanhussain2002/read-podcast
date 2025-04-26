import { AssemblyAI } from "assemblyai";
export const client = new AssemblyAI({
    apiKey: process.env.ASSEMBLYAI_API_KEY!,
  });