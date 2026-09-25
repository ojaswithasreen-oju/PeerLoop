import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Zap,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
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
  const { currentUser, firebaseUser, signOut, switchDemoUser } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        return 'Home';
      case 'learn':
        return 'Explore Skills';
      case 'quick-help':
        return 'Quick Help';
      case 'sessions':
        return 'Sessions';
      case 'teach':
        return 'Teach';
      case 'community':
        return 'Community';
      case 'progress':
        return 'Progress';
      case 'saved':
        return 'Saved';
      case 'notifications':
        return 'Notifications';
      case 'profile':
        return 'Profile';
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
    <header className="h-16 px-4 sm:px-6 bg-white border-b border-[#E5EAE7] flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left: Page Title */}
      <div className="flex items-center gap-2 min-w-0">
        <h1 className="text-base sm:text-lg font-semibold text-[#1F2933] tracking-tight truncate">
          {getPageTitle(currentTab)}
        </h1>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search skills, mentors, resources..."
            className="w-full bg-[#F7F8F5] border border-[#E5EAE7] rounded-lg pl-9 pr-10 py-2 text-xs text-[#1F2933] placeholder-[#6B7280] focus:outline-none focus:border-[#3F6B5B] focus:bg-white transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-mono text-[#6B7280] bg-white px-1.5 py-0.5 rounded border border-[#E5EAE7]">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Help Button */}
        <button
          onClick={onOpenQuickHelp}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#DCE9E2] text-[#3F6B5B] hover:bg-[#3F6B5B] hover:text-white text-xs font-semibold transition-all cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">Quick Help</span>
        </button>

        {/* Notifications Icon Button */}
        <button
          onClick={() => onNavigate('notifications')}
          className="relative p-2 rounded-lg text-[#6B7280] hover:text-[#1F2933] hover:bg-[#F7F8F5] transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#3F6B5B] ring-2 ring-white" />
        </button>

        {/* User Profile Avatar with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#F7F8F5] transition-colors cursor-pointer"
          >
            <img
              src={
                currentUser?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
              }
              alt={currentUser?.fullName || 'User'}
              className="w-8 h-8 rounded-full object-cover border border-[#E5EAE7]"
            />
            <ChevronDown className="w-3.5 h-3.5 text-[#6B7280] hidden sm:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E5EAE7] rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in duration-100">
              <div className="px-3.5 py-2 border-b border-[#E5EAE7] mb-1">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-bold text-[#1F2933] truncate">
                    {currentUser?.fullName || 'Ojaswitha'}
                  </p>
                  {firebaseUser ? (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#DCE9E2] text-[#3F6B5B]">
                      Firebase
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#F7F8F5] text-[#6B7280] border border-[#E5EAE7]">
                      Demo
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#6B7280] truncate">
                  {firebaseUser?.email || currentUser?.course || 'CSE • AI/ML'}
                </p>
              </div>

              <button
                onClick={() => {
                  onNavigate('profile');
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#1F2933] hover:bg-[#F7F8F5] transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#3F6B5B]" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('progress');
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#1F2933] hover:bg-[#F7F8F5] transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#3F6B5B]" />
                <span>Progress</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('settings');
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#1F2933] hover:bg-[#F7F8F5] transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-[#6B7280]" />
                <span>Settings</span>
              </button>

              <div className="border-t border-[#E5EAE7] my-1" />

              <div className="px-3.5 py-1 text-[10px] uppercase font-semibold text-[#6B7280]">
                Switch Persona
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
                      ? 'text-[#3F6B5B] font-bold bg-[#DCE9E2]/50'
                      : 'text-[#6B7280] hover:text-[#1F2933] hover:bg-[#F7F8F5]'
                  }`}
                >
                  <img src={user.avatarUrl} alt="" className="w-4 h-4 rounded-full" />
                  <span className="truncate">{user.fullName}</span>
                </button>
              ))}

              <div className="border-t border-[#E5EAE7] my-1" />

              <button
                onClick={() => {
                  signOut();
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
