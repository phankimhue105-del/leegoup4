/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { VocabularyItem } from '../data/vocabulary';
import { 
  Gamepad2, Volume2, HelpCircle, Star, Sparkles, Check, 
  X, AlertCircle, RefreshCw, Trophy, Award, Timer, Flame
} from 'lucide-react';
import { playWordAudio } from '../lib/audioHelper';

interface VocabGamesProps {
  vocabList: VocabularyItem[];
  onAwardPoints: (points: number) => void;
  onWordMastered: (word: string, status: 'learning' | 'mastered', isDifficult: boolean, isCorrect: boolean, points: number) => void;
}

interface MemoryCard {
  id: string;
  type: 'word' | 'meaning';
  content: string;
  associatedWord: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function VocabGames({ vocabList, onAwardPoints, onWordMastered }: VocabGamesProps) {
  const [activeGame, setActiveGame] = useState<'selector' | 'picture' | 'listen' | 'speed' | 'memory'>('selector');
  const [gameScore, setGameScore] = useState<number>(0);
  const [gameStreak, setGameStreak] = useState<number>(0);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [wrongAnswersCount, setWrongAnswersCount] = useState<number>(0);

  // Speed Quiz states
  const [speedTimer, setSpeedTimer] = useState<number>(30);
  const [speedQuestion, setSpeedQuestion] = useState<{ english: string; vietnamese: string; isMatch: boolean } | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Memory Match states
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<MemoryCard[]>([]);
  const [matchedPairsCount, setMatchedPairsCount] = useState<number>(0);

  // Speaks out words using browser's Text-to-Speech synthesis
  const speakText = (text: string) => {
    playWordAudio(text);
  };

  // Generic option shuffler for Multiple Choices
  const generateMultipleChoices = (correctAnswer: string, isEnglish: boolean = true) => {
    const choices = new Set<string>();
    choices.add(correctAnswer);

    const pool = vocabList.map(item => isEnglish ? item.word : item.meaning);
    // Add dummy options until we have 4 options or exhausted pool
    let attempts = 0;
    while (choices.size < Math.min(4, pool.length + 1) && attempts < 20) {
      const randomItem = pool[Math.floor(Math.random() * pool.length)];
      if (randomItem) choices.add(randomItem);
      attempts++;
    }

    // fallback dummies if pool size is too small
    if (choices.size < 4) {
      const dummies = isEnglish 
        ? ['climb', 'ski', 'backpack', 'helmet', 'happy', 'skate']
        : ['leo trèo', 'trượt tuyết', 'ba lô', 'mũ bảo hiểm', 'vui vẻ', 'trượt băng'];
      let dIdx = 0;
      while (choices.size < 4 && dIdx < dummies.length) {
        choices.add(dummies[dIdx]);
        dIdx++;
      }
    }

    return Array.from(choices).sort(() => Math.random() - 0.5);
  };

  // ============================================
  // GAME 1: PICTURE CHALLENGE
  // ============================================
  const startPictureGame = () => {
    setActiveGame('picture');
    setGameScore(0);
    setGameStreak(0);
    setCurrentIdx(0);
    setFeedback(null);
    setWrongAnswersCount(0);
    setupPictureQuestion(0);
  };

  const setupPictureQuestion = (index: number) => {
    if (index >= vocabList.length) return;
    const item = vocabList[index];
    const choices = generateMultipleChoices(item.word, true);
    setShuffledOptions(choices);
    setFeedback(null);
  };

  const handlePictureAnswer = (selectedWord: string) => {
    if (feedback) return; // Prevent double clicking
    const correctWord = vocabList[currentIdx].word;
    const isCorrect = selectedWord === correctWord;

    if (isCorrect) {
      speakText(correctWord);
      setGameScore(prev => prev + 1);
      setGameStreak(prev => prev + 1);
      setFeedback({ isCorrect: true, message: '🎉 Chính xác rồi! Con siêu quá! (+20 xu 🪙)' });
      onWordMastered(correctWord, 'mastered', false, true, 20);
    } else {
      setFeedback({ isCorrect: false, message: `❌ Chưa đúng rồi! Từ này là "${correctWord}" nhé.` });
      setGameStreak(0);
      setWrongAnswersCount(prev => prev + 1);
      onWordMastered(correctWord, 'learning', true, false, 0);
    }

    setTimeout(() => {
      const nextIndex = currentIdx + 1;
      if (nextIndex < vocabList.length) {
        setCurrentIdx(nextIndex);
        setupPictureQuestion(nextIndex);
      } else {
        // Game complete bonus points
        const bonusPoints = Math.max(20, (vocabList.length - wrongAnswersCount) * 10);
        onAwardPoints(bonusPoints);
        setFeedback({ isCorrect: true, message: `🏆 Con đã hoàn thành Picture Challenge! Thưởng thêm +${bonusPoints} xu 🪙` });
        setTimeout(() => setActiveGame('selector'), 3000);
      }
    }, 1800);
  };

  // ============================================
  // GAME 2: LISTEN & GUESS
  // ============================================
  const startListenGame = () => {
    setActiveGame('listen');
    setGameScore(0);
    setGameStreak(0);
    setCurrentIdx(0);
    setFeedback(null);
    setWrongAnswersCount(0);
    setupListenQuestion(0);
  };

  const setupListenQuestion = (index: number) => {
    if (index >= vocabList.length) return;
    const item = vocabList[index];
    const choices = generateMultipleChoices(item.meaning, false);
    setShuffledOptions(choices);
    setFeedback(null);
    // Speak automatically on question load
    setTimeout(() => speakText(item.word), 350);
  };

  const handleListenAnswer = (selectedMeaning: string) => {
    if (feedback) return;
    const correctMeaning = vocabList[currentIdx].meaning;
    const correctWord = vocabList[currentIdx].word;
    const isCorrect = selectedMeaning === correctMeaning;

    if (isCorrect) {
      setGameScore(prev => prev + 1);
      setGameStreak(prev => prev + 1);
      setFeedback({ isCorrect: true, message: '🌟 Lắng nghe rất giỏi! Bé trả lời đúng rồi! (+20 xu 🪙)' });
      onWordMastered(correctWord, 'mastered', false, true, 20);
    } else {
      setFeedback({ isCorrect: false, message: `❌ Chưa đúng rồi! "${correctWord}" có nghĩa là "${correctMeaning}".` });
      setGameStreak(0);
      setWrongAnswersCount(prev => prev + 1);
      onWordMastered(correctWord, 'learning', true, false, 0);
    }

    setTimeout(() => {
      const nextIndex = currentIdx + 1;
      if (nextIndex < vocabList.length) {
        setCurrentIdx(nextIndex);
        setupListenQuestion(nextIndex);
      } else {
        const bonusPoints = Math.max(20, (vocabList.length - wrongAnswersCount) * 10);
        onAwardPoints(bonusPoints);
        setFeedback({ isCorrect: true, message: `🏆 Hoàn thành Listen & Guess! Con được thưởng thêm +${bonusPoints} xu 🪙` });
        setTimeout(() => setActiveGame('selector'), 3000);
      }
    }, 1800);
  };

  // ============================================
  // GAME 3: SPEED QUIZ (T/F 30s)
  // ============================================
  const startSpeedGame = () => {
    setActiveGame('speed');
    setGameScore(0);
    setGameStreak(0);
    setSpeedTimer(30);
    setFeedback(null);
    setupSpeedQuestion();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSpeedTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          // Timeout, show results
          handleSpeedTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const setupSpeedQuestion = () => {
    if (vocabList.length === 0) return;
    const item = vocabList[Math.floor(Math.random() * vocabList.length)];
    const isMatch = Math.random() > 0.5;
    
    let displayMeaning = item.meaning;
    if (!isMatch) {
      // Pick a random incorrect meaning
      const filtered = vocabList.filter(v => v.word !== item.word);
      if (filtered.length > 0) {
        displayMeaning = filtered[Math.floor(Math.random() * filtered.length)].meaning;
      } else {
        displayMeaning = 'Trái nghĩa hoặc hành động khác';
      }
    }

    setSpeedQuestion({
      english: item.word,
      vietnamese: displayMeaning,
      isMatch
    });
    setFeedback(null);
  };

  const handleSpeedAnswer = (userSaysMatch: boolean) => {
    if (!speedQuestion || feedback) return;

    const isCorrect = userSaysMatch === speedQuestion.isMatch;
    if (isCorrect) {
      speakText(speedQuestion.english);
      setGameScore(prev => prev + 1);
      setGameStreak(prev => prev + 1);
      setFeedback({ isCorrect: true, message: '⚡ Chính xác! (+10 xu 🪙)' });
      onAwardPoints(10);
    } else {
      setFeedback({ isCorrect: false, message: '❌ Sai mất rồi!' });
      setGameStreak(0);
    }

    setTimeout(() => {
      setupSpeedQuestion();
    }, 800);
  };

  const handleSpeedTimeOut = () => {
    setFeedback({
      isCorrect: true,
      message: `🏁 Hết giờ! Con đã trả lời chính xác ${gameScore} câu hỏi tốc độ!`
    });
    setTimeout(() => {
      setActiveGame('selector');
    }, 3500);
  };

  // ============================================
  // GAME 4: MEMORY MATCH (FLIP CARDS)
  // ============================================
  const startMemoryGame = () => {
    setActiveGame('memory');
    setGameScore(0);
    setFeedback(null);
    setSelectedCards([]);
    setMatchedPairsCount(0);

    // Take max 4 words to make a clean 8-card grid (easy for primary school kids)
    const gameWords = [...vocabList].sort(() => Math.random() - 0.5).slice(0, 4);
    
    const cards: MemoryCard[] = [];
    gameWords.forEach((item, index) => {
      // Word card
      cards.push({
        id: `word-${item.word}-${index}`,
        type: 'word',
        content: `${item.emoji} ${item.word}`,
        associatedWord: item.word,
        isFlipped: false,
        isMatched: false
      });
      // Meaning card
      cards.push({
        id: `meaning-${item.word}-${index}`,
        type: 'meaning',
        content: item.meaning,
        associatedWord: item.word,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle cards
    setMemoryCards(cards.sort(() => Math.random() - 0.5));
  };

  const handleCardClick = (card: MemoryCard) => {
    if (card.isMatched || card.isFlipped || selectedCards.length >= 2) return;

    // Flip the clicked card
    const updatedCards = memoryCards.map(c => {
      if (c.id === card.id) return { ...c, isFlipped: true };
      return c;
    });
    setMemoryCards(updatedCards);

    const newSelection = [...selectedCards, { ...card, isFlipped: true }];
    setSelectedCards(newSelection);

    if (newSelection.length === 2) {
      const [first, second] = newSelection;
      
      // Check if matched
      if (first.associatedWord === second.associatedWord && first.type !== second.type) {
        // Matched!
        setTimeout(() => {
          setMemoryCards(prev => prev.map(c => {
            if (c.associatedWord === first.associatedWord) {
              return { ...c, isMatched: true };
            }
            return c;
          }));
          speakText(first.associatedWord);
          setMatchedPairsCount(prev => {
            const nextCount = prev + 1;
            if (nextCount === 4) {
              // Game completed!
              onAwardPoints(100);
              setFeedback({ isCorrect: true, message: '🎉 Tuyệt đỉnh! Con đã tìm thấy tất cả các cặp từ trùng khớp! Thưởng +100 xu 🪙' });
              setTimeout(() => setActiveGame('selector'), 3500);
            }
            return nextCount;
          });
          setSelectedCards([]);
        }, 500);
      } else {
        // No match, flip them back
        setTimeout(() => {
          setMemoryCards(prev => prev.map(c => {
            if (c.id === first.id || c.id === second.id) {
              return { ...c, isFlipped: false };
            }
            return c;
          }));
          setSelectedCards([]);
        }, 1200);
      }
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-xs space-y-6">
      
      {/* 1. LOBBY SELECTOR */}
      {activeGame === 'selector' && (
        <div className="space-y-6 py-4">
          <div className="text-center space-y-2">
            <span className="bg-brand-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Gamified Practice Suite
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-800">
              Vừa Chơi Vừa Học Từ Vựng 🎮
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Bé chọn các trò chơi cực vui dưới đây để ghi nhớ sâu từ vựng Everybody Up 4 và tích lũy thật nhiều xu nhé!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            
            {/* Game Card 1: Picture Challenge */}
            <div className="bg-slate-50 hover:bg-rose-50/40 p-5 rounded-2xl border border-slate-100 hover:border-rose-200 transition text-left flex items-start space-x-4">
              <div className="bg-rose-100 text-brand-primary p-3 rounded-2xl text-xl">🖼️</div>
              <div className="space-y-1.5 flex-1">
                <h4 className="text-sm font-extrabold text-slate-800">Hình ảnh vui nhộn</h4>
                <p className="text-[11px] text-slate-500 leading-normal">Xem biểu tượng hoạt hình đáng yêu và chọn đúng từ tiếng Anh tương thích.</p>
                <button 
                  onClick={startPictureGame}
                  className="bg-brand-primary hover:bg-rose-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl cursor-pointer transition shadow-xs mt-1"
                >
                  Chơi ngay 🚀
                </button>
              </div>
            </div>

            {/* Game Card 2: Listen & Guess */}
            <div className="bg-slate-50 hover:bg-blue-50/40 p-5 rounded-2xl border border-slate-100 hover:border-blue-200 transition text-left flex items-start space-x-4">
              <div className="bg-blue-100 text-brand-blue p-3 rounded-2xl text-xl">👂</div>
              <div className="space-y-1.5 flex-1">
                <h4 className="text-sm font-extrabold text-slate-800">Lắng nghe đoán từ</h4>
                <p className="text-[11px] text-slate-500 leading-normal">Nghe âm thanh phát âm chuẩn Mỹ và lựa chọn nghĩa tiếng Việt chính xác.</p>
                <button 
                  onClick={startListenGame}
                  className="bg-brand-blue hover:bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl cursor-pointer transition shadow-xs mt-1"
                >
                  Chơi ngay 🚀
                </button>
              </div>
            </div>

            {/* Game Card 3: Speed Quiz */}
            <div className="bg-slate-50 hover:bg-amber-50/40 p-5 rounded-2xl border border-slate-100 hover:border-amber-200 transition text-left flex items-start space-x-4">
              <div className="bg-amber-100 text-brand-yellow p-3 rounded-2xl text-xl">⚡</div>
              <div className="space-y-1.5 flex-1">
                <h4 className="text-sm font-extrabold text-slate-800">Đua tốc độ (30 giây)</h4>
                <p className="text-[11px] text-slate-500 leading-normal">Thử thách phản xạ nhanh! Xác định từ tiếng Anh và nghĩa hiển thị đúng hay sai.</p>
                <button 
                  onClick={startSpeedGame}
                  className="bg-brand-yellow hover:bg-amber-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl cursor-pointer transition shadow-xs mt-1"
                >
                  Chơi ngay 🚀
                </button>
              </div>
            </div>

            {/* Game Card 4: Memory Match */}
            <div className="bg-slate-50 hover:bg-emerald-50/40 p-5 rounded-2xl border border-slate-100 hover:border-emerald-200 transition text-left flex items-start space-x-4">
              <div className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl text-xl">🧠</div>
              <div className="space-y-1.5 flex-1">
                <h4 className="text-sm font-extrabold text-slate-800">Thử tài trí nhớ</h4>
                <p className="text-[11px] text-slate-500 leading-normal">Lật các thẻ bài tiếng Anh và tiếng Việt để ghép đôi hoàn chỉnh đúng nghĩa.</p>
                <button 
                  onClick={startMemoryGame}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl cursor-pointer transition shadow-xs mt-1"
                >
                  Chơi ngay 🚀
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. GAME: PICTURE CHALLENGE WORKSPACE */}
      {activeGame === 'picture' && vocabList.length > 0 && (
        <div className="space-y-6 text-center max-w-md mx-auto py-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <button 
              onClick={() => setActiveGame('selector')}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ← Thoát game
            </button>
            <div className="flex items-center space-x-3 text-xs font-bold font-mono">
              <span className="text-slate-400">Câu {currentIdx + 1}/{vocabList.length}</span>
              <span className="text-amber-500 flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-500" />{gameScore * 20}</span>
              <span className="text-rose-500 flex items-center gap-0.5"><Flame className="h-3.5 w-3.5 fill-rose-500" />{gameStreak}</span>
            </div>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-primary duration-300 transition-all"
              style={{ width: `${((currentIdx + 1) / vocabList.length) * 100}%` }}
            />
          </div>

          {/* Big Cartoon Clue Box */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 flex flex-col items-center justify-center space-y-4">
            <span className="text-7xl animate-bounce">{vocabList[currentIdx]?.emoji || '⭐️'}</span>
            <button 
              onClick={() => speakText(vocabList[currentIdx].word)}
              className="bg-white hover:bg-slate-100 p-2.5 rounded-full border border-slate-100 cursor-pointer shadow-xs transition"
            >
              <Volume2 className="h-5 w-5 text-brand-primary" />
            </button>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Chọn đúng từ tiếng Anh cho hình trên!</p>
          </div>

          {/* Answers grid */}
          <div className="grid grid-cols-2 gap-3">
            {shuffledOptions.map((opt) => (
              <button
                key={opt}
                disabled={!!feedback}
                onClick={() => handlePictureAnswer(opt)}
                className={`p-4 rounded-2xl border-2 text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                  feedback?.isCorrect && opt === vocabList[currentIdx].word
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-600'
                    : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-700'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Feedback message overlay */}
          {feedback && (
            <div className={`p-3 rounded-2xl text-xs font-bold ${
              feedback.isCorrect ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}>
              {feedback.message}
            </div>
          )}
        </div>
      )}

      {/* 3. GAME: LISTEN & GUESS WORKSPACE */}
      {activeGame === 'listen' && vocabList.length > 0 && (
        <div className="space-y-6 text-center max-w-md mx-auto py-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <button 
              onClick={() => setActiveGame('selector')}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ← Thoát game
            </button>
            <div className="flex items-center space-x-3 text-xs font-bold font-mono">
              <span className="text-slate-400">Câu {currentIdx + 1}/{vocabList.length}</span>
              <span className="text-amber-500 flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-500" />{gameScore * 20}</span>
              <span className="text-rose-500 flex items-center gap-0.5"><Flame className="h-3.5 w-3.5 fill-rose-500" />{gameStreak}</span>
            </div>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-blue duration-300 transition-all"
              style={{ width: `${((currentIdx + 1) / vocabList.length) * 100}%` }}
            />
          </div>

          {/* Large sound card */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-8 flex flex-col items-center justify-center space-y-4">
            <button 
              onClick={() => speakText(vocabList[currentIdx].word)}
              className="w-20 h-20 bg-brand-blue hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md transform hover:scale-105 active:scale-95 cursor-pointer transition"
            >
              <Volume2 className="h-10 w-10 animate-ping absolute opacity-30" />
              <Volume2 className="h-10 w-10 relative" />
            </button>
            <p className="text-xs text-brand-blue font-bold uppercase tracking-wide">Nhấp loa để nghe lại âm thanh!</p>
          </div>

          {/* Vietnamese choices */}
          <div className="grid grid-cols-1 gap-2.5">
            {shuffledOptions.map((opt) => (
              <button
                key={opt}
                disabled={!!feedback}
                onClick={() => handleListenAnswer(opt)}
                className={`p-3.5 rounded-2xl border-2 text-xs font-extrabold text-center transition cursor-pointer ${
                  feedback?.isCorrect && opt === vocabList[currentIdx].meaning
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-600'
                    : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-700'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Feedback message overlay */}
          {feedback && (
            <div className={`p-3 rounded-2xl text-xs font-bold ${
              feedback.isCorrect ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}>
              {feedback.message}
            </div>
          )}
        </div>
      )}

      {/* 4. GAME: SPEED QUIZ WORKSPACE */}
      {activeGame === 'speed' && speedQuestion && (
        <div className="space-y-6 text-center max-w-md mx-auto py-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <button 
              onClick={() => {
                if (timerRef.current) clearInterval(timerRef.current);
                setActiveGame('selector');
              }}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ← Thoát game
            </button>
            <div className="flex items-center space-x-4 text-xs font-bold font-mono">
              <span className="text-amber-500 flex items-center gap-1"><Trophy className="h-3.5 w-3.5" />{gameScore * 10} pts</span>
              <span className="text-rose-500 flex items-center gap-1"><Timer className="h-3.5 w-3.5" />{speedTimer}s</span>
            </div>
          </div>

          {/* Question board */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-4 shadow-lg border-4 border-slate-800">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">Thử thách đúng / sai nhanh</span>
            <div className="space-y-1">
              <h3 className="text-3xl font-display font-black tracking-tight text-brand-blue">{speedQuestion.english}</h3>
              <p className="text-xs text-slate-400 font-semibold font-mono">bằng tiếng Việt có nghĩa là:</p>
              <h4 className="text-xl font-bold text-amber-300">"{speedQuestion.vietnamese}"</h4>
            </div>
          </div>

          {/* True / False Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              disabled={!!feedback && feedback.message.includes('Hết giờ')}
              onClick={() => handleSpeedAnswer(false)}
              className="bg-rose-500 hover:bg-rose-600 text-white p-5 rounded-2xl shadow-md transition cursor-pointer flex flex-col items-center justify-center space-y-1.5"
            >
              <X className="h-6 w-6 stroke-[3]" />
              <span className="text-xs font-black uppercase">Sai ❌</span>
            </button>

            <button
              disabled={!!feedback && feedback.message.includes('Hết giờ')}
              onClick={() => handleSpeedAnswer(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white p-5 rounded-2xl shadow-md transition cursor-pointer flex flex-col items-center justify-center space-y-1.5"
            >
              <Check className="h-6 w-6 stroke-[3]" />
              <span className="text-xs font-black uppercase">Đúng ✅</span>
            </button>
          </div>

          {/* feedback banner */}
          {feedback && (
            <div className={`p-3 rounded-2xl text-xs font-bold ${
              feedback.isCorrect ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}>
              {feedback.message}
            </div>
          )}
        </div>
      )}

      {/* 5. GAME: MEMORY MATCH WORKSPACE */}
      {activeGame === 'memory' && (
        <div className="space-y-6 text-center max-w-lg mx-auto py-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <button 
              onClick={() => setActiveGame('selector')}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ← Thoát game
            </button>
            <div className="flex items-center space-x-3 text-xs font-bold font-mono">
              <span className="text-emerald-500">Khớp: {matchedPairsCount}/4 cặp</span>
              <span className="text-amber-500 flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-500" />{matchedPairsCount * 25} xu</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Lật 2 thẻ trùng khớp tiếng Anh - Việt để nối chúng!</p>

          {/* 4x2 grid of cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {memoryCards.map((card) => {
              const showCardContent = card.isFlipped || card.isMatched;

              return (
                <button
                  key={card.id}
                  disabled={card.isMatched}
                  onClick={() => handleCardClick(card)}
                  className={`h-24 sm:h-28 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform active:scale-95 flex flex-col items-center justify-center p-3 text-center ${
                    card.isMatched
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-500 opacity-60 cursor-not-allowed'
                      : showCardContent
                      ? 'bg-white border-brand-blue shadow-sm text-slate-800'
                      : 'bg-gradient-to-br from-brand-primary to-rose-400 border-rose-300 text-white font-mono text-xl font-bold'
                  }`}
                >
                  {showCardContent ? (
                    <span className="text-xs sm:text-sm font-extrabold leading-snug">{card.content}</span>
                  ) : (
                    <span className="animate-pulse">❓</span>
                  )}
                </button>
              );
            })}
          </div>

          {feedback && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs font-bold text-emerald-600">
              {feedback.message}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
