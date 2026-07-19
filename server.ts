import express from "express";
import createViteServer from "vite";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini client with fallback environment key lookup
const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
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

function extractJsonString(rawText: string): string {
  if (!rawText) return "";
  let clean = rawText.trim();
  clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const jsonMatch = clean.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    clean = jsonMatch[0];
  }
  return clean;
}

async function startServer() {
  // API Chat Endpoint for conversational AI responses between questions
  app.post("/api/chat", async (req, res) => {
    try {
      const { history, currentQuestion, nextQuestion } = req.body;
      
      if (!currentQuestion) {
        return res.status(400).json({ error: "Missing currentQuestion" });
      }

      const activeApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
      const client = ai || (activeApiKey && !activeApiKey.includes("MY_GEMINI_API_KEY") ? new GoogleGenAI({ apiKey: activeApiKey }) : null);

      if (!client) {
        return res.json({
          reply: "Good job! Let's continue to the next question.",
          nextQuestion: nextQuestion ? `Câu hỏi tiếp theo:\n\n💬 "${nextQuestion.question}"\n(${nextQuestion.vietnamesePrompt})` : undefined
        });
      }

      const promptText = `
You are a friendly, encouraging AI English Teacher for a primary school student studying "Everybody Up 4" (Oxford).
The student just answered: "${history[history.length - 1]?.answer || ''}" to the question: "${currentQuestion.question}".

Give a very short (1-2 sentences), encouraging reply in Vietnamese with 1 English praise phrase.
Do NOT give scores or full evaluations yet. Just praise them and encourage them.
`;

      const response = await client.models.generateContent({
        model: "gemini-2.0-flash",
        contents: promptText
      });

      const reply = response.text ? response.text.trim() : "Con làm tốt lắm! Hút thở sâu và trả lời câu tiếp theo nhé!";

      return res.json({
        reply,
        nextQuestion: nextQuestion ? `Câu hỏi tiếp theo:\n\n💬 "${nextQuestion.question}"\n(${nextQuestion.vietnamesePrompt})` : undefined
      });
    } catch (err: any) {
      console.error("[server.ts /api/chat] Error:", err);
      return res.json({
        reply: "Rất tốt! Con hãy tiếp tục phát huy nhé!",
        nextQuestion: req.body.nextQuestion ? `Câu hỏi tiếp theo:\n\n💬 "${req.body.nextQuestion.question}"\n(${req.body.nextQuestion.vietnamesePrompt})` : undefined
      });
    }
  });

  // API Speaking Evaluation Endpoint
  app.post("/api/evaluate-speaking", async (req, res) => {
    try {
      const { history, unitId } = req.body;

      if (!history || !Array.isArray(history)) {
        return res.status(400).json({ error: "Missing conversation history" });
      }

      console.log("[server.ts /api/evaluate-speaking] Transcript:", JSON.stringify(history, null, 2));

      const activeApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
      const client = ai || (activeApiKey && !activeApiKey.includes("MY_GEMINI_API_KEY") ? new GoogleGenAI({ apiKey: activeApiKey }) : null);

      if (!client) {
        console.error("[server.ts /api/evaluate-speaking] Gemini API key missing.");
        return res.json({ useFallback: true, error: "Gemini API key missing" });
      }

      const promptText = `
You are a strict, fair, and encouraging AI English Speaking Coach for primary school students studying "Everybody Up 4" (Oxford) - Unit: "${unitId || 'General'}".
You are evaluating a student's 10-question speaking performance.

Here is the exact conversation log:
${history.map((h: any, i: number) => `Q${i + 1}: ${h.question}\nStudent's Spoken Answer: "${h.answer}"`).join('\n\n')}

PRIMARY SCHOOL EVALUATION RUBRIC:
- 40% Answer Relevance: Does the student's answer match the question prompt?
- 25% Grammar: Correct sentence pattern and basic grammar for Everybody Up 4.
- 20% Vocabulary: Correct use of Unit vocabulary.
- 15% Fluency: Completeness, confidence, and smoothness.
(Do NOT heavily penalize children's pronunciation; evaluate pronunciation gently).

SCORING SCALE:
- 90–100: Excellent (Accurate, complete answers matching questions)
- 75–89: Good (Understood prompt, good attempt with minor grammar/vocabulary errors)
- 60–74: Fair (Simple or partially correct answers)
- 40–59: Needs Improvement (Irrelevant, random words like "banana elephant", or empty)

DYNAMIC FEEDBACK REQUIREMENTS:
- Feedback MUST be generated ONLY from the student's real answers.
- MUST contain:
  ✓ One strength
  ✓ One weakness
  ✓ One concrete example quoting the student's actual answer
  ✓ One practical suggestion for improvement

Return strict JSON matching all 9 required fields:
{
  "overallScore": integer (40-100),
  "pronunciationScore": integer (40-100),
  "grammarScore": integer (40-100),
  "fluencyScore": integer (40-100),
  "feedback": "Encouraging feedback in Vietnamese incorporating a concrete example from student's answer",
  "strengths": ["One specific strength in Vietnamese referencing student's actual answers"],
  "weaknesses": ["One specific weakness in Vietnamese referencing student's actual answers"],
  "commonMistakes": ["Specific incorrect sentences or errors made by student"],
  "suggestedPractice": "One practical suggestion for improvement in Vietnamese"
}
`;

      let attempts = 0;
      let result: any = null;

      while (attempts < 2 && !result) {
        attempts++;
        try {
          const response = await client.models.generateContent({
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
          console.log("[server.ts /api/evaluate-speaking] Gemini Raw Response:", rawText);

          if (!rawText) {
            continue;
          }

          const cleanedJsonText = extractJsonString(rawText);

          try {
            const parsed = JSON.parse(cleanedJsonText);
            const overall = parsed.overallScore ?? parsed.overall;
            if (overall !== undefined && overall !== null) {
              result = {
                overallScore: Number(overall),
                pronunciationScore: Number(parsed.pronunciationScore ?? parsed.pronunciation ?? overall),
                grammarScore: Number(parsed.grammarScore ?? parsed.grammar ?? overall),
                fluencyScore: Number(parsed.fluencyScore ?? parsed.fluency ?? overall),
                feedback: parsed.feedback || "Con đã cố gắng hoàn thành bài nói!",
                strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
                weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
                commonMistakes: Array.isArray(parsed.commonMistakes) ? parsed.commonMistakes : (Array.isArray(parsed.corrections) ? parsed.corrections : []),
                suggestedPractice: parsed.suggestedPractice || ""
              };
            }
          } catch (parseErr: any) {
            console.error("[server.ts /api/evaluate-speaking] JSON parse exception:", parseErr.stack || parseErr);
          }
        } catch (genErr: any) {
          console.error("[server.ts /api/evaluate-speaking] Gemini generateContent error:", genErr.stack || genErr);
        }
      }

      if (result) {
        return res.json(result);
      } else {
        return res.json({ useFallback: true, error: "Failed to obtain evaluation from Gemini" });
      }
    } catch (err: any) {
      console.error("[server.ts /api/evaluate-speaking] Handler exception:", err.stack || err);
      return res.json({ useFallback: true, error: "Internal Server Error" });
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
