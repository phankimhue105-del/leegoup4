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
  "corrections": ["list of improved/suggested model answers for their mistakes in Vietnamese/English"],
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
    console.error("Gemini evaluate-speaking error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
