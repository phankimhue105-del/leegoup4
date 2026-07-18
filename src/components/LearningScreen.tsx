/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserSession, Unit, Lesson, InteractiveActivity } from '../types';
import { syllabusData, getLessonActivities } from '../data/syllabus';
import { getVocabularyForLesson } from '../data/vocabulary';
import GrammarScreen from './GrammarScreen';
import VocabGames from './VocabGames';
import ShortTestScreen from './ShortTestScreen';
import AISpeakingCoach from './AISpeakingCoach';
import { 
  ArrowLeft, BookOpen, Sparkles, Trophy, CheckCircle, 
  ChevronRight, Volume2, Mic, Play, Smile, HelpCircle, Heart, Star, Award, MessageSquare
} from 'lucide-react';

interface LearningScreenProps {
  session: UserSession;
  onUpdateSession: (updated: UserSession) => void;
  selectedUnitId: string | null;
}

export default function LearningScreen({ session, onUpdateSession, selectedUnitId }: LearningScreenProps) {
  // Select active unit and lesson state
  const [activeUnit, setActiveUnit] = useState<Unit>(
    syllabusData.find(u => u.id === selectedUnitId) || syllabusData[0]
  );
  const [activeLesson, setActiveLesson] = useState<Lesson>(activeUnit.lessons[0]);
  
  // Interactive activity states
  const [currentTab, setCurrentTab] = useState<'study' | 'activities' | 'grammar' | 'test' | 'speaking_coach'>('study');
  const [activeActivityIndex, setActiveActivityIndex] = useState(0);

  // Flashcards state
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);

  // Sentence Builder state
  const [builderWords, setBuilderWords] = useState<string[]>([]);
  const [placedWords, setPlacedWords] = useState<string[]>([]);
  const [sentenceCorrect, setSentenceCorrect] = useState<boolean | null>(null);

  // Vocabulary Match state
  const [selectedEng, setSelectedEng] = useState<string | null>(null);
  const [selectedViet, setSelectedViet] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]); // list of English words matched
  const [wrongMatch, setWrongMatch] = useState<boolean>(false);



  // Listen to unit selected from Dashboard
  useEffect(() => {
    if (selectedUnitId) {
      const unit = syllabusData.find(u => u.id === selectedUnitId);
      if (unit) {
        setActiveUnit(unit);
        setActiveLesson(unit.lessons[0]);
        resetActivityStates(unit.lessons[0]);
      }
    }
  }, [selectedUnitId]);

  // Handle lesson switching
  const handleLessonSelect = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setCurrentTab('study');
    resetActivityStates(lesson);
  };

  const resetActivityStates = (lesson: Lesson) => {
    setActiveActivityIndex(0);
    setIsFlipped(false);
    setFlashcardIndex(0);
    setSentenceCorrect(null);
    setSelectedEng(null);
    setSelectedViet(null);
    setMatchedPairs([]);
    
    // Setup sentence builder options with System Validation
    const targetActivity = getLessonActivities(activeUnit.id, lesson.id).find(
      act => act.type === 'sentence_builder'
    );
    if (targetActivity) {
      setPlacedWords([]);
      
      const rawTarget = targetActivity.data.target;
      // Clean target: lowercase and strip punctuation
      const cleanTargetWords = rawTarget
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, '')
        .split(/\s+/)
        .filter(Boolean);
      
      // Clean options list
      const cleanOptions = targetActivity.data.options
        .map((opt: string) => opt.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, '').trim())
        .filter(Boolean);

      // Extract distractors
      const distractors = cleanOptions.filter((opt: string) => !cleanTargetWords.includes(opt));
      const uniqueDistractors = Array.from(new Set(distractors)).slice(0, 1); // exactly 1 clean distractor

      // Build unique perfect options matching clean target + distractor
      const finalOptions = Array.from(new Set([...cleanTargetWords, ...uniqueDistractors]))
        .sort(() => Math.random() - 0.5);

      setBuilderWords(finalOptions);
      // Store cleaned target as a custom field
      targetActivity.data.cleanedTarget = cleanTargetWords.join(' ');
    }
  };

  // Speaks out words using browser's Text-to-Speech synthesis
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85; // slightly slower for children
      window.speechSynthesis.speak(utterance);
    } else {
      console.log('Text to Speech is not supported in this browser.');
    }
  };

  // Handles Flashcard flip / Navigation
  const handleNextFlashcard = (cardsCount: number) => {
    setIsFlipped(false);
    setTimeout(() => {
      setFlashcardIndex((prev) => (prev + 1) % cardsCount);
    }, 150);
  };

  // Placed / Recalled word bubbles in Sentence Builder
  const handleWordBubbleClick = (word: string, isPlaced: boolean) => {
    if (isPlaced) {
      // Remove from placed words, send back to options
      setPlacedWords(placedWords.filter(w => w !== word));
      setBuilderWords([...builderWords, word]);
    } else {
      // Add to placed words, remove from options
      setPlacedWords([...placedWords, word]);
      setBuilderWords(builderWords.filter(w => w !== word));
    }
    setSentenceCorrect(null);
  };

  const checkSentence = (target: string) => {
    // Retrieve target activity to check for pre-sanitized target
    const targetActivity = getLessonActivities(activeUnit.id, activeLesson.id).find(
      act => act.type === 'sentence_builder'
    );
    const perfectTarget = targetActivity?.data.cleanedTarget || target;

    const userSentence = placedWords.join(' ');
    // Remove punctuation & lower-case for lenient checking fit for kids
    const cleanUser = userSentence.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"").toLowerCase().trim();
    const cleanTarget = perfectTarget.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"").toLowerCase().trim();

    if (cleanUser === cleanTarget) {
      setSentenceCorrect(true);
      speakText(perfectTarget);
      awardPoints(50);
    } else {
      setSentenceCorrect(false);
    }
  };

  // Vocabulary match game logic
  const handleEngSelect = (eng: string) => {
    setSelectedEng(eng);
    checkMatch(eng, selectedViet);
  };

  const handleVietSelect = (viet: string) => {
    setSelectedViet(viet);
    checkMatch(selectedEng, viet);
  };

  const checkMatch = (eng: string | null, viet: string | null) => {
    if (!eng || !viet) return;

    // Fetch vocabulary array for correctness verification
    const currentAct = getLessonActivities(activeUnit.id, activeLesson.id).find(
      act => act.type === 'vocabulary_match'
    ) || getLessonActivities(activeUnit.id, activeLesson.id)[0];
    
    const match = currentAct?.data.find((item: any) => {
      // Supporting standard format or simulated translation format
      if (item.english) {
        return item.english === eng && item.vietnamese === viet;
      }
      return item.word === eng && viet.includes(item.word);
    });

    if (match) {
      setMatchedPairs([...matchedPairs, eng]);
      speakText(eng);
      setSelectedEng(null);
      setSelectedViet(null);
      
      // If all elements are matched, award extra points!
      const totalToMatch = currentAct?.data.length || 0;
      if (matchedPairs.length + 1 === totalToMatch) {
        awardPoints(100);
      }
    } else {
      setWrongMatch(true);
      setTimeout(() => {
        setSelectedEng(null);
        setSelectedViet(null);
        setWrongMatch(false);
      }, 800);
    }
  };



  // Helper points awarder
  const awardPoints = (pointsAwarded: number) => {
    const updated = {
      ...session,
      points: session.points + pointsAwarded
    };
    onUpdateSession(updated);
  };

  // Atomic vocabulary progress & badge manager
  const updateWordProgress = (word: string, status: 'learning' | 'mastered', isDifficult: boolean, isCorrect: boolean, pointsToAdd: number = 0) => {
    const updatedProgress = { ...(session.vocabularyProgress || {}) };
    
    const existing = updatedProgress[word] || {
      word,
      unitId: activeUnit.id,
      lessonId: activeLesson.id,
      status: 'new',
      correctCount: 0,
      totalAttempts: 0,
      isDifficult: false
    };

    const updated = {
      ...existing,
      totalAttempts: existing.totalAttempts + 1,
      correctCount: existing.correctCount + (isCorrect ? 1 : 0),
      isDifficult,
      status
    };

    updatedProgress[word] = updated;

    // Check badges dynamically
    const totalMastered = Object.values(updatedProgress).filter(p => p.status === 'mastered').length;
    const totalWords = Object.keys(updatedProgress).length;
    const earnedBadges = [...(session.badges || [])];

    if (totalMastered >= 4 && !earnedBadges.includes('badge-persistence')) {
      earnedBadges.push('badge-persistence');
    }
    if (totalWords >= 8 && !earnedBadges.includes('badge-vocab-prodigy')) {
      earnedBadges.push('badge-vocab-prodigy');
    }

    onUpdateSession({
      ...session,
      points: session.points + pointsToAdd,
      vocabularyProgress: updatedProgress,
      badges: earnedBadges
    });
  };

  // Complete entire lesson & progress tracker
  const handleCompleteLesson = () => {
    const lessonKey = `${activeUnit.id}-${activeLesson.id}`;
    if (!session.completedLessons.includes(lessonKey)) {
      const updated = {
        ...session,
        completedLessons: [...session.completedLessons, lessonKey],
        points: session.points + 150, // bonus completion points
        streak: session.streak + 1
      };
      onUpdateSession(updated);
      alert('🌟 Chúc mừng con đã hoàn thành bài học Everybody Up 4! Con nhận được 150 xu thưởng 🪙 và được cộng 1 ngày Streak học tập!');
    } else {
      alert('Con đã hoàn thành bài học này trước đó rồi. Thật tốt khi ôn tập lại bài cũ!');
    }
  };

  const activities = getLessonActivities(activeUnit.id, activeLesson.id);
  const isLessonCompleted = session.completedLessons.includes(`${activeUnit.id}-${activeLesson.id}`);

  const unitLessonsIds = activeUnit.lessons.map(l => `${activeUnit.id}-${l.id}`);
  const completedLessonsInUnit = unitLessonsIds.filter(id => session.completedLessons.includes(id)).length;
  
  const hasCompletedVocab = completedLessonsInUnit >= 1;
  const hasCompletedGrammar = completedLessonsInUnit >= 2;
  const hasCompletedQuiz = !!session.testResults?.[activeUnit.id];
  const speakingResult = (session as any).speakingResults?.[activeUnit.id];
  const hasCompletedSpeaking = !!speakingResult;

  if (currentTab === 'speaking_coach') {
    return (
      <AISpeakingCoach
        session={session}
        onUpdateSession={onUpdateSession}
        activeUnit={activeUnit}
        onBack={() => {
          setCurrentTab('study');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* Sidebar: Navigation menu of all 8 Units & Lessons (Rule C Mobile responsive layout) */}
      <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-5 shadow-xs space-y-6">
        <div>
          <h3 className="font-display font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-3">
            Chọn chủ đề học
          </h3>
          
          {/* Unit selector dropdown */}
          <select 
            value={activeUnit.id}
            onChange={(e) => {
              const u = syllabusData.find(unit => unit.id === e.target.value);
              if (u) {
                setActiveUnit(u);
                setActiveLesson(u.lessons[0]);
                resetActivityStates(u.lessons[0]);
              }
            }}
            className="w-full bg-slate-50 border border-slate-200 text-sm font-semibold p-3 rounded-2xl outline-none focus:border-brand-primary"
          >
            {syllabusData.map((unit) => (
              <option key={unit.id} value={unit.id}>
                Unit {unit.number}: {unit.title}
              </option>
            ))}
          </select>
        </div>

        {/* Lesson List within active Unit */}
        <div>
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Các bài học trong Unit {activeUnit.number}
          </h4>
          
          <div className="space-y-2">
            {activeUnit.lessons.map((lesson) => {
              const completedKey = `${activeUnit.id}-${lesson.id}`;
              const isSelected = activeLesson.id === lesson.id;
              const hasCompleted = session.completedLessons.includes(completedKey);

              return (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonSelect(lesson)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition flex items-center justify-between cursor-pointer border ${
                    isSelected
                      ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className={`text-[10px] uppercase rounded-md px-1.5 py-0.5 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {lesson.id.replace('lesson-', 'L')}
                    </span>
                    <span className="truncate max-w-[130px]">{lesson.title}</span>
                  </div>
                  {hasCompleted && (
                    <CheckCircle className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-brand-secondary'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Unit Review & AI Speaking Coach Status Dashboard */}
        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-brand-blue mb-1">
              <Trophy className="h-4 w-4 fill-brand-blue" />
              <span className="text-xs font-bold uppercase tracking-wider">Unit {activeUnit.number} Status</span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
              Hoàn thành các hoạt động để mở khoá đầy đủ chứng chỉ!
            </p>
          </div>

          <div className="space-y-2.5 text-xs font-bold text-slate-700">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100">
              <span className="flex items-center gap-1.5">📚 Vocabulary</span>
              {hasCompletedVocab ? (
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg text-[10px] flex items-center gap-0.5">✓ Đã học</span>
              ) : (
                <span className="text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg text-[10px]">Chưa học</span>
              )}
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100">
              <span className="flex items-center gap-1.5">✍️ Grammar</span>
              {hasCompletedGrammar ? (
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg text-[10px] flex items-center gap-0.5">✓ Đã học</span>
              ) : (
                <span className="text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg text-[10px]">Chưa học</span>
              )}
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100">
              <span className="flex items-center gap-1.5">📝 Quiz Test</span>
              {hasCompletedQuiz ? (
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg text-[10px] flex items-center gap-0.5">✓ Xong</span>
              ) : (
                <span className="text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg text-[10px]">Chưa thi</span>
              )}
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100">
              <span className="flex items-center gap-1.5">🤖 Speaking Coach</span>
              {hasCompletedSpeaking ? (
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg text-[10px] flex items-center gap-0.5">✓ {speakingResult.overallScore}/100</span>
              ) : (
                <span className="text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg text-[10px]">Chưa nói</span>
              )}
            </div>
          </div>

          {/* AI Speaking Coach Trigger with Lock logic */}
          <button 
            disabled={!hasCompletedVocab || !hasCompletedGrammar || !hasCompletedQuiz}
            onClick={() => {
              if (hasCompletedVocab && hasCompletedGrammar && hasCompletedQuiz) {
                setCurrentTab('speaking_coach');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className={`w-full text-xs font-black py-3 px-3 rounded-2xl transition text-center block shadow-sm ${
              hasCompletedVocab && hasCompletedGrammar && hasCompletedQuiz
                ? 'bg-brand-primary hover:bg-rose-600 text-white cursor-pointer'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            {hasCompletedVocab && hasCompletedGrammar && hasCompletedQuiz ? (
              <span>AI Speaking Coach → Bắt đầu 🤖</span>
            ) : (
              <span className="flex items-center justify-center gap-1">
                🔒 Khóa (Cần học xong & làm Kiểm tra)
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* Lesson Objective Banner Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-brand-primary mb-1">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Everybody Up 4 - Unit {activeUnit.number} Lesson {activeLesson.id.replace('lesson-', '')}
              </span>
            </div>
            <h2 className="text-2xl font-display font-extrabold text-slate-800">
              {activeLesson.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              💡 Chủ đề cốt lõi: <span className="font-semibold text-slate-700">{activeLesson.focus}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { setCurrentTab('study'); resetActivityStates(activeLesson); }}
              className={`px-4 py-2 text-xs font-bold rounded-2xl transition cursor-pointer ${
                currentTab === 'study'
                  ? 'bg-brand-blue text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              1. Học lý thuyết
            </button>
            <button
              onClick={() => { setCurrentTab('activities'); resetActivityStates(activeLesson); }}
              className={`px-4 py-2 text-xs font-bold rounded-2xl transition cursor-pointer flex items-center space-x-1 ${
                currentTab === 'activities'
                  ? 'bg-brand-secondary text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="h-3 w-3 fill-white" />
              <span>2. Luyện tập</span>
            </button>
            <button
              onClick={() => { setCurrentTab('grammar'); resetActivityStates(activeLesson); }}
              className={`px-4 py-2 text-xs font-bold rounded-2xl transition cursor-pointer flex items-center space-x-1 ${
                currentTab === 'grammar'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Trophy className="h-3 w-3" />
              <span>3. Ngữ pháp & Xếp câu</span>
            </button>
            <button
              onClick={() => { setCurrentTab('test'); resetActivityStates(activeLesson); }}
              className={`px-4 py-2 text-xs font-bold rounded-2xl transition cursor-pointer flex items-center space-x-1 ${
                currentTab === 'test'
                  ? 'bg-rose-500 text-white shadow-xs animate-pulse'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Award className="h-3.5 w-3.5 text-amber-300 fill-amber-300" />
              <span>4. Kiểm tra ngắn (15 câu)</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Theory Study Layout */}
        {currentTab === 'study' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Box A: Vocabulary study */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
              <h3 className="font-display font-bold text-slate-800 text-base border-b border-slate-50 pb-2">
                Vocabulary (Từ vựng)
              </h3>
              <p className="text-xs text-slate-400">Ấn vào loa để nghe giọng đọc bản xứ Oxford chuẩn!</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {getVocabularyForLesson(activeUnit.id, activeLesson.id).map((item) => (
                  <div 
                    key={item.word}
                    onClick={() => speakText(item.word)}
                    className="bg-slate-50 hover:bg-rose-50/20 hover:border-brand-primary/30 border border-slate-100 p-3.5 rounded-2xl flex flex-col justify-between cursor-pointer transition relative group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2.5">
                        <span className="text-2xl">{item.emoji}</span>
                        <div>
                          <span className="text-xs font-extrabold text-slate-800 group-hover:text-brand-primary transition">
                            {item.word}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold font-mono block mt-0.5">
                            {item.ipa} · <span className="italic text-[9px]">{item.partOfSpeech}</span>
                          </span>
                        </div>
                      </div>
                      <Volume2 className="h-4 w-4 text-slate-400 group-hover:text-brand-primary transition group-hover:scale-110" />
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-slate-100/60">
                      <p className="text-xs text-slate-600 font-medium">Nghĩa: <span className="font-bold text-slate-800">{item.meaning}</span></p>
                      <p className="text-[10px] text-slate-400 italic mt-1 leading-relaxed">
                        "{item.exampleSentence}"
                        <span className="block text-slate-400 font-normal not-italic mt-0.5">({item.exampleTranslation})</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Box B: Sentence Patterns & Value */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-6">
              
              {/* Sentence patterns */}
              <div className="space-y-3">
                <h3 className="font-display font-bold text-slate-800 text-base border-b border-slate-50 pb-2">
                  Sentence Patterns (Mẫu câu chính)
                </h3>
                
                <div className="space-y-3">
                  {activeLesson.sentencePatterns.map((pattern, index) => (
                    <div 
                      key={pattern}
                      className={`p-3.5 rounded-2xl border ${
                        index === 0 
                          ? 'bg-blue-50/40 border-blue-100 text-blue-800' 
                          : 'bg-emerald-50/30 border-emerald-100 text-emerald-800'
                      }`}
                    >
                      <p className="text-xs font-extrabold flex items-center justify-between">
                        <span>{pattern}</span>
                        <Volume2 
                          onClick={() => speakText(pattern)}
                          className="h-4 w-4 text-slate-400 hover:text-slate-600 cursor-pointer transition flex-shrink-0 ml-1" 
                        />
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">Mẫu câu Oxford Everybody Up 4</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Value Spotlight (Only lesson 3 has explicit values but we simulate nice ones) */}
              <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 flex items-center space-x-3.5">
                <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
                  <Heart className="h-5 w-5 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-800">Bài học đạo đức (Value)</h4>
                  <p className="text-sm font-extrabold text-slate-800 mt-0.5">
                    {activeLesson.value || 'Be kind and listen to your teacher.'}
                  </p>
                </div>
              </div>

            </div>



            {/* Complete lesson buttons */}
            <div className="md:col-span-2 flex items-center justify-end">
              <button
                onClick={handleCompleteLesson}
                className={`px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition cursor-pointer flex items-center space-x-2 ${
                  isLessonCompleted
                    ? 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    : 'bg-brand-secondary hover:bg-emerald-600 text-white'
                }`}
              >
                <CheckCircle className="h-5 w-5" />
                <span>{isLessonCompleted ? 'Đã Hoàn Thành Lesson này' : 'Đánh Dấu Hoàn Thành Lesson'}</span>
              </button>
            </div>

          </div>
        )}

        {/* Tab 2: Exercises & Mini Games Layout */}
        {currentTab === 'activities' && (
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-6">
            
            {/* Switch between available activities for this lesson */}
            <div className="flex border-b border-slate-100 pb-3 justify-between items-center">
              <div className="flex space-x-2">
                {activities.map((act, index) => (
                  <button
                    key={act.id}
                    onClick={() => { setActiveActivityIndex(index); }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                      activeActivityIndex === index
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    Bản tập {index + 1}: {act.type === 'flashcard' ? 'Học qua Game 🎮' : 'Nối từ'}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center space-x-1.5 bg-brand-primary/10 text-brand-primary px-2.5 py-1 rounded-xl text-xs font-bold">
                <Star className="h-3 w-3 fill-brand-primary" />
                <span>Thưởng xu 🪙</span>
              </div>
            </div>

            {/* Render selected exercise */}
            <div className="py-6">
              
              {/* ACTIVITY TYPE 1: VOCABULARY GAMES (Replaces traditional Flashcard) */}
              {activities[activeActivityIndex]?.type === 'flashcard' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 text-center uppercase tracking-wider mb-2">
                    Hoạt động: Chơi Game Từ Vựng 🎮
                  </h4>
                  <VocabGames
                    vocabList={getVocabularyForLesson(activeUnit.id, activeLesson.id)}
                    onAwardPoints={awardPoints}
                    onWordMastered={updateWordProgress}
                  />
                </div>
              )}

              {/* ACTIVITY TYPE 3: VOCABULARY MATCH */}
              {activities[activeActivityIndex]?.type === 'vocabulary_match' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="text-center">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      {activities[activeActivityIndex].instructions}
                    </h4>
                    <p className="text-[10px] text-slate-400">Ấn nối từ tiếng Anh bên trái với từ tiếng Việt tương thích bên phải!</p>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-4">
                    
                    {/* Left Col: English list */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-slate-400 block text-center uppercase tracking-wide">English</span>
                      {activities[activeActivityIndex].data.map((item: any) => {
                        const word = item.english || item.word;
                        const isMatched = matchedPairs.includes(word);
                        const isSelected = selectedEng === word;

                        return (
                          <button
                            key={`match-eng-${word}`}
                            disabled={isMatched}
                            onClick={() => handleEngSelect(word)}
                            className={`w-full p-3 text-xs font-extrabold rounded-2xl border text-center transition cursor-pointer ${
                              isMatched 
                                ? 'bg-emerald-50 text-emerald-500 border-emerald-100 opacity-60'
                                : isSelected
                                ? 'bg-brand-blue text-white border-brand-blue shadow-xs'
                                : wrongMatch && isSelected
                                ? 'bg-rose-100 text-rose-600 border-rose-200'
                                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-100'
                            }`}
                          >
                            {word}
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Col: Vietnamese list */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-slate-400 block text-center uppercase tracking-wide">Tiếng Việt</span>
                      {[...activities[activeActivityIndex].data]
                        .sort((a, b) => (a.vietnamese || a.meaning).localeCompare(b.vietnamese || b.meaning))
                        .map((item: any) => {
                          const meaning = item.vietnamese || item.meaning;
                          const associatedWord = item.english || item.word;
                          const isMatched = matchedPairs.includes(associatedWord);
                          const isSelected = selectedViet === meaning;

                          return (
                            <button
                              key={`match-viet-${meaning}`}
                              disabled={isMatched}
                              onClick={() => handleVietSelect(meaning)}
                              className={`w-full p-3 text-xs font-extrabold rounded-2xl border text-center transition cursor-pointer ${
                                isMatched 
                                  ? 'bg-emerald-50 text-emerald-500 border-emerald-100 opacity-60'
                                  : isSelected
                                  ? 'bg-brand-blue text-white border-brand-blue shadow-xs'
                                  : wrongMatch && isSelected
                                  ? 'bg-rose-100 text-rose-600 border-rose-200'
                                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-100'
                              }`}
                            >
                              {meaning}
                            </button>
                          );
                        })}
                    </div>

                  </div>

                  {matchedPairs.length === activities[activeActivityIndex].data.length && (
                    <div className="text-center pt-6 animate-bounce">
                      <p className="text-sm font-bold text-brand-secondary">
                        🌟 Tuyệt cú mèo! Con đã hoàn thành tất cả các cặp nối từ! (+100 xu thưởng)
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>



          </div>
        )}

        {/* Tab 3: Grammar & Sentence Builder */}
        {currentTab === 'grammar' && (
          <GrammarScreen
            session={session}
            onUpdateSession={onUpdateSession}
            activeUnit={activeUnit}
            activeLesson={activeLesson}
          />
        )}

        {/* Tab 4: Short Test Module */}
        {currentTab === 'test' && (
          <ShortTestScreen
            session={session}
            onUpdateSession={onUpdateSession}
            activeUnit={activeUnit}
          />
        )}

      </div>

    </div>
  );
}
