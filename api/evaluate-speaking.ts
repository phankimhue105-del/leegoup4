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
  clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
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
