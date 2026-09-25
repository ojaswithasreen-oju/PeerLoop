import React, { useState } from 'react';
import {
  GraduationCap,
  MapPin,
  Clock,
  BookOpen,
  Award,
  Star,
  CheckCircle2,
  Calendar,
  Edit3,
  Target,
  Sparkles,
  Zap,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const StudentProfileView: React.FC = () => {
  const { currentUser } = useAuth();

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(
    currentUser?.bio ||
      'Passionate about clean frontend architecture, algorithm visualization, and peer mentoring. Always eager to exchange insights with fellow students and walk through challenging concepts together.'
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-7 animate-in fade-in duration-150">
      {/* ---------------------------------------------------- */}
      {/* 1. STUDENT LEARNING IDENTITY HEADER */}
      {/* Name, College, Course, Year, Bio */}
      {/* ---------------------------------------------------- */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E3E1D9] space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <img
              src={
                currentUser?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
              }
              alt={currentUser?.fullName || 'User'}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#DCE6DE] shadow-xs"
            />

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="font-serif text-2xl sm:text-3xl text-[#202924]">
                  {currentUser?.fullName || 'Ojaswitha Sreen'}
                </h1>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#DCE6DE] text-[#496456]">
                  Verified Peer Mentor
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-[#496456]">
                {currentUser?.course || 'Computer Science & Engineering'}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[#69736D] pt-0.5">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-[#496456]" />
                  <span>{currentUser?.college || 'UC Berkeley'}</span>
                </span>
                <span>•</span>
                <span>
                  Year:{' '}
                  <strong className="text-[#202924] font-medium">
                    {currentUser?.year || 'Junior, Class of 2027'}
                  </strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#69736D]" />
                  <span>{currentUser?.location || 'Berkeley, CA'}</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditingBio(!isEditingBio)}
            className="px-3.5 py-1.5 rounded-xl bg-[#F6F4EE] hover:bg-[#E3E1D9] border border-[#E3E1D9] text-xs font-semibold text-[#202924] transition-colors flex items-center gap-1.5 cursor-pointer self-center sm:self-start"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#69736D]" />
            <span>{isEditingBio ? 'Save Bio' : 'Edit Bio'}</span>
          </button>
        </div>

        {/* Bio */}
        <div className="p-4 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#69736D] block mb-1">
            Student Bio
          </span>
          {isEditingBio ? (
            <textarea
              rows={3}
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              className="w-full bg-white p-2.5 rounded-lg border border-[#E3E1D9] text-xs sm:text-sm text-[#202924] focus:outline-none focus:border-[#496456]"
            />
          ) : (
            <p className="text-xs sm:text-sm text-[#202924] leading-relaxed font-sans">
              “{bioText}”
            </p>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. REPUTATION & ACHIEVEMENTS */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* REPUTATION SECTION */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E3E1D9] space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-[#202924] flex items-center gap-2">
              <Star className="w-4 h-4 text-[#C9825B] fill-current" />
              <span>Reputation</span>
            </h2>
            <span className="text-[11px] font-mono font-bold text-[#496456] bg-[#DCE6DE] px-2.5 py-0.5 rounded-full">
              Top 5% Campus Mentor
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
            <div className="p-3.5 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9]">
              <p className="text-xl font-bold text-[#496456] tabular-nums">96</p>
              <p className="text-[10px] text-[#69736D]">Quality Index</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9]">
              <p className="text-xl font-bold text-[#C9825B] tabular-nums">4.9</p>
              <p className="text-[10px] text-[#69736D]">Star Rating</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9]">
              <p className="text-xl font-bold text-[#387B62] tabular-nums">95%</p>
              <p className="text-[10px] text-[#69736D]">Clarity Score</p>
            </div>
          </div>

          <p className="text-xs text-[#69736D] leading-relaxed font-sans">
            Reputation is earned exclusively through verified post-session peer feedback, concept clarity ratings, and timely doubt resolutions.
          </p>
        </div>

        {/* ACHIEVEMENTS SECTION */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E3E1D9] space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-[#202924] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#496456]" />
              <span>Achievements</span>
            </h2>
            <span className="text-xs text-[#69736D]">4 Badges Earned</span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#DCE6DE] text-[#496456] flex items-center justify-center text-sm font-bold">
                ⭐
              </span>
              <div>
                <p className="text-xs font-bold text-[#202924]">Rising Mentor Award</p>
                <p className="text-[11px] text-[#69736D]">Completed 10+ high-clarity doubt sessions</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#F1DED3] text-[#C9825B] flex items-center justify-center text-sm font-bold">
                ⚡
              </span>
              <div>
                <p className="text-xs font-bold text-[#202924]">Quick Responder</p>
                <p className="text-[11px] text-[#69736D]">Answered campus peer doubts in under 5 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. LEARNING & TEACHING SECTIONS */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* LEARNING SECTION */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E3E1D9] space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-[#202924] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#496456]" />
              <span>Learning</span>
            </h2>
            <span className="text-xs text-[#496456] font-semibold">2 Active Paths</span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3.5 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#202924]">Python Loops &amp; Algorithms</p>
                <p className="text-[11px] text-[#69736D]">Nested Loops, 2D Traversal, Big-O</p>
              </div>
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-[#DCE6DE] text-[#496456]">
                68% • In Progress
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#202924]">Distributed State Architecture</p>
                <p className="text-[11px] text-[#69736D]">Caching, Replication, Optimistic UI</p>
              </div>
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-white border border-[#E3E1D9] text-[#69736D]">
                Next Goal
              </span>
            </div>
          </div>
        </div>

        {/* TEACHING SECTION */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E3E1D9] space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-[#202924] flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#496456]" />
              <span>Teaching</span>
            </h2>
            <span className="text-xs text-[#387B62] font-semibold">Verified Mentor</span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3.5 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#202924]">UI/UX Design Systems</p>
                <p className="text-[11px] text-[#69736D]">Figma Variables, Tokens, Component Hand-off</p>
              </div>
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-[#DCE6DE] text-[#387B62] flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Verified</span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#202924]">Modern Web Frontend</p>
                <p className="text-[11px] text-[#69736D]">React 19, TypeScript, Clean Component Hooks</p>
              </div>
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-[#DCE6DE] text-[#387B62] flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Verified</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. SKILLS SECTION */}
      {/* ---------------------------------------------------- */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E3E1D9] space-y-4 shadow-xs">
        <h2 className="font-serif text-lg font-bold text-[#202924] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#496456]" />
          <span>Skills</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'Python', level: 'Intermediate', type: 'Learning' },
            { name: 'React 19', level: 'Advanced', type: 'Teaching' },
            { name: 'Figma Tokens', level: 'Advanced', type: 'Teaching' },
            { name: 'TypeScript', level: 'Intermediate', type: 'Learning' },
            { name: 'SQL', level: 'Beginner', type: 'Learning' },
            { name: 'Tailwind CSS', level: 'Advanced', type: 'Teaching' },
            { name: 'Data Structures', level: 'Intermediate', type: 'Learning' },
            { name: 'Design Systems', level: 'Advanced', type: 'Teaching' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] flex flex-col justify-between space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#202924]">{item.name}</span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                    item.type === 'Teaching'
                      ? 'bg-[#DCE6DE] text-[#496456]'
                      : 'bg-white text-[#69736D] border border-[#E3E1D9]'
                  }`}
                >
                  {item.type}
                </span>
              </div>
              <span className="text-[10px] text-[#69736D]">{item.level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 5. CAREER GOALS & AVAILABILITY */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* CAREER GOALS SECTION */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E3E1D9] space-y-3 shadow-xs">
          <h2 className="font-serif text-lg font-bold text-[#202924] flex items-center gap-2">
            <Target className="w-4 h-4 text-[#496456]" />
            <span>Career Goals</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#69736D] leading-relaxed font-sans">
            Aspiring Software Engineer focused on high-performance frontend architecture, accessible design systems, and human-centered developer tools. Aiming for internship roles in Product Infrastructure &amp; UI Systems.
          </p>
        </div>

        {/* AVAILABILITY SECTION */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E3E1D9] space-y-3 shadow-xs">
          <h2 className="font-serif text-lg font-bold text-[#202924] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#496456]" />
            <span>Availability</span>
          </h2>
          <div className="space-y-1">
            <p className="text-xs font-bold text-[#202924]">
              Mon, Wed, Fri &amp; Weekend Afternoons
            </p>
            <p className="text-xs text-[#69736D]">
              4:00 PM – 8:30 PM PST (Live instant doubts accepted when status is Available Now).
            </p>
          </div>
          <div className="pt-2 flex items-center gap-2 text-[11px] text-[#387B62] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#387B62]" />
            <span>Accepting 1-on-1 peer bookings</span>
          </div>
        </div>
      </div>
    </div>
  );
};
