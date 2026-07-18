import { GoogleGenAI } from "@google/genai";

// Initialize Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && !apiKey.includes("MY_GEMINI_API_KEY")) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { audio, mimeType } = req.body;

    if (!audio) {
      return res.status(400).json({ error: "Missing audio data" });
    }

    if (!ai) {
      return res.json({ useFallback: true, transcript: "" });
    }

    // Call Gemini with multimodal audio input to transcribe it
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: mimeType || "audio/webm",
            data: audio
          }
        },
        {
          text: "You are a precise speech-to-text transcriber for primary school students learning English. Listen to the audio and write down exactly what the speaker says in English. Do not add any punctuation, commentary, corrections, explanations, or assumptions. Output ONLY the English transcript of the spoken words."
        }
      ]
    });

    const transcriptText = response.text ? response.text.trim() : "";
    return res.json({ transcript: transcriptText });
  } catch (err) {
    console.error("Transcription Serverless Function error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

