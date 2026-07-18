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
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

