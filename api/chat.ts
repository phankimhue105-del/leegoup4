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
    const { history, currentQuestion, nextQuestion } = req.body;

    if (!ai) {
      return res.json({ 
        useFallback: true, 
        reply: "Good job!", 
        nextQuestion: nextQuestion ? `Câu hỏi tiếp theo:\n\n💬 "${nextQuestion.question}"\n(${nextQuestion.vietnamesePrompt})` : "Chúc mừng con đã hoàn thành bài nói!" 
      });
    }

    const studentAnswer = history && history.length > 0 ? history[history.length - 1].answer : "";

    let nextQuestionInstruction = "";
    if (nextQuestion) {
      nextQuestionInstruction = `introduce the next question: "${nextQuestion.question}" (with its Vietnamese helper translation: "${nextQuestion.vietnamesePrompt}"). Formulate it nicely so the student knows it's the next question.`;
    } else {
      nextQuestionInstruction = `state that this was the last question, congratulate the student warmly in Vietnamese, and say that you are now compiling the final speaking report.`;
    }

    const promptText = `
You are a friendly, encouraging AI English Teacher for primary school students studying "Everybody Up 4" (Oxford).
You are in the middle of a speaking test conversation.
- Question asked: "${currentQuestion.question}"
- Target Expected Answer: "${currentQuestion.suggestedAnswer}"
- Student's spoken response: "${studentAnswer}"

Please review the student's response. Give a short, encouraging teacher comment in Vietnamese (warm and friendly for a kid, maximum 2 sentences) commenting on how they did.
Then, ${nextQuestionInstruction}

Format the response strictly matching this JSON schema:
{
  "reply": "Short encouraging teacher comment in Vietnamese",
  "nextQuestion": "The next question formulated clearly with its Vietnamese translation, or graduation message if completed"
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
            reply: { type: Type.STRING },
            nextQuestion: { type: Type.STRING }
          },
          required: ["reply", "nextQuestion"]
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
    console.error("Chat Serverless Function error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
