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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProgressView: React.FC = () => {
  const { currentUser } = useAuth();

  const skillsLearning = [
    {
      name: 'Python — Nested Loops & Comprehensions',
      progress: 68,
      category: 'Programming',
      hoursSpent: 14.5,
      mentor: 'Rahul',
      status: 'Active',
    },
    {
      name: 'Full-Stack Web Development & APIs',
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
  ];

  const skillsMastered = [
    {
      name: 'UI/UX Design Systems & Figma Tokens',
      category: 'Design',
      completedDate: 'Completed last week',
      verifiedBy: 'Campus Review',
    },
    {
      name: 'Modern CSS Flexbox & Responsive Layouts',
      category: 'Web Dev',
      completedDate: 'Completed Aug 2026',
      verifiedBy: '5 Sessions Mentored',
    },
    {
      name: 'Python Data Structures & Collections',
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in duration-150">
      {/* ---------------------------------------------------- */}
      {/* 1. HEADER */}
      {/* ---------------------------------------------------- */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2933] tracking-tight">
          Learning Progress
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
          A visual record of your study streaks, mastered topics, and community peer sessions.
        </p>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. CORE SIX METRICS STRIP (as required by prompt) */}
      {/* Skills learning | Skills mastered | Sessions completed | Questions solved | People helped | Learning streak */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Skills learning */}
        <div className="p-4 rounded-xl bg-white border border-[#E5EAE7] space-y-1">
          <p className="text-[11px] font-medium text-[#6B7280]">Skills learning</p>
          <p className="text-xl font-bold text-[#1F2933] font-mono tabular-nums">3</p>
          <p className="text-[10px] text-[#3F6B5B] font-medium">In progress</p>
        </div>

        {/* 2. Skills mastered */}
        <div className="p-4 rounded-xl bg-white border border-[#E5EAE7] space-y-1">
          <p className="text-[11px] font-medium text-[#6B7280]">Skills mastered</p>
          <p className="text-xl font-bold text-[#387B62] font-mono tabular-nums">3</p>
          <p className="text-[10px] text-[#387B62] font-medium">Verified</p>
        </div>

        {/* 3. Sessions completed */}
        <div className="p-4 rounded-xl bg-white border border-[#E5EAE7] space-y-1">
          <p className="text-[11px] font-medium text-[#6B7280]">Sessions completed</p>
          <p className="text-xl font-bold text-[#1F2933] font-mono tabular-nums">18</p>
          <p className="text-[10px] text-[#6B7280]">1-on-1 calls</p>
        </div>

        {/* 4. Questions solved */}
        <div className="p-4 rounded-xl bg-white border border-[#E5EAE7] space-y-1">
          <p className="text-[11px] font-medium text-[#6B7280]">Questions solved</p>
          <p className="text-xl font-bold text-[#3F6B5B] font-mono tabular-nums">31</p>
          <p className="text-[10px] text-[#6B7280]">Doubt topics</p>
        </div>

        {/* 5. People helped */}
        <div className="p-4 rounded-xl bg-white border border-[#E5EAE7] space-y-1">
          <p className="text-[11px] font-medium text-[#6B7280]">People helped</p>
          <p className="text-xl font-bold text-[#1F2933] font-mono tabular-nums">23</p>
          <p className="text-[10px] text-[#3F6B5B] font-medium">Peer students</p>
        </div>

        {/* 6. Learning streak */}
        <div className="p-4 rounded-xl bg-white border border-[#E5EAE7] space-y-1">
          <p className="text-[11px] font-medium text-[#6B7280]">Learning streak</p>
          <p className="text-xl font-bold text-[#D99B26] font-mono tabular-nums">7 Days</p>
          <p className="text-[10px] text-[#D99B26] font-medium">Daily practice</p>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. SIMPLE WEEKLY ACTIVITY CHART */}
      {/* ---------------------------------------------------- */}
      <div className="p-6 rounded-2xl bg-white border border-[#E5EAE7] space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1F2933]">Study &amp; Session Hours This Week</h3>
            <p className="text-xs text-[#6B7280]">25.5 hours total across learning and peer mentoring</p>
          </div>
          <span className="text-xs font-semibold text-[#387B62]">+18% vs last week</span>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-32 pt-4 pb-2 border-b border-[#E5EAE7]">
          {weeklyActivity.map((item, idx) => {
            const heightPercent = (item.hours / 6.0) * 100;
            return (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-mono text-[#6B7280]">
                  {item.label}
                </span>
                <div className="w-full bg-[#F7F8F5] rounded-md h-full flex items-end p-1">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full rounded bg-[#DCE9E2] hover:bg-[#3F6B5B] transition-colors"
                  />
                </div>
                <span className="text-[11px] font-medium text-[#6B7280]">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. SKILLS LEARNING & SKILLS MASTERED */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills Learning */}
        <div className="p-6 rounded-2xl bg-white border border-[#E5EAE7] space-y-4 shadow-xs">
          <h2 className="text-base font-bold text-[#1F2933] tracking-tight flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#3F6B5B]" />
            <span>Skills Learning</span>
          </h2>

          <div className="space-y-4">
            {skillsLearning.map((skill, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1F2933]">{skill.name}</span>
                  <span className="font-mono text-[#3F6B5B] font-bold">{skill.progress}%</span>
                </div>
                <div className="w-full bg-[#F7F8F5] h-2 rounded-full overflow-hidden border border-[#E5EAE7]">
                  <div
                    className="h-full rounded-full bg-[#3F6B5B]"
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
                  <span>Mentor: {skill.mentor}</span>
                  <span>{skill.hoursSpent}h logged</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Mastered */}
        <div className="p-6 rounded-2xl bg-white border border-[#E5EAE7] space-y-4 shadow-xs">
          <h2 className="text-base font-bold text-[#1F2933] tracking-tight flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#387B62]" />
            <span>Skills Mastered</span>
          </h2>

          <div className="space-y-3">
            {skillsMastered.map((skill, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#F7F8F5] border border-[#E5EAE7] flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#DCE9E2] text-[#387B62] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                    <h4 className="text-xs font-bold text-[#1F2933]">{skill.name}</h4>
                  </div>
                  <p className="text-[11px] text-[#6B7280] ml-6 mt-0.5">
                    {skill.verifiedBy} • {skill.completedDate}
                  </p>
                </div>

                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#DCE9E2] text-[#387B62]">
                  Mastered
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
