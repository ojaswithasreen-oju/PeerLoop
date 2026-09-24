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
  Compass,
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
  const { currentUser, firebaseUser, signOut, switchDemoUser } = useAuth();
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
        {/* Landing Page Switch Option */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-[#1E2A47] hover:border-[#22D3EE]/50 bg-[#151E33]/70 hover:bg-[#151E33] text-[#94A3B8] hover:text-[#22D3EE] text-xs font-semibold transition-all cursor-pointer shadow-xs"
          title="Switch to Landing Page"
        >
          <Compass className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span className="hidden sm:inline">Landing Page</span>
        </button>

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

              <button
                onClick={() => {
                  onNavigate('landing');
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#22D3EE] hover:bg-[#11182B] transition-colors cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-[#22D3EE]" />
                <span>View Landing Page</span>
              </button>

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
