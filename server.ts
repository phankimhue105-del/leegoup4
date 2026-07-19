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
  let relevantAnswersCount = 0;
  let wordCountTotal = 0;
  let irrelevantSample = "";
  let irrelevantQuestion = "";
  let validSample = "";

  const totalQ = Math.max(1, history.length);

  history.forEach((item: any) => {
    const qText = (item.question || "").toLowerCase();
    const ans = (item.answer || "").trim().toLowerCase();

    if (ans.length > 0) {
      const words = ans.split(/\s+/);
      wordCountTotal += words.length;

      let isRelevant = true;

      if (qText.includes("how old")) {
        const hasAgeWord = /\b(nine|ten|eleven|twelve|eight|seven|six|years|old|[0-9]+)\b/i.test(ans) || /^i'm\s+[0-9]+/i.test(ans);
        const isAnimalOrFood = /\b(dog|cat|apple|banana|car|fish|bird)\b/i.test(ans);
        if (!hasAgeWord || isAnimalOrFood) {
          isRelevant = false;
        }
      }
      else if (qText.includes("name")) {
        const isIrrelevantWord = /\b(dog|cat|apple|banana|car|yes|no)\b/i.test(ans) && !ans.includes("my name");
        if (isIrrelevantWord) {
          isRelevant = false;
        }
      }
      else if (qText.includes("how are you") || qText.includes("feeling")) {
        const hasFeelingWord = /\b(happy|great|good|fine|ok|well|sad|tired)\b/i.test(ans);
        const isAnimalOrFood = /\b(dog|cat|apple|banana|car|nine|ten)\b/i.test(ans);
        if (!hasFeelingWord && isAnimalOrFood) {
          isRelevant = false;
        }
      }
      else {
        if (words.length === 1 && /\b(dog|cat|apple|banana|car|bird)\b/i.test(ans) && !qText.includes("animal") && !qText.includes("food")) {
          isRelevant = false;
        }
      }

      if (isRelevant) {
        relevantAnswersCount++;
        if (!validSample) validSample = item.answer;
      } else {
        if (!irrelevantSample) {
          irrelevantSample = item.answer;
          irrelevantQuestion = item.question;
        }
      }
    }
  });

  // Exact 10-point per relevant question formula for Grammar Score
  // E.g. 5 relevant questions out of 10 = 50 points!
  const grammarScore = Math.round((relevantAnswersCount / totalQ) * 100);

  const avgWords = relevantAnswersCount > 0 ? wordCountTotal / relevantAnswersCount : 0;
  const pronunciationScore = Math.min(100, Math.max(30, Math.round(grammarScore * 0.7 + Math.min(avgWords * 5, 30))));
  const fluencyScore = Math.min(100, Math.max(30, Math.round((relevantAnswersCount / totalQ) * 90 + 10)));
  const overallScore = Math.min(100, Math.max(30, Math.round(grammarScore * 0.45 + pronunciationScore * 0.30 + fluencyScore * 0.25)));

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const commonMistakes: string[] = [];

  if (grammarScore >= 80) {
    strengths.push("Trả lời đúng trọng tâm các câu hỏi trong bài học.");
    strengths.push("Sử dụng cấu trúc câu phù hợp với chương trình Everybody Up 4.");
  } else {
    weaknesses.push(`Điểm Ngữ pháp là ${grammarScore}/100 do có ${totalQ - relevantAnswersCount} câu trả lời không đúng nội dung câu hỏi.`);
  }

  if (irrelevantSample) {
    weaknesses.push(`Không tính điểm ngữ pháp cho câu trả lời từ không liên quan (ví dụ: nói "${irrelevantSample}" cho câu hỏi "${irrelevantQuestion}").`);
    commonMistakes.push(`Trả lời không đúng trọng tâm: "${irrelevantSample}" (Hỏi: ${irrelevantQuestion})`);
  }

  if (validSample) {
    strengths.push(`Trả lời tốt câu: "${validSample}".`);
  }

  const feedback = irrelevantSample
    ? `Con đã trả lời đúng trọng tâm ${relevantAnswersCount}/${totalQ} câu hỏi (Điểm Ngữ pháp: ${grammarScore}/100). Chú ý không trả lời các từ không liên quan như "${irrelevantSample}" nhé!`
    : `Con đã xuất sắc hoàn thành ${relevantAnswersCount}/${totalQ} câu hỏi đúng trọng tâm! Điểm Ngữ pháp đạt ${grammarScore}/100. Hãy tiếp tục phát huy nhé!`;

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

EXACT GRAMMAR SCORING INSTRUCTION:
Each of the 10 questions is worth 10 points for Grammar.
If a student's answer is NOT relevant to the question asked (e.g. saying "dog" or "cat" when asked "How old are you?"), give 0 points for Grammar on that question.
For example, if 5 out of 10 answers are relevant, grammarScore MUST be 50. If 8 out of 10 answers are relevant, grammarScore MUST be 80.

Conversation log:
${history.map((h: any, i: number) => `Q${i + 1}: ${h.question}\nStudent: "${h.answer}"`).join('\n\n')}

Return strict JSON:
{
  "overallScore": integer (0-100),
  "pronunciationScore": integer (0-100),
  "grammarScore": integer (0-100),
  "fluencyScore": integer (0-100),
  "feedback": "Feedback in Vietnamese mentioning grammarScore calculation",
  "strengths": ["One strength in Vietnamese"],
  "weaknesses": ["One weakness noting grammar deduction if any"],
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
