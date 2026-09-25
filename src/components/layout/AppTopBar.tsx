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
  TrendingUp,
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

  const navLinks = [
    { id: 'dashboard', label: 'Home' },
    { id: 'learn', label: 'Learn' },
    { id: 'quick-help', label: 'Quick Help' },
    { id: 'sessions', label: 'Sessions' },
    { id: 'teach', label: 'Teach' },
    { id: 'community', label: 'Community' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchValue);
    if (searchValue.trim()) {
      onNavigate('learn');
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#F6F4EE]/95 backdrop-blur-md border-b border-[#E3E1D9] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-[#496456] text-white flex items-center justify-center font-bold text-sm tracking-tight transition-transform group-hover:scale-105">
            P
          </div>
          <span className="text-xl font-bold tracking-tight text-[#202924]">
            PeerLoop
          </span>
        </div>

        {/* Desktop Primary Top Navigation: Home · Learn · Quick Help · Sessions · Teach · Community */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#DCE6DE] text-[#496456]'
                    : 'text-[#69736D] hover:text-[#202924] hover:bg-white/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Search · Notifications · Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-48 lg:w-60">
            <Search className="w-3.5 h-3.5 text-[#69736D] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search skills, peers..."
              className="w-full bg-white border border-[#E3E1D9] rounded-lg pl-8 pr-8 py-1.5 text-xs text-[#202924] placeholder-[#69736D] focus:outline-none focus:border-[#496456] transition-colors"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#69736D] bg-[#F6F4EE] px-1 rounded border border-[#E3E1D9]">
              ⌘K
            </div>
          </form>

          {/* Quick Help Shortcut CTA button */}
          <button
            onClick={onOpenQuickHelp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#DCE6DE] hover:bg-[#cde0d1] text-[#496456] text-xs font-semibold transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Ask Doubt</span>
          </button>

          {/* Notifications */}
          <button
            onClick={() => onNavigate('notifications')}
            className="relative p-2 rounded-lg text-[#69736D] hover:text-[#202924] hover:bg-white transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#496456] ring-2 ring-[#F6F4EE]" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-white transition-colors cursor-pointer"
            >
              <img
                src={
                  currentUser?.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                }
                alt={currentUser?.fullName || 'User'}
                className="w-8 h-8 rounded-full object-cover border border-[#E3E1D9]"
              />
              <ChevronDown className="w-3.5 h-3.5 text-[#69736D] hidden sm:block" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E3E1D9] rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in duration-100">
                <div className="px-3.5 py-2 border-b border-[#E3E1D9] mb-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-[#202924] truncate">
                      {currentUser?.fullName || 'Ojaswitha'}
                    </p>
                    {firebaseUser ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#DCE6DE] text-[#496456]">
                        Firebase
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#F6F4EE] text-[#69736D] border border-[#E3E1D9]">
                        Demo
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#69736D] truncate">
                    {firebaseUser?.email || currentUser?.course || 'CSE • AI/ML'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    onNavigate('profile');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#202924] hover:bg-[#F6F4EE] transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#496456]" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('progress');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#202924] hover:bg-[#F6F4EE] transition-colors cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-[#496456]" />
                  <span>Progress</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('saved');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#202924] hover:bg-[#F6F4EE] transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#496456]" />
                  <span>Saved Library</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('settings');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#202924] hover:bg-[#F6F4EE] transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-[#69736D]" />
                  <span>Settings</span>
                </button>

                <div className="border-t border-[#E3E1D9] my-1" />

                <div className="px-3.5 py-1 text-[10px] uppercase font-semibold text-[#69736D]">
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
                        ? 'text-[#496456] font-bold bg-[#DCE6DE]/50'
                        : 'text-[#69736D] hover:text-[#202924] hover:bg-[#F6F4EE]'
                    }`}
                  >
                    <img src={user.avatarUrl} alt="" className="w-4 h-4 rounded-full" />
                    <span className="truncate">{user.fullName}</span>
                  </button>
                ))}

                <div className="border-t border-[#E3E1D9] my-1" />

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
      </div>
    </header>
  );
};
