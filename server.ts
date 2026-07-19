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

  // API Route: Speech to Text (transcribe)
  app.post("/api/transcribe", async (req, res) => {
    try {
      const { audio, mimeType } = req.body;

      if (!audio) {
        return res.status(400).json({ error: "Missing audio data" });
      }

      if (!ai) {
        return res.json({ useFallback: true, transcript: "" });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
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
      console.error("Transcription local route error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // API Route: AI Teacher Chat Feedback
  app.post("/api/chat", async (req, res) => {
    try {
      const { history, currentQuestion, nextQuestion } = req.body;

      if (!ai) {
        return res.json({ 
          useFallback: true, 
          reply: "Good job!", 
          nextQuestion: nextQuestion ? `Câu hỏi tiếp theo:\n\n💬 "${nextQuestion.question}"\n(${nextQuestion.vietnamesePrompt})` : "Chúc mừng con đã hoàn thành bài nói!" 
        });
      }

      const studentAnswer = history && history.length > 0 ? history[history.length - 1].answer : "";

      let nextQuestionInstruction = "";
      if (nextQuestion) {
        nextQuestionInstruction = `introduce the next question: "${nextQuestion.question}" (with its Vietnamese helper translation: "${nextQuestion.vietnamesePrompt}"). Formulate it nicely so the student knows it's the next question.`;
      } else {
        nextQuestionInstruction = `state that this was the last question, congratulate the student warmly in Vietnamese, and say that you are now compiling the final speaking report.`;
      }

      const promptText = `
You are a friendly, encouraging AI English Teacher for primary school students studying "Everybody Up 4" (Oxford).
You are in the middle of a speaking test conversation.
- Question asked: "${currentQuestion.question}"
- Target Expected Answer: "${currentQuestion.suggestedAnswer}"
- Student's spoken response: "${studentAnswer}"

Please review the student's response. Give a short, encouraging teacher comment in Vietnamese (warm and friendly for a kid, maximum 2 sentences) commenting on how they did.
Then, ${nextQuestionInstruction}

Format the response strictly matching this JSON schema:
{
  "reply": "Short encouraging teacher comment in Vietnamese",
  "nextQuestion": "The next question formulated clearly with its Vietnamese translation, or graduation message if completed"
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: promptText,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: { type: Type.STRING },
              nextQuestion: { type: Type.STRING }
            },
            required: ["reply", "nextQuestion"]
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
      console.error("Chat local route error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // API Route: Comprehensive speaking evaluation
  app.post("/api/evaluate-speaking", async (req, res) => {
    try {
      const { history, unitId } = req.body;

      if (!history || !Array.isArray(history)) {
        return res.status(400).json({ error: "Missing conversation history" });
      }

      console.log("Transcript:", JSON.stringify(history, null, 2));

      if (!ai) {
        return res.status(500).json({ error: "Gemini API key missing", useFallback: true });
      }

      const promptText = `
You are a strict, fair, and professional AI English Speaking Coach for primary school students studying "Everybody Up 4" (Oxford).
You are evaluating a student's 10-question speaking performance.

Here is the exact conversation log:
${history.map((h: any, i: number) => `Q${i + 1}: ${h.question}\nStudent's Spoken Answer: "${h.answer}"`).join('\n\n')}

EVALUATION RULES:
1. DYNAMIC REALISTIC SCORING:
   - Excellent English answers matching the question prompt: Score 85 - 100.
   - Good or simple English answers with minor errors: Score 65 - 84.
   - Irrelevant, random nonsensical words (e.g., "Banana elephant book"), incorrect answers, or missing answers: Score 30 - 60.
   - DO NOT give generic 85 scores unless the performance genuinely matches 85/100.
2. DYNAMIC FEEDBACK:
   - "feedback", "strengths", "weaknesses", "commonMistakes", and "suggestedPractice" MUST directly reference specific sentences spoken by the student.

Return strict JSON matching all 9 required fields:
{
  "overallScore": integer (30-100),
  "pronunciationScore": integer (30-100),
  "grammarScore": integer (30-100),
  "fluencyScore": integer (30-100),
  "feedback": "Detailed encouraging feedback in Vietnamese mentioning their specific performance",
  "strengths": ["list of specific strengths in Vietnamese based on their actual spoken answers"],
  "weaknesses": ["list of specific weaknesses in Vietnamese based on their actual spoken answers"],
  "commonMistakes": ["list of specific mistakes or incorrect sentences spoken by the student"],
  "suggestedPractice": "Specific practice tips in Vietnamese"
}
`;

      let attempts = 0;
      let result: any = null;

      while (attempts < 2 && !result) {
        attempts++;
        try {
          const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: promptText,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  overallScore: { type: Type.INTEGER },
                  pronunciationScore: { type: Type.INTEGER },
                  grammarScore: { type: Type.INTEGER },
                  fluencyScore: { type: Type.INTEGER },
                  feedback: { type: Type.STRING },
                  strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                  weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                  commonMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
                  suggestedPractice: { type: Type.STRING }
                },
                required: [
                  "overallScore", "pronunciationScore", "grammarScore", "fluencyScore",
                  "feedback", "strengths", "weaknesses", "commonMistakes", "suggestedPractice"
                ]
              }
            }
          });

          const rawText = response.text ? response.text.trim() : "";
          console.log("Gemini raw response:", rawText);

          if (!rawText) {
            console.log("JSON parse failed");
            continue;
          }

          try {
            const parsed = JSON.parse(rawText);
            console.log("JSON parse success");

            const requiredFields = [
              "overallScore", "pronunciationScore", "grammarScore", "fluencyScore",
              "feedback", "strengths", "weaknesses", "commonMistakes", "suggestedPractice"
            ];

            const hasAllFields = requiredFields.every(field => parsed[field] !== undefined && parsed[field] !== null);

            if (hasAllFields) {
              console.log("Parsed evaluation:", JSON.stringify(parsed, null, 2));
              result = parsed;
            } else {
              console.warn(`Missing required fields on attempt ${attempts}. Retrying...`);
            }
          } catch (parseErr) {
            console.log("JSON parse failed");
            console.log("Gemini raw response:", rawText);
          }
        } catch (genErr) {
          console.error("Gemini generateContent error:", genErr);
        }
      }

      if (result) {
        return res.json(result);
      } else {
        return res.status(500).json({ error: "Failed to parse evaluation from Gemini", useFallback: true });
      }
    } catch (err) {
      console.error("Gemini local evaluate-speaking error:", err);
      return res.status(500).json({ error: "Internal Server Error", useFallback: true });
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
