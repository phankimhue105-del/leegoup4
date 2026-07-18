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
        model: "gemini-2.5-flash",
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

      if (!ai) {
        return res.json({ useFallback: true });
      }

      const promptText = `
You are a friendly, expert AI English Speaking Coach for primary school students studying "Everybody Up 4" (Oxford).
You have just conducted a 10-question speaking test with a student.
Here is the entire conversation log:
${history.map((h: any, i: number) => `Q${i + 1}: ${h.question}\nStudent's Answer: ${h.answer}`).join('\n\n')}

Please provide a comprehensive evaluation of the student's performance. Assess:
1. Pronunciation (clear articulation, syllable stress, native comparison)
2. Grammar (proper structure usage, word order, verb forms)
3. Fluency (flow, rate of speech, sentence links)
4. Vocabulary usage (appropriate word choice matching Everybody Up 4 themes)
5. Overall communication (meaning transmission, response relevance)

Identify any common spelling/grammar mistakes they made in their answers, and suggest correct versions in corrections.

Respond in strict JSON matching this schema:
{
  "overallScore": integer (50-100),
  "pronunciation": integer (50-100),
  "grammar": integer (50-100),
  "vocabulary": integer (50-100),
  "fluency": integer (50-100),
  "strengths": ["list of 2-3 strengths in Vietnamese"],
  "weaknesses": ["list of 2-3 areas of improvement in Vietnamese"],
  "corrections": ["list of incorrect student sentences with explanation of errors in Vietnamese"],
  "feedback": "Detailed encouraging feedback in Vietnamese directly to the child"
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptText,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallScore: { type: Type.INTEGER },
              pronunciation: { type: Type.INTEGER },
              grammar: { type: Type.INTEGER },
              vocabulary: { type: Type.INTEGER },
              fluency: { type: Type.INTEGER },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              corrections: { type: Type.ARRAY, items: { type: Type.STRING } },
              feedback: { type: Type.STRING }
            },
            required: [
              "overallScore", "pronunciation", "grammar", "vocabulary", "fluency", 
              "strengths", "weaknesses", "corrections", "feedback"
            ]
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
      console.error("Gemini local evaluate-speaking error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
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
