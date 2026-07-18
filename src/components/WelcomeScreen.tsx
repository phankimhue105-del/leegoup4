/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserRole, UserSession } from '../types';
import { defaultStudentSession, defaultAdminSession, defaultGuestSession, googleSheetsService, isGuestModeEnabled } from '../lib/storage';
import { Sparkles, GraduationCap, ArrowRight, Phone, MessageSquare, AlertCircle, KeyRound, Globe, Play } from 'lucide-react';

interface WelcomeScreenProps {
  onLoginSuccess: (session: UserSession) => void;
}

export default function WelcomeScreen({ onLoginSuccess }: WelcomeScreenProps) {
  const [studentUsername, setStudentUsername] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Custom credentials for manual Admin/Teacher sign-in
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Handles standard student login
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentUsername.trim()) {
      setError('Hãy nhập tên đăng nhập của con!');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const session = await googleSheetsService.loginWithCredentials(studentUsername, studentPassword);
      if (session.role === 'admin') {
        setError('Tài khoản này là Admin, vui lòng đăng nhập bên tab Giáo viên!');
        setLoading(false);
        return;
      }
      onLoginSuccess(session);
    } catch (err: any) {
      setError(err.message || 'Tên đăng nhập hoặc mật khẩu không đúng!');
    } finally {
      setLoading(false);
    }
  };

  // Handles admin login
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUsername.trim()) {
      setError('Hãy nhập tài khoản quản trị!');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const session = await googleSheetsService.loginWithCredentials(adminUsername, adminPassword);
      if (session.role !== 'admin') {
        setError('Tài khoản này không có quyền quản trị/giáo viên!');
        setLoading(false);
        return;
      }
      onLoginSuccess(session);
    } catch (err: any) {
      setError(err.message || 'Tài khoản hoặc mật khẩu không đúng!');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = () => {
    if (!isGuestModeEnabled()) {
      setError('Chế độ trải nghiệm khách (Guest Mode) đang bị Giáo viên tạm khóa. Vui lòng liên hệ giáo viên LeeGo: 0988.526.585 để nhận tài khoản học nhé!');
      return;
    }
    onLoginSuccess(defaultGuestSession);
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

      {/* Welcome Layout Card */}
      <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: Brand Visual Card */}
        <div className="bg-gradient-to-br from-brand-primary to-brand-orange p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Background circles */}
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
              <div className="flex items-center space-x-2 text-xs font-semibold bg-white/10 p-2 rounded-xl border border-white/10">
                <span className="bg-brand-yellow text-slate-900 rounded-full w-4 h-4 flex items-center justify-center text-[10px]">3</span>
                <span>Đồng bộ tiến độ học Google Sheets</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 pt-6 border-t border-white/20 flex items-center justify-between">
            <span className="text-xs font-bold text-brand-yellow">Hotline hỗ trợ:</span>
            <span className="text-sm font-extrabold">0988.526.585</span>
          </div>
        </div>

        {/* Right Side: Auth / Login Modes */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          
          {/* Tabs for Login Type */}
          <div className="flex border-b border-slate-100 mb-6">
            <button
              onClick={() => { setIsAdminMode(false); setError(null); }}
              className={`flex-1 pb-3 text-sm font-bold border-b-2 transition ${
                !isAdminMode
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Dành Cho Học Viên
            </button>
            <button
              onClick={() => { setIsAdminMode(true); setError(null); }}
              className={`flex-1 pb-3 text-sm font-bold border-b-2 transition ${
                isAdminMode
                  ? 'border-brand-purple text-brand-purple'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Giáo Viên / Quản Trị
            </button>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-3.5 mb-5 text-rose-600 text-xs font-medium flex items-start space-x-2 animate-shake">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Student Form */}
          {!isAdminMode ? (
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Tên đăng nhập học viên:
                </label>
                <input
                  type="text"
                  value={studentUsername}
                  onChange={(e) => setStudentUsername(e.target.value)}
                  placeholder="Ví dụ: leego2026, hs002..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-primary focus:bg-white rounded-2xl px-4 py-3 text-sm outline-none transition font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Mật khẩu:
                </label>
                <input
                  type="password"
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  placeholder="Nhập mật khẩu học viên"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-primary focus:bg-white rounded-2xl px-4 py-3 text-sm outline-none transition font-semibold"
                />
                <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                  💡 Sử dụng tài khoản mặc định: đăng nhập <strong>leego2026</strong> mật khẩu <strong>leego</strong> để trải nghiệm nhanh.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                ) : (
                  <>
                    <span>Đăng nhập Vào Học</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
              
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Hoặc</span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>

              {/* Guest / Demo Access */}
              <button
                type="button"
                onClick={handleGuestAccess}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-3.5 px-6 rounded-2xl transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Play className="h-4 w-4 text-brand-secondary fill-brand-secondary" />
                <span>Trải Nghiệm Khách (Guest)</span>
              </button>
            </form>
          ) : (
            /* Admin Form */
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Tài khoản Giáo viên / Quản trị:
                </label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="Tài khoản Admin"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-purple focus:bg-white rounded-2xl px-4 py-3 text-sm outline-none transition font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Mật khẩu:
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-purple focus:bg-white rounded-2xl px-4 py-3 text-sm outline-none transition font-semibold"
                />
                <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                  💡 Đăng nhập nhanh Quản trị: tài khoản <strong>admin</strong> mật khẩu <strong>leego</strong>.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-purple hover:bg-purple-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4" />
                    <span>Đăng nhập Giáo Viên</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
