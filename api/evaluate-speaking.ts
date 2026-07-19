import { GoogleGenAI, Type } from "@google/genai";

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

function extractJsonString(rawText: string): string {
  if (!rawText) return "";
  let clean = rawText.trim();
  // Strip markdown code fences if present (e.g. ```json ... ```)
  clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  // Extract JSON object if surrounded by explanatory text
  const jsonMatch = clean.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    clean = jsonMatch[0];
  }
  return clean;
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

    console.log("Transcript:", JSON.stringify(history, null, 2));

    if (!ai) {
      console.error("Gemini API key is not configured");
      return res.json({ error: "Gemini API key missing", useFallback: true });
    }

    const promptText = `
You are a strict, fair, and professional AI English Speaking Coach for primary school students studying "Everybody Up 4" (Oxford) - Unit: "${unitId || 'General'}".
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

    console.log("Gemini Request:", JSON.stringify({ promptText }, null, 2));

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
        console.log("Gemini Raw Response BEFORE JSON.parse:", rawText);

        if (!rawText) {
          console.log("JSON parse failed");
          continue;
        }

        const cleanedJsonText = extractJsonString(rawText);

        try {
          const parsed = JSON.parse(cleanedJsonText);
          console.log("Parsed JSON:", JSON.stringify(parsed, null, 2));

          const requiredFields = [
            "overallScore", "pronunciationScore", "grammarScore", "fluencyScore",
            "feedback", "strengths", "weaknesses", "commonMistakes", "suggestedPractice"
          ];

          const hasAllFields = requiredFields.every(field => parsed[field] !== undefined && parsed[field] !== null);

          if (hasAllFields) {
            console.log("Evaluation Object:", JSON.stringify(parsed, null, 2));
            result = parsed;
          } else {
            console.warn(`Missing required fields on attempt ${attempts}. Retrying...`);
          }
        } catch (parseErr: any) {
          console.error("JSON parse exception stack trace:", parseErr.stack || parseErr);
          console.log("JSON parse failed:", parseErr.message || parseErr);
          console.log("Gemini Raw Response:", rawText);
        }
      } catch (genErr) {
        console.error("Gemini generateContent error:", genErr);
      }
    }

    if (result) {
      return res.json(result);
    } else {
      console.error("All Gemini evaluation attempts failed or returned incomplete schema.");
      return res.json({ useFallback: true, error: "Failed to parse evaluation from Gemini" });
    }
  } catch (err: any) {
    console.error("Gemini evaluate-speaking handler error:", err.stack || err);
    return res.json({ useFallback: true, error: "Internal Server Error" });
  }
}
