import express from "express";
import createViteServer from "vite";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

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

// Strict relevance & grammar checker for primary school speaking answers
function evaluateSpeakingLocally(history: any[], unitId: string) {
  let validAnswers = 0;
  let relevantAnswers = 0;
  let wordCountTotal = 0;
  let irrelevantSample = "";
  let irrelevantQuestion = "";
  let validSample = "";

  history.forEach((item: any) => {
    const qText = (item.question || "").toLowerCase();
    const ans = (item.answer || "").trim().toLowerCase();

    if (ans.length > 0) {
      validAnswers++;
      const words = ans.split(/\s+/);
      wordCountTotal += words.length;

      let isRelevant = true;

      // 1. Age question ("how old")
      if (qText.includes("how old")) {
        const hasAgeWord = /\b(nine|ten|eleven|twelve|eight|seven|six|years|old|[0-9]+)\b/i.test(ans) || /^i'm\s+[0-9]+/i.test(ans);
        const isAnimalOrFood = /\b(dog|cat|apple|banana|car|fish|bird)\b/i.test(ans);
        if (!hasAgeWord || isAnimalOrFood) {
          isRelevant = false;
        }
      }
      // 2. Name question ("what is your name" / "what's your name")
      else if (qText.includes("name")) {
        const isIrrelevantWord = /\b(dog|cat|apple|banana|car|yes|no)\b/i.test(ans) && !ans.includes("my name");
        if (isIrrelevantWord) {
          isRelevant = false;
        }
      }
      // 3. Feeling question ("how are you")
      else if (qText.includes("how are you") || qText.includes("feeling")) {
        const hasFeelingWord = /\b(happy|great|good|fine|ok|well|sad|tired)\b/i.test(ans);
        const isAnimalOrFood = /\b(dog|cat|apple|banana|car|nine|ten)\b/i.test(ans);
        if (!hasFeelingWord && isAnimalOrFood) {
          isRelevant = false;
        }
      }
      // 4. General question matching
      else {
        if (words.length === 1 && /\b(dog|cat|apple|banana|car|bird)\b/i.test(ans) && !qText.includes("animal") && !qText.includes("food")) {
          isRelevant = false;
        }
      }

      if (isRelevant) {
        relevantAnswers++;
        if (!validSample) validSample = item.answer;
      } else {
        if (!irrelevantSample) {
          irrelevantSample = item.answer;
          irrelevantQuestion = item.question;
        }
      }
    }
  });

  const totalQ = Math.max(1, history.length);
  const relevanceRatio = relevantAnswers / totalQ;

  // Severe penalty for irrelevant/off-topic answers
  const grammarScore = Math.min(100, Math.max(40, Math.round(relevanceRatio * 95)));
  const pronunciationScore = Math.min(100, Math.max(45, Math.round(50 + (relevantAnswers / totalQ) * 45)));
  const fluencyScore = Math.min(100, Math.max(40, Math.round(45 + (validAnswers / totalQ) * 50)));
  const overallScore = Math.min(100, Math.max(40, Math.round(grammarScore * 0.40 + pronunciationScore * 0.35 + fluencyScore * 0.25)));

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const commonMistakes: string[] = [];

  if (relevanceRatio >= 0.8) {
    strengths.push("Trả lời đúng trọng tâm các câu hỏi trong bài học.");
    strengths.push("Sử dụng cấu trúc câu phù hợp với chương trình Everybody Up 4.");
  } else {
    weaknesses.push("Trừ điểm ngữ pháp nặng do có câu trả lời không đúng nội dung câu hỏi.");
  }

  if (irrelevantSample) {
    weaknesses.push(`Cần chú ý không trả lời từ không liên quan (ví dụ: nói "${irrelevantSample}" cho câu hỏi "${irrelevantQuestion}").`);
    commonMistakes.push(`Trả lời không đúng trọng tâm: "${irrelevantSample}" (Hỏi: ${irrelevantQuestion})`);
  }

  if (validSample) {
    strengths.push(`Trả lời tốt câu: "${validSample}".`);
  }

  const feedback = irrelevantSample
    ? `Con đã trả lời ${validAnswers}/${totalQ} câu hỏi, tuy nhiên có câu trả lời chưa đúng nội dung như "${irrelevantSample}". Con chú ý lắng nghe kỹ câu hỏi nhé!`
    : `Con đã làm rất tốt bài nói với ${relevantAnswers}/${totalQ} câu trả lời đúng trọng tâm! Hãy tiếp tục phát huy nhé.`;

  return {
    overallScore,
    pronunciationScore,
    grammarScore,
    fluencyScore,
    feedback,
    strengths: strengths.length > 0 ? strengths : ["Con có tinh thần học tập tích cực."],
    weaknesses: weaknesses.length > 0 ? weaknesses : ["Hãy tập luyện trả lời thành câu dài hơn."],
    commonMistakes: commonMistakes.length > 0 ? commonMistakes : ["Chú ý phát âm rõ các âm đuôi."],
    suggestedPractice: `Luyện tập trả lời đúng trọng tâm các câu hỏi của Unit ${unitId || ''}.`
  };
}

async function startServer() {
  // API Chat Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { currentQuestion, nextQuestion } = req.body;
      if (!currentQuestion) {
        return res.status(400).json({ error: "Missing currentQuestion" });
      }
      return res.json({
        reply: "Good job! Let's continue to the next question.",
        nextQuestion: nextQuestion ? `Câu hỏi tiếp theo:\n\n💬 "${nextQuestion.question}"\n(${nextQuestion.vietnamesePrompt})` : undefined
      });
    } catch (err: any) {
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
      const client = (activeApiKey && !activeApiKey.includes("MY_GEMINI_API_KEY")) ? new GoogleGenAI({ apiKey: activeApiKey }) : null;

      if (client) {
        try {
          const promptText = `
You are a strict AI English Speaking Coach for primary school students studying "Everybody Up 4" (Oxford) - Unit: "${unitId || 'General'}".

CRITICAL GRADING RULE:
- If a student answers an irrelevant word (e.g. answering "dog" or "cat" when asked "How old are you?"), GIVE 0 POINTS for relevance & grammar on that question and HEAVILY PENALIZE the Grammar Score!

Conversation log:
${history.map((h: any, i: number) => `Q${i + 1}: ${h.question}\nStudent: "${h.answer}"`).join('\n\n')}

Return strict JSON:
{
  "overallScore": integer (40-100),
  "pronunciationScore": integer (40-100),
  "grammarScore": integer (40-100),
  "fluencyScore": integer (40-100),
  "feedback": "Feedback in Vietnamese noting any off-topic answers",
  "strengths": ["One strength in Vietnamese"],
  "weaknesses": ["One weakness in Vietnamese noting off-topic penalties if any"],
  "commonMistakes": ["List off-topic or grammar mistakes"],
  "suggestedPractice": "One practice suggestion in Vietnamese"
}
`;

          const response = await client.models.generateContent({
            model: "gemini-2.0-flash",
            contents: promptText,
            config: {
              responseMimeType: "application/json"
            }
          });

          const rawText = response.text ? response.text.trim() : "";
          if (rawText) {
            const cleaned = extractJsonString(rawText);
            const parsed = JSON.parse(cleaned);
            const overall = parsed.overallScore ?? parsed.overall;
            if (overall !== undefined && overall !== null) {
              return res.json({
                overallScore: Number(overall),
                pronunciationScore: Number(parsed.pronunciationScore ?? parsed.pronunciation ?? overall),
                grammarScore: Number(parsed.grammarScore ?? parsed.grammar ?? overall),
                fluencyScore: Number(parsed.fluencyScore ?? parsed.fluency ?? overall),
                feedback: parsed.feedback || "Con đã cố gắng hoàn thành bài nói!",
                strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ["Phản xạ nói tự tin"],
                weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : ["Chú ý trả lời đúng trọng tâm"],
                commonMistakes: Array.isArray(parsed.commonMistakes) ? parsed.commonMistakes : [],
                suggestedPractice: parsed.suggestedPractice || "Luyện nói 10 phút mỗi ngày"
              });
            }
          }
        } catch (gemErr: any) {
          console.warn("[server.ts /api/evaluate-speaking] Gemini error, using strict local evaluation:", gemErr.message || gemErr);
        }
      }

      const localEval = evaluateSpeakingLocally(history, unitId);
      return res.json(localEval);

    } catch (err: any) {
      console.error("[server.ts /api/evaluate-speaking] Handler exception:", err.stack || err);
      const safeEval = evaluateSpeakingLocally(req.body?.history || [], req.body?.unitId || '');
      return res.json(safeEval);
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
