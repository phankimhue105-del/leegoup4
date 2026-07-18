/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Universal speech player to fix iPhone (iOS Safari/Chrome) audio issues.
 * Uses high-quality prerecorded Google Translate TTS MP3 files via HTML5 Audio.
 * Falls back to Web Speech API (speechSynthesis) if playing fails.
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

    // 2. Try playing Google Translate MP3 Audio directly
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(cleanedText)}`;
    const audio = new Audio(audioUrl);
    audio.preload = 'auto';

    audio.play()
      .then(() => {
        audio.onended = () => resolve();
      })
      .catch((err) => {
        console.warn("Prerecorded MP3 play failed, falling back to Web Speech API:", err);
        
        // 3. Fallback to browser SpeechSynthesis (TTS)
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(cleanedText);
          utterance.lang = 'en-US';
          utterance.rate = 0.85; // friendly pace for children
          utterance.onend = () => resolve();
          utterance.onerror = () => resolve();
          window.speechSynthesis.speak(utterance);
        } else {
          resolve();
        }
      });
  });
};

