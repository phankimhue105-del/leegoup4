/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserSession } from '../types';
import { saveUserSession, getUsersDB } from '../lib/storage';
import { Sparkles, GraduationCap, AlertCircle, Lock, User } from 'lucide-react';

interface WelcomeScreenProps {
  onLoginSuccess: (session: UserSession) => void;
}

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyraxAby--FP4P8PZ-IMWvpYA50MECguJMKA5fuMnugh3_A64E6xAq_WG4sBU_gnig6gw/exec';

export default function WelcomeScreen({ onLoginSuccess }: WelcomeScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Sai tên đăng nhập hoặc mật khẩu.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const payload = {
        username: username.trim(),
        password: password.trim()
      };

      let response: Response;
      try {
        response = await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (networkErr) {
        // Fallback for CORS preflight in some browsers when hitting Apps Script POST
        response = await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) {
        throw new Error('NETWORK_ERROR');
      }

      const data = await response.json();

      if (data && data.success === true) {
        const studentName = data.student || username.trim();
        
        // Retrieve existing session data or build a new session for this student
        const existingUsers = getUsersDB();
        const userInDb = existingUsers.find(u => u.username.toLowerCase() === username.trim().toLowerCase());

        const session: UserSession = {
          username: username.trim(),
          fullName: studentName,
          role: 'student',
          avatarUrl: userInDb?.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=60',
          points: userInDb?.points || 0,
          streak: userInDb?.streak || 1,
          completedLessons: userInDb?.completedLessons || [],
          vocabularyProgress: userInDb?.vocabularyProgress || {},
          grammarProgress: userInDb?.grammarProgress || {},
          testResults: userInDb?.testResults || {},
          speakingResults: userInDb?.speakingResults || {},
          badges: userInDb?.badges || [],
          lastActiveDate: new Date().toISOString().split('T')[0]
        };

        saveUserSession(session);
        onLoginSuccess(session);
      } else {
        setError('Sai tên đăng nhập hoặc mật khẩu.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      
      {/* Decorative Badge */}
      <div className="inline-flex items-center space-x-1.5 bg-brand-primary/10 text-brand-primary px-4 py-1.5 rounded-full text-xs font-bold mb-6 border border-brand-primary/20 animate-bounce">
        <Sparkles className="h-3.5 w-3.5" />
        <span>Hệ thống Anh ngữ Chất lượng cao</span>
      </div>

      {/* Main Hero Header */}
      <div className="text-center max-w-2xl mb-10">
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-800 tracking-tight leading-none mb-4">
          Everybody Up <span className="text-brand-primary">4</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 font-medium">
          Cổng học tập tương tác chuẩn Oxford dành riêng cho học viên <span className="font-semibold text-brand-secondary">Anh ngữ LeeGo</span>
        </p>
      </div>

      {/* Login Layout Card */}
      <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 max-w-3xl">
        
        {/* Left Side: Brand Visual Card */}
        <div className="bg-gradient-to-br from-brand-primary to-brand-orange p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-10 translate-y-10"></div>
          
          <div className="relative z-10">
            <div className="bg-white/20 backdrop-blur-xs p-3 rounded-2xl w-fit mb-6">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold font-display mb-3">Everybody Up 4</h3>
            <p className="text-xs text-white/90 leading-relaxed mb-6">
              Chương trình học tập sinh động tích hợp 8 chủ điểm từ thế giới xung quanh: Hoạt động dã ngoại, sinh vật biển, nghề nghiệp ước mơ đến khám phá vũ trụ bao la.
            </p>
            
            <div className="space-y-3.5">
              <div className="flex items-center space-x-2 text-xs font-semibold bg-white/10 p-2 rounded-xl border border-white/10">
                <span className="bg-brand-yellow text-slate-900 rounded-full w-4 h-4 flex items-center justify-center text-[10px]">1</span>
                <span>8 Units chuẩn Syllabus Oxford</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold bg-white/10 p-2 rounded-xl border border-white/10">
                <span className="bg-brand-yellow text-slate-900 rounded-full w-4 h-4 flex items-center justify-center text-[10px]">2</span>
                <span>Luyện nói AI Speaking Coach thông minh</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 pt-6 border-t border-white/20 flex items-center justify-between">
            <span className="text-xs font-bold text-brand-yellow">Hotline hỗ trợ:</span>
            <span className="text-sm font-extrabold">0988.526.585</span>
          </div>
        </div>

        {/* Right Side: Student Login Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          
          <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3 text-brand-primary">
            Dành cho học viên
          </h2>

          {error && (
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-3.5 mb-5 text-rose-600 text-xs font-bold flex items-start space-x-2 animate-shake">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                TÊN ĐĂNG NHẬP HỌC VIÊN
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên đăng nhập học viên"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-primary focus:bg-white rounded-2xl pl-10 pr-4 py-3.5 text-sm outline-none transition font-semibold text-slate-800"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                MẬT KHẨU
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-primary focus:bg-white rounded-2xl pl-10 pr-4 py-3.5 text-sm outline-none transition font-semibold text-slate-800"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white font-extrabold py-4 px-6 rounded-2xl shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer text-sm mt-2"
            >
              {loading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
              ) : (
                <>
                  <span>Đăng nhập Vào học →</span>
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
