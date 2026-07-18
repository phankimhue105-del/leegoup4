/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserSession, TestResult } from '../types';
import { unitTestsData, TestQuestion } from '../data/testData';
import { 
  Volume2, HelpCircle, Star, Trophy, Sparkles, Check, 
  X, AlertCircle, ChevronRight, Award, Calendar, RefreshCw, Eye
} from 'lucide-react';

interface ShortTestScreenProps {
  session: UserSession;
  onUpdateSession: (updated: UserSession) => void;
  activeUnit: {
    id: string;
    number: number;
    title: string;
  };
}

export default function ShortTestScreen({ session, onUpdateSession, activeUnit }: ShortTestScreenProps) {
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(-1); // -1 means Lobby / Intro screen
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({}); // keyed by question id
  const [testCompleted, setTestCompleted] = useState<boolean>(false);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState<boolean>(false);
  const [selectedWordBank, setSelectedWordBank] = useState<string[]>([]); // for scrambled writing questions

  // For review mode
  const [showReview, setShowReview] = useState<boolean>(false);

  // Load questions for the active unit on mount or unit change
  useEffect(() => {
    const unitQuestions = unitTestsData[activeUnit.id] || [];
    setQuestions(unitQuestions);
    // Reset test states
    setCurrentIdx(-1);
    setUserAnswers({});
    setTestCompleted(false);
    setShowReview(false);
    setSelectedWordBank([]);
  }, [activeUnit]);

  // Voice player helper
  const speakAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any playing audio
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8; // Friendly, slow pace for children
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartTest = () => {
    setCurrentIdx(0);
    setUserAnswers({});
    setTestCompleted(false);
    setSelectedWordBank([]);
    
    // Auto speak the first question audio if it's a listening question
    const firstQ = questions[0];
    if (firstQ && firstQ.section === 'listening' && firstQ.audioText) {
      setTimeout(() => {
        speakAudio(firstQ.audioText || '');
      }, 500);
    }
  };

  const handleOptionSelect = (option: string) => {
    const currentQ = questions[currentIdx];
    setUserAnswers({
      ...userAnswers,
      [currentQ.id]: option
    });
  };

  // Tap-to-arrange for write_arrange questions
  const handleWordBankTap = (word: string, isFromSelection: boolean) => {
    if (isFromSelection) {
      // Remove word from selected list, send back
      const newSelection = [...selectedWordBank];
      const index = newSelection.lastIndexOf(word);
      if (index !== -1) {
        newSelection.splice(index, 1);
        setSelectedWordBank(newSelection);
        
        // Update user answers with current builder progress
        const currentQ = questions[currentIdx];
        setUserAnswers({
          ...userAnswers,
          [currentQ.id]: newSelection.join(' ')
        });
      }
    } else {
      // Add word to selected list
      const newSelection = [...selectedWordBank, word];
      setSelectedWordBank(newSelection);
      
      // Update answers
      const currentQ = questions[currentIdx];
      setUserAnswers({
        ...userAnswers,
        [currentQ.id]: newSelection.join(' ')
      });
    }
  };

  // Helper to validate and clean sentence answers for flexible checking
  const cleanSentence = (str: string) => {
    return str
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  };

  const handleNextQuestion = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx < questions.length) {
      setCurrentIdx(nextIdx);
      setSelectedWordBank([]);
      
      // Auto speak if next question is listening
      const nextQ = questions[nextIdx];
      if (nextQ && nextQ.section === 'listening' && nextQ.audioText) {
        setTimeout(() => {
          speakAudio(nextQ.audioText || '');
        }, 500);
      }
    } else {
      // Test finished, process scoring and save!
      handleFinishTest();
    }
  };

  const handlePrevQuestion = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      
      // Load previous writing words if any
      const prevQ = questions[prevIdx];
      if (prevQ.type === 'write_arrange' && userAnswers[prevQ.id]) {
        setSelectedWordBank(userAnswers[prevQ.id].split(' ').filter(Boolean));
      } else {
        setSelectedWordBank([]);
      }

      if (prevQ.section === 'listening' && prevQ.audioText) {
        speakAudio(prevQ.audioText);
      }
    }
  };

  const handleFinishTest = () => {
    // 1. Calculate section scores
    let listeningScore = 0;
    let readingScore = 0;
    let writingScore = 0;

    questions.forEach((q) => {
      const uAns = userAnswers[q.id] || '';
      const isCorrect = cleanSentence(uAns) === cleanSentence(q.correctAnswer);
      
      if (isCorrect) {
        if (q.section === 'listening') listeningScore++;
        if (q.section === 'reading') readingScore++;
        if (q.section === 'writing') writingScore++;
      }
    });

    const totalCorrect = listeningScore + readingScore + writingScore;

    // 2. Map weak areas based on wrong questions
    const weakAreas: string[] = [];
    let wrongListening = 7 - listeningScore;
    let wrongReading = 4 - readingScore;
    let wrongWriting = 4 - writingScore;

    if (wrongListening > 2) weakAreas.push('Kỹ năng Nghe hiểu (Listening Comprehension)');
    if (wrongReading > 1) weakAreas.push('Kỹ năng Đọc hiểu & Từ vựng (Reading & Vocab)');
    if (wrongWriting > 1) weakAreas.push('Kỹ năng Sắp xếp câu & Ngữ pháp (Grammar & Sentence structure)');

    if (weakAreas.length === 0 && totalCorrect < 15) {
      weakAreas.push('Từ vựng chi tiết & Ôn tập cuối bài');
    }

    // 3. Award points: 20 points per correct answer, plus 100 points completion bonus
    const pointsEarned = (totalCorrect * 20) + 100;

    // 4. Save test results to Session state
    const newTestResult: TestResult = {
      unitId: activeUnit.id,
      score: totalCorrect,
      listeningScore,
      readingScore,
      writingScore,
      totalQuestions: questions.length,
      completedAt: new Date().toLocaleDateString('vi-VN'),
      weakAreas: weakAreas.length > 0 ? weakAreas : ['Không có! Con đạt kết quả hoàn hảo! 🎉']
    };

    const updatedResults = {
      ...(session.testResults || {}),
      [activeUnit.id]: newTestResult
    };

    const updatedSession: UserSession = {
      ...session,
      points: session.points + pointsEarned,
      testResults: updatedResults
    };

    // Award badges if applicable
    const earnedBadges = [...(session.badges || [])];
    if (totalCorrect === 15 && !earnedBadges.includes('badge-perfect-test')) {
      earnedBadges.push('badge-perfect-test');
    }
    if (!earnedBadges.includes('badge-first-test')) {
      earnedBadges.push('badge-first-test');
    }
    updatedSession.badges = earnedBadges;

    onUpdateSession(updatedSession);
    setTestCompleted(true);
  };

  const getLevelBadge = (score: number) => {
    if (score >= 13) return { label: 'Excellent 🏆', color: 'bg-emerald-500 text-white', feedback: 'Tuyệt vời! Con nắm vững kiến thức bài học rất tốt.' };
    if (score >= 10) return { label: 'Good 🌟', color: 'bg-brand-blue text-white', feedback: 'Rất tốt! Con hãy ôn luyện thêm một chút để đạt điểm tuyệt đối nhé.' };
    return { label: 'Need Practice 💪', color: 'bg-amber-500 text-white', feedback: 'Con cần ôn luyện lại từ vựng và cấu trúc của Unit này nhiều hơn nhé.' };
  };

  // Get current active result if exists
  const savedResult = session.testResults?.[activeUnit.id];

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs max-w-4xl mx-auto">
      
      {/* Intro Lobby Screen */}
      {currentIdx === -1 && !testCompleted && (
        <div className="text-center py-8 space-y-6">
          <div className="mx-auto w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 animate-bounce">
            <Award className="h-10 w-10" />
          </div>
          
          <div className="space-y-2">
            <span className="bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Kiểm tra cuối Unit {activeUnit.number}
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-800">
              Bài kiểm tra ngắn: {activeUnit.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
              Bài kiểm tra gồm <strong>15 câu hỏi</strong> trắc nghiệm và viết bám sát giáo trình <strong>Everybody Up 4</strong>. Giúp đánh giá toàn diện kỹ năng Listening, Reading và Writing của con.
            </p>
          </div>

          {/* Test guidelines cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-4 text-left">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start space-x-3">
              <div className="bg-blue-100 text-brand-blue p-2 rounded-xl text-xs font-bold font-mono">1</div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Listening (7 câu)</h4>
                <p className="text-[10px] text-slate-400 mt-1">Nghe audio giọng Mỹ chuẩn và chọn/điền đáp án đúng.</p>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start space-x-3">
              <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl text-xs font-bold font-mono">2</div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Reading (4 câu)</h4>
                <p className="text-[10px] text-slate-400 mt-1">Đọc hiểu đoạn văn ngắn và lựa chọn đáp án phù hợp.</p>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start space-x-3">
              <div className="bg-amber-100 text-amber-600 p-2 rounded-xl text-xs font-bold font-mono">3</div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Writing (4 câu)</h4>
                <p className="text-[10px] text-slate-400 mt-1">Sắp xếp câu, điền từ khuyết chuẩn cấu trúc ngữ pháp.</p>
              </div>
            </div>
          </div>

          {/* Previous result if present */}
          {savedResult && (
            <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-2xl p-4 max-w-md mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-3 text-left">
                <Trophy className="h-5 w-5 text-emerald-500 fill-emerald-100" />
                <div>
                  <h4 className="text-xs font-bold text-slate-700">Điểm kiểm tra tốt nhất:</h4>
                  <p className="text-[10px] text-slate-400">Hoàn thành: {savedResult.completedAt}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-emerald-600 font-mono">{savedResult.score}/15</span>
                <span className="text-[9px] font-bold block text-slate-400 bg-white border border-emerald-100 px-1.5 py-0.5 rounded-md uppercase">
                  {getLevelBadge(savedResult.score).label}
                </span>
              </div>
            </div>
          )}

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleStartTest}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-rose-500 to-brand-primary hover:from-rose-600 hover:to-rose-700 text-white font-extrabold text-sm rounded-2xl shadow-md cursor-pointer transform hover:scale-102 transition flex items-center justify-center space-x-2"
            >
              <Sparkles className="h-4 w-4 fill-white animate-pulse" />
              <span>Bắt đầu làm bài thi (+100 xu thưởng)</span>
            </button>
            {savedResult && (
              <button
                onClick={() => { setShowReview(true); setTestCompleted(true); }}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm rounded-2xl cursor-pointer transition flex items-center justify-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>Xem lại bài làm</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* active quiz running */}
      {currentIdx >= 0 && !testCompleted && questions.length > 0 && (
        <div className="space-y-6">
          
          {/* Top Progress Ribbon */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
            <div className="flex items-center space-x-3">
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                questions[currentIdx].section === 'listening' ? 'bg-blue-100 text-brand-blue' :
                questions[currentIdx].section === 'reading' ? 'bg-emerald-100 text-emerald-600' :
                'bg-amber-100 text-amber-600'
              }`}>
                {questions[currentIdx].section === 'listening' ? 'Listening Section' :
                 questions[currentIdx].section === 'reading' ? 'Reading Section' :
                 'Writing Section'}
              </span>
              <span className="text-xs text-slate-400 font-bold font-mono">
                Câu hỏi {currentIdx + 1} / {questions.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full sm:w-48 bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-rose-500 duration-300 transition-all"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* MAIN WORKSPACE FOR QUESTION */}
          <div className="bg-slate-50/50 rounded-3xl border border-slate-100 p-5 sm:p-7 space-y-6">
            
            {/* Listening Speaker Box */}
            {questions[currentIdx].section === 'listening' && (
              <div className="bg-white border border-slate-100 p-4 sm:p-6 rounded-2xl text-center space-y-4 max-w-md mx-auto shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Nghe đoạn hội thoại dưới đây</span>
                <button
                  onClick={() => speakAudio(questions[currentIdx].audioText || '')}
                  className="mx-auto w-14 h-14 bg-blue-50 hover:bg-blue-100 text-brand-blue rounded-full flex items-center justify-center cursor-pointer transition shadow-sm transform hover:scale-105 active:scale-95"
                >
                  <Volume2 className="h-6 w-6 animate-pulse" />
                </button>
                <button
                  onClick={() => speakAudio(questions[currentIdx].audioText || '')}
                  className="text-[10px] font-bold text-slate-500 hover:text-brand-blue underline uppercase tracking-wide cursor-pointer block mx-auto"
                >
                  Phát lại âm thanh 🔊
                </button>
              </div>
            )}

            {/* Question Text */}
            <div className="space-y-1.5 text-center sm:text-left">
              <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">
                {questions[currentIdx].prompt}
              </p>
              <h3 className="text-lg sm:text-xl font-display font-bold text-slate-800 leading-snug whitespace-pre-line">
                {questions[currentIdx].question}
              </h3>
            </div>

            {/* Options selection based on Question Type */}
            {questions[currentIdx].type === 'write_arrange' ? (
              // Tap to arrange words
              <div className="space-y-4 max-w-xl mx-auto pt-4">
                
                {/* Result Sentence Box */}
                <div className="min-h-14 bg-white border border-dashed border-slate-200 rounded-2xl p-3 flex flex-wrap gap-2 items-center justify-center shadow-xs">
                  {selectedWordBank.length === 0 ? (
                    <span className="text-xs text-slate-400 font-semibold italic">Nhấp vào từ ở dưới để bắt đầu sắp xếp câu...</span>
                  ) : (
                    selectedWordBank.map((word, wIdx) => (
                      <button
                        key={`sel-word-${word}-${wIdx}`}
                        onClick={() => handleWordBankTap(word, true)}
                        className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        {word}
                      </button>
                    ))
                  )}
                </div>

                {/* Scrambled Word bank options */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 block text-center uppercase tracking-wider">Ngân hàng từ vựng (Word Bank)</span>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {questions[currentIdx].options.map((word, oIdx) => {
                      // Allow selecting multiple instances if they exist, but dim based on selected count
                      const selectedCount = selectedWordBank.filter(w => w === word).length;
                      const totalCountInOptions = questions[currentIdx].options.filter(w => w === word).length;
                      const isFullyUsed = selectedCount >= totalCountInOptions;

                      return (
                        <button
                          key={`bank-word-${word}-${oIdx}`}
                          disabled={isFullyUsed}
                          onClick={() => handleWordBankTap(word, false)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                            isFullyUsed
                              ? 'bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {word}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            ) : (
              // Multiple Choice Options (Standard choose or select picture)
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-2xl mx-auto pt-2">
                {questions[currentIdx].options.map((option) => {
                  const isSelected = userAnswers[questions[currentIdx].id] === option;
                  return (
                    <button
                      key={option}
                      onClick={() => handleOptionSelect(option)}
                      className={`w-full p-4 rounded-2xl text-left text-xs sm:text-sm font-bold border-2 transition cursor-pointer ${
                        isSelected
                          ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-sm'
                          : 'bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] border-2 ${
                          isSelected ? 'border-rose-500 bg-rose-500 text-white' : 'border-slate-200 text-slate-400'
                        }`}>
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span className="leading-tight">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

          </div>

          {/* Bottom Action controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              disabled={currentIdx === 0}
              onClick={handlePrevQuestion}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                currentIdx === 0
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer'
              }`}
            >
              Câu trước
            </button>

            <button
              onClick={handleNextQuestion}
              className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center space-x-1"
            >
              <span>{currentIdx === questions.length - 1 ? 'Nộp bài thi' : 'Câu tiếp theo'}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* REPORT / TEST RESULTS COMPLETED SCREEN */}
      {testCompleted && (
        <div className="space-y-8 py-4">
          
          {/* Header Jumbotron */}
          {(() => {
            const result = savedResult || { score: 0, listeningScore: 0, readingScore: 0, writingScore: 0, weakAreas: [], completedAt: '' };
            const lvl = getLevelBadge(result.score);
            return (
              <>
                <div className="text-center space-y-4">
                  <div className="inline-block bg-amber-50 p-4 rounded-full text-brand-yellow animate-bounce border border-amber-100">
                    <Trophy className="h-12 w-12 fill-amber-100 text-amber-500" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">Kết quả đánh giá</span>
                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-800">
                      Bài kiểm tra: Unit {activeUnit.number}
                    </h2>
                    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-extrabold shadow-sm ${lvl.color} uppercase tracking-wider`}>
                      Trình độ: {lvl.label}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-md mx-auto">
                    {lvl.feedback}
                  </p>
                </div>

                {/* Scores breakdown metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 max-w-3xl mx-auto">
                  
                  {/* Circle Score */}
                  <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tổng điểm</span>
                    <div className="relative flex items-center justify-center w-24 h-24">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                        <circle cx="48" cy="48" r="40" stroke="#f43f5e" strokeWidth="8" fill="transparent" 
                          strokeDasharray={251.2}
                          strokeDashoffset={251.2 - (251.2 * result.score) / 15}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-2xl font-extrabold text-slate-800 font-mono">{result.score}</span>
                        <span className="text-xs text-slate-400 block font-bold font-mono">/15 câu</span>
                      </div>
                    </div>
                  </div>

                  {/* Listening skill */}
                  <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 space-y-3 shadow-xs">
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-xs font-bold uppercase text-slate-400">Listening</span>
                      <span className="text-sm font-extrabold text-brand-blue font-mono">{result.listeningScore}/7</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-blue" style={{ width: `${(result.listeningScore / 7) * 100}%` }} />
                    </div>
                    <p className="text-[9px] text-slate-400 italic">Nghe hiểu các mẫu câu và từ vựng trong Everybody Up 4.</p>
                  </div>

                  {/* Reading skill */}
                  <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 space-y-3 shadow-xs">
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-xs font-bold uppercase text-slate-400">Reading</span>
                      <span className="text-sm font-extrabold text-emerald-600 font-mono">{result.readingScore}/4</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${(result.readingScore / 4) * 100}%` }} />
                    </div>
                    <p className="text-[9px] text-slate-400 italic">Đọc hiểu đoạn văn ngắn và liên hệ thực tế bài học.</p>
                  </div>

                  {/* Writing skill */}
                  <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 space-y-3 shadow-xs">
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-xs font-bold uppercase text-slate-400">Writing</span>
                      <span className="text-sm font-extrabold text-amber-600 font-mono">{result.writingScore}/4</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: `${(result.writingScore / 4) * 100}%` }} />
                    </div>
                    <p className="text-[9px] text-slate-400 italic">Sắp xếp câu và ghép từ khuyết đúng chính tả ngữ pháp.</p>
                  </div>

                </div>

                {/* Personalized detailed recommendation */}
                <div className="bg-slate-50 rounded-3xl border border-slate-100 p-5 sm:p-6 max-w-3xl mx-auto space-y-4">
                  <h4 className="font-display font-extrabold text-slate-800 text-sm uppercase tracking-wider flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-brand-primary" />
                    <span>Nhận xét và Đề xuất Học tập</span>
                  </h4>

                  <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                    <p>
                      Chào <strong>{session.fullName}</strong>, hệ thống đã ghi nhận bài kiểm tra ngắn của con cho <strong>Unit {activeUnit.number}: {activeUnit.title}</strong> vào ngày {result.completedAt || new Date().toLocaleDateString('vi-VN')}.
                    </p>
                    
                    <div>
                      <span className="font-bold block text-slate-700">Điểm yếu cần khắc phục:</span>
                      <ul className="list-disc list-inside space-y-1.5 pl-1 pt-1 text-slate-500">
                        {result.weakAreas.map((area, idx) => (
                          <li key={idx}><strong>{area}</strong></li>
                        ))}
                      </ul>
                    </div>

                    <p className="bg-white p-3 rounded-xl border border-slate-100 text-slate-500">
                      💡 <strong>Đề xuất:</strong> {result.score === 15 ? 
                        'Bé có kết quả tuyệt đối hoàn hảo! Con đã có thể sẵn sàng tự tin bước sang các Unit học tiếp theo.' : 
                        'Bé nên tiếp tục vào phần "Luyện tập" hoặc "Ngữ pháp & Xếp câu" để chơi các mini-game từ vựng giúp ghi nhớ lâu hơn. Con đã làm rất tốt rồi!'}
                    </p>
                  </div>
                </div>

                {/* Action panel */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-4">
                  <button
                    onClick={() => {
                      setTestCompleted(false);
                      setShowReview(false);
                      handleStartTest();
                    }}
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs py-3 rounded-2xl transition cursor-pointer flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Làm lại bài thi</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowReview(!showReview);
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs py-3 rounded-2xl transition cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <Eye className="h-4 w-4" />
                    <span>{showReview ? 'Ẩn review chi tiết' : 'Review từng câu hỏi'}</span>
                  </button>
                </div>

                {/* QUESTIONS REVIEW BLOCK */}
                {showReview && (
                  <div className="max-w-3xl mx-auto space-y-4 pt-6 border-t border-slate-100">
                    <h3 className="font-display font-extrabold text-slate-800 text-sm uppercase tracking-wide">Xem lại chi tiết từng câu:</h3>
                    
                    <div className="space-y-4">
                      {questions.map((q, idx) => {
                        const uAns = userAnswers[q.id] || '(Trống)';
                        const isCorrect = cleanSentence(uAns) === cleanSentence(q.correctAnswer);
                        
                        return (
                          <div key={q.id} className="bg-white p-4 rounded-2xl border border-slate-100 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-400">Câu {idx + 1} ({q.section.toUpperCase()})</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                              }`}>
                                {isCorrect ? 'Đúng' : 'Sai'}
                              </span>
                            </div>

                            <p className="text-xs font-bold text-slate-800">{q.question}</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                <span className="text-slate-400 font-bold block text-[9px] uppercase">Đáp án của con:</span>
                                <span className={isCorrect ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold'}>{uAns}</span>
                              </div>
                              <div className="bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100/50">
                                <span className="text-emerald-500 font-bold block text-[9px] uppercase">Đáp án đúng chuẩn:</span>
                                <span className="text-slate-700 font-bold">{q.correctAnswer}</span>
                              </div>
                            </div>

                            <p className="text-[10px] bg-amber-50/50 border border-amber-100/40 p-2.5 rounded-xl text-slate-500 leading-relaxed">
                              💡 <strong>Giải thích:</strong> {q.explanation}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            );
          })()}

        </div>
      )}

    </div>
  );
}
