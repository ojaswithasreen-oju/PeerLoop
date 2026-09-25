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
    { id: 'progress', label: 'Progress', icon: TrendingUp },
  ];

  const secondaryNavItems = [
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col bg-[#FFFDF8] border-r border-[#DDD8CC] transition-all duration-200 z-30 select-none ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#DDD8CC]">
        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group overflow-hidden"
        >
          <div className="w-8 h-8 rounded-lg bg-[#4F6355] text-white flex items-center justify-center font-bold text-sm tracking-tight shrink-0 transition-transform group-hover:scale-105">
            P
          </div>

          {!collapsed && (
            <div className="flex items-center gap-1.5 transition-opacity duration-200">
              <span className="text-base font-bold text-[#26312B] tracking-tight">PeerLoop</span>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-[#737A72] hover:text-[#26312B] hover:bg-[#F5F1E8] transition-colors cursor-pointer"
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
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all group relative cursor-pointer ${
                  isActive
                    ? 'bg-[#DCE2D7] text-[#4F6355]'
                    : 'text-[#737A72] hover:text-[#26312B] hover:bg-[#F5F1E8]'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? 'text-[#4F6355]'
                      : item.highlight
                      ? 'text-[#4F6355]'
                      : 'text-[#737A72] group-hover:text-[#26312B]'
                  }`}
                />

                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}

                {!collapsed && item.highlight && !isActive && (
                  <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#DCE2D7] text-[#4F6355]">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="border-t border-[#DDD8CC] pt-4 space-y-1">
          {!collapsed && (
            <div className="px-3 pb-1.5 text-[11px] font-semibold text-[#737A72] tracking-tight">
              Library &amp; Activity
            </div>
          )}

          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all group relative cursor-pointer ${
                  isActive
                    ? 'bg-[#DCE2D7] text-[#4F6355]'
                    : 'text-[#737A72] hover:text-[#26312B] hover:bg-[#F5F1E8]'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-[#4F6355]' : 'text-[#737A72] group-hover:text-[#26312B]'
                  }`}
                />

                {!collapsed && <span className="truncate">{item.label}</span>}

                {item.badge && item.badge > 0 && (
                  <span
                    className={`ml-auto text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      collapsed
                        ? 'absolute top-1 right-1 w-2 h-2 p-0 bg-[#4F6355]'
                        : 'bg-[#DCE2D7] text-[#4F6355]'
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
      <div className="p-3 border-t border-[#DDD8CC] space-y-1 bg-[#F5F1E8]/70">
        <button
          onClick={() => onNavigate('profile')}
          className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors hover:bg-white cursor-pointer ${
            currentTab === 'profile' ? 'bg-[#DCE2D7] text-[#4F6355]' : 'text-[#26312B]'
          }`}
          title={collapsed ? currentUser?.fullName || 'Profile' : undefined}
        >
          <img
            src={
              currentUser?.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
            }
            alt={currentUser?.fullName || 'User'}
            className="w-8 h-8 rounded-full object-cover border border-[#DDD8CC] shrink-0"
          />

          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#26312B] truncate">
                {currentUser?.fullName || 'Ojaswitha'}
              </p>
              <p className="text-[11px] text-[#737A72] truncate">
                {currentUser?.college || 'UC Berkeley'}
              </p>
            </div>
          )}
        </button>

        <button
          onClick={() => onNavigate('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#737A72] hover:text-[#26312B] hover:bg-white transition-colors cursor-pointer ${
            currentTab === 'settings' ? 'text-[#4F6355] bg-[#DCE2D7] font-semibold' : ''
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
