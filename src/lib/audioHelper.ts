/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
 * Uses Youdao DictVoice API which acts as a stable, high-quality, CORS-friendly MP3 source.
 * Falls back to Web Speech API (SpeechSynthesis) with forced English voice selection.
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

    // 2. Play high-quality MP3 from Youdao DictVoice API (US Accent)
    const audioUrl = `https://dict.youdao.com/dictvoice?type=2&audio=${encodeURIComponent(cleanedText)}`;
    const audio = new Audio();
    let hasFailed = false;

    // Direct listener for play failure
    audio.addEventListener('error', (e) => {
      if (!hasFailed) {
        hasFailed = true;
        console.error("Youdao MP3 playback failed on iOS, trying TTS fallback:", e);
        playTTSFallback(cleanedText, resolve);
      }
    });

    audio.src = audioUrl;
    audio.preload = 'auto';

    audio.play()
      .then(() => {
        audio.onended = () => resolve();
      })
      .catch((err) => {
        if (!hasFailed) {
          hasFailed = true;
          console.error("Youdao MP3 play promise rejected, trying TTS fallback:", err);
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
    utterance.rate = 0.82;

    // iOS voice lookup: search specifically for an English voice
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang === 'en-US' && v.name.includes('Google')) ||
                    voices.find(v => v.lang.startsWith('en-US')) ||
                    voices.find(v => v.lang.startsWith('en-'));
    if (enVoice) {
      utterance.voice = enVoice;
    }

    utterance.onend = () => callback();
    utterance.onerror = () => callback();
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error("SpeechSynthesis fallback failed:", err);
    callback();
  }
};
