/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'admin' | 'student' | 'guest';

export interface VocabularyProgress {
  word: string;
  unitId: string;
  lessonId: string;
  status: 'new' | 'learning' | 'mastered';
  correctCount: number;
  totalAttempts: number;
  isDifficult: boolean;
}

export interface GrammarProgress {
  exerciseId: string;
  unitId: string;
  lessonId: string;
  isCorrect: boolean;
  attemptsCount: number;
  completedAt: string;
  userAnswer?: string;
}

export interface TestResult {
  unitId: string;
  score: number; // overall out of 15
  listeningScore: number; // out of 7 (or similar)
  readingScore: number; // out of 4 (or similar)
  writingScore: number; // out of 4 (or similar)
  totalQuestions: number; // always 15
  completedAt: string;
  weakAreas: string[];
}

export interface UserSession {
  username: string;
  fullName: string;
  role: UserRole;
  avatarUrl: string;
  points: number;
  streak: number;
  completedLessons: string[]; // List of 'unitId-lessonId'
  lastActiveDate?: string;
  vocabularyProgress?: Record<string, VocabularyProgress>; // Keyed by word
  grammarProgress?: Record<string, GrammarProgress>; // Keyed by exerciseId
  testResults?: Record<string, TestResult>; // Keyed by unitId
  speakingResults?: Record<string, any>; // Keyed by unitId
  badges?: string[]; // List of earned badge IDs
}

export interface Lesson {
  id: string; // 'lesson-1', 'lesson-2', etc.
  title: string; // "Camping", "Sports", etc.
  focus: string; // Vocab, Grammar, Reading, Science, Math, etc.
  vocabulary: string[]; // ['climb', 'hike', 'canoe', ...]
  sentencePatterns: string[]; // ["What does he/she like doing?", "He/She likes climbing."]
  conversation?: string; // For Lesson 3
  value?: string; // For Lesson 3 (e.g. "Be brave.")
  activities: InteractiveActivity[];
}

export interface InteractiveActivity {
  id: string;
  type: 'vocabulary_match' | 'sentence_builder' | 'speaking_practice' | 'flashcard';
  title: string;
  instructions: string;
  data: any; // Flexible data structure depending on activity type
}

export interface Unit {
  id: string; // 'unit-1', 'unit-2'
  number: number;
  title: string; // "Fun Outdoors", "Land and Sea"
  lessons: Lesson[];
  review: {
    title: string;
    description: string;
    completed: boolean;
  };
}

export interface StudentProgress {
  userId: string;
  streak: number;
  points: number;
  completedUnits: string[]; // List of unitIds
  completedLessons: string[]; // List of 'unitId-lessonId'
  recentActivity: {
    date: string;
    action: string;
    pointsEarned: number;
  }[];
}

export interface AdminMetrics {
  totalStudents: number;
  activeToday: number;
  averageProgress: number;
  recentLogins: {
    studentName: string;
    time: string;
    role: string;
  }[];
}
