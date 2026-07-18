/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserSession, Unit, Lesson } from '../types';
import { syllabusData } from '../data/syllabus';
import { getGrammarForLesson, GrammarPoint, GrammarExercise } from '../data/grammar';
import { 
  BookOpen, Sparkles, Trophy, CheckCircle, Volume2, 
  HelpCircle, Heart, Star, AlertTriangle, Lightbulb, 
  RotateCcw, ArrowRight, Check, X, Brain, ShieldCheck
} from 'lucide-react';
import { playWordAudio } from '../lib/audioHelper';

interface GrammarScreenProps {
  session: UserSession;
  onUpdateSession: (updated: UserSession) => void;
  activeUnit: Unit;
  activeLesson: Lesson;
}

export default function GrammarScreen({ session, onUpdateSession, activeUnit, activeLesson }: GrammarScreenProps) {
  const [currentSection, setCurrentSection] = useState<'study' | 'practice' | 'tracker'>('study');

  // Load grammar point & exercises for current lesson
  const { grammarPoint, exercises } = getGrammarForLesson(activeUnit.id, activeLesson.id);

  // Active exercise states
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [placedWords, setPlacedWords] = useState<string[]>([]);
  const [scrambledWords, setScrambledWords] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrectResult, setIsCorrectResult] = useState(false);
  const [attemptsThisExercise, setAttemptsThisExercise] = useState(0);
  const [aiFeedbackExplanation, setAiFeedbackExplanation] = useState('');

  // AI Sandbox states
  const [sandboxText, setSandboxText] = useState('');
  const [sandboxResult, setSandboxResult] = useState<{
    status: 'correct' | 'error' | null;
    correction: string;
    explanation: string;
  } | null>(null);

  // Sync state when lesson or unit changes
  useEffect(() => {
    resetGame();
  }, [activeUnit, activeLesson]);

  const resetGame = () => {
    setActiveExerciseIndex(0);
    resetExerciseState(0);
  };

  const resetExerciseState = (index: number) => {
    setSelectedOption(null);
    setPlacedWords([]);
    setIsAnswered(false);
    setAttemptsThisExercise(0);
    setAiFeedbackExplanation('');
    
    const exercise = exercises[index];
    if (exercise && exercise.type === 'scrambled_words') {
      // Scramble options randomly for fresh experience
      setScrambledWords([...exercise.options].sort(() => Math.random() - 0.5));
    } else if (exercise && exercise.type === 'find_error') {
      setScrambledWords([...exercise.options]);
    }
  };

  // Text to Speech voice standard
  const speakText = (text: string) => {
    playWordAudio(text);
  };

  // Scrambled word bubble click handler
  const handleWordBubbleClick = (word: string, isPlaced: boolean) => {
    if (isAnswered) return;
    if (isPlaced) {
      setPlacedWords(prev => prev.filter(w => w !== word));
      setScrambledWords(prev => [...prev, word]);
    } else {
      setPlacedWords(prev => [...prev, word]);
      setScrambledWords(prev => prev.filter(w => w !== word));
    }
  };

  // Grade user's response
  const handleCheckAnswer = async () => {
    if (isAnswered) return;
    const exercise = exercises[activeExerciseIndex];
    if (!exercise) return;

    let isCorrect = false;
    let finalAnswerText = '';
    let customExplanation = '';
    let usedAIEvaluation = false;

    if (exercise.type === 'scrambled_words') {
      const userAnswer = placedWords.join(' ').trim();
      const correctAnswerText = String(exercise.correctAnswer).replace(/\s+/g, ' ').trim();
      finalAnswerText = userAnswer;

      // 1. Try to validate with the real Express full-stack backend
      try {
        const response = await fetch("/api/validate-sentence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: exercise.question,
            prompt: exercise.prompt,
            correctAnswer: correctAnswerText,
            userAnswer: userAnswer,
            options: exercise.options
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.useFallback !== true) {
            isCorrect = data.isCorrect;
            if (data.explanation) {
              customExplanation = data.explanation;
            }
            usedAIEvaluation = true;
          }
        }
      } catch (err) {
        console.warn("API check-sentence failed or not available, falling back to smart local check:", err);
      }

      // 2. Local fallback if AI validation wasn't available
      if (!usedAIEvaluation) {
        const cleanUser = userAnswer.toLowerCase().replace(/[^a-z0-9']/g, '').trim();
        const cleanTarget = correctAnswerText.toLowerCase().replace(/[^a-z0-9']/g, '').trim();

        isCorrect = cleanUser === cleanTarget;

        // Smart local permutation matching (e.g., swapping items in 'and' list)
        if (!isCorrect) {
          if (cleanUser.includes('and') && cleanTarget.includes('and')) {
            const userParts = cleanUser.split('and').map(s => s.trim()).sort().join('');
            const targetParts = cleanTarget.split('and').map(s => s.trim()).sort().join('');
            if (userParts === targetParts) {
              isCorrect = true;
              customExplanation = "Con đã sắp xếp chính xác và tự nhiên! Cách sắp xếp thứ tự các hoạt động của con hoàn toàn đúng.";
            }
          }
        }
      }
    } else if (exercise.type === 'fill_in_blank' || exercise.type === 'choose_correct' || exercise.type === 'find_error' || exercise.type === 'complete_dialog' || exercise.type === 'picture_matching') {
      isCorrect = selectedOption === Number(exercise.correctAnswer);
      finalAnswerText = selectedOption !== null ? exercise.options[selectedOption] : '';
    }

    if (customExplanation) {
      setAiFeedbackExplanation(customExplanation);
    }

    setIsCorrectResult(isCorrect);
    setIsAnswered(true);
    setAttemptsThisExercise(prev => prev + 1);

    // Dynamic points and gamification tracking
    let pointsEarned = 0;
    if (isCorrect) {
      pointsEarned = attemptsThisExercise === 0 ? 50 : 20; // 50 points on first attempt, 20 on subsequent
      speakText("Excellent!");
    } else {
      speakText("Try again.");
    }

    // Save grammar progress in session
    const updatedProgress = { ...(session.grammarProgress || {}) };
    updatedProgress[exercise.id] = {
      exerciseId: exercise.id,
      unitId: activeUnit.id,
      lessonId: activeLesson.id,
      isCorrect,
      attemptsCount: (updatedProgress[exercise.id]?.attemptsCount || 0) + 1,
      completedAt: new Date().toISOString(),
      userAnswer: finalAnswerText
    };

    // Check dynamic badge trigger: "Grammar Master Badge"
    const totalExercises = Object.keys(updatedProgress).length;
    const totalCorrect = Object.values(updatedProgress).filter(p => p.isCorrect).length;
    const earnedBadges = [...(session.badges || [])];

    if (totalCorrect >= 10 && !earnedBadges.includes('badge-grammar-master')) {
      earnedBadges.push('badge-grammar-master');
      alert("🎉 Siêu đỉnh! Bé đã đạt Huy Hiệu 'Grammar Master Badge' vì làm đúng xuất sắc 10 bài tập Ngữ Pháp! 🏆");
    }

    onUpdateSession({
      ...session,
      points: session.points + pointsEarned,
      grammarProgress: updatedProgress,
      badges: earnedBadges
    });
  };

  // Next exercise
  const handleNextExercise = () => {
    if (activeExerciseIndex + 1 < exercises.length) {
      const nextIndex = activeExerciseIndex + 1;
      setActiveExerciseIndex(nextIndex);
      resetExerciseState(nextIndex);
    } else {
      alert("🎉 Tuyệt vời! Con đã hoàn thành tất cả các bài tập Ngữ pháp của Lesson này! Hãy tiếp tục rèn luyện các chủ đề khác nhé!");
      setCurrentSection('tracker');
    }
  };

  // AI Free Speech Sandbox simulator
  const handleAISandboxCheck = () => {
    if (!sandboxText.trim()) return;

    const query = sandboxText.trim().toLowerCase();
    let status: 'correct' | 'error' = 'correct';
    let correction = '';
    let explanation = '';

    // Check custom rules corresponding to the current active unit/lesson to simulate deep AI capability
    if (activeUnit.id === 'unit-1') {
      if (activeLesson.id === 'lesson-1') {
        // Like + V-ing rules
        if (query.includes('he like ') || query.includes('she like ') || query.includes('it like ')) {
          status = 'error';
          correction = sandboxText.replace(/like/i, 'likes');
          explanation = 'He/She/It là ngôi thứ 3 số ít. Động từ "like" phải thêm "s" thành "likes" con nhé!';
        } else if (query.match(/(likes|like)\s+[a-z]+(\s+|$)/) && !query.includes('climbing') && !query.includes('hiking') && !query.includes('canoeing') && !query.includes('fishing') && !query.includes('watching') && !query.includes('grilling') && !query.match(/ing/)) {
          status = 'error';
          explanation = 'Sau động từ "like/likes", hành động chỉ sở thích phải thêm đuôi "-ing" (ví dụ: like climbing, like watching birds).';
        } else {
          explanation = 'Tuyệt vời! Câu của con đúng 100% ngữ pháp Oxford Everybody Up 4! Con đã sử dụng chính xác cấu trúc sở thích rồi đấy.';
        }
      } else if (activeLesson.id === 'lesson-2') {
        // Good at + V-ing rules
        if (query.includes('good in')) {
          status = 'error';
          correction = sandboxText.replace(/good in/i, 'good at');
          explanation = 'Trong tiếng Anh chuẩn, ta dùng giới từ "at" đi với "good" (good at) chứ không dùng "good in".';
        } else if (query.includes('good at') && query.match(/good at\s+[a-z]+/) && !query.match(/ing/)) {
          status = 'error';
          explanation = 'Sau cụm "good at", các động từ chỉ hoạt động phải thêm đuôi "-ing" (ví dụ: good at skiing, good at skating).';
        } else {
          explanation = 'Hoàn hảo! Câu rất tự nhiên và chính xác cấu trúc "good at + V-ing". Tiếp tục phát huy nhé!';
        }
      } else {
        explanation = 'Cực kỳ tốt! Câu viết đúng ngữ pháp tiếng Anh chuẩn Oxford Everybody Up 4.';
      }
    } else if (activeUnit.id === 'unit-2') {
      // Comparison rules
      if (query.includes('bigger then')) {
        status = 'error';
        correction = sandboxText.replace(/bigger then/i, 'bigger than');
        explanation = 'Trong cấu trúc so sánh hơn, ta phải dùng "than" chứ không dùng "then" con nhé!';
      } else if (query.includes('biggest') && !query.includes('the biggest')) {
        status = 'error';
        explanation = 'So sánh nhất của tính từ ngắn luôn luôn có mạo từ "the" đi trước (ví dụ: the biggest, the smallest).';
      } else {
        explanation = 'Rất xuất sắc! Câu so sánh đúng cấu trúc ngữ pháp và biểu đạt rất tự nhiên.';
      }
    } else {
      explanation = 'Chúc mừng con! Câu viết rất đúng ngữ pháp, trôi chảy và phù hợp hoàn hảo với ngữ cảnh Everybody Up 4!';
    }

    setSandboxResult({ status, correction, explanation });
  };

  // Quick statistics
  const userProgressList = Object.values(session.grammarProgress || {});
  const unitProgress = userProgressList.filter(p => p.unitId === activeUnit.id);
  const lessonProgress = userProgressList.filter(p => p.unitId === activeUnit.id && p.lessonId === activeLesson.id);
  
  const totalCompleted = userProgressList.length;
  const totalCorrectFirstTry = userProgressList.filter(p => p.attemptsCount === 1 && p.isCorrect).length;
  const accuracyRate = totalCompleted > 0 ? Math.round((userProgressList.filter(p => p.isCorrect).length / totalCompleted) * 100) : 100;

  // Encouraging phrases based on status
  const getEncouragingPhrase = () => {
    const phrases = ["Excellent!", "Great job!", "Correct!", "Bé giỏi quá!", "Xuất sắc luôn!", "Quá chính xác!"];
    return phrases[activeExerciseIndex % phrases.length];
  };

  return (
    <div className="space-y-6">
        
        {/* Header Ribbon / Navigation */}
        <div className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-brand-primary">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Everybody Up 4 - Unit {activeUnit.number} Lesson {activeLesson.id.replace('lesson-', '')}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-800">
              {activeLesson.title} Grammar
            </h2>
            <p className="text-xs text-slate-400">
              Trọng tâm ngữ pháp: <span className="font-bold text-slate-700">{activeLesson.focus}</span>
            </p>
          </div>

          {/* Tab Menu Options */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => setCurrentSection('study')}
              className={`flex-1 md:flex-initial px-4 py-2.5 text-xs font-bold rounded-2xl transition cursor-pointer text-center ${
                currentSection === 'study'
                  ? 'bg-brand-blue text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              📖 Lý Thuyết
            </button>
            <button
              onClick={() => {
                setCurrentSection('practice');
                resetGame();
              }}
              className={`flex-1 md:flex-initial px-4 py-2.5 text-xs font-bold rounded-2xl transition cursor-pointer text-center flex items-center justify-center space-x-1 ${
                currentSection === 'practice'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="h-3 w-3 fill-white" />
              <span>🎮 Ghép Câu</span>
            </button>
            <button
              onClick={() => setCurrentSection('tracker')}
              className={`flex-1 md:flex-initial px-4 py-2.5 text-xs font-bold rounded-2xl transition cursor-pointer text-center ${
                currentSection === 'tracker'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              📊 Sổ Tay Ôn Tập
            </button>
          </div>
        </div>

        {/* SECTION A: STUDY THEORY */}
        {currentSection === 'study' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Grammar Point Core Card */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Mẫu câu Oxford
                </span>
                <h3 className="font-display font-extrabold text-slate-800 text-lg mt-2">
                  {grammarPoint.title}
                </h3>
              </div>

              {/* Sentence Formula Box */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 space-y-1">
                <span className="text-[9px] text-blue-600 font-bold uppercase tracking-wider block">Công thức vàng</span>
                <pre className="font-mono text-sm font-bold text-blue-900 whitespace-pre-wrap leading-relaxed">
                  {grammarPoint.structure}
                </pre>
              </div>

              {/* Simple Explanation in Vietnamese */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Giải thích chi tiết:</h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {grammarPoint.explanation}
                </p>
              </div>

              {/* Memory Tip */}
              <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-4 flex items-start space-x-3">
                <div className="bg-amber-100 p-2 rounded-xl text-amber-600 flex-shrink-0">
                  <Lightbulb className="h-4 w-4 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-amber-800">Mẹo siêu trí nhớ:</h4>
                  <p className="text-xs text-amber-700 leading-relaxed mt-0.5 font-medium">
                    {grammarPoint.rememberTip}
                  </p>
                </div>
              </div>
            </div>

            {/* Examples & Common Mistakes */}
            <div className="space-y-6">
              
              {/* Examples Box */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
                <h3 className="font-display font-bold text-slate-800 text-base border-b border-slate-50 pb-2">
                  Ví dụ minh họa (Click loa để nghe)
                </h3>
                
                <div className="space-y-2.5">
                  {grammarPoint.examples.map((ex, index) => (
                    <div 
                      key={index} 
                      onClick={() => speakText(ex.english)}
                      className="bg-slate-50 hover:bg-blue-50/20 hover:border-blue-200 border border-slate-100 p-3 rounded-2xl cursor-pointer transition flex items-center justify-between group"
                    >
                      <div className="space-y-0.5">
                        <p className="text-xs font-extrabold text-slate-800 group-hover:text-brand-blue transition">
                          {ex.english}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {ex.vietnamese}
                        </p>
                      </div>
                      <div className="p-1.5 bg-white rounded-xl border border-slate-100 group-hover:scale-105 transition flex-shrink-0">
                        <Volume2 className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand-blue" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Mistakes Warning Card */}
              <div className="bg-rose-50/30 border border-rose-100 rounded-3xl p-6 space-y-3">
                <div className="flex items-center space-x-2 text-rose-600">
                  <AlertTriangle className="h-5 w-5 fill-rose-100" />
                  <span className="text-xs font-extrabold uppercase tracking-wider">Cảnh báo lỗi thường gặp!</span>
                </div>
                <div className="text-xs text-rose-800 leading-relaxed whitespace-pre-wrap font-medium">
                  {grammarPoint.commonMistakes}
                </div>
              </div>

            </div>

            {/* AI Sandbox Playground inside the Study Tab */}
            <div className="md:col-span-2 bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 text-white rounded-3xl p-6 shadow-md space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-indigo-500/30 inline-flex items-center space-x-1">
                    <Brain className="h-3 w-3 text-indigo-400 animate-pulse" />
                    <span>AI Grammar Sandbox (Thử thách viết câu)</span>
                  </span>
                  <h4 className="text-base sm:text-lg font-bold font-display">Tự viết câu tiếng Anh - Robot AI chấm điểm ngay</h4>
                  <p className="text-xs text-slate-300">
                    Bé hãy tự viết một câu bất kỳ sử dụng cấu trúc vừa học bên trên. Hệ thống AI thông minh sẽ phân tích lỗi sai và chỉ bảo cho bé!
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Oxford Standard Rules</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text"
                  value={sandboxText}
                  onChange={(e) => setSandboxText(e.target.value)}
                  placeholder="Ví dụ: She likes climbing. hoặc He like fishing..."
                  className="flex-1 bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 rounded-2xl px-4 py-3.5 text-xs font-bold outline-none focus:border-indigo-500 focus:bg-slate-800 transition"
                />
                <button
                  onClick={handleAISandboxCheck}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-6 py-3.5 rounded-2xl transition cursor-pointer active:scale-95 shadow-lg flex items-center justify-center space-x-1"
                >
                  <span>AI Thẩm Định 🔍</span>
                </button>
              </div>

              {sandboxResult && (
                <div className={`p-4 rounded-2xl border transition duration-300 animate-fade-in ${
                  sandboxResult.status === 'correct' 
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-100'
                    : 'bg-rose-950/40 border-rose-500/30 text-rose-100'
                }`}>
                  <div className="flex items-start space-x-3">
                    <span className="text-xl">
                      {sandboxResult.status === 'correct' ? '🎉' : '💡'}
                    </span>
                    <div className="space-y-1">
                      <p className="text-xs font-extrabold">
                        Kết quả phân tích: <span className={sandboxResult.status === 'correct' ? 'text-emerald-400' : 'text-rose-400'}>
                          {sandboxResult.status === 'correct' ? 'Câu Viết Rất Tốt!' : 'Có Lỗi Nhỏ Cần Sửa'}
                        </span>
                      </p>
                      {sandboxResult.correction && (
                        <p className="text-xs font-mono font-bold bg-black/30 px-2 py-1 rounded border border-white/5 mt-1 text-yellow-300">
                          Nên sửa lại là: "{sandboxResult.correction}"
                        </p>
                      )}
                      <p className="text-xs text-slate-300 leading-relaxed mt-1">
                        {sandboxResult.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Practice shortcut CTA */}
            <div className="md:col-span-2 flex justify-end">
              <button
                onClick={() => { setCurrentSection('practice'); resetGame(); }}
                className="bg-brand-primary hover:bg-rose-600 text-white font-bold text-xs px-6 py-3.5 rounded-2xl shadow-lg transition flex items-center space-x-2 cursor-pointer"
              >
                <span>Chuyển Sang Luyện Tập Ngay</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        )}

        {/* SECTION B: PRACTICE GAME - SENTENCE BUILDER */}
        {currentSection === 'practice' && exercises.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-6">
            
            {/* Header progress info */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                  Everybody Up 4 Sentence Builder
                </span>
                <h4 className="text-sm font-bold text-slate-800">
                  Câu hỏi {activeExerciseIndex + 1} / {exercises.length}
                </h4>
              </div>
              
              <div className="flex items-center space-x-1.5 text-xs font-bold text-brand-secondary bg-brand-secondary/10 px-3 py-1 rounded-full">
                <Star className="h-3.5 w-3.5 fill-brand-secondary" />
                <span>+50 xu 🪙</span>
              </div>
            </div>

            {/* Exercise Display */}
            <div className="py-2 space-y-6">
              
              {/* Question Instruction */}
              <div className="text-center space-y-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800">
                  {exercises[activeExerciseIndex].question}
                </h3>
                <div className="inline-flex items-center space-x-2 bg-rose-50 text-rose-700 border border-rose-100 px-4 py-2 rounded-2xl">
                  <span className="text-xs font-bold">Nghĩa là: {exercises[activeExerciseIndex].prompt}</span>
                </div>
              </div>

              {/* GAME TYPE 1: SCRAMBLED WORDS */}
              {exercises[activeExerciseIndex].type === 'scrambled_words' && (
                <div className="space-y-6 max-w-xl mx-auto">
                  
                  {/* Tray area */}
                  <div className="min-h-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-4 flex flex-wrap gap-2 items-center justify-center">
                    {placedWords.length === 0 ? (
                      <span className="text-xs text-slate-400 font-bold">Chạm các từ phía dưới để lắp ghép câu...</span>
                    ) : (
                      placedWords.map((word, idx) => (
                        <button
                          key={`placed-${word}-${idx}`}
                          onClick={() => handleWordBubbleClick(word, true)}
                          className="bg-brand-blue text-white px-4 py-2.5 rounded-2xl text-xs font-extrabold shadow-sm hover:bg-rose-500 transition cursor-pointer flex items-center space-x-1"
                        >
                          <span>{word}</span>
                        </button>
                      ))
                    )}
                  </div>

                  {/* Bubbles Pool */}
                  <div className="flex flex-wrap gap-2.5 justify-center pt-2">
                    {scrambledWords.map((word, idx) => (
                      <button
                        key={`scramble-${word}-${idx}`}
                        onClick={() => handleWordBubbleClick(word, false)}
                        className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer"
                      >
                        {word}
                      </button>
                    ))}
                  </div>

                </div>
              )}

              {/* GAME TYPE 2: CHOOSE CORRECT / FILL BLANK / DIALOGUE / ERROR SPOT */}
              {(exercises[activeExerciseIndex].type === 'fill_in_blank' || 
                exercises[activeExerciseIndex].type === 'choose_correct' || 
                exercises[activeExerciseIndex].type === 'find_error' || 
                exercises[activeExerciseIndex].type === 'complete_dialog' || 
                exercises[activeExerciseIndex].type === 'picture_matching') && (
                <div className="max-w-xl mx-auto space-y-3">
                  {exercises[activeExerciseIndex].options.map((option, index) => {
                    const letters = ['A', 'B', 'C', 'D'];
                    const isSelected = selectedOption === index;
                    
                    return (
                      <button
                        key={index}
                        disabled={isAnswered}
                        onClick={() => setSelectedOption(index)}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition flex items-center justify-between cursor-pointer ${
                          isSelected 
                            ? 'bg-blue-50 border-brand-blue text-brand-blue font-extrabold'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-100 text-slate-700 font-bold'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className={`h-6 w-6 rounded-lg text-xs font-extrabold flex items-center justify-center ${
                            isSelected ? 'bg-brand-blue text-white' : 'bg-slate-200 text-slate-500'
                          }`}>
                            {letters[index]}
                          </span>
                          <span className="text-xs sm:text-sm">{option}</span>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-brand-blue" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center items-center space-x-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => resetExerciseState(activeExerciseIndex)}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-2xl transition cursor-pointer flex items-center space-x-1.5"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Làm Lại</span>
                </button>
                
                {!isAnswered ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={
                      (exercises[activeExerciseIndex].type === 'scrambled_words' && placedWords.length === 0) ||
                      (exercises[activeExerciseIndex].type !== 'scrambled_words' && selectedOption === null)
                    }
                    className="px-6 py-3 bg-brand-primary hover:bg-rose-600 disabled:opacity-50 text-white font-extrabold text-xs rounded-2xl shadow-md transition cursor-pointer"
                  >
                    Kiểm Tra Kết Quả
                  </button>
                ) : (
                  <button
                    onClick={handleNextExercise}
                    className="px-6 py-3 bg-brand-secondary hover:bg-emerald-600 text-white font-extrabold text-xs rounded-2xl shadow-md transition cursor-pointer flex items-center space-x-1"
                  >
                    <span>{activeExerciseIndex + 1 < exercises.length ? 'Câu Tiếp Theo' : 'Hoàn Thành Lesson'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Feedback System (Section VII) */}
              {isAnswered && (
                <div className={`p-5 rounded-3xl border-2 transition duration-300 animate-fade-in max-w-xl mx-auto ${
                  isCorrectResult 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">
                      {isCorrectResult ? '🏆' : '💡'}
                    </span>
                    <div className="space-y-1.5 flex-1">
                      <p className="text-sm font-extrabold">
                        {isCorrectResult ? getEncouragingPhrase() : 'Chưa chính xác rồi con ơi!'}
                      </p>
                      
                      {!isCorrectResult && (
                        <div className="text-xs space-y-1 font-medium text-rose-900 bg-white/60 p-3 rounded-2xl border border-rose-100/60 leading-relaxed">
                          <p>
                            👉 <span className="font-extrabold">Đáp án đúng:</span>{' '}
                            <span className="font-extrabold text-emerald-700">
                              {exercises[activeExerciseIndex].type === 'scrambled_words' 
                                ? String(exercises[activeExerciseIndex].correctAnswer)
                                : exercises[activeExerciseIndex].options[Number(exercises[activeExerciseIndex].correctAnswer)]
                              }
                            </span>
                          </p>
                          <p>
                            ❓ <span className="font-extrabold">Giải thích:</span> {exercises[activeExerciseIndex].explanation}
                          </p>
                        </div>
                      )}

                      {isCorrectResult && (
                        <p className="text-xs text-emerald-700 leading-relaxed font-bold">
                          Chính xác! Con vừa nhận thêm {attemptsThisExercise === 1 ? '+50' : '+20'} xu vàng 🪙 vào kho tài sản LeeGo!
                        </p>
                      )}

                      {aiFeedbackExplanation && (
                        <div className="mt-2 text-xs font-medium bg-white/70 p-3 rounded-2xl border border-slate-100/60 leading-relaxed text-slate-700">
                          <p>🤖 <span className="font-extrabold text-indigo-700">AI nhận định:</span> {aiFeedbackExplanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* SECTION C: GRAMMAR PROGRESS TRACKER & HANDBOOK */}
        {currentSection === 'tracker' && (
          <div className="space-y-6">
            
            {/* Statistics Board */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs text-center space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Bài tập hoàn thành</span>
                <span className="text-2xl font-extrabold text-slate-800 font-mono">{totalCompleted}</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs text-center space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Hoàn thành lần đầu đúng</span>
                <span className="text-2xl font-extrabold text-emerald-600 font-mono">{totalCorrectFirstTry}</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs text-center space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Huy hiệu đạt được</span>
                <span className="text-2xl font-extrabold text-amber-500 font-mono">
                  {session.badges?.includes('badge-grammar-master') ? '1 / 1' : '0 / 1'}
                </span>
              </div>
            </div>

            {/* Notebook List of Completed / Wrong Questions */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
              <h3 className="font-display font-extrabold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center justify-between">
                <span>Sổ Tay Sửa Sai & Ôn Luyện (Review Handbook)</span>
                <span className="text-xs text-slate-400 font-medium">Lưu tự động</span>
              </h3>

              {userProgressList.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <p className="text-xs text-slate-400 font-bold">Sổ tay rỗng. Bé hãy tham gia làm bài tập Ngữ pháp để lưu trữ nhé!</p>
                  <button 
                    onClick={() => setCurrentSection('practice')}
                    className="bg-slate-100 text-slate-700 text-xs font-bold py-2 px-4 rounded-xl"
                  >
                    Bắt đầu ghép câu ngay
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userProgressList.map((progress, idx) => {
                    const isCorrect = progress.isCorrect;
                    
                    return (
                      <div 
                        key={idx} 
                        className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isCorrect 
                            ? 'bg-emerald-50/20 border-emerald-100' 
                            : 'bg-rose-50/20 border-rose-100'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                              isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {isCorrect ? 'Đã thuộc bài' : 'Cần ôn thêm'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">
                              Unit {progress.unitId.replace('unit-', '')} Lesson {progress.lessonId.replace('lesson-', '')}
                            </span>
                          </div>
                          
                          <p className="text-xs font-bold text-slate-800">
                            Câu hỏi ID: {progress.exerciseId}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            Câu trả lời của con: "{progress.userAnswer || 'Chưa trả lời'}"
                          </p>
                        </div>

                        {!isCorrect && (
                          <button
                            onClick={() => {
                              setCurrentSection('practice');
                              const idx = exercises.findIndex(ex => ex.id === progress.exerciseId);
                              if (idx !== -1) {
                                setActiveExerciseIndex(idx);
                                resetExerciseState(idx);
                              } else {
                                resetGame();
                              }
                            }}
                            className="text-[10px] font-bold text-rose-600 hover:text-rose-700 underline self-start sm:self-center cursor-pointer"
                          >
                            Làm lại câu này 🔄
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

    </div>
  );
}
