import React from 'react';
import {
  Home,
  BookOpen,
  Zap,
  Video,
  GraduationCap,
  Users,
  TrendingUp,
  Bookmark,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  Sparkles,
  Compass,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AppSidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  unreadCount?: number;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentTab,
  onNavigate,
  collapsed,
  onToggleCollapse,
  unreadCount = 2,
}) => {
  const { currentUser } = useAuth();

  const primaryNavItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'quick-help', label: 'Quick Help', icon: Zap, highlight: true },
    { id: 'sessions', label: 'Sessions', icon: Video },
    { id: 'teach', label: 'Teach', icon: GraduationCap },
    { id: 'community', label: 'Community', icon: Users },
  ];

  const secondaryNavItems = [
    { id: 'progress', label: 'My Progress', icon: TrendingUp },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'landing', label: 'Landing Page', icon: Compass },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col bg-[#11182B] border-r border-[#1E2A47] transition-all duration-200 z-30 select-none ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Sidebar Header & Brand Logo */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#1E2A47]">
        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 cursor-pointer group overflow-hidden"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/25 shrink-0 transition-transform group-hover:scale-105">
            <span className="font-extrabold text-white text-base tracking-tighter">P</span>
          </div>

          {!collapsed && (
            <div className="flex items-center gap-1.5 transition-opacity duration-200">
              <span className="text-base font-bold text-[#F8FAFC] tracking-tight">PeerLoop</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#8B5CF6]/20 text-[#22D3EE] border border-[#8B5CF6]/30 uppercase tracking-wider">
                EDU
              </span>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151E33] transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative cursor-pointer ${
                  isActive
                    ? 'bg-[#151E33] text-[#F8FAFC] border border-[#8B5CF6]/40 shadow-sm'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151E33]/60'
                }`}
                title={collapsed ? item.label : undefined}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-gradient-to-b from-[#8B5CF6] to-[#22D3EE]" />
                )}

                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive
                      ? 'text-[#22D3EE]'
                      : item.highlight
                      ? 'text-[#8B5CF6]'
                      : 'text-[#94A3B8] group-hover:text-[#F8FAFC]'
                  }`}
                />

                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}

                {!collapsed && item.highlight && (
                  <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/30">
                    Live
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="border-t border-[#1E2A47] pt-4 space-y-1">
          {!collapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]/70">
              Workspace
            </div>
          )}

          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative cursor-pointer ${
                  isActive
                    ? 'bg-[#151E33] text-[#F8FAFC] border border-[#8B5CF6]/40 shadow-sm'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151E33]/60'
                }`}
                title={collapsed ? item.label : undefined}
              >
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-gradient-to-b from-[#8B5CF6] to-[#22D3EE]" />
                )}

                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-[#22D3EE]' : 'text-[#94A3B8] group-hover:text-[#F8FAFC]'
                  }`}
                />

                {!collapsed && <span className="truncate">{item.label}</span>}

                {/* Badge indicator */}
                {item.badge && item.badge > 0 && (
                  <span
                    className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      collapsed
                        ? 'absolute top-1 right-1 w-2 h-2 p-0 bg-[#8B5CF6]'
                        : 'bg-[#8B5CF6] text-white'
                    }`}
                  >
                    {!collapsed && item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Profile & Settings Section */}
      <div className="p-3 border-t border-[#1E2A47] space-y-2 bg-[#0B1020]/40">
        <button
          onClick={() => onNavigate('profile')}
          className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition-colors hover:bg-[#151E33] ${
            currentTab === 'profile' ? 'bg-[#151E33] border border-[#1E2A47]' : ''
          }`}
          title={collapsed ? currentUser?.fullName || 'Profile' : undefined}
        >
          <img
            src={
              currentUser?.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
            }
            alt={currentUser?.fullName || 'User'}
            className="w-8 h-8 rounded-lg object-cover border border-[#8B5CF6]/40 shrink-0"
          />

          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#F8FAFC] truncate">
                {currentUser?.fullName || 'Ojaswitha'}
              </p>
              <p className="text-[11px] text-[#22D3EE] truncate">
                {currentUser?.college || 'UC Berkeley'}
              </p>
            </div>
          )}
        </button>

        <button
          onClick={() => onNavigate('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151E33] transition-colors ${
            currentTab === 'settings' ? 'text-[#F8FAFC] bg-[#151E33]' : ''
          }`}
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
};
