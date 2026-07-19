import { GoogleGenAI } from "@google/genai";
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

// Strict per-question grammar & relevance evaluation engine
function evaluateSpeakingLocally(history: any[], unitId: string) {
  let correctRelevantCount = 0;
  let wordCountTotal = 0;
  let sampleIrrelevantAnswer = "";
  let sampleIrrelevantQuestion = "";
  let sampleValidAnswer = "";

  const totalQuestions = Math.max(1, history.length);

  history.forEach((item: any) => {
    const qText = (item.question || "").toLowerCase();
    const ansText = (item.answer || "").trim().toLowerCase();

    if (ansText.length > 0) {
      const words = ansText.split(/\s+/);
      wordCountTotal += words.length;

      let isGrammaticallyAppropriateAndRelevant = true;

      // Rule 1: Single random animal/food/object words that don't match question
      const isRandomWord = words.length === 1 && /\b(dog|cat|apple|banana|car|fish|bird|elephant|monkey)\b/i.test(ansText);

      // Rule 2: Age Question ("how old are you")
      if (qText.includes("how old")) {
        const hasAgePattern = /\b(nine|ten|eleven|twelve|eight|seven|six|years|old|[0-9]+)\b/i.test(ansText) || /^i'm\s+[0-9]+/i.test(ansText);
        if (!hasAgePattern || isRandomWord || ansText.includes("football") || ansText.includes("like")) {
          isGrammaticallyAppropriateAndRelevant = false;
        }
      }
      // Rule 3: Name Question ("what is your name" / "what's your name")
      else if (qText.includes("name")) {
        const hasNamePattern = ansText.includes("my name") || ansText.includes("i am") || ansText.includes("i'm") || words.length >= 2;
        if (!hasNamePattern || isRandomWord || ansText.includes("years old")) {
          isGrammaticallyAppropriateAndRelevant = false;
        }
      }
      // Rule 4: Feeling Question ("how are you feeling" / "how are you")
      else if (qText.includes("how are you") || qText.includes("feeling")) {
        const hasFeelingPattern = /\b(happy|great|good|fine|ok|well|sad|tired)\b/i.test(ansText);
        if (!hasFeelingPattern || isRandomWord) {
          isGrammaticallyAppropriateAndRelevant = false;
        }
      }
      // Rule 5: Topic Questions
      else {
        if (isRandomWord && !qText.includes("animal") && !qText.includes("food")) {
          isGrammaticallyAppropriateAndRelevant = false;
        }
      }

      if (isGrammaticallyAppropriateAndRelevant) {
        correctRelevantCount++;
        if (!sampleValidAnswer) sampleValidAnswer = item.answer;
      } else {
        if (!sampleIrrelevantAnswer) {
          sampleIrrelevantAnswer = item.answer;
          sampleIrrelevantQuestion = item.question;
        }
      }
    }
  });

  // Strict linear Grammar Score: 10 points per grammatically correct & relevant answer
  // E.g., 5 out of 10 = 50 points
  const grammarScore = Math.round((correctRelevantCount / totalQuestions) * 100);

  const avgWords = correctRelevantCount > 0 ? wordCountTotal / correctRelevantCount : 0;
  const pronunciationScore = Math.min(100, Math.max(0, Math.round(grammarScore * 0.75 + Math.min(avgWords * 5, 25))));
  const fluencyScore = Math.min(100, Math.max(0, Math.round((correctRelevantCount / totalQuestions) * 90 + (wordCountTotal > 15 ? 10 : 0))));
  const overallScore = Math.min(100, Math.max(0, Math.round(grammarScore * 0.45 + pronunciationScore * 0.30 + fluencyScore * 0.25)));

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const commonMistakes: string[] = [];

  if (grammarScore >= 80) {
    strengths.push("Trả lời đúng ngữ pháp và đúng trọng tâm các câu hỏi trong bài học.");
    strengths.push("Sử dụng mẫu câu phù hợp với trình độ Everybody Up 4.");
  } else {
    weaknesses.push(`Điểm Ngữ pháp đạt ${grammarScore}/100 do có ${totalQuestions - correctRelevantCount} câu trả lời không đúng ngữ pháp hoặc không liên quan tới câu hỏi.`);
  }

  if (sampleIrrelevantAnswer) {
    weaknesses.push(`Không tính điểm ngữ pháp cho câu trả lời không phù hợp (ví dụ: nói "${sampleIrrelevantAnswer}" cho câu hỏi "${sampleIrrelevantQuestion}").`);
    commonMistakes.push(`Câu trả lời không phù hợp: "${sampleIrrelevantAnswer}" (Câu hỏi: ${sampleIrrelevantQuestion})`);
  }

  if (sampleValidAnswer) {
    strengths.push(`Trả lời tốt câu: "${sampleValidAnswer}".`);
  }

  const feedback = sampleIrrelevantAnswer
    ? `Con đã trả lời đúng ngữ pháp và trọng tâm ${correctRelevantCount}/${totalQuestions} câu hỏi (Điểm Ngữ pháp: ${grammarScore}/100). Chú ý không trả lời các từ không liên quan như "${sampleIrrelevantAnswer}" nhé!`
    : `Con đã hoàn thành ${correctRelevantCount}/${totalQuestions} câu hỏi đúng ngữ pháp và trọng tâm! Điểm Ngữ pháp đạt ${grammarScore}/100. Hãy tiếp tục phát huy nhé!`;

  return {
    overallScore,
    pronunciationScore,
    grammarScore,
    fluencyScore,
    feedback,
    strengths: strengths.length > 0 ? strengths : ["Con có tinh thần học tập tốt."],
    weaknesses: weaknesses.length > 0 ? weaknesses : ["Hãy tập luyện trả lời thành câu dài hơn."],
    commonMistakes: commonMistakes.length > 0 ? commonMistakes : ["Chú ý phát âm rõ âm đuôi."],
    suggestedPractice: `Luyện tập trả lời đúng ngữ pháp và trọng tâm các câu hỏi của Unit ${unitId || ''}.`
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
You are a strict AI English Speaking Coach for primary school students studying "Everybody Up 4" (Oxford) - Unit: "${unitId || 'General'}".

STRICT GRAMMAR SCORING INSTRUCTION:
Each of the 10 questions is worth 10 points for Grammar.
A student receives 10 points ONLY if their answer is grammatically appropriate AND directly relevant to the question asked.
Give 0 points for Grammar on a question if the answer is:
- Unrelated (e.g. answering "I like football" when asked "How old are you?")
- Random words (e.g. answering "dog cat banana" when asked "How old are you?")

For example:
- 5 grammatically correct & relevant answers out of 10 = grammarScore MUST BE 50.
- 8 grammatically correct & relevant answers out of 10 = grammarScore MUST BE 80.

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
  "weaknesses": ["One weakness noting grammar deductions if any"],
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
        console.warn("[api/evaluate-speaking] Gemini error, using strict local evaluation:", gemErr.message || gemErr);
      }
    }

    const localEval = evaluateSpeakingLocally(history, unitId);
    return res.json(localEval);

  } catch (err: any) {
    console.error("[api/evaluate-speaking] Handler exception:", err.stack || err);
    const safeEval = evaluateSpeakingLocally(req.body?.history || [], req.body?.unitId || '');
    return res.json(safeEval);
  }
}
