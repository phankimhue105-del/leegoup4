// Initialize SpeechSynthesis voices immediately on file load for all browsers
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  try {
    window.speechSynthesis.getVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        try {
          window.speechSynthesis.getVoices();
        } catch (e) {}
      };
    }
  } catch (e) {}
}

/**
 * Universal speech player for desktop, laptop, and mobile devices.
 * Uses native Web Speech API (SpeechSynthesis) with forced English voice selection.
 */
export const playWordAudio = (text: string): Promise<void> => {
  return new Promise((resolve) => {
    // 1. Clean up text: remove emojis, excessive spaces, and formatting
    const cleanedText = text
      .replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '') // remove emojis
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanedText) {
      resolve();
      return;
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn("[playWordAudio] SpeechSynthesis is not supported in this browser.");
      resolve();
      return;
    }

    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.lang = 'en-US';
      utterance.rate = 0.85; // Natural pace for primary school learners

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const enVoice = voices.find(v => v.lang === 'en-US' && v.name.toLowerCase().includes('google')) ||
                        voices.find(v => v.lang === 'en-US' && v.name.toLowerCase().includes('samantha')) ||
                        voices.find(v => v.lang.startsWith('en-US')) ||
                        voices.find(v => v.lang.startsWith('en-'));
        if (enVoice) {
          utterance.voice = enVoice;
        }
      }

      utterance.onend = () => resolve();
      utterance.onerror = (e) => {
        console.warn("[playWordAudio] Utterance error:", e);
        resolve();
      };
      
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("SpeechSynthesis failed:", err);
      resolve();
    }
  });
};
