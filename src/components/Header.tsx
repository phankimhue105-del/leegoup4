/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserSession } from '../types';
import { Flame, Trophy, LogOut, GraduationCap, Phone, ShieldCheck, User } from 'lucide-react';

interface HeaderProps {
  session: UserSession | null;
  onLogout: () => void;
  onNavigate: (view: 'dashboard' | 'learning' | 'admin') => void;
  currentView: string;
}

export default function Header({ session, onLogout, onNavigate, currentView }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="bg-brand-primary/10 p-2 rounded-xl text-brand-primary animate-pulse">
            <GraduationCap className="h-7 w-7" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg sm:text-xl text-slate-800 tracking-tight flex items-center gap-1.5">
              Anh ngữ <span className="text-brand-primary">LeeGo</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium hidden sm:block">Everybody Up 4 Portal</p>
          </div>
        </div>

        {/* Center Support Hotline (Rule C) */}
        <div className="hidden md:flex items-center space-x-2 bg-slate-50 px-3 h-9 rounded-full border border-slate-100">
          <Phone className="h-3.5 w-3.5 text-brand-secondary" />
          <span className="text-xs font-semibold text-slate-600">
            Hotline: <a href="tel:0988526585" className="hover:text-brand-primary text-brand-secondary transition">0988.526.585</a>
          </span>
        </div>

        {/* User Session Info / Badges */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {session ? (
            <>
              {/* Navigation Actions */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition ${
                    currentView === 'dashboard'
                      ? 'bg-brand-blue text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Bảng điều khiển
                </button>
                
                {session.role !== 'admin' && (
                  <button
                    onClick={() => onNavigate('learning')}
                    className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition ${
                      currentView === 'learning'
                        ? 'bg-brand-secondary text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Vào Học 🚀
                  </button>
                )}

                {session.role === 'admin' && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition ${
                      currentView === 'admin'
                        ? 'bg-brand-purple text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Quản trị viên
                  </button>
                )}
              </div>

              {/* Progress Counters (Student or Guest) */}
              {session.role !== 'admin' && (
                <div className="flex items-center space-x-1.5 sm:space-x-2.5 bg-slate-50 px-2.5 py-1.5 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-1 text-amber-500 font-bold text-xs sm:text-sm" title="Streak ngày học">
                    <Flame className="h-4 w-4 fill-amber-500 animate-bounce" />
                    <span>{session.streak}</span>
                  </div>
                  <div className="h-4 w-[1px] bg-slate-200"></div>
                  <div className="flex items-center space-x-1 text-brand-primary font-bold text-xs sm:text-sm" title="Điểm tích luỹ">
                    <Trophy className="h-4 w-4 text-brand-yellow fill-brand-yellow" />
                    <span>{session.points}</span>
                  </div>
                </div>
              )}

              {/* Profile Avatar / Role Badge */}
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <img
                    src={session.avatarUrl}
                    alt={session.fullName}
                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border-2 border-brand-primary object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1">
                    {session.role === 'admin' ? (
                      <div className="bg-brand-purple text-white p-0.5 rounded-full border border-white" title="Quản trị">
                        <ShieldCheck className="h-3 w-3" />
                      </div>
                    ) : session.role === 'guest' ? (
                      <div className="bg-amber-400 text-white p-0.5 rounded-full border border-white" title="Khách">
                        <User className="h-3 w-3" />
                      </div>
                    ) : (
                      <div className="bg-brand-secondary text-white p-0.5 rounded-full border border-white" title="Học viên">
                        <GraduationCap className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Name / Logout button */}
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-slate-800 leading-3">{session.fullName}</p>
                  <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                    {session.role === 'admin' ? 'Giáo viên/Admin' : session.role === 'guest' ? 'Khách trải nghiệm' : 'Học viên'}
                  </span>
                </div>

                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-brand-primary rounded-lg hover:bg-slate-50 transition"
                  title="Đăng xuất"
                >
                  <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </>
          ) : (
            /* Login Hotline fallback for guest-only header style */
            <div className="flex items-center space-x-2">
              <Phone className="h-3.5 w-3.5 text-brand-primary animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-slate-600">
                0988.526.585
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
