import React from 'react';
import { Home, BookOpen, Zap, Video, GraduationCap, User } from 'lucide-react';

interface MobileNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onNavigate }) => {
  const items = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'quick-help', label: 'Help', icon: Zap },
    { id: 'teach', label: 'Teach', icon: GraduationCap },
    { id: 'sessions', label: 'Sessions', icon: Video },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F6F4EE]/95 border-t border-[#E3E1D9] backdrop-blur-md px-3 py-1.5 flex items-center justify-around shadow-xs">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          currentTab === item.id ||
          (item.id === 'dashboard' && currentTab === 'home') ||
          (item.id === 'profile' && (currentTab === 'settings' || currentTab === 'progress'));

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
              isActive
                ? 'text-[#496456] font-semibold'
                : 'text-[#69736D] hover:text-[#202924]'
            }`}
          >
            <Icon
              className={`w-4 h-4 ${
                isActive ? 'text-[#496456]' : 'text-[#69736D]'
              }`}
            />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
