import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  Star,
  Users,
  CheckCircle2,
  Clock,
  BookOpen,
  GraduationCap,
  MapPin,
  Mail,
  ShieldCheck,
  Edit3,
  Flame,
  Check,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const StudentProfileView: React.FC = () => {
  const { currentUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [bioText, setBioText] = useState(
    currentUser?.bio ||
      'Passionate about algorithms, system design, and AI models. Always learning and helping peers.'
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in duration-200">
      {/* ---------------------------------------------------- */}
      {/* 1. HERO PROFILE CARD */}
      {/* ---------------------------------------------------- */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#151E33] border border-[#1E2A47] shadow-xl space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative">
              <img
                src={
                  currentUser?.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                }
                alt={currentUser?.fullName || 'Ojaswitha'}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-[#8B5CF6]/50 shadow-xl"
              />
              <span className="w-4 h-4 rounded-full bg-[#34D399] ring-4 ring-[#151E33] absolute -bottom-1 -right-1" />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC]">
                  {currentUser?.fullName || 'Ojaswitha'}
                </h1>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#8B5CF6]/20 text-[#22D3EE] border border-[#8B5CF6]/30">
                  Student Mentor
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-[#22D3EE]">
                {currentUser?.course || 'CSE • AI/ML'}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[#94A3B8]">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  {currentUser?.college || 'UC Berkeley'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#22D3EE]" />
                  {currentUser?.location || 'Berkeley, CA'}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Bio Button */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="self-center sm:self-start px-3.5 py-1.5 rounded-xl bg-[#11182B] hover:bg-[#1A2540] border border-[#1E2A47] text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Save Bio' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Bio Text */}
        <div className="p-4 rounded-2xl bg-[#0B1020] border border-[#1E2A47]">
          {isEditing ? (
            <textarea
              rows={2}
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              className="w-full bg-transparent text-xs text-[#F8FAFC] focus:outline-hidden"
            />
          ) : (
            <p className="text-xs sm:text-sm text-[#F8FAFC] leading-relaxed">
              &ldquo;{bioText}&rdquo;
            </p>
          )}
        </div>

        {/* Core Profile Metrics Strip */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-2 border-t border-[#1E2A47] text-center font-mono">
          <div className="p-3 rounded-xl bg-[#11182B] border border-[#1E2A47]">
            <p className="text-lg sm:text-2xl font-extrabold text-[#22D3EE] tabular-nums">
              {currentUser?.reputation.score || 96}
            </p>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">Reputation score</p>
          </div>

          <div className="p-3 rounded-xl bg-[#11182B] border border-[#1E2A47]">
            <p className="text-lg sm:text-2xl font-extrabold text-[#F8FAFC] tabular-nums">
              {currentUser?.reputation.sessionsCount || 18}
            </p>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">Sessions completed</p>
          </div>

          <div className="p-3 rounded-xl bg-[#11182B] border border-[#1E2A47]">
            <p className="text-lg sm:text-2xl font-extrabold text-amber-400 tabular-nums">
              {currentUser?.reputation.learnersHelped || 23}
            </p>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">Learners helped</p>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. SKILLS TO LEARN & SKILLS TO TEACH */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills to Learn */}
        <div className="p-6 rounded-3xl bg-[#151E33] border border-[#1E2A47] space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#8B5CF6]" />
              <span>Skills to Learn</span>
            </h2>
            <span className="text-[11px] font-mono text-[#8B5CF6] font-bold">Currently Studying</span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-[#11182B] border border-[#1E2A47] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#F8FAFC]">Python</p>
                <p className="text-[11px] text-[#94A3B8]">Nested Loops, List Comprehensions, Algorithms</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/30">
                Intermediate
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#11182B] border border-[#1E2A47] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#F8FAFC]">Web Development</p>
                <p className="text-[11px] text-[#94A3B8]">Full-Stack React 19, TypeScript, REST APIs</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/30">
                Intermediate
              </span>
            </div>
          </div>
        </div>

        {/* Skills to Teach */}
        <div className="p-6 rounded-3xl bg-[#151E33] border border-[#1E2A47] space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#22D3EE]" />
              <span>Skills to Teach</span>
            </h2>
            <span className="text-[11px] font-mono text-[#34D399] font-bold">Verified Mentor</span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-[#11182B] border border-[#1E2A47] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#F8FAFC]">UI/UX Design</p>
                <p className="text-[11px] text-[#94A3B8]">Figma Systems, Design Tokens, Wireframing</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-[#34D399] border border-emerald-500/30">
                Advanced
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#11182B] border border-[#1E2A47] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#F8FAFC]">HTML/CSS</p>
                <p className="text-[11px] text-[#94A3B8]">Modern Flexbox, CSS Grid, Responsive Design</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-[#34D399] border border-emerald-500/30">
                Advanced
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
