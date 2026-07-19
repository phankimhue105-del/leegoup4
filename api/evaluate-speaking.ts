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

          // Validate that all 9 required fields exist
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
      console.error("All Gemini evaluation attempts failed or returned incomplete schema.");
      return res.status(500).json({ error: "Failed to parse evaluation from Gemini", useFallback: true });
    }
  } catch (err) {
    console.error("Gemini evaluate-speaking handler error:", err);
    return res.status(500).json({ error: "Internal Server Error", useFallback: true });
  }
}
