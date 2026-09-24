import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Zap,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
  Command,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_USERS } from '../../services/seedData';

interface AppTopBarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenQuickHelp: () => void;
  onSearch?: (query: string) => void;
}

export const AppTopBar: React.FC<AppTopBarProps> = ({
  currentTab,
  onNavigate,
  onOpenQuickHelp,
  onSearch,
}) => {
  const { currentUser, firebaseUser, signInWithGoogle, signOut, switchDemoUser } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'Home Command Center';
      case 'learn':
        return 'Learn & Explore';
      case 'quick-help':
        return 'Quick Help';
      case 'sessions':
        return 'Learning Sessions';
      case 'teach':
        return 'Teaching Hub';
      case 'community':
        return 'Community Network';
      case 'progress':
        return 'My Progress';
      case 'saved':
        return 'Saved Library';
      case 'profile':
        return 'Student Profile';
      case 'settings':
        return 'Settings';
      default:
        return 'Workspace';
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchValue);
    if (searchValue.trim()) {
      onNavigate('learn');
    }
  };

  return (
    <header className="h-16 px-4 sm:px-6 bg-[#11182B] border-b border-[#1E2A47] flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left: Page Title / Breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs font-semibold text-[#94A3B8] hidden sm:inline">PeerLoop</span>
        <span className="text-xs text-[#94A3B8]/60 hidden sm:inline">/</span>
        <h1 className="text-sm sm:text-base font-bold text-[#F8FAFC] tracking-tight truncate">
          {getPageTitle(currentTab)}
        </h1>
      </div>

      {/* Center/Right: Search Bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search skills, mentors, resources..."
            className="w-full bg-[#0B1020] border border-[#1E2A47] rounded-xl pl-9 pr-12 py-2 text-xs text-[#F8FAFC] placeholder-[#94A3B8]/70 focus:outline-hidden focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-mono text-[#94A3B8] bg-[#151E33] px-1.5 py-0.5 rounded border border-[#1E2A47]">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Help Action Button */}
        <button
          onClick={onOpenQuickHelp}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white text-xs font-bold shadow-md shadow-[#8B5CF6]/25 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <Zap className="w-3.5 h-3.5 fill-current text-[#22D3EE]" />
          <span className="hidden sm:inline">Quick Help</span>
        </button>

        {/* Notifications Icon Button */}
        <button
          onClick={() => onNavigate('notifications')}
          className="relative p-2 rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151E33] transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#8B5CF6] ring-2 ring-[#11182B]" />
        </button>

        {/* User Profile Avatar with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-xl hover:bg-[#151E33] transition-colors cursor-pointer"
          >
            <img
              src={
                currentUser?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
              }
              alt={currentUser?.fullName || 'User'}
              className="w-8 h-8 rounded-lg object-cover border border-[#8B5CF6]/40"
            />
            <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] hidden sm:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#151E33] border border-[#1E2A47] rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3.5 py-2 border-b border-[#1E2A47] mb-1">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-bold text-[#F8FAFC] truncate">
                    {currentUser?.fullName || 'Ojaswitha'}
                  </p>
                  {firebaseUser ? (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Firebase
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      Demo
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#22D3EE] truncate">
                  {firebaseUser?.email || currentUser?.course || 'CSE • AI/ML'}
                </p>
              </div>

              {!firebaseUser && (
                <>
                  <button
                    onClick={async () => {
                      setProfileDropdownOpen(false);
                      try {
                        await signInWithGoogle();
                      } catch (e) {
                        console.error('Google Sign-in failed', e);
                      }
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#8B5CF6] hover:bg-[#11182B] transition-colors cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Sign in with Google</span>
                  </button>
                  <div className="border-t border-[#1E2A47] my-1" />
                </>
              )}

              <button
                onClick={() => {
                  onNavigate('profile');
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#11182B] transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('progress');
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#11182B] transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#22D3EE]" />
                <span>My Skills &amp; Goals</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('settings');
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#11182B] transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span>Settings</span>
              </button>

              <div className="border-t border-[#1E2A47] my-1" />

              <div className="px-3.5 py-1 text-[10px] uppercase font-bold text-[#94A3B8]/60">
                Switch Student Persona
              </div>

              {DEMO_USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    switchDemoUser(user.id);
                    setProfileDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3.5 py-1.5 text-xs transition-colors cursor-pointer ${
                    currentUser?.id === user.id
                      ? 'text-[#22D3EE] font-bold bg-[#11182B]'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#11182B]'
                  }`}
                >
                  <img src={user.avatarUrl} alt="" className="w-4 h-4 rounded-full" />
                  <span className="truncate">{user.fullName}</span>
                </button>
              ))}

              <div className="border-t border-[#1E2A47] my-1" />

              <button
                onClick={() => {
                  signOut();
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-rose-400 hover:bg-[#11182B] transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
