import React from 'react';
import {
  TrendingUp,
  Award,
  Sparkles,
  Clock,
  CheckCircle2,
  Flame,
  Star,
  BookOpen,
  Users,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProgressView: React.FC = () => {
  const { currentUser } = useAuth();

  const skillsInProgress = [
    {
      name: 'Python — Nested Loops & Comprehensions',
      progress: 68,
      category: 'Programming',
      hoursSpent: 14.5,
      mentor: 'Rahul',
      status: 'Active',
    },
    {
      name: 'Web Development — Full-Stack APIs',
      progress: 60,
      category: 'Web Dev',
      hoursSpent: 12.0,
      mentor: 'Maya',
      status: 'Active',
    },
    {
      name: 'Data Structures — Binary Search Trees',
      progress: 35,
      category: 'Algorithms',
      hoursSpent: 8.0,
      mentor: 'David',
      status: 'Next Up',
    },
    {
      name: 'UI/UX Design Systems in Figma',
      progress: 90,
      category: 'Design',
      hoursSpent: 18.0,
      mentor: 'Self / Mentoring',
      status: 'Mastered',
    },
  ];

  const badges = [
    {
      name: 'Rising Mentor',
      desc: 'Maintained 4.8+ rating across first 10 peer teaching sessions',
      icon: '✨',
      rarity: 'Common',
      earned: 'Aug 2026',
    },
    {
      name: 'Clarity Champion',
      desc: 'Awarded for explaining complex concepts in under 15 minutes',
      icon: '🔥',
      rarity: 'Rare',
      earned: 'Sep 2026',
    },
    {
      name: 'Quick Responder',
      desc: 'Answered peer doubt beacons in under 2 minutes',
      icon: '⚡',
      rarity: 'Epic',
      earned: 'Sep 2026',
    },
    {
      name: 'Loop Architect',
      desc: 'Completed the full Learn → Teach → Build cycle 5 times',
      icon: '🔄',
      rarity: 'Legendary',
      earned: 'Sep 2026',
    },
  ];

  const weeklyActivity = [
    { day: 'Mon', hours: 3.5, label: '3.5h' },
    { day: 'Tue', hours: 2.0, label: '2.0h' },
    { day: 'Wed', hours: 4.5, label: '4.5h' },
    { day: 'Thu', hours: 1.5, label: '1.5h' },
    { day: 'Fri', hours: 5.0, label: '5.0h' },
    { day: 'Sat', hours: 6.0, label: '6.0h' },
    { day: 'Sun', hours: 3.0, label: '3.0h' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in duration-200">
      {/* ---------------------------------------------------- */}
      {/* 1. HEADER */}
      {/* ---------------------------------------------------- */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
          My Learning &amp; Teaching Progress
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Detailed metrics tracking your journey through the PeerLoop cycle.
        </p>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. STATS ROW */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Teaching Score */}
        <div className="p-5 rounded-2xl bg-[#151E33] border border-[#1E2A47] space-y-2">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-semibold">Teaching Score</span>
            <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#22D3EE] font-mono">
              96
            </span>
            <span className="text-xs text-[#94A3B8]">/ 100</span>
          </div>
          <p className="text-[11px] text-[#34D399] font-medium">Top 5% on campus</p>
        </div>

        {/* Learning Hours */}
        <div className="p-5 rounded-2xl bg-[#151E33] border border-[#1E2A47] space-y-2">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-semibold">Learning Hours</span>
            <Clock className="w-4 h-4 text-[#22D3EE]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] font-mono">
              42.5
            </span>
            <span className="text-xs text-[#94A3B8]">hrs</span>
          </div>
          <p className="text-[11px] text-[#94A3B8]">18 peer sessions</p>
        </div>

        {/* Reputation Points */}
        <div className="p-5 rounded-2xl bg-[#151E33] border border-[#1E2A47] space-y-2">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-semibold">Reputation Points</span>
            <Star className="w-4 h-4 text-amber-400 fill-current" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
              1,480
            </span>
            <span className="text-xs text-[#94A3B8]">pts</span>
          </div>
          <p className="text-[11px] text-[#C4B5FD] font-medium">Tier: Senior Peer Mentor</p>
        </div>

        {/* Badges Earned */}
        <div className="p-5 rounded-2xl bg-[#151E33] border border-[#1E2A47] space-y-2">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-semibold">Badges Earned</span>
            <Award className="w-4 h-4 text-[#34D399]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#34D399] font-mono">
              4
            </span>
            <span className="text-xs text-[#94A3B8]">unlocked</span>
          </div>
          <p className="text-[11px] text-[#94A3B8]">2 next tier in progress</p>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. WEEKLY GROWTH ACTIVITY BARS */}
      {/* ---------------------------------------------------- */}
      <div className="p-6 rounded-2xl bg-[#151E33] border border-[#1E2A47] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC]">Weekly Learning &amp; Mentoring Hours</h3>
            <p className="text-xs text-[#94A3B8]">25.5 hours total this week</p>
          </div>
          <span className="text-xs font-mono font-bold text-[#34D399]">+18% vs last week</span>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-36 pt-4 pb-2 border-b border-[#1E2A47]">
          {weeklyActivity.map((item, idx) => {
            const heightPercent = (item.hours / 6.0) * 100;
            return (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-mono text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.label}
                </span>
                <div className="w-full bg-[#0B1020] rounded-lg h-full flex items-end p-1">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full rounded-md bg-gradient-to-t from-[#8B5CF6] to-[#22D3EE] transition-all group-hover:from-[#7C3AED] group-hover:to-[#06B6D4]"
                  />
                </div>
                <span className="text-[11px] font-medium text-[#94A3B8]">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. SKILLS IN PROGRESS */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-[#F8FAFC] tracking-tight flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#8B5CF6]" />
          <span>Skills In Progress</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skillsInProgress.map((skill, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#151E33] border border-[#1E2A47] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#11182B] text-[#C4B5FD] border border-[#1E2A47]">
                  {skill.category}
                </span>
                <span className="text-xs font-mono font-bold text-[#22D3EE] tabular-nums">
                  {skill.progress}%
                </span>
              </div>

              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#F8FAFC]">
                  {skill.name}
                </h4>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">
                  Mentor: {skill.mentor} • {skill.hoursSpent}h logged
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#0B1020] h-2 rounded-full overflow-hidden border border-[#1E2A47]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE]"
                  style={{ width: `${skill.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 5. BADGES EARNED */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-[#F8FAFC] tracking-tight flex items-center gap-2">
          <Award className="w-4 h-4 text-[#22D3EE]" />
          <span>Badges &amp; Recognitions</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#151E33] border border-[#1E2A47] hover:border-[#8B5CF6]/50 transition-all flex flex-col justify-between space-y-3 shadow-sm"
            >
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#11182B] border border-[#1E2A47] flex items-center justify-center text-2xl shadow-inner">
                  {badge.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F8FAFC]">{badge.name}</h4>
                  <span className="text-[10px] font-mono text-[#22D3EE]">{badge.rarity}</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  {badge.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-[#1E2A47] text-[10px] text-[#94A3B8] font-mono">
                Earned: {badge.earned}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
