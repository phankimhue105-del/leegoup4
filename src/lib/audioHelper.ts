// Keep global reference to prevent Garbage Collection of SpeechSynthesisUtterance in Chrome/Edge Desktop
let activeUtterance: SpeechSynthesisUtterance | null = null;

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
 * Solves Chrome/Edge Desktop garbage collection silence bug.
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
      utterance.rate = 0.85; // Natural pace for primary school learners

      // Prevent Chrome/Edge Desktop Garbage Collection bug
      activeUtterance = utterance;
      (window as any)._activeUtterance = utterance;

      const speakNow = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          const enVoice = voices.find(v => (v.lang === 'en-US' || v.lang === 'en_US') && v.name.toLowerCase().includes('google')) ||
                          voices.find(v => v.lang === 'en-US' || v.lang === 'en_US') ||
                          voices.find(v => v.lang.startsWith('en')) ||
                          voices[0];
          if (enVoice) {
            utterance.voice = enVoice;
          }
        }

        utterance.onend = () => {
          activeUtterance = null;
          (window as any)._activeUtterance = null;
          resolve();
        };

        utterance.onerror = (e) => {
          console.warn("[playWordAudio] Utterance error:", e);
          activeUtterance = null;
          (window as any)._activeUtterance = null;
          resolve();
        };

        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        window.speechSynthesis.speak(utterance);
      };

      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          speakNow();
        };
        setTimeout(speakNow, 100);
      } else {
        speakNow();
      }

    } catch (err) {
      console.error("SpeechSynthesis failed:", err);
      resolve();
    }
  });
};
