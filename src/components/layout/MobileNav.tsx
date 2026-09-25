import React from 'react';
import { Home, BookOpen, Zap, Video, GraduationCap, Users } from 'lucide-react';

interface MobileNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onNavigate }) => {
  const items = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'quick-help', label: 'Quick Help', icon: Zap, highlight: true },
    { id: 'sessions', label: 'Sessions', icon: Video },
    { id: 'teach', label: 'Teach', icon: GraduationCap },
    { id: 'community', label: 'Community', icon: Users },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-[#E5EAE7] backdrop-blur-md px-2 py-1.5 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
              isActive
                ? 'text-[#3F6B5B] font-semibold'
                : 'text-[#6B7280] hover:text-[#1F2933]'
            }`}
          >
            <Icon
              className={`w-4 h-4 ${
                isActive
                  ? 'text-[#3F6B5B]'
                  : item.highlight
                  ? 'text-[#3F6B5B]'
                  : 'text-[#6B7280]'
              }`}
            />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
