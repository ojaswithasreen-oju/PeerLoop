import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  Video,
  Users,
  FolderGit2,
  Bell,
  Search,
  Check,
  LogOut,
  User,
  Plus,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/storeService';
import { DEMO_USERS } from '../../services/seedData';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenQuickDoubt: () => void;
  onOpenAuth: () => void;
  onOpenProfile: (userId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenQuickDoubt,
  onOpenAuth,
  onOpenProfile,
}) => {
  const { currentUser, activeMode, switchActiveMode, signOut, switchDemoUser } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const notifications = currentUser ? store.getNotifications(currentUser.id) : [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: BookOpen },
    { id: 'learn', label: 'Learn', icon: GraduationCap },
    { id: 'teach', label: 'Teach', icon: Sparkles },
    { id: 'sessions', label: 'Sessions', icon: Video },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'resources', label: 'Resources', icon: FolderGit2 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-white text-lg tracking-tighter">P</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-white tracking-tight">PeerLoop</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Learn • Teach • Practice</p>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  {item.label}
                </button>
              );
            })}
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:bg-slate-900 transition-colors cursor-pointer"
              title="View Product Landing Page"
            >
              <span>Landing Page</span>
            </button>
          </nav>
        </div>

        {/* Right Section Controls */}
        <div className="flex items-center gap-3">
          {/* Mode Switcher (Learn vs Teach) */}
          {currentUser && (
            <div className="hidden lg:flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs font-medium">
              <button
                onClick={() => switchActiveMode('learner')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeMode === 'learner'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Learn Mode
              </button>
              <button
                onClick={() => switchActiveMode('mentor')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeMode === 'mentor'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Teach Mode
              </button>
            </div>
          )}

          {/* Quick Doubt CTA */}
          <button
            onClick={onOpenQuickDoubt}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all hover:shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Ask Quick Doubt</span>
            <span className="sm:hidden">Doubt</span>
          </button>

          {/* Demo User Switcher Dropdown (Fast test drive) */}
          <div className="relative">
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 font-medium"
              title="Switch demo persona for testing"
            >
              <span className="text-slate-500">Persona:</span>
              <span className="text-indigo-400 max-w-[85px] truncate">
                {currentUser?.fullName.split(' ')[0] || 'Guest'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showDemoMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50">
                <div className="px-3 py-1.5 border-b border-slate-800 text-xs font-semibold text-slate-400">
                  Switch Persona (Instant Testing)
                </div>
                {DEMO_USERS.map((demo) => (
                  <button
                    key={demo.id}
                    onClick={() => {
                      switchDemoUser(demo.id);
                      setShowDemoMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-800/80 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={demo.avatarUrl}
                        alt={demo.fullName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-xs font-medium text-white">{demo.fullName}</p>
                        <p className="text-[10px] text-slate-400">
                          {demo.course} • {demo.college}
                        </p>
                      </div>
                    </div>
                    {currentUser?.id === demo.id && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-900/60">
                  <span className="text-xs font-bold text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => currentUser && store.markAllNotificationsAsRead(currentUser.id)}
                      className="text-[11px] text-indigo-400 hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => store.markNotificationAsRead(notif.id)}
                        className={`p-3 text-left hover:bg-slate-800/50 cursor-pointer transition-colors ${
                          !notif.isRead ? 'bg-indigo-950/20' : ''
                        }`}
                      >
                        <p className="text-xs font-semibold text-slate-200">{notif.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{notif.message}</p>
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          {new Date(notif.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu / Avatar */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-indigo-500/50 transition-all"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  className="w-8 h-8 rounded-full object-cover border border-slate-700"
                />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-sm font-semibold text-white truncate">{currentUser.fullName}</p>
                    <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                    <span className="mt-1 inline-block text-[10px] text-indigo-400 bg-indigo-950/50 border border-indigo-800/40 px-1.5 py-0.5 rounded font-mono">
                      Reputation: {currentUser.reputation.score}/100
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onOpenProfile(currentUser.id);
                      setShowUserMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    My Student Profile
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('onboarding');
                      setShowUserMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    Edit Goals & Skills
                  </button>

                  <div className="border-t border-slate-800 mt-1 pt-1">
                    <button
                      onClick={() => {
                        signOut();
                        setShowUserMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs text-rose-400 hover:bg-rose-950/20 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
