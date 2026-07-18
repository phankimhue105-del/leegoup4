/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserSession, VocabularyProgress, GrammarProgress, TestResult } from '../types';

const USER_SESSION_KEY = 'leego_user_session';
const USERS_DB_KEY = 'leego_users_db_v2';
const GUEST_MODE_KEY = 'leego_guest_mode_enabled';
const APPS_SCRIPT_URL_KEY = 'leego_apps_script_url';

export interface UserAccount {
  username: string;
  password?: string;
  fullName: string;
  role: 'admin' | 'student' | 'guest';
  avatarUrl: string;
  points: number;
  streak: number;
  status: 'active' | 'locked';
  completedLessons: string[];
  vocabularyProgress?: Record<string, VocabularyProgress>;
  grammarProgress?: Record<string, GrammarProgress>;
  testResults?: Record<string, TestResult>;
  speakingResults?: Record<string, any>;
  badges?: string[];
  createdAt: string;
}

// Initial seed data for immediate offline usage and testing
const defaultUsers: UserAccount[] = [
  {
    username: 'admin',
    password: 'leego',
    fullName: 'Cô Kim Huệ (Manager)',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60',
    points: 0,
    streak: 0,
    status: 'active',
    completedLessons: [],
    createdAt: new Date().toISOString()
  },
  {
    username: 'leego2026',
    password: 'leego',
    fullName: 'Nguyễn Minh Quân',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=60',
    points: 1250,
    streak: 5,
    status: 'active',
    completedLessons: ['unit-1-lesson-1', 'unit-1-lesson-2'],
    createdAt: new Date().toISOString()
  },
  {
    username: 'hs002',
    password: '123',
    fullName: 'Trần Bảo Nam',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
    points: 450,
    streak: 3,
    status: 'active',
    completedLessons: ['unit-1-lesson-1'],
    createdAt: new Date().toISOString()
  },
  {
    username: 'hs003',
    password: '123',
    fullName: 'Lê Quỳnh Chi',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60',
    points: 1980,
    streak: 8,
    status: 'active',
    completedLessons: ['unit-1-lesson-1', 'unit-1-lesson-2', 'unit-2-lesson-1'],
    createdAt: new Date().toISOString()
  }
];

export const defaultStudentSession: UserSession = {
  username: 'leego2026',
  fullName: 'Nguyễn Minh Quân',
  role: 'student',
  avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=60',
  points: 1250,
  streak: 5,
  completedLessons: ['unit-1-lesson-1', 'unit-1-lesson-2'],
  lastActiveDate: new Date().toISOString().split('T')[0]
};

export const defaultAdminSession: UserSession = {
  username: 'admin',
  fullName: 'Cô Kim Huệ (Manager)',
  role: 'admin',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60',
  points: 0,
  streak: 0,
  completedLessons: [],
  lastActiveDate: new Date().toISOString().split('T')[0]
};

export const defaultGuestSession: UserSession = {
  username: 'guest_leego',
  fullName: 'Khách Trải Nghiệm',
  role: 'guest',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
  points: 100,
  streak: 1,
  completedLessons: [],
  lastActiveDate: new Date().toISOString().split('T')[0]
};

// Local storage cache managers
export const getUsersDB = (): UserAccount[] => {
  const db = localStorage.getItem(USERS_DB_KEY);
  if (!db) {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  try {
    return JSON.parse(db);
  } catch (e) {
    return defaultUsers;
  }
};

export const saveUsersDB = (users: UserAccount[]) => {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
};

export const isGuestModeEnabled = (): boolean => {
  const config = localStorage.getItem(GUEST_MODE_KEY);
  return config === null ? true : config === 'true';
};

export const setGuestModeEnabled = (enabled: boolean) => {
  localStorage.setItem(GUEST_MODE_KEY, String(enabled));
};

export const getAppsScriptURL = (): string => {
  const url = localStorage.getItem(APPS_SCRIPT_URL_KEY);
  return url || '';
};

export const saveAppsScriptURL = (url: string) => {
  localStorage.setItem(APPS_SCRIPT_URL_KEY, url);
};

export const loadUserSession = (): UserSession | null => {
  const session = localStorage.getItem(USER_SESSION_KEY);
  if (!session) return null;
  try {
    return JSON.parse(session);
  } catch (e) {
    return null;
  }
};

export const saveUserSession = (session: UserSession) => {
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
  
  // Also synchronize back into the local users DB to maintain offline persistence parity
  const users = getUsersDB();
  const index = users.findIndex(u => u.username === session.username);
  if (index !== -1) {
    users[index] = {
      ...users[index],
      fullName: session.fullName,
      points: session.points,
      streak: session.streak,
      completedLessons: session.completedLessons,
      vocabularyProgress: session.vocabularyProgress,
      grammarProgress: session.grammarProgress,
      testResults: session.testResults,
      speakingResults: session.speakingResults,
      badges: session.badges
    };
    saveUsersDB(users);
    
    // Auto-sync single student progress to Google Sheets if active
    googleSheetsService.syncProgressToGoogleSheets(session).catch(err => {
      console.warn('Auto-sync to Google Sheets failed:', err.message);
    });
  }
};

export const clearUserSession = () => {
  localStorage.removeItem(USER_SESSION_KEY);
};

// API Client layer supporting both Local CRUD Cache & Google Sheets remote syncing
export const googleSheetsService = {
  // Pulls fresh users from Sheets and caches locally
  async fetchUsersFromSheets(): Promise<UserAccount[]> {
    const url = getAppsScriptURL();
    if (!url) {
      return getUsersDB();
    }
    
    try {
      const response = await fetch(`${url}?action=get_users`);
      if (!response.ok) throw new Error('Yêu cầu không thành công');
      const data = await response.json();
      if (Array.isArray(data)) {
        // Map any spreadsheet missing attributes and save to cache
        const parsedUsers = data.map((u: any) => ({
          username: String(u.username || ''),
          password: String(u.password || '123'),
          fullName: String(u.fullName || ''),
          role: (u.role || 'student') as any,
          avatarUrl: String(u.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150'),
          points: Number(u.points || 0),
          streak: Number(u.streak || 0),
          status: (u.status || 'active') as any,
          completedLessons: typeof u.completedLessons === 'string' 
            ? u.completedLessons.split(',').filter(Boolean)
            : Array.isArray(u.completedLessons) ? u.completedLessons : [],
          createdAt: String(u.createdAt || new Date().toISOString())
        }));
        saveUsersDB(parsedUsers);
        return parsedUsers;
      }
      return getUsersDB();
    } catch (e: any) {
      console.warn('Apps Script sync fetch failed, using local cache:', e.message);
      return getUsersDB();
    }
  },

  // Performs validation against local DB + optional sheets verification
  async loginWithCredentials(username: string, password?: string): Promise<UserSession> {
    // If username is empty, abort
    if (!username.trim()) {
      throw new Error('Tên đăng nhập không được để trống!');
    }

    // Attempt to pull latest users from Sheets if URL configured
    await this.fetchUsersFromSheets().catch(() => {});

    const users = getUsersDB();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase().trim());

    if (!user) {
      throw new Error('Tên đăng nhập không tồn tại trên hệ thống!');
    }

    if (user.status === 'locked') {
      throw new Error('Tài khoản của con đã bị khóa! Vui lòng liên hệ giáo viên LeeGo: 0988.526.585 để được mở khóa.');
    }

    // Admins and Students MUST supply password
    if (user.role === 'admin' || user.role === 'student') {
      const providedPass = password || '';
      const savedPass = user.password || '';
      if (providedPass !== savedPass) {
        throw new Error('Mật khẩu của con chưa chính xác!');
      }
    }

    // Build Session
    const session: UserSession = {
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      points: user.points,
      streak: user.streak,
      completedLessons: user.completedLessons,
      vocabularyProgress: user.vocabularyProgress || {},
      grammarProgress: user.grammarProgress || {},
      testResults: user.testResults || {},
      speakingResults: user.speakingResults || {},
      badges: user.badges || [],
      lastActiveDate: new Date().toISOString().split('T')[0]
    };

    saveUserSession(session);
    return session;
  },

  // Sync single student progress to the Google Sheet (via background POST)
  async syncProgressToGoogleSheets(session: UserSession): Promise<boolean> {
    const url = getAppsScriptURL();
    if (!url) {
      console.log('Skipping real Sheets sync (URL not configured)');
      return false;
    }

    try {
      const payload = {
        action: 'sync_progress',
        username: session.username,
        points: session.points,
        streak: session.streak,
        completedLessons: session.completedLessons.join(','),
        vocabularyProgress: JSON.stringify(session.vocabularyProgress || {}),
        grammarProgress: JSON.stringify(session.grammarProgress || {}),
        testResults: JSON.stringify(session.testResults || {}),
        speakingResults: JSON.stringify(session.speakingResults || {})
      };

      const response = await fetch(url, {
        method: 'POST',
        mode: 'no-cors', // handle Apps Script redirect standard
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return true;
    } catch (e: any) {
      console.warn('Apps Script background push failed:', e.message);
      return false;
    }
  },

  // Creates user locally and pushes to Google Sheets
  async createUser(user: UserAccount): Promise<boolean> {
    const users = getUsersDB();
    if (users.some(u => u.username.toLowerCase() === user.username.toLowerCase())) {
      throw new Error(`Tên đăng nhập "${user.username}" đã tồn tại!`);
    }

    users.push(user);
    saveUsersDB(users);

    const url = getAppsScriptURL();
    if (url) {
      try {
        await fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create_user',
            user: {
              ...user,
              completedLessons: user.completedLessons.join(',')
            }
          })
        });
      } catch (err) {
        console.warn('Create user sheets sync failed:', err);
      }
    }
    return true;
  },

  // Updates user details locally and syncs to Sheets
  async updateUser(username: string, updates: Partial<UserAccount>): Promise<boolean> {
    const users = getUsersDB();
    const index = users.findIndex(u => u.username === username);
    if (index === -1) throw new Error('Không tìm thấy người dùng');

    users[index] = {
      ...users[index],
      ...updates
    };
    saveUsersDB(users);

    const url = getAppsScriptURL();
    if (url) {
      try {
        await fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update_user',
            username,
            updates: {
              ...updates,
              completedLessons: updates.completedLessons ? updates.completedLessons.join(',') : undefined
            }
          })
        });
      } catch (err) {
        console.warn('Update user sheets sync failed:', err);
      }
    }
    return true;
  },

  // Deletes user locally and deletes on Sheets
  async deleteUser(username: string): Promise<boolean> {
    let users = getUsersDB();
    users = users.filter(u => u.username !== username);
    saveUsersDB(users);

    const url = getAppsScriptURL();
    if (url) {
      try {
        await fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'delete_user',
            username
          })
        });
      } catch (err) {
        console.warn('Delete user sheets sync failed:', err);
      }
    }
    return true;
  }
};

export const loadAdminMetrics = (): { totalStudents: number; activeToday: number; averageProgress: number } => {
  const users = getUsersDB();
  const students = users.filter(u => u.role === 'student');
  const activeCount = users.filter(u => u.status === 'active').length;
  
  // Calculate average completion rate of 32 total lessons (syllabus)
  const totalLessons = 32;
  const totalProgress = students.reduce((acc, u) => acc + (u.completedLessons.length / totalLessons), 0);
  const averageProgress = students.length > 0 ? Math.round((totalProgress / students.length) * 100) : 0;

  return {
    totalStudents: students.length,
    activeToday: activeCount,
    averageProgress: Math.min(averageProgress, 100)
  };
};
