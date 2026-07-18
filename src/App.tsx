/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserSession } from './types';
import { loadUserSession, saveUserSession, clearUserSession } from './lib/storage';
import Header from './components/Header';
import Footer from './components/Footer';
import WelcomeScreen from './components/WelcomeScreen';
import DashboardScreen from './components/DashboardScreen';
import LearningScreen from './components/LearningScreen';

export default function App() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'learning' | 'admin'>('dashboard');
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  // Load session from localStorage on startup
  useEffect(() => {
    const activeSession = loadUserSession();
    if (activeSession) {
      setSession(activeSession);
    }
  }, []);

  const handleLoginSuccess = (newSession: UserSession) => {
    setSession(newSession);
    saveUserSession(newSession);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    clearUserSession();
    setSession(null);
    setCurrentView('dashboard');
    setSelectedUnitId(null);
  };

  const handleUpdateSession = (updatedSession: UserSession) => {
    setSession(updatedSession);
    saveUserSession(updatedSession);
  };

  const handleNavigate = (view: 'dashboard' | 'learning' | 'admin') => {
    setCurrentView(view);
  };

  const handleSelectUnit = (unitId: string) => {
    setSelectedUnitId(unitId);
    setCurrentView('learning');
  };

  return (
    <div id="app-root" className="min-h-screen flex flex-col bg-slate-50/50">
      
      {/* Dynamic Header */}
      <Header
        session={session}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        currentView={currentView}
      />

      {/* Main Content Area */}
      <main className="flex-grow py-6 sm:py-10">
        {!session ? (
          <WelcomeScreen onLoginSuccess={handleLoginSuccess} />
        ) : (
          <>
            {currentView === 'dashboard' && (
              <DashboardScreen
                session={session}
                onNavigate={handleNavigate}
                onSelectUnit={handleSelectUnit}
                onUpdateSession={handleUpdateSession}
              />
            )}
            {currentView === 'learning' && (
              <LearningScreen
                session={session}
                onUpdateSession={handleUpdateSession}
                selectedUnitId={selectedUnitId}
              />
            )}
            {currentView === 'admin' && (
              <DashboardScreen
                session={session}
                onNavigate={handleNavigate}
                onSelectUnit={handleSelectUnit}
                onUpdateSession={handleUpdateSession}
              />
            )}
          </>
        )}
      </main>

      {/* Dynamic Footer */}
      <Footer />

    </div>
  );
}
