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
 * Prioritizes local MP3 playback using HTMLAudioElement.
 * Falls back to Web Speech API (SpeechSynthesis) with forced English voice selection.
 * Does not depend on third-party online pronunciation services.
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

    // 2. Derive local MP3 path
    const localUrl = `/audio/${encodeURIComponent(cleanedText.toLowerCase().replace(/\s+/g, '_'))}.mp3`;
    const audio = new Audio();
    let hasFailed = false;

    // Direct listener for play failure
    audio.addEventListener('error', (e) => {
      if (!hasFailed) {
        hasFailed = true;
        console.error(`[playWordAudio] Local MP3 not found or failed to load at ${localUrl}. Falling back to native SpeechSynthesis. Error details:`, audio.error || e);
        playTTSFallback(cleanedText, resolve);
      }
    });

    audio.src = localUrl;
    audio.preload = 'auto';

    audio.play()
      .then(() => {
        audio.onended = () => resolve();
      })
      .catch((err) => {
        if (!hasFailed) {
          hasFailed = true;
          console.error(`[playWordAudio] Play promise rejected for ${localUrl}. Falling back to native SpeechSynthesis. Error details:`, err);
          playTTSFallback(cleanedText, resolve);
        }
      });
  });
};

const playTTSFallback = (text: string, callback: () => void) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    callback();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.82; // Kid-friendly pace

    // iOS voice lookup: search specifically for an English voice
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang === 'en-US' && v.name.toLowerCase().includes('google')) ||
                    voices.find(v => v.lang === 'en-US' && v.name.toLowerCase().includes('samantha')) ||
                    voices.find(v => v.lang.startsWith('en-US')) ||
                    voices.find(v => v.lang.startsWith('en-'));
    if (enVoice) {
      utterance.voice = enVoice;
    }

    utterance.onend = () => callback();
    utterance.onerror = (e) => {
      console.error("[playWordAudio] SpeechSynthesis fallback utterance error:", e);
      callback();
    };
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error("SpeechSynthesis fallback failed:", err);
    callback();
  }
};
