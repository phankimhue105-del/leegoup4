// Initialize SpeechSynthesis voices immediately on file load for iOS WebKit compatibility
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
}

/**
 * Universal speech player to fix iPhone (iOS Safari/Chrome) audio issues.
 * Uses native Web Speech API (SpeechSynthesis) with forced English voice selection.
 * Does not try to load local MP3 files or depend on third-party online services.
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
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.lang = 'en-US';
      utterance.rate = 0.82; // Kid-friendly pace

      // English voice lookup: search specifically for an English voice
      const voices = window.speechSynthesis.getVoices();
      const enVoice = voices.find(v => v.lang === 'en-US' && v.name.toLowerCase().includes('google')) ||
                      voices.find(v => v.lang === 'en-US' && v.name.toLowerCase().includes('samantha')) ||
                      voices.find(v => v.lang.startsWith('en-US')) ||
                      voices.find(v => v.lang.startsWith('en-'));
      if (enVoice) {
        utterance.voice = enVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (e) => {
        console.error("[playWordAudio] SpeechSynthesis utterance error:", e);
        resolve();
      };
      
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("SpeechSynthesis failed:", err);
      resolve();
    }
  });
};
