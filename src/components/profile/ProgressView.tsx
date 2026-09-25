import React from 'react';
import {
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  Flame,
  Star,
  BookOpen,
  Users,
  Check,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProgressView: React.FC = () => {
  const { currentUser } = useAuth();

  const skillsLearning = [
    {
      name: 'Python — Nested Loops & Matrix Traversal',
      progress: 68,
      category: 'Programming',
      hoursSpent: 14.5,
      mentor: 'Rahul',
      status: 'Current Skill',
    },
    {
      name: 'Full-Stack Web Development & APIs',
      progress: 60,
      category: 'Web Dev',
      hoursSpent: 12.0,
      mentor: 'Maya',
      status: 'In Progress',
    },
    {
      name: 'Data Structures — Binary Search Trees',
      progress: 35,
      category: 'Algorithms',
      hoursSpent: 8.0,
      mentor: 'David',
      status: 'Up Next',
    },
  ];

  const skillsCompleted = [
    {
      name: 'UI/UX Design Systems & Figma Tokens',
      category: 'Design',
      completedDate: 'Completed last week',
      verifiedBy: 'Campus Peer Review',
    },
    {
      name: 'Modern CSS Flexbox & Responsive Layouts',
      category: 'Web Dev',
      completedDate: 'Completed Aug 2026',
      verifiedBy: '5 Sessions Mentored',
    },
    {
      name: 'Python Fundamentals & Control Flow',
      category: 'Programming',
      completedDate: 'Completed Sep 2026',
      verifiedBy: 'Skill Assessment',
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 animate-in fade-in duration-150">
      {/* ---------------------------------------------------- */}
      {/* 1. HEADER */}
      {/* ---------------------------------------------------- */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#202924] tracking-tight">
          Your Learning Progress
        </h1>
        <p className="text-xs sm:text-sm text-[#69736D] mt-1 font-sans">
          A clear, visual record of your study streaks, mastered concepts, and peer mentoring impact.
        </p>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. THE SIX CORE METRICS (Exact requirements from prompt) */}
      {/* Skills learning · Skills completed · Sessions · Questions solved · Learners helped · Learning streak */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Skills learning */}
        <div className="p-4 rounded-xl bg-white border border-[#E3E1D9] space-y-1 shadow-xs">
          <p className="text-[11px] font-semibold text-[#69736D]">Skills learning</p>
          <p className="text-2xl font-bold text-[#202924] font-mono">3</p>
          <p className="text-[10px] text-[#496456] font-medium">In active rotation</p>
        </div>

        {/* 2. Skills completed */}
        <div className="p-4 rounded-xl bg-white border border-[#E3E1D9] space-y-1 shadow-xs">
          <p className="text-[11px] font-semibold text-[#69736D]">Skills completed</p>
          <p className="text-2xl font-bold text-[#496456] font-mono">3</p>
          <p className="text-[10px] text-[#387B62] font-medium">Verified mastery</p>
        </div>

        {/* 3. Sessions */}
        <div className="p-4 rounded-xl bg-white border border-[#E3E1D9] space-y-1 shadow-xs">
          <p className="text-[11px] font-semibold text-[#69736D]">Sessions</p>
          <p className="text-2xl font-bold text-[#202924] font-mono">18</p>
          <p className="text-[10px] text-[#69736D]">1-on-1 meetings</p>
        </div>

        {/* 4. Questions solved */}
        <div className="p-4 rounded-xl bg-white border border-[#E3E1D9] space-y-1 shadow-xs">
          <p className="text-[11px] font-semibold text-[#69736D]">Questions solved</p>
          <p className="text-2xl font-bold text-[#496456] font-mono">31</p>
          <p className="text-[10px] text-[#69736D]">Doubt topics</p>
        </div>

        {/* 5. Learners helped */}
        <div className="p-4 rounded-xl bg-white border border-[#E3E1D9] space-y-1 shadow-xs">
          <p className="text-[11px] font-semibold text-[#69736D]">Learners helped</p>
          <p className="text-2xl font-bold text-[#202924] font-mono">23</p>
          <p className="text-[10px] text-[#496456] font-medium">Campus peers</p>
        </div>

        {/* 6. Learning streak */}
        <div className="p-4 rounded-xl bg-white border border-[#E3E1D9] space-y-1 shadow-xs">
          <p className="text-[11px] font-semibold text-[#69736D]">Learning streak</p>
          <p className="text-2xl font-bold text-[#C9825B] font-mono flex items-center gap-1">
            <span>7</span>
            <span className="text-sm font-sans font-medium text-[#202924]">days</span>
          </p>
          <p className="text-[10px] text-[#C9825B] font-medium">Daily practice 🔥</p>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. SIMPLE WEEKLY STUDY VISUALIZATION */}
      {/* ---------------------------------------------------- */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E3E1D9] space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#202924]">
              Weekly Learning Activity
            </h2>
            <p className="text-xs text-[#69736D] font-sans">
              25.5 total hours logged this week across mentoring and practice.
            </p>
          </div>
          <span className="text-xs font-mono text-[#496456] font-semibold bg-[#DCE6DE] px-3 py-1 rounded-full self-start sm:self-auto">
            Top 10% Active Student
          </span>
        </div>

        {/* Bar chart visual */}
        <div className="pt-4">
          <div className="flex items-end justify-between gap-3 h-36 border-b border-[#E3E1D9] pb-2">
            {weeklyActivity.map((item, idx) => {
              const maxHours = 6.0;
              const heightPercent = Math.round((item.hours / maxHours) * 100);
              const isToday = item.day === 'Sun';

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono text-[#69736D] group-hover:text-[#202924] transition-colors">
                    {item.label}
                  </span>
                  <div className="w-full max-w-[42px] bg-[#F6F4EE] rounded-t-lg overflow-hidden h-full flex items-end">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-lg transition-all ${
                        isToday ? 'bg-[#496456]' : 'bg-[#DCE6DE] group-hover:bg-[#496456]'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      isToday ? 'text-[#496456]' : 'text-[#69736D]'
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. ACTIVE LEARNING SKILLS VS COMPLETED MASTERY */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills currently in progress */}
        <div className="p-6 rounded-2xl bg-white border border-[#E3E1D9] space-y-4 shadow-xs">
          <h2 className="font-serif text-lg font-bold text-[#202924] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#496456]" />
            <span>Skills Learning</span>
          </h2>

          <div className="space-y-4">
            {skillsLearning.map((skill, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#202924]">{skill.name}</span>
                  <span className="font-mono font-bold text-[#496456]">{skill.progress}%</span>
                </div>
                <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#E3E1D9]">
                  <div
                    style={{ width: `${skill.progress}%` }}
                    className="h-full bg-[#496456] rounded-full"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#69736D]">
                  <span>Mentor: {skill.mentor}</span>
                  <span className="text-[#496456] font-semibold">{skill.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills mastered & completed */}
        <div className="p-6 rounded-2xl bg-white border border-[#E3E1D9] space-y-4 shadow-xs">
          <h2 className="font-serif text-lg font-bold text-[#202924] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#387B62]" />
            <span>Skills Completed</span>
          </h2>

          <div className="space-y-3">
            {skillsCompleted.map((skill, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-[#202924]">{skill.name}</h4>
                  <p className="text-[11px] text-[#69736D]">
                    {skill.completedDate} • {skill.verifiedBy}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-[#DCE6DE] text-[#387B62] text-[10px] font-bold shrink-0 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Mastered</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
