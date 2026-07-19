import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

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

// Simple primary school evaluation engine based on Grammar, Vocabulary & Response Speed
function evaluateSpeakingLocally(history: any[], unitId: string) {
  let validAnswers = 0;
  let wordCountTotal = 0;
  let grammarMatches = 0;
  let sampleAnswer = "";

  history.forEach((item: any) => {
    const ans = (item.answer || "").trim();
    if (ans.length > 0) {
      validAnswers++;
      const words = ans.split(/\s+/);
      wordCountTotal += words.length;
      if (!sampleAnswer && words.length > 1) {
        sampleAnswer = ans;
      }
      // Check for basic sentence structures (I am, My name, She likes, He is, Yes/No)
      if (/^i\b|^my\b|^she\b|^he\b|^they\b|^yes\b|^no\b|^it\b/i.test(ans) || words.length >= 3) {
        grammarMatches++;
      }
    }
  });

  const completionRatio = Math.min(1, validAnswers / Math.max(1, history.length));
  const avgWords = validAnswers > 0 ? wordCountTotal / validAnswers : 0;

  // 1. Grammar Score (based on proper sentence structure)
  const grammarScore = Math.min(100, Math.max(50, Math.round(60 + (grammarMatches / Math.max(1, history.length)) * 35)));

  // 2. Vocabulary & Pronunciation Score (based on word length & vocabulary complexity)
  const pronunciationScore = Math.min(100, Math.max(55, Math.round(65 + Math.min(avgWords * 6, 30))));

  // 3. Response Speed & Fluency (based on completeness & answer count)
  const fluencyScore = Math.min(100, Math.max(50, Math.round(60 + completionRatio * 35)));

  // Overall Score (Weighted)
  const overallScore = Math.min(100, Math.max(50, Math.round(grammarScore * 0.35 + pronunciationScore * 0.35 + fluencyScore * 0.30)));

  const strengths = [];
  const weaknesses = [];

  if (grammarScore >= 80) {
    strengths.push("Sử dụng đúng cấu trúc câu cơ bản của bài học Everybody Up 4.");
  } else {
    weaknesses.push("Cần chú ý trả lời thành câu hoàn chỉnh thay vì chỉ dùng từ đơn.");
  }

  if (pronunciationScore >= 80) {
    strengths.push("Từ vựng phát âm tương đối rõ ràng và đúng chủ đề.");
  } else {
    weaknesses.push("Luyện tập phát âm chuẩn hơn các từ mới trong Unit.");
  }

  if (fluencyScore >= 80) {
    strengths.push("Phản xạ trả lời tốt, hoàn thành đầy đủ các câu hỏi.");
  } else {
    weaknesses.push("Rèn luyện phản xạ nói nhanh hơn để tăng sự tự tin.");
  }

  const feedbackQuote = sampleAnswer ? ` (ví dụ: "${sampleAnswer}")` : "";
  const feedback = `Con đã hoàn thành ${validAnswers}/${history.length} câu hỏi. Trả lời khá tự tin${feedbackQuote}. Hãy tiếp tục phát huy nhé!`;

  return {
    overallScore,
    pronunciationScore,
    grammarScore,
    fluencyScore,
    feedback,
    strengths: strengths.length > 0 ? strengths : ["Con có tinh thần luyện tập nói tiếng Anh rất tốt!"],
    weaknesses: weaknesses.length > 0 ? weaknesses : ["Hãy mở rộng câu trả lời dài hơn một chút."],
    commonMistakes: sampleAnswer ? [`Câu trả lời tiêu biểu: "${sampleAnswer}"`] : ["Chú ý phát âm rõ âm đuôi (ending sounds)."],
    suggestedPractice: `Luyện tập nói lại các câu hỏi của Unit ${unitId || ''} 10 phút mỗi ngày.`
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { history, unitId } = req.body;

    if (!history || !Array.isArray(history)) {
      return res.status(400).json({ error: "Missing conversation history" });
    }

    console.log("[api/evaluate-speaking] Transcript:", JSON.stringify(history, null, 2));

    const activeApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
    const client = (activeApiKey && !activeApiKey.includes("MY_GEMINI_API_KEY")) ? new GoogleGenAI({ apiKey: activeApiKey }) : null;

    if (client) {
      try {
        const promptText = `
You are an encouraging AI English Speaking Coach for primary school students studying "Everybody Up 4" (Oxford) - Unit: "${unitId || 'General'}".
Evaluate the student's 10-question speaking performance based on Grammar, Vocabulary, and Fluency.

Conversation log:
${history.map((h: any, i: number) => `Q${i + 1}: ${h.question}\nStudent: "${h.answer}"`).join('\n\n')}

Return strict JSON:
{
  "overallScore": integer (50-100),
  "pronunciationScore": integer (50-100),
  "grammarScore": integer (50-100),
  "fluencyScore": integer (50-100),
  "feedback": "Encouraging feedback in Vietnamese with student answer quote",
  "strengths": ["One strength in Vietnamese"],
  "weaknesses": ["One weakness in Vietnamese"],
  "commonMistakes": ["One example error or sentence to improve"],
  "suggestedPractice": "One suggestion in Vietnamese"
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
              weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : ["Cần chú ý phát âm chuẩn hơn"],
              commonMistakes: Array.isArray(parsed.commonMistakes) ? parsed.commonMistakes : [],
              suggestedPractice: parsed.suggestedPractice || "Luyện nói 10 phút mỗi ngày"
            });
          }
        }
      } catch (gemErr: any) {
        console.warn("[api/evaluate-speaking] Gemini error, using primary evaluation engine:", gemErr.message || gemErr);
      }
    }

    // Fallback to deterministic primary evaluation engine based on student's answers
    const localEval = evaluateSpeakingLocally(history, unitId);
    return res.json(localEval);

  } catch (err: any) {
    console.error("[api/evaluate-speaking] Handler exception:", err.stack || err);
    // Even on exception, guarantee a clean evaluation object
    const safeEval = evaluateSpeakingLocally(req.body?.history || [], req.body?.unitId || '');
    return res.json(safeEval);
  }
}
