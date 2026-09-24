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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#11182B]/95 border-t border-[#1E2A47] backdrop-blur-lg px-2 py-1.5 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
              isActive
                ? 'text-[#22D3EE]'
                : item.highlight
                ? 'text-[#8B5CF6]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Icon
              className={`w-4 h-4 ${
                isActive
                  ? 'text-[#22D3EE]'
                  : item.highlight
                  ? 'text-[#8B5CF6]'
                  : 'text-[#94A3B8]'
              }`}
            />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
