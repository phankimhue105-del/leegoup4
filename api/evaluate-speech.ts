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
    const { history, unitId, transcript, audio, mimeType, question, suggestedAnswer, targetPatterns } = req.body;

    if (!ai) {
      return res.json({ useFallback: true });
    }

    // Case A: Comprehensive evaluation (history of 10 questions provided)
    if (history && Array.isArray(history)) {
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

Identify any common spelling/grammar mistakes they made in their answers, and suggest correct versions.

Respond in strict JSON matching this schema:
{
  "pronunciationScore": integer (50-100),
  "grammarScore": integer (50-100),
  "fluencyScore": integer (50-100),
  "vocabularyScore": integer (50-100),
  "overallScore": integer (50-100),
  "feedback": "Detailed encouraging feedback in Vietnamese directly to the child",
  "strengths": ["list of 2-3 strengths in Vietnamese"],
  "weaknesses": ["list of 2-3 areas of improvement in Vietnamese"],
  "commonMistakes": ["list of incorrect student sentences with explanation of errors in Vietnamese"],
  "suggestedCorrections": ["list of improved/suggested model answers for their mistakes"]
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
              pronunciationScore: { type: Type.INTEGER },
              grammarScore: { type: Type.INTEGER },
              fluencyScore: { type: Type.INTEGER },
              vocabularyScore: { type: Type.INTEGER },
              overallScore: { type: Type.INTEGER },
              feedback: { type: Type.STRING },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              commonMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestedCorrections: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: [
              "pronunciationScore", "grammarScore", "fluencyScore", "vocabularyScore", 
              "overallScore", "feedback", "strengths", "weaknesses", "commonMistakes", "suggestedCorrections"
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
    }

    // Case B: Single audio/transcript evaluation
    if (!transcript && !audio) {
      return res.status(400).json({ error: "Missing transcript or audio data" });
    }

    let contents: any[] = [];
    let schemaProperties: any = {
      pronunciationScore: { type: Type.INTEGER },
      grammarScore: { type: Type.INTEGER },
      fluencyScore: { type: Type.INTEGER },
      overallScore: { type: Type.INTEGER },
      feedback: { type: Type.STRING },
      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
      suggestedPractice: { type: Type.STRING }
    };
    let requiredFields = [
      "pronunciationScore", "grammarScore", "fluencyScore", "overallScore", 
      "feedback", "strengths", "weaknesses", "suggestedPractice"
    ];

    if (audio) {
      // Multimodal input: base64 audio file + text instructions
      contents = [
        {
          inlineData: {
            mimeType: mimeType || "audio/webm",
            data: audio
          }
        },
        {
          text: `You are a friendly AI English Speaking Coach for primary school students studying "Everybody Up 4" (Oxford).
Listen to the student's spoken response in the audio to this question:
- Question asked: "${question}"
- Target / Expected answer: "${suggestedAnswer}" (Target patterns to look for: ${JSON.stringify(targetPatterns)})

Please transcribe what the student said in the audio and assess three criteria (0-100 score):
1. pronunciation: clear articulation compared to native standards.
2. grammar: correct structures and target patterns usage.
3. fluency: speed and natural flow.

Respond in strict JSON matching this schema:
{
  "transcript": "English transcription of what the student said in the audio",
  "pronunciationScore": integer (50-100),
  "grammarScore": integer (50-100),
  "fluencyScore": integer (50-100),
  "overallScore": integer (50-100),
  "feedback": "Friendly feedback in Vietnamese directly to the child",
  "strengths": ["list of strengths in Vietnamese"],
  "weaknesses": ["list of areas to improve in Vietnamese"],
  "suggestedPractice": "Practical practice tip in Vietnamese"
}
`
        }
      ];
      schemaProperties.transcript = { type: Type.STRING };
      requiredFields.push("transcript");
    } else {
      // Text-only input (fallback or typed answer)
      contents = [
        {
          text: `You are a friendly AI English Speaking Coach for primary school students studying "Everybody Up 4" (Oxford).
Evaluate this spoken response:
- Question asked: "${question}"
- Expected Answer / Patterns: "${suggestedAnswer}" (Target patterns: ${JSON.stringify(targetPatterns)})
- Student's actual spoken transcript: "${transcript}"

Assess three criteria (0-100 score):
1. pronunciation: clear articulation compared to native standards.
2. grammar: correct structures and target patterns usage.
3. fluency: speed and natural flow.

Respond in strict JSON matching this schema:
{
  "pronunciationScore": integer (50-100),
  "grammarScore": integer (50-100),
  "fluencyScore": integer (50-100),
  "overallScore": integer (50-100),
  "feedback": "Friendly feedback in Vietnamese directly to the child",
  "strengths": ["list of strengths in Vietnamese"],
  "weaknesses": ["list of areas to improve in Vietnamese"],
  "suggestedPractice": "Practical practice tip in Vietnamese"
}
`
        }
      ];
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: schemaProperties,
          required: requiredFields
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
    console.error("Gemini evaluate-speech error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

