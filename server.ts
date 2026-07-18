/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini client on the server
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

  // API Route 1: Validate Sentence Builder with semantic analysis
  app.post("/api/validate-sentence", async (req, res) => {
    try {
      const { question, prompt, correctAnswer, userAnswer, options } = req.body;
      
      if (!userAnswer || !correctAnswer) {
        return res.status(400).json({ error: "Missing fields" });
      }

      if (!ai) {
        return res.json({ useFallback: true });
      }

      const promptText = `
You are an expert ESL (English as a Second Language) teacher checking a primary school student's answer in a "Sentence Builder" (scrambled words) game.
Exercise details:
- Question / Task: "${question}"
- Target Meaning (in Vietnamese): "${prompt}"
- Standard Reference Answer: "${correctAnswer}"
- Available Words (options): ${JSON.stringify(options)}
- Student's assembled answer: "${userAnswer}"

Please analyze if the student's answer is grammatically correct, natural English, uses ONLY the words from the available options (ignoring minor punctuation differences), and matches the target meaning.
Note: Students might omit or place a period/question mark at a different position. Be lenient with punctuation.
If the student's answer has the same meaning and is grammatically correct (e.g. they arranged things in an alternative valid order like "I like reading and writing" instead of "I like writing and reading"), it must be marked as correct.

Respond in strict JSON format matching this schema:
{
  "isCorrect": boolean,
  "explanation": "Explain why in Vietnamese, encouraging and warm for a kid"
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isCorrect: { type: Type.BOOLEAN },
              explanation: { type: Type.STRING }
            },
            required: ["isCorrect", "explanation"]
          }
        }
      });

      if (response.text) {
        const result = JSON.parse(response.text);
        return res.json(result);
      } else {
        return res.json({ useFallback: true });
      }
    } catch (err) {
      console.error("Gemini check-sentence error:", err);
      return res.json({ useFallback: true });
    }
  });

  // API Route 2: Real Gemini-powered Speech Evaluation
  app.post("/api/evaluate-speech", async (req, res) => {
    try {
      const { transcript, audio, mimeType, question, suggestedAnswer, targetPatterns } = req.body;

      if (!transcript && !audio) {
        return res.status(400).json({ error: "Missing transcript or audio data" });
      }

      if (!ai) {
        return res.json({ useFallback: true });
      }

      let contents: any[] = [];
      let schemaProperties: any = {
        pronunciationScore: { type: Type.INTEGER },
        grammarScore: { type: Type.INTEGER },
        fluencyScore: { type: Type.INTEGER },
        overallScore: { type: Type.INTEGER },
        feedback: { type: Type.STRING },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        suggestedPractice: { type: Type.STRING }
      };
      let requiredFields = [
        "pronunciationScore", "grammarScore", "fluencyScore", "overallScore", 
        "feedback", "strengths", "weaknesses", "suggestedPractice"
      ];

      if (audio) {
        // Multimodal input: base64 audio file + text instructions
        contents = [
          {
            inlineData: {
              mimeType: mimeType || "audio/webm",
              data: audio
            }
          },
          {
            text: `You are a friendly AI English Speaking Coach for primary school students studying "Everybody Up 4" (Oxford).
Listen to the student's spoken response in the audio to this question:
- Question asked: "${question}"
- Target / Expected answer: "${suggestedAnswer}" (Target patterns to look for: ${JSON.stringify(targetPatterns)})

Please transcribe what the student said in the audio and assess three criteria (0-100 score):
1. pronunciation: clear articulation compared to native standards.
2. grammar: correct structures and target patterns usage.
3. fluency: speed and natural flow.

Respond in strict JSON matching this schema:
{
  "transcript": "English transcription of what the student said in the audio",
  "pronunciationScore": integer (50-100),
  "grammarScore": integer (50-100),
  "fluencyScore": integer (50-100),
  "overallScore": integer (50-100),
  "feedback": "Friendly feedback in Vietnamese directly to the child",
  "strengths": ["list of strengths in Vietnamese"],
  "weaknesses": ["list of areas to improve in Vietnamese"],
  "suggestedPractice": "Practical practice tip in Vietnamese"
}
`
          }
        ];
        schemaProperties.transcript = { type: Type.STRING };
        requiredFields.push("transcript");
      } else {
        // Text-only input (fallback or typed answer)
        contents = [
          {
            text: `You are a friendly AI English Speaking Coach for primary school students studying "Everybody Up 4" (Oxford).
Evaluate this spoken response:
- Question asked: "${question}"
- Expected Answer / Patterns: "${suggestedAnswer}" (Target patterns: ${JSON.stringify(targetPatterns)})
- Student's actual spoken transcript: "${transcript}"

Assess three criteria (0-100 score):
1. pronunciation: clear articulation compared to native standards.
2. grammar: correct structures and target patterns usage.
3. fluency: speed and natural flow.

Respond in strict JSON matching this schema:
{
  "pronunciationScore": integer (50-100),
  "grammarScore": integer (50-100),
  "fluencyScore": integer (50-100),
  "overallScore": integer (50-100),
  "feedback": "Friendly feedback in Vietnamese directly to the child",
  "strengths": ["list of strengths in Vietnamese"],
  "weaknesses": ["list of areas to improve in Vietnamese"],
  "suggestedPractice": "Practical practice tip in Vietnamese"
}
`
          }
        ];
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: schemaProperties,
            required: requiredFields
          }
        }
      });

      if (response.text) {
        const result = JSON.parse(response.text);
        return res.json(result);
      } else {
        return res.json({ useFallback: true });
      }
    } catch (err) {
      console.error("Gemini evaluate-speech error:", err);
      return res.json({ useFallback: true });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
