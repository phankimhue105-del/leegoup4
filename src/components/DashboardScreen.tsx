/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserSession, Unit } from '../types';
import { syllabusData } from '../data/syllabus';
import { loadAdminMetrics, getUsersDB, isGuestModeEnabled, setGuestModeEnabled, getAppsScriptURL, saveAppsScriptURL, googleSheetsService } from '../lib/storage';
import { vocabularyDatabase } from '../data/vocabulary';
import { 
  Flame, Trophy, BookOpen, CheckCircle, Clock, 
  Settings, Users, Server, CloudLightning, ChevronRight, 
  Sparkles, Award, Star, ListCollapse, Play, FileSpreadsheet,
  Volume2, X, Lock, Crown, Check, RefreshCw, Plus, Trash2, Edit, Copy, ShieldAlert, Key
} from 'lucide-react';

const APPS_SCRIPT_CODE = `/* 
  GOOGLE APPS SCRIPT FOR LEEGO ENGLISH DATABASE
  -----------------------------------------------
  Instructions:
  1. Go to drive.google.com and create a new Google Sheet named "LeeGo_EverybodyUp4_DB".
  2. In the Google Sheet, rename the first tab to "Users".
  3. Create headers in row 1:
     A1: username, B1: password, C1: fullName, D1: role, E1: points, F1: streak, G1: status, H1: completedLessons, I1: createdAt
  4. Fill in default users or leave empty (the app will sync).
  5. In Google Sheet, click Extensions -> Apps Script.
  6. Paste this code, click Save, then click "Deploy" -> "New Deployment".
  7. Select "Web app". Set:
     - Execute as: "Me"
     - Who has access: "Anyone"
  8. Copy the Web App URL and paste it into the teacher panel!
*/

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Users");
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Users");
    sheet.appendRow(["username", "password", "fullName", "role", "points", "streak", "status", "completedLessons", "createdAt"]);
  }
  
  var action = e.parameter.action;
  if (action === "get_users") {
    var data = sheet.getDataRange().getValues();
    var users = [];
    for (var i = 1; i < data.length; i++) {
      users.push({
        username: data[i][0],
        password: data[i][1],
        fullName: data[i][2],
        role: data[i][3],
        points: Number(data[i][4] || 0),
        streak: Number(data[i][5] || 0),
        status: data[i][6],
        completedLessons: data[i][7],
        createdAt: data[i][8]
      });
    }
    return ContentService.createTextOutput(JSON.stringify(users))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Users");
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Users");
    sheet.appendRow(["username", "password", "fullName", "role", "points", "streak", "status", "completedLessons", "createdAt"]);
  }
  
  var postData = JSON.parse(e.postData.contents);
  var action = postData.action;
  
  var data = sheet.getDataRange().getValues();
  
  if (action === "create_user") {
    var user = postData.user;
    sheet.appendRow([
      user.username,
      user.password,
      user.fullName,
      user.role,
      user.points,
      user.streak,
      user.status,
      user.completedLessons,
      user.createdAt || new Date().toISOString()
    ]);
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  if (action === "update_user") {
    var username = postData.username;
    var updates = postData.updates;
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]).toLowerCase() === String(username).toLowerCase()) {
        var row = i + 1;
        if (updates.fullName !== undefined) sheet.getRange(row, 3).setValue(updates.fullName);
        if (updates.password !== undefined) sheet.getRange(row, 2).setValue(updates.password);
        if (updates.role !== undefined) sheet.getRange(row, 4).setValue(updates.role);
        if (updates.status !== undefined) sheet.getRange(row, 7).setValue(updates.status);
        break;
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === "delete_user") {
    var username = postData.username;
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]).toLowerCase() === String(username).toLowerCase()) {
        sheet.deleteRow(i + 1);
        break;
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  if (action === "sync_progress") {
    var username = postData.username;
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]).toLowerCase() === String(username).toLowerCase()) {
        var row = i + 1;
        sheet.getRange(row, 5).setValue(postData.points);
        sheet.getRange(row, 6).setValue(postData.streak);
        sheet.getRange(row, 8).setValue(postData.completedLessons);
        break;
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

interface DashboardScreenProps {
  session: UserSession;
  onNavigate: (view: 'dashboard' | 'learning' | 'admin') => void;
  onSelectUnit: (unitId: string) => void;
  onUpdateSession?: (updated: UserSession) => void;
}

export default function DashboardScreen({ session, onNavigate, onSelectUnit, onUpdateSession }: DashboardScreenProps) {
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState(getAppsScriptURL());
  const [isSavedUrl, setIsSavedUrl] = useState(false);
  const [adminTab, setAdminTab] = useState<'users' | 'sheets' | 'reports'>('users');
  const [selectedReportUser, setSelectedReportUser] = useState<string>('');
  const [showStudentReport, setShowStudentReport] = useState(false);
  const [guestModeActive, setGuestModeActive] = useState(isGuestModeEnabled());

  // CRUD User Management States
  const [usersList, setUsersList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  // Form Fields for Add/Edit User
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formFullName, setFormFullName] = useState('');
  const [formRole, setFormRole] = useState<'admin' | 'student'>('student');
  const [formStatus, setFormStatus] = useState<'active' | 'locked'>('active');

  // Load and sync users list
  useEffect(() => {
    if (session.role === 'admin') {
      setUsersList(getUsersDB());
      googleSheetsService.fetchUsersFromSheets()
        .then(list => setUsersList(list))
        .catch(err => console.warn('Could not pull fresh users from Sheets:', err));
    }
  }, [session]);

  const [copiedCode, setCopiedCode] = useState(false);
  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleToggleGuestMode = () => {
    const nextVal = !guestModeActive;
    setGuestModeActive(nextVal);
    setGuestModeEnabled(nextVal);
  };

  const handleOpenCreateForm = () => {
    setEditingUser(null);
    setFormUsername('');
    setFormPassword('');
    setFormFullName('');
    setFormRole('student');
    setFormStatus('active');
    setShowUserForm(true);
  };

  const handleOpenEditForm = (user: any) => {
    setEditingUser(user);
    setFormUsername(user.username);
    setFormPassword(user.password || '');
    setFormFullName(user.fullName);
    setFormRole(user.role);
    setFormStatus(user.status);
    setShowUserForm(true);
  };

  const handleToggleLock = async (user: any) => {
    const nextStatus = user.status === 'locked' ? 'active' : 'locked';
    try {
      await googleSheetsService.updateUser(user.username, { status: nextStatus });
      setUsersList(getUsersDB());
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDeleteUser = async (username: string) => {
    if (username === 'admin') {
      alert('Không thể xóa tài khoản Admin hệ thống!');
      return;
    }
    if (confirm(`Con có chắc chắn muốn xóa tài khoản "${username}" không? Toàn bộ tiến độ sẽ bị xóa.`)) {
      try {
        await googleSheetsService.deleteUser(username);
        setUsersList(getUsersDB());
      } catch (e: any) {
        alert(e.message);
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsername.trim() || !formFullName.trim()) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc!');
      return;
    }

    try {
      if (editingUser) {
        await googleSheetsService.updateUser(editingUser.username, {
          fullName: formFullName,
          password: formPassword,
          role: formRole,
          status: formStatus
        });
      } else {
        const newUser = {
          username: formUsername.trim().toLowerCase(),
          password: formPassword || '123',
          fullName: formFullName,
          role: formRole,
          status: formStatus,
          avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${formUsername}`,
          points: 100,
          streak: 1,
          completedLessons: [],
          createdAt: new Date().toISOString()
        };
        await googleSheetsService.createUser(newUser);
      }
      setUsersList(getUsersDB());
      setShowUserForm(false);
      setEditingUser(null);
    } catch (err: any) {
      alert(err.message || 'Đã xảy ra lỗi!');
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveAppsScriptURL(googleSheetsUrl);
    setIsSavedUrl(true);
    setTimeout(() => setIsSavedUrl(false), 2000);
    googleSheetsService.fetchUsersFromSheets()
      .then(list => setUsersList(list))
      .catch(() => {});
  };

  const handleSyncNow = async () => {
    try {
      const freshList = await googleSheetsService.fetchUsersFromSheets();
      setUsersList(freshList);
      alert('Đồng bộ thành công dữ liệu từ Google Sheets!');
    } catch (err: any) {
      alert('Đồng bộ thất bại: ' + err.message);
    }
  };

  // Admin and teacher specific stats
  const adminMetrics = loadAdminMetrics();

  // Helper calculating progress for the current student
  const totalLessonsCount = syllabusData.reduce((acc, u) => acc + u.lessons.length, 0);
  const completedLessonsCount = session.completedLessons.length;
  const progressPercent = Math.round((completedLessonsCount / totalLessonsCount) * 100) || 0;

  // Flatten vocabulary list for easy querying & distractors
  const allWordsList = Object.values(vocabularyDatabase).flatMap(unit => 
    Object.values(unit).flatMap(lesson => lesson)
  );

  // Smart Review Quiz States
  const [showReviewQuiz, setShowReviewQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85; // slightly slower for kids
      window.speechSynthesis.speak(utterance);
    }
  };

  const startSmartReview = () => {
    // Collect difficult or learning words
    const userProgress = session.vocabularyProgress || {};
    const difficultWords = Object.values(userProgress).filter(p => p.isDifficult || p.status === 'learning');
    
    // Choose 5 words for the quiz
    let chosenItems: any[] = [];
    
    // Convert difficult words to real vocabulary items
    difficultWords.forEach(dw => {
      const found = allWordsList.find(w => w.word === dw.word);
      if (found) {
        chosenItems.push(found);
      }
    });
    
    // If not enough, fill with random words
    if (chosenItems.length < 5) {
      const remainingCount = 5 - chosenItems.length;
      const shuffledAll = [...allWordsList].sort(() => Math.random() - 0.5);
      for (let i = 0; i < shuffledAll.length && chosenItems.length < 5; i++) {
        const item = shuffledAll[i];
        if (!chosenItems.some(c => c.word === item.word)) {
          chosenItems.push(item);
        }
      }
    }
    
    // Generate questions
    const questions = chosenItems.map(item => {
      const correctMeaning = item.meaning;
      // Get 3 distractors
      const distractors = [...allWordsList]
        .filter(w => w.meaning !== correctMeaning)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.meaning);
        
      const options = [correctMeaning, ...distractors].sort(() => Math.random() - 0.5);
      const correctIndex = options.indexOf(correctMeaning);
      
      return {
        word: item.word,
        meaning: item.meaning,
        phonetic: item.ipa,
        emoji: item.emoji,
        options,
        correctIndex
      };
    });
    
    setQuizQuestions(questions);
    setCurrentQuizIndex(0);
    setSelectedOptionIndex(null);
    setQuizScore(0);
    setQuizCompleted(false);
    setShowReviewQuiz(true);
    
    // Speak first word
    if (questions.length > 0) {
      speakText(questions[0].word);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (selectedOptionIndex !== null) return; // prevent clicking multiple times
    setSelectedOptionIndex(optionIndex);
    const question = quizQuestions[currentQuizIndex];
    const isCorrect = optionIndex === question.correctIndex;
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }

    if (onUpdateSession) {
      const updatedProgress = { ...(session.vocabularyProgress || {}) };
      const currentWord = question.word;
      
      const existing = updatedProgress[currentWord] || {
        word: currentWord,
        unitId: 'unit-1',
        lessonId: 'lesson-1',
        status: 'new',
        correctCount: 0,
        totalAttempts: 0,
        isDifficult: false
      };
      
      const updated = {
        ...existing,
        totalAttempts: existing.totalAttempts + 1,
        correctCount: existing.correctCount + (isCorrect ? 1 : 0),
        isDifficult: !isCorrect,
        status: (isCorrect ? 'mastered' : 'learning') as any
      };
      
      updatedProgress[currentWord] = updated;

      // Update badge states dynamically
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
        points: session.points + (isCorrect ? 20 : 0),
        vocabularyProgress: updatedProgress,
        badges: earnedBadges
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex + 1 < quizQuestions.length) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
      // Speak next word
      speakText(quizQuestions[currentQuizIndex + 1].word);
    } else {
      // Quiz completed!
      setQuizCompleted(true);
      if (onUpdateSession) {
        onUpdateSession({
          ...session,
          points: session.points + 100 // +100 completion points
        });
      }
    }
  };

  const startLesson = (unitId: string) => {
    onSelectUnit(unitId);
    onNavigate('learning');
  };

  if (session.role === 'admin') {
    const filteredUsers = usersList.filter(u => {
      const matchesSearch = u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            u.username.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    return (
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Admin Header with Banner */}
        <div className="bg-gradient-to-r from-brand-purple to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-15">
            <Settings className="h-48 w-48" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="bg-white/20 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                Teacher Dashboard
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold mt-2">
                Xin chào, {session.fullName}!
              </h2>
              <p className="text-xs sm:text-sm text-purple-100 mt-1 max-w-xl">
                Hệ thống quản lý tài khoản học viên, đồng bộ hóa thời gian thực qua Google Sheets và giám sát học tập.
              </p>
            </div>
            
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 w-fit">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {googleSheetsUrl ? 'Đã liên kết Cloud' : 'Lưu trữ cục bộ'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-purple-50 text-brand-purple">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Học viên & Quản trị</p>
              <h3 className="text-2xl font-bold text-slate-800">{usersList.length}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-brand-secondary">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tài khoản Hoạt động</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {usersList.filter(u => u.status === 'active').length}
              </h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-blue-50 text-brand-blue">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tiến độ Syllabus trung bình</p>
              <h3 className="text-2xl font-bold text-slate-800">{adminMetrics.averageProgress}%</h3>
            </div>
          </div>
        </div>

        {/* Guest Mode Configuration Banner */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
              <ShieldAlert className="h-4 w-4 text-brand-orange" />
              <span>Chế độ Khách Trải Nghiệm (Guest Mode)</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Cho phép người dùng trải nghiệm ứng dụng Everybody Up 4 mà không cần tài khoản học chính thức.
            </p>
          </div>
          <button
            onClick={handleToggleGuestMode}
            className={`font-bold text-xs px-4 py-2 rounded-xl border transition cursor-pointer flex items-center space-x-1.5 ${
              guestModeActive 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${guestModeActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
            <span>{guestModeActive ? 'Đang MỞ (Cho phép truy cập)' : 'Đang KHÓA (Yêu cầu tài khoản)'}</span>
          </button>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setAdminTab('users')}
            className={`pb-3 text-sm font-bold border-b-2 px-4 transition ${
              adminTab === 'users'
                ? 'border-brand-purple text-brand-purple'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Quản lý Tài khoản ({usersList.length})
          </button>
          <button
            onClick={() => setAdminTab('reports')}
            className={`pb-3 text-sm font-bold border-b-2 px-4 transition ${
              adminTab === 'reports'
                ? 'border-brand-purple text-brand-purple'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Báo cáo Tiến trình & AI Speaking 📈
          </button>
          <button
            onClick={() => setAdminTab('sheets')}
            className={`pb-3 text-sm font-bold border-b-2 px-4 transition ${
              adminTab === 'sheets'
                ? 'border-brand-purple text-brand-purple'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Liên kết Google Sheets
          </button>
        </div>

        {/* TAB 1: User Database Manager */}
        {adminTab === 'users' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-slate-800 text-base">Cơ sở dữ liệu Học viên & Quản trị</h3>
                <p className="text-xs text-slate-400">Thêm mới, sửa mật khẩu, khóa hoặc xóa tài khoản của học sinh.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Tìm kiếm học viên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs px-3 py-2 rounded-xl outline-none focus:border-brand-purple focus:bg-white transition"
                />
                <button
                  onClick={handleSyncNow}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl border border-slate-200 flex items-center space-x-1.5 cursor-pointer transition"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Đồng bộ ngay</span>
                </button>
                <button 
                  onClick={handleOpenCreateForm}
                  className="flex items-center space-x-1 bg-brand-purple hover:bg-purple-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tạo tài khoản</span>
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    <th className="px-6 py-4">Họ và Tên</th>
                    <th className="px-6 py-4">Tên đăng nhập</th>
                    <th className="px-6 py-4">Vai trò</th>
                    <th className="px-6 py-4">Điểm / Streak</th>
                    <th className="px-6 py-4">Syllabus hoàn thành</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-slate-400 font-medium">
                        Không tìm thấy tài khoản nào khớp với bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(user => (
                      <tr key={user.username} className={user.status === 'locked' ? 'bg-slate-50/50' : ''}>
                        <td className="px-6 py-4 font-bold text-slate-800 flex items-center space-x-2.5">
                          <img 
                            src={user.avatarUrl} 
                            alt={user.fullName} 
                            className="h-8 w-8 rounded-full border border-slate-100 object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="block">{user.fullName}</span>
                            <span className="text-[10px] font-medium text-slate-400">
                              Mật khẩu: <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-600 font-bold">{user.password || 'leego'}</span>
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-slate-600">{user.username}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-indigo-100 text-indigo-700'
                          }`}>
                            {user.role === 'admin' ? 'Giáo viên' : 'Học sinh'}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold">
                          <div className="flex items-center space-x-3">
                            <span className="text-amber-500 flex items-center">
                              🔥 {user.streak}
                            </span>
                            <span className="text-brand-primary flex items-center">
                              🪙 {user.points}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-bold text-slate-500">
                              {user.completedLessons ? user.completedLessons.length : 0} bài học
                            </span>
                            <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div 
                                className="bg-brand-secondary h-full" 
                                style={{ width: `${Math.min(((user.completedLessons ? user.completedLessons.length : 0) / 32) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            user.status === 'locked'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${user.status === 'locked' ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                            <span>{user.status === 'locked' ? 'Khóa' : 'Hoạt động'}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleToggleLock(user)}
                              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                user.status === 'locked'
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                                  : 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100'
                              }`}
                              title={user.status === 'locked' ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                            >
                              <Lock className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditForm(user)}
                              className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 cursor-pointer transition"
                              title="Sửa thông tin"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.username)}
                              className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer transition"
                              title="Xóa tài khoản"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Google Sheets Setup and Settings */}
        {adminTab === 'sheets' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Setup Config */}
            <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 shadow-xs p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-brand-purple mb-4">
                  <Server className="h-5 w-5" />
                  <h4 className="font-display font-bold text-slate-800 text-sm uppercase tracking-wide">Cổng kết nối Google Sheet</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Đồng bộ tự động tất cả tài khoản học viên và điểm số real-time về file Google Sheets của trường Anh ngữ LeeGo thông qua <strong>Google Apps Script</strong>.
                </p>

                <form onSubmit={handleSaveConfig} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Google Apps Script Web App URL:</label>
                    <input
                      type="url"
                      value={googleSheetsUrl}
                      onChange={(e) => setGoogleSheetsUrl(e.target.value)}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-brand-purple focus:bg-white transition"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-brand-purple hover:bg-purple-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <CloudLightning className="h-3.5 w-3.5" />
                    <span>Cập nhật liên kết Cloud</span>
                  </button>
                </form>
                
                {isSavedUrl && (
                  <p className="text-[10px] text-emerald-600 font-semibold mt-2 animate-pulse text-center">
                    ✅ Liên kết Cloud đã lưu thành công và sẵn sàng đồng bộ!
                  </p>
                )}
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 mt-6 border border-purple-100">
                <span className="text-[10px] font-bold text-brand-purple uppercase tracking-wider block mb-1">Mẹo đồng bộ:</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Khi học sinh hoàn thành các phần luyện tập từ vựng, ngữ pháp, bài kiểm tra ngắn hoặc nói chuyện với AI Speaking Coach, điểm số và tiến trình sẽ lập tức tự động đồng bộ lên Google Sheet mà giáo viên không cần thao tác thủ công.
                </p>
              </div>
            </div>

            {/* Apps Script Guide Code block */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-slate-800 text-sm">Hướng dẫn tích hợp Google Apps Script</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Làm theo 4 bước để lấy URL API và thiết lập cơ sở dữ liệu cloud.</p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl cursor-pointer transition"
                >
                  {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedCode ? 'Đã sao chép' : 'Sao chép mã'}</span>
                </button>
              </div>

              {/* Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed">
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                  <span className="font-bold text-brand-purple">Bước 1:</span> Tạo bảng Google Sheet có tên bất kỳ. Đổi tên tab đầu tiên thành <strong>Users</strong>. Ở dòng đầu tiên (Row 1), tạo các tiêu đề cột sau:
                  <div className="mt-2 font-mono text-[9px] bg-white p-2 rounded border border-slate-100 select-all font-bold text-slate-500 overflow-x-auto">
                    username, password, fullName, role, points, streak, status, completedLessons, createdAt
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                  <span className="font-bold text-brand-purple">Bước 2:</span> Trong menu Google Sheet, nhấp vào <strong>Tiện ích mở rộng (Extensions)</strong> &rarr; <strong>Apps Script</strong>.
                </div>

                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                  <span className="font-bold text-brand-purple">Bước 3:</span> Xóa toàn bộ mã mặc định và dán đoạn mã Apps Script bên dưới. Sau đó nhấp vào biểu tượng <strong>Lưu (Save)</strong>.
                </div>

                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                  <span className="font-bold text-brand-purple">Bước 4:</span> Nhấp nút <strong>Triển khai (Deploy)</strong> &rarr; <strong>Tùy chọn triển khai mới (New deployment)</strong>. Chọn loại là <strong>Ứng dụng web (Web app)</strong>. Thiết lập:
                  <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[11px]">
                    <li>Thực thi dưới dạng: <strong>Tôi (Me)</strong></li>
                    <li>Ai có quyền truy cập: <strong>Mọi người (Anyone)</strong></li>
                  </ul>
                  Sau đó sao chép URL của ứng dụng web được cấp và dán vào ô cấu hình bên trái!
                </div>
              </div>

              {/* Code viewer block */}
              <div className="relative">
                <div className="absolute top-2 right-2 text-[10px] bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded">
                  Javascript / Google Apps Script
                </div>
                <pre className="text-[10px] font-mono bg-slate-900 text-slate-200 rounded-2xl p-4 max-h-56 overflow-y-auto overflow-x-auto">
                  {APPS_SCRIPT_CODE}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Student Reports & AI Speaking Coach Analytics */}
        {adminTab === 'reports' && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Student Selection list */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
              <div>
                <h3 className="font-display font-bold text-slate-800 text-base">Học viên & AI Speaking Analytics</h3>
                <p className="text-xs text-slate-400">Chọn một học viên bên dưới để xem báo cáo chi tiết về kết quả học tập và luyện nói.</p>
              </div>

              {/* Grid of students to select */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {usersList.filter(u => u.role === 'student').map(student => (
                  <button
                    key={student.username}
                    onClick={() => setSelectedReportUser(student.username)}
                    className={`p-3.5 rounded-2xl border transition text-left flex flex-col items-center justify-center text-center space-y-2 cursor-pointer ${
                      selectedReportUser === student.username
                        ? 'border-brand-purple bg-purple-50/50 shadow-xs ring-2 ring-brand-purple/20'
                        : 'border-slate-100 bg-slate-50 hover:bg-slate-100/70 hover:border-slate-200'
                    }`}
                  >
                    <img
                      src={student.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${student.username}`}
                      alt={student.fullName}
                      className="h-10 w-10 rounded-full border border-slate-100 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="leading-tight">
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{student.fullName}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{student.points} Xu • {student.streak}🔥</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected student detailed report */}
            {selectedReportUser ? (() => {
              const student = usersList.find(u => u.username === selectedReportUser);
              if (!student) return null;

              // Calculate completions
              const stdLessonsCount = student.completedLessons?.length || 0;
              const stdProgressPercent = Math.round((stdLessonsCount / totalLessonsCount) * 100) || 0;

              // Extract vocabulary
              const vocabProg = student.vocabularyProgress || {};
              const masteredCount = Object.values(vocabProg).filter((p: any) => p.status === 'mastered').length;
              const learningCount = Object.values(vocabProg).filter((p: any) => p.status === 'learning').length;
              const difficultCount = Object.values(vocabProg).filter((p: any) => p.isDifficult).length;

              // Extract tests and speaking
              const testResults = student.testResults || {};
              const speakingResults = student.speakingResults || {};

              return (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column: General Progress Profile Card */}
                  <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-6 flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4 border-b border-slate-50 pb-5">
                        <img
                          src={student.avatarUrl}
                          alt={student.fullName}
                          className="h-14 w-14 rounded-full border-2 border-brand-purple/20 object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="text-[9px] font-bold text-brand-purple uppercase bg-purple-50 px-2 py-0.5 rounded-full">
                            HỌC VIÊN CHÍNH THỨC
                          </span>
                          <h4 className="font-display font-extrabold text-slate-800 text-lg mt-0.5">
                            {student.fullName}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Tài khoản: @{student.username}
                          </p>
                        </div>
                      </div>

                      {/* Numeric Stats Grid */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-amber-50/50 border border-amber-100/50 rounded-2xl p-3 text-center">
                          <span className="text-[9px] font-bold text-amber-600 uppercase block">Chuỗi ngày</span>
                          <span className="text-lg font-black text-amber-700">{student.streak} 🔥</span>
                        </div>
                        <div className="bg-purple-50/50 border border-purple-100/50 rounded-2xl p-3 text-center">
                          <span className="text-[9px] font-bold text-purple-600 uppercase block">Điểm tích lũy</span>
                          <span className="text-lg font-black text-purple-700">{student.points} xu</span>
                        </div>
                        <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-3 text-center">
                          <span className="text-[9px] font-bold text-emerald-600 uppercase block">Hoàn thành</span>
                          <span className="text-lg font-black text-emerald-700">{stdProgressPercent}%</span>
                        </div>
                      </div>

                      {/* Vocabulary Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-500">Tiến trình Từ vựng ({Object.keys(vocabProg).length} từ đã gặp)</span>
                          <span className="text-emerald-600">{masteredCount} Đã thuộc</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                          <div className="bg-emerald-500 h-full" style={{ width: `${Object.keys(vocabProg).length ? (masteredCount / Object.keys(vocabProg).length) * 100 : 0}%` }}></div>
                          <div className="bg-amber-400 h-full" style={{ width: `${Object.keys(vocabProg).length ? (learningCount / Object.keys(vocabProg).length) * 100 : 0}%` }}></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                          <span>🟢 Thuộc: {masteredCount} từ</span>
                          <span>🟡 Đang học: {learningCount} từ</span>
                          <span>🔴 Từ khó: {difficultCount} từ</span>
                        </div>
                      </div>

                      {/* Detailed badgeless achievement tracking */}
                      <div className="space-y-2 border-t border-slate-50 pt-4">
                        <span className="text-xs font-bold text-slate-500 block mb-2">Bài học đã hoàn thành ({stdLessonsCount} bài)</span>
                        {student.completedLessons && student.completedLessons.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                            {student.completedLessons.map((lessonId: string) => (
                              <span key={lessonId} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                {lessonId.replace('unit-', 'Unit ').replace('-lesson-', ' Lesson ')}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-400 italic">Học sinh chưa hoàn thành bài học nào.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Center Column: Short Quiz Test Scores */}
                  <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
                    <div className="flex items-center space-x-2 border-b border-slate-50 pb-4">
                      <span className="p-2.5 bg-blue-50 text-brand-blue rounded-xl">
                        <Award className="h-5 w-5" />
                      </span>
                      <div>
                        <h4 className="font-display font-bold text-slate-800 text-base">Điểm Kiểm tra Short Quiz</h4>
                        <p className="text-[11px] text-slate-400">Kết quả kiểm tra tổng hợp 15 câu (Nghe - Đọc - Viết)</p>
                      </div>
                    </div>

                    <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                      {syllabusData.map((unit) => {
                        const result = testResults[unit.id];
                        return (
                          <div key={unit.id} className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl flex flex-col space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-black text-slate-700">Unit {unit.number}: {unit.title}</span>
                              {result ? (
                                <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                                  result.score >= 12 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {result.score} / 15 Điểm
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold bg-slate-100 text-slate-400 px-2 py-1 rounded-full">Chưa làm test</span>
                              )}
                            </div>

                            {result && (
                              <div className="grid grid-cols-3 gap-2 text-center text-[10px] border-t border-slate-200/50 pt-2 font-bold text-slate-500">
                                <div className="bg-white p-1 rounded-md border border-slate-100">
                                  <span>👂 Nghe: {result.listeningScore || 0}/7</span>
                                </div>
                                <div className="bg-white p-1 rounded-md border border-slate-100">
                                  <span>📖 Đọc: {result.readingScore || 0}/4</span>
                                </div>
                                <div className="bg-white p-1 rounded-md border border-slate-100">
                                  <span>✍️ Viết: {result.writingScore || 0}/4</span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: AI Speaking Coach Evaluation Report */}
                  <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
                    <div className="flex items-center space-x-2 border-b border-slate-50 pb-4">
                      <span className="p-2.5 bg-purple-50 text-brand-purple rounded-xl">
                        <Sparkles className="h-5 w-5 fill-brand-purple" />
                      </span>
                      <div>
                        <h4 className="font-display font-bold text-slate-800 text-base">Học viên AI Speaking Coach</h4>
                        <p className="text-[11px] text-slate-400">Đánh giá phát âm, ngữ pháp và tốc độ phản xạ</p>
                      </div>
                    </div>

                    <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                      {syllabusData.map((unit) => {
                        const result = speakingResults[unit.id];
                        return (
                          <div key={unit.id} className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl flex flex-col space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-black text-slate-700">Unit {unit.number}: {unit.title}</span>
                              {result ? (
                                <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                                  result.overallScore >= 85 ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {result.overallScore} / 100 Điểm
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold bg-slate-100 text-slate-400 px-2 py-1 rounded-full">Chưa luyện nói</span>
                              )}
                            </div>

                            {result && (
                              <div className="space-y-2 mt-1">
                                <div className="grid grid-cols-3 gap-1.5 text-center text-[9px] font-extrabold text-slate-600">
                                  <div className="bg-white p-1 rounded-md border border-slate-100 flex flex-col">
                                    <span className="text-indigo-500 text-xs">{result.pronunciationScore}</span>
                                    <span>🗣️ Phát âm</span>
                                  </div>
                                  <div className="bg-white p-1 rounded-md border border-slate-100 flex flex-col">
                                    <span className="text-purple-500 text-xs">{result.grammarScore}</span>
                                    <span>📝 Ngữ pháp</span>
                                  </div>
                                  <div className="bg-white p-1 rounded-md border border-slate-100 flex flex-col">
                                    <span className="text-amber-500 text-xs">{result.responseSpeedScore}</span>
                                    <span>⚡ Phản xạ</span>
                                  </div>
                                </div>

                                {/* Common Errors / Weaknesses */}
                                {result.commonErrors && result.commonErrors.length > 0 && (
                                  <div className="text-[10px] text-rose-600 bg-rose-50/55 p-2 rounded-xl border border-rose-100/50">
                                    <strong className="block mb-0.5">⚠️ Lỗi phát âm / cấu trúc cần sửa:</strong>
                                    <ul className="list-disc pl-3.5 space-y-0.5">
                                      {result.commonErrors.map((err: string, i: number) => (
                                        <li key={i}>{err}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Parent Evaluation Report */}
                                {result.parentReport && (
                                  <div className="text-[10px] text-indigo-900 bg-indigo-50/50 p-2 rounded-xl border border-indigo-100/40 space-y-1">
                                    <div>
                                      <strong className="text-emerald-700">💪 Ưu điểm:</strong> {result.parentReport.strengths?.join(', ') || 'Đang cập nhật'}
                                    </div>
                                    <div>
                                      <strong className="text-rose-600">🩹 Cần cải thiện:</strong> {result.parentReport.weaknesses?.join(', ') || 'Đang cập nhật'}
                                    </div>
                                    <div className="border-t border-indigo-100/60 pt-1 mt-1 text-slate-500 italic">
                                      {result.parentReport.suggestedPractice}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              );
            })() : (
              <div className="bg-slate-50 rounded-3xl p-10 text-center border-2 border-dashed border-slate-200">
                <span className="text-4xl block mb-3 animate-bounce">📈</span>
                <h4 className="font-display font-extrabold text-slate-800 text-base">Xem Báo cáo Đánh giá Học viên</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Vui lòng nhấp chọn một học viên ở danh sách phía trên để nạp thông tin điểm số, xu, tiến độ và phân tích lỗi sai AI Speaking!</p>
              </div>
            )}
          </div>
        )}

        {/* CREATE / EDIT USER MODAL FORM */}
        {showUserForm && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full border border-slate-100 shadow-2xl p-6 sm:p-8 space-y-6 relative animate-scale-up">
              
              <button
                onClick={() => { setShowUserForm(false); setEditingUser(null); }}
                className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center space-x-2 text-brand-purple">
                <Users className="h-5 w-5" />
                <h4 className="font-display font-bold text-slate-800 text-base">
                  {editingUser ? 'Sửa thông tin tài khoản' : 'Tạo tài khoản học sinh mới'}
                </h4>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Họ và Tên học viên:</label>
                  <input
                    type="text"
                    value={formFullName}
                    onChange={(e) => setFormFullName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Minh Quân"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-purple focus:bg-white transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Tên đăng nhập (Username):</label>
                  <input
                    type="text"
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    placeholder="Ví dụ: leego2026"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-purple focus:bg-white transition disabled:opacity-50"
                    disabled={!!editingUser} // cannot change username once created
                    required
                  />
                  {!editingUser && (
                    <p className="text-[10px] text-slate-400 mt-1">Con nhập chữ thường viết liền không dấu nhé.</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Mật khẩu đăng nhập:</label>
                  <input
                    type="text"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder="Ví dụ: 123"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-purple focus:bg-white transition"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Vai trò:</label>
                    <select
                      value={formRole}
                      onChange={(e: any) => setFormRole(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-purple focus:bg-white transition"
                    >
                      <option value="student">Học sinh</option>
                      <option value="admin">Giáo viên / Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Trạng thái:</label>
                    <select
                      value={formStatus}
                      onChange={(e: any) => setFormStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-purple focus:bg-white transition"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="locked">Bị khóa</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-purple hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl shadow-md transition text-xs cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Check className="h-4 w-4" />
                  <span>{editingUser ? 'Lưu thay đổi' : 'Tạo tài khoản học sinh'}</span>
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    );
  }

  if (showReviewQuiz) {
    const currentQuestion = quizQuestions[currentQuizIndex];
    const progressPercent = Math.round(((currentQuizIndex) / quizQuestions.length) * 100);
    
    return (
      <div id="smart-review-overlay" className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        <div id="smart-review-card" className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-lg space-y-6 sm:space-y-8 relative overflow-hidden">
          
          {/* Header */}
          <div id="review-header" className="flex items-center justify-between">
            <div id="review-title-group" className="flex items-center space-x-2 text-brand-purple">
              <span className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                <Crown className="h-5 w-5 animate-pulse" />
              </span>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Bé tự kiểm tra</span>
                <span className="text-sm font-extrabold text-slate-700">Ôn tập Từ vựng Thông minh</span>
              </div>
            </div>
            <button 
              id="close-review-btn"
              onClick={() => setShowReviewQuiz(false)}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {!quizCompleted ? (
            <div id="quiz-active-panel" className="space-y-6">
              {/* Progress Bar */}
              <div id="quiz-progress-section">
                <div id="quiz-progress-labels" className="flex justify-between text-xs text-slate-500 font-bold mb-2">
                  <span>Câu hỏi {currentQuizIndex + 1} / {quizQuestions.length}</span>
                  <span className="text-brand-yellow font-extrabold bg-amber-50 px-2.5 py-0.5 rounded-full">⭐ Đúng: {quizScore}</span>
                </div>
                <div id="quiz-progress-track" className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div 
                    id="quiz-progress-bar"
                    className="bg-purple-500 h-full transition-all duration-300" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Question card */}
              <div id="question-card" className="bg-slate-50 border border-slate-100 p-6 sm:p-8 rounded-3xl flex flex-col items-center text-center space-y-4">
                <span id="question-emoji" className="text-6xl sm:text-7xl animate-bounce">{currentQuestion?.emoji}</span>
                <h3 id="question-word" className="text-2xl sm:text-3xl font-display font-extrabold text-slate-800 tracking-tight">
                  {currentQuestion?.word}
                </h3>
                <p id="question-phonetic" className="text-xs text-slate-400 font-semibold font-mono bg-white px-3 py-1 rounded-full border border-slate-100">
                  {currentQuestion?.phonetic}
                </p>
                <button 
                  id="speak-question-btn"
                  onClick={() => speakText(currentQuestion?.word)}
                  className="bg-white hover:bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl text-slate-600 transition shadow-xs flex items-center space-x-1.5 cursor-pointer text-xs font-bold"
                >
                  <Volume2 className="h-4 w-4" />
                  <span>Nghe phát âm</span>
                </button>
              </div>

              {/* Options */}
              <div id="quiz-options-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQuestion?.options.map((option: string, oIdx: number) => {
                  const isSelected = selectedOptionIndex === oIdx;
                  const isCorrectAnswer = oIdx === currentQuestion.correctIndex;
                  const hasAnswered = selectedOptionIndex !== null;
                  
                  let btnStyle = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700';
                  if (hasAnswered) {
                    if (isCorrectAnswer) {
                      btnStyle = 'bg-emerald-500 border-emerald-500 text-white shadow-md scale-[1.01]';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-500 border-rose-500 text-white shadow-md';
                    } else {
                      btnStyle = 'bg-slate-50 border-slate-100 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      id={`quiz-option-${oIdx}`}
                      key={oIdx}
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold transition duration-200 cursor-pointer text-center ${btnStyle}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Feedback and next button */}
              {selectedOptionIndex !== null && (
                <div id="quiz-feedback-box" className="flex flex-col items-center pt-4 space-y-3">
                  <p id="quiz-feedback-text" className="text-xs sm:text-sm font-extrabold text-slate-800">
                    {selectedOptionIndex === currentQuestion.correctIndex ? (
                      <span className="text-emerald-600">🎉 Tuyệt vời! Chính xác rồi! (+20 xu 🪙)</span>
                    ) : (
                      <span className="text-rose-500">❌ Gần đúng rồi! Nghĩa đúng là: "{currentQuestion.meaning}"</span>
                    )}
                  </p>
                  <button
                    id="quiz-continue-btn"
                    onClick={handleNextQuestion}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition cursor-pointer flex items-center space-x-1"
                  >
                    <span>Tiếp tục</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Results Screen */
            <div id="quiz-results-panel" className="text-center py-6 sm:py-8 space-y-6 flex flex-col items-center">
              <div id="results-icon-container" className="h-20 w-20 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                <Crown className="h-10 w-10 fill-purple-400" />
              </div>
              <div id="results-headline">
                <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-800">Hoàn thành Ôn tập!</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md leading-relaxed">
                  Chúc mừng con đã hoàn thành xuất sắc thử thách Ôn tập Từ vựng ngày hôm nay! Con trả lời đúng <strong>{quizScore}/{quizQuestions.length}</strong> từ vựng.
                </p>
              </div>

              {/* Score breakdown */}
              <div id="results-score-breakdown" className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-100 w-full max-w-md grid grid-cols-2 gap-4">
                <div className="text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Điểm tích luỹ</span>
                  <span className="text-sm sm:text-base font-extrabold text-brand-primary">+{quizScore * 20} xu 🪙</span>
                </div>
                <div className="text-center border-l border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bonus Hoàn thành</span>
                  <span className="text-sm sm:text-base font-extrabold text-emerald-600">+100 xu ⭐</span>
                </div>
              </div>

              <div id="results-actions" className="flex space-x-3">
                <button
                  id="retry-quiz-btn"
                  onClick={startSmartReview}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3 rounded-2xl transition cursor-pointer flex items-center space-x-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Luyện tập lại</span>
                </button>
                <button
                  id="finish-quiz-btn"
                  onClick={() => setShowReviewQuiz(false)}
                  className="bg-brand-primary hover:bg-rose-600 text-white font-bold text-xs px-6 py-3 rounded-2xl transition cursor-pointer flex items-center space-x-1 shadow-md"
                >
                  <Check className="h-4 w-4" />
                  <span>Quay lại Dashboard</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Otherwise, render student / guest view
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* Welcome Banner for Students */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-orange rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-15">
          <Sparkles className="h-48 w-48" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1 bg-white/20 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-white/20 mb-3">
              <Star className="h-3 w-3 fill-white" />
              <span>{session.role === 'guest' ? 'Trải Nghiệm Tự Do' : 'Học Viên Chính Thức'}</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold leading-tight">
              Chào mừng con, <span className="text-brand-yellow">{session.fullName}</span>!
            </h2>
            <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-xl font-medium leading-relaxed">
              Mỗi ngày học tập là một bước chân khám phá thế giới rộng lớn. Hãy tích lũy thật nhiều Điểm 🪙 và giữ chuỗi liên tục 🔥 nhé!
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-white/10 px-5 py-3 rounded-2xl border border-white/15 w-fit">
            <div>
              <p className="text-[10px] font-bold text-white/70 uppercase">Tiến trình lớp 4</p>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-lg font-extrabold">{progressPercent}%</span>
                <span className="text-xs text-white/80">({completedLessonsCount}/{totalLessonsCount} bài)</span>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-white/20"></div>
            <button
              onClick={() => onNavigate('learning')}
              className="bg-brand-yellow hover:scale-105 hover:bg-white text-slate-800 font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition cursor-pointer flex items-center space-x-1"
            >
              <span>VÀO HỌC</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Cards (Mobile responsive grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Streak Counter */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-500">
              <Flame className="h-6 w-6 fill-amber-500 animate-bounce" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Chuỗi ngày (Streak)</h4>
              <p className="text-xl font-extrabold text-slate-800">{session.streak} Ngày liên tục</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">🔥 Siêu Đỉnh</span>
        </div>

        {/* Total Points */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 rounded-2xl bg-brand-primary/10 text-brand-primary">
              <Trophy className="h-6 w-6 text-brand-yellow fill-brand-yellow" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Điểm tích luỹ</h4>
              <p className="text-xl font-extrabold text-slate-800">{session.points} xu 🪙</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-brand-primary bg-rose-50 px-2 py-1 rounded-full">⭐ LeeGo Xu</span>
        </div>

        {/* Level indicator */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 rounded-2xl bg-blue-50 text-brand-blue">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Giáo trình chính</h4>
              <p className="text-xl font-extrabold text-slate-800">Everybody Up 4</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-brand-blue bg-blue-50 px-2 py-1 rounded-full">📚 Lớp 4</span>
        </div>

      </div>

      {/* View Reports Button */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50/50 border border-indigo-100/60 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center space-x-3.5">
          <span className="p-3 bg-indigo-500 text-white rounded-2xl shadow-sm text-xl">
            📊
          </span>
          <div>
            <h4 className="font-display font-extrabold text-slate-800 text-sm sm:text-base">Báo cáo Học tập & AI Speaking Độc quyền 🚀</h4>
            <p className="text-xs text-slate-500 mt-0.5">Ba mẹ và bé xem đánh giá chi tiết phát âm, từ vựng, ngữ pháp và gợi ý học tập chuẩn Leego.</p>
          </div>
        </div>
        <button
          onClick={() => setShowStudentReport(!showStudentReport)}
          className="bg-brand-purple hover:bg-purple-700 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-xs transition duration-200 cursor-pointer text-center"
        >
          {showStudentReport ? 'ĐÓNG BÁO CÁO ❌' : 'XEM BÁO CÁO NGAY 📈'}
        </button>
      </div>

      {/* Student Detailed Report Panels */}
      {showStudentReport && (
        <div className="bg-white rounded-3xl border border-indigo-100 p-6 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-display font-extrabold text-slate-800 text-base sm:text-lg flex items-center gap-2">
              🏆 Học bạ Thông minh & AI Coach Feedback của con
            </h3>
            <span className="text-xs text-slate-400 font-bold">Cập nhật thời gian thực</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: Short Quiz Test Scores */}
            <div className="bg-slate-50/70 border border-slate-100 p-5 rounded-2xl space-y-4">
              <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                📝 Kết quả Kiểm tra Short Quiz
              </h4>
              <p className="text-xs text-slate-400">Điểm số chuẩn của con qua các bài Test 15 câu trắc nghiệm.</p>
              
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {syllabusData.map((unit) => {
                  const result = session.testResults?.[unit.id];
                  return (
                    <div key={unit.id} className="bg-white border border-slate-100/80 p-3 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-700">Unit {unit.number}: {unit.title}</p>
                        {result && (
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                            👂 Nghe: {result.listeningScore}/7 | 📖 Đọc: {result.readingScore}/4 | ✍️ Viết: {result.writingScore}/4
                          </p>
                        )}
                      </div>
                      {result ? (
                        <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                          {result.score} / 15
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full">Chưa làm</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Speaking Coach Results */}
            <div className="bg-slate-50/70 border border-slate-100 p-5 rounded-2xl space-y-4">
              <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                🗣️ Phân tích Luyện nói AI Speaking
              </h4>
              <p className="text-xs text-slate-400">Phản hồi từ AI Coach về kỹ năng phát âm, ngữ pháp và phản xạ.</p>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {syllabusData.map((unit) => {
                  const result = session.speakingResults?.[unit.id];
                  return (
                    <div key={unit.id} className="bg-white border border-slate-100/80 p-3.5 rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-700">Unit {unit.number}: {unit.title}</span>
                        {result ? (
                          <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                            {result.overallScore} / 100
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full">Chưa luyện nói</span>
                        )}
                      </div>

                      {result && (
                        <div className="space-y-2 text-[11px]">
                          <div className="grid grid-cols-3 gap-1 text-center font-bold text-slate-500">
                            <span className="bg-slate-50 py-0.5 rounded">🗣️ Phát âm: {result.pronunciationScore}</span>
                            <span className="bg-slate-50 py-0.5 rounded">📝 Ngữ pháp: {result.grammarScore}</span>
                            <span className="bg-slate-50 py-0.5 rounded">⚡ Phản xạ: {result.responseSpeedScore}</span>
                          </div>
                          
                          {/* Parent report section */}
                          {result.parentReport && (
                            <div className="bg-indigo-50/30 p-2 rounded-lg space-y-1 border border-indigo-100/30 text-slate-600">
                              <p><strong className="text-emerald-700">💪 Điểm mạnh:</strong> {result.parentReport.strengths?.join(', ')}</p>
                              <p><strong className="text-rose-600">🩹 Cần sửa:</strong> {result.parentReport.weaknesses?.join(', ')}</p>
                              <p className="text-[10px] italic text-slate-400 mt-1 pt-1 border-t border-slate-100">{result.parentReport.suggestedPractice}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Smart Review & Badges Section (Bento Grid) */}
      <div id="student-bento-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Smart Review (2/3 width on large screens) */}
        <div id="bento-smart-review" className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
              <div className="flex items-center space-x-2.5">
                <span className="p-2.5 bg-indigo-50 text-brand-purple rounded-2xl">
                  <Crown className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display font-extrabold text-slate-800 text-base sm:text-lg">Ôn tập Từ vựng Thông minh</h3>
                  <p className="text-[11px] text-slate-400">Luyện tập lại các từ con hay trả lời chưa chính xác</p>
                </div>
              </div>
              <button 
                onClick={startSmartReview}
                className="bg-brand-primary hover:bg-rose-600 hover:scale-[1.02] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer flex items-center space-x-1"
              >
                <span>LUYỆN NGAY</span>
                <Play className="h-3 w-3 fill-white" />
              </button>
            </div>

            {/* Vocabulary Statistics Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-50/50 border border-emerald-100/50 p-3 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-emerald-600 block uppercase">Đã Thuộc</span>
                <span className="text-xl font-black text-emerald-700">
                  {Object.values(session.vocabularyProgress || {}).filter(p => p.status === 'mastered').length}
                </span>
              </div>
              <div className="bg-amber-50/50 border border-amber-100/50 p-3 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-amber-600 block uppercase">Đang Học</span>
                <span className="text-xl font-black text-amber-700">
                  {Object.values(session.vocabularyProgress || {}).filter(p => p.status === 'learning' && !p.isDifficult).length}
                </span>
              </div>
              <div className="bg-rose-50/50 border border-rose-100/50 p-3 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-rose-600 block uppercase">Cần Ôn</span>
                <span className="text-xl font-black text-rose-700 animate-pulse">
                  {Object.values(session.vocabularyProgress || {}).filter(p => p.isDifficult).length}
                </span>
              </div>
            </div>

            {/* Difficult words list */}
            <div>
              <span className="text-xs font-extrabold text-slate-500 block mb-2.5">Sổ Tay Từ Khó (Cần Ôn Tập)</span>
              {Object.values(session.vocabularyProgress || {}).filter(p => p.isDifficult).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[160px] overflow-y-auto pr-1">
                  {Object.values(session.vocabularyProgress || {})
                    .filter(p => p.isDifficult)
                    .map((p) => {
                      const detail = allWordsList.find(w => w.word === p.word);
                      return (
                        <div key={p.word} className="bg-slate-50/80 border border-slate-100 p-2.5 rounded-xl flex items-center justify-between">
                          <div className="flex items-center space-x-2.5">
                            <span className="text-2xl">{detail?.emoji || '⭐'}</span>
                            <div>
                              <p className="text-xs font-bold text-slate-800">{p.word}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{detail?.meaning || 'Đang cập nhật'}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => speakText(p.word)}
                            className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="bg-slate-50 rounded-2xl p-6 text-center border border-dashed border-slate-100">
                  <span className="text-3xl block mb-2">🌟</span>
                  <p className="text-xs font-bold text-slate-600">Tuyệt vời! Con không có từ vựng khó nào.</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Toàn bộ từ vựng đã học đều đang ở trạng thái Hoàn hảo.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Badges Collection (1/3 width) */}
        <div id="bento-badges" className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2.5 border-b border-slate-50 pb-4">
            <span className="p-2.5 bg-rose-50 text-brand-primary rounded-2xl">
              <Award className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display font-extrabold text-slate-800 text-base sm:text-lg">Huy hiệu Vinh danh</h3>
              <p className="text-[11px] text-slate-400">Hoàn thành thử thách để mở khóa huy hiệu</p>
            </div>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'badge-rookie', name: 'Lính Mới Tinh Anh', desc: 'Tham gia lớp Anh ngữ LeeGo', emoji: '🎒', unlocked: true, bg: 'bg-blue-50 text-blue-500 border-blue-100' },
              { id: 'badge-streak', name: 'Chiến Binh Chăm Chỉ', desc: 'Đạt chuỗi học tập từ 5 ngày liên tiếp', emoji: '🔥', unlocked: session.streak >= 5, bg: 'bg-orange-50 text-orange-500 border-orange-100' },
              { id: 'badge-point-king', name: 'Vua Điểm Thưởng', desc: 'Tích lũy từ 1,500 xu trở lên', emoji: '🪙', unlocked: session.points >= 1500, bg: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
              { id: 'badge-vocab-prodigy', name: 'Thần Đồng Từ Vựng', desc: 'Học tối thiểu 8 từ tiếng Anh', emoji: '🧠', unlocked: Object.keys(session.vocabularyProgress || {}).length >= 8 || (session.badges && session.badges.includes('badge-vocab-prodigy')), bg: 'bg-purple-50 text-purple-600 border-purple-100' },
              { id: 'badge-pronounce', name: 'Chuyên Gia Phát Âm', desc: 'Hoàn thành từ 3 bài học', emoji: '🗣️', unlocked: session.completedLessons.length >= 3, bg: 'bg-teal-50 text-teal-600 border-teal-100' },
              { id: 'badge-persistence', name: 'Kiên Trì Bền Bỉ', desc: 'Thành thạo 4 từ vựng trở lên', emoji: '🏆', unlocked: Object.values(session.vocabularyProgress || {}).filter(p => p.status === 'mastered').length >= 4 || (session.badges && session.badges.includes('badge-persistence')), bg: 'bg-indigo-50 text-indigo-500 border-indigo-100' }
            ].map((b) => (
              <div 
                key={b.id} 
                className={`group relative p-2.5 rounded-2xl border flex flex-col items-center justify-center text-center transition duration-200 ${
                  b.unlocked 
                    ? `${b.bg} shadow-xs scale-100` 
                    : 'bg-slate-50/50 border-slate-100 text-slate-300 opacity-60'
                }`}
              >
                <span className={`text-2xl mb-1.5 transition duration-300 ${b.unlocked ? 'group-hover:scale-125' : 'grayscale'}`}>
                  {b.emoji}
                </span>
                
                <span className={`text-[9px] font-bold leading-tight ${b.unlocked ? 'text-slate-700' : 'text-slate-400'}`}>
                  {b.name.split(' ').slice(0, 2).join(' ')}
                </span>

                <div className="absolute bottom-1 right-1">
                  {b.unlocked ? (
                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                  ) : (
                    <Lock className="h-1.5 w-1.5 text-slate-400" />
                  )}
                </div>

                <div className="pointer-events-none absolute -top-14 left-1/2 -translate-x-1/2 w-48 bg-slate-800 text-white text-[10px] p-2 rounded-xl opacity-0 group-hover:opacity-100 transition duration-200 z-30 shadow-md">
                  <p className="font-extrabold">{b.name}</p>
                  <p className="text-[9px] text-slate-300 mt-0.5">{b.desc}</p>
                  <p className="font-bold mt-1 text-[9px] text-brand-yellow">Trạng thái: {b.unlocked ? '🔓 Đã mở khóa' : '🔒 Chưa đạt'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Main Roadmap Path & Lesson Explorer */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 sm:p-8">
        <div className="mb-6">
          <h3 className="font-display font-extrabold text-slate-800 text-lg sm:text-xl flex items-center gap-2">
            🎒 Bản Đồ Học Tập Everybody Up 4
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Nhấn vào bất kỳ Unit nào dưới đây để khám phá từ vựng, ngữ pháp chuẩn Oxford và luyện nói thông qua các bài luyện tập tương tác sinh động!
          </p>
        </div>

        {/* Grid representing all 8 Units with rich statuses */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {syllabusData.map((unit) => {
            // Count completed lessons in this unit
            const unitLessonsIds = unit.lessons.map(l => `${unit.id}-${l.id}`);
            const completedCount = unitLessonsIds.filter(id => session.completedLessons.includes(id)).length;
            const isCompleted = completedCount === unit.lessons.length;
            const isStarted = completedCount > 0;

            return (
              <div 
                key={unit.id}
                className={`group border-2 rounded-2xl p-5 flex flex-col justify-between transition relative overflow-hidden ${
                  isCompleted 
                    ? 'border-brand-secondary bg-emerald-50/20'
                    : isStarted
                    ? 'border-brand-blue bg-blue-50/10'
                    : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                }`}
              >
                <div>
                  {/* Card Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                      isCompleted 
                        ? 'bg-emerald-100 text-emerald-700'
                        : isStarted
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      Unit {unit.number}
                    </span>
                    
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-brand-secondary fill-brand-secondary" />
                    ) : isStarted ? (
                      <span className="text-[10px] font-bold text-brand-blue">{completedCount}/4 Đã học</span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400">Chưa bắt đầu</span>
                    )}
                  </div>

                  <h4 className="font-display font-bold text-slate-800 group-hover:text-brand-primary transition duration-300">
                    {unit.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    Mẫu câu chính: {unit.lessons[0]?.sentencePatterns[0] || 'Luyện tập các mẫu câu Oxford'}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100/60 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400">4 Bài học + Review</span>
                  <button 
                    onClick={() => startLesson(unit.id)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                      isCompleted 
                        ? 'bg-brand-secondary/10 text-brand-secondary hover:bg-brand-secondary hover:text-white'
                        : 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white'
                    }`}
                  >
                    <span>{isStarted ? 'Tiếp tục' : 'Bắt đầu'}</span>
                    <Play className="h-3 w-3 fill-current" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
