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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const StudentProfileView: React.FC = () => {
  const { currentUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [bioText, setBioText] = useState(
    currentUser?.bio ||
      'Passionate about user-centered frontend systems, algorithms, and peer mentoring. Always eager to exchange insights with fellow students.'
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-in fade-in duration-150">
      {/* ---------------------------------------------------- */}
      {/* 1. PROFILE HEADER CARD (Student Portfolio Hero) */}
      {/* Include: Profile photo, Name, College, Course, Year, Bio */}
      {/* ---------------------------------------------------- */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E5EAE7] space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <img
              src={
                currentUser?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
              }
              alt={currentUser?.fullName || 'User'}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-[#E5EAE7]"
            />

            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#1F2933]">
                  {currentUser?.fullName || 'Ojaswitha Sreen'}
                </h1>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-[#DCE9E2] text-[#3F6B5B]">
                  Verified Peer Mentor
                </span>
              </div>

              <p className="text-xs sm:text-sm font-medium text-[#3F6B5B]">
                {currentUser?.course || 'Computer Science & Engineering'}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[#6B7280] pt-0.5">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-[#3F6B5B]" />
                  {currentUser?.college || 'UC Berkeley'}
                </span>
                <span>•</span>
                <span>Year: <strong className="text-[#1F2933] font-medium">{currentUser?.year || 'Junior, Class of 2027'}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#6B7280]" />
                  {currentUser?.location || 'Berkeley, CA'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-1.5 rounded-lg bg-[#F7F8F5] hover:bg-[#EEF2EE] border border-[#E5EAE7] text-xs font-semibold text-[#1F2933] transition-colors flex items-center gap-1.5 cursor-pointer self-center sm:self-start"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>{isEditing ? 'Save Bio' : 'Edit Bio'}</span>
          </button>
        </div>

        {/* Bio */}
        <div className="p-4 rounded-xl bg-[#F7F8F5] border border-[#E5EAE7]">
          {isEditing ? (
            <textarea
              rows={2}
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              className="w-full bg-transparent text-xs text-[#1F2933] focus:outline-none"
            />
          ) : (
            <p className="text-xs sm:text-sm text-[#1F2933] leading-relaxed">
              &ldquo;{bioText}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. REPUTATION & ACHIEVEMENTS */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Reputation */}
        <div className="p-6 rounded-2xl bg-white border border-[#E5EAE7] space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1F2933] flex items-center gap-2">
              <Star className="w-4 h-4 text-[#D99B26] fill-current" />
              <span>Reputation</span>
            </h2>
            <span className="text-xs font-mono font-bold text-[#3F6B5B]">
              Top 5% Mentor
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-3 rounded-xl bg-[#F7F8F5] border border-[#E5EAE7]">
              <p className="text-lg font-bold text-[#3F6B5B] tabular-nums">96</p>
              <p className="text-[10px] text-[#6B7280]">Score / 100</p>
            </div>
            <div className="p-3 rounded-xl bg-[#F7F8F5] border border-[#E5EAE7]">
              <p className="text-lg font-bold text-[#D99B26] tabular-nums">4.8</p>
              <p className="text-[10px] text-[#6B7280]">Star rating</p>
            </div>
            <div className="p-3 rounded-xl bg-[#F7F8F5] border border-[#E5EAE7]">
              <p className="text-lg font-bold text-[#387B62] tabular-nums">95%</p>
              <p className="text-[10px] text-[#6B7280]">Clarity score</p>
            </div>
          </div>

          <p className="text-xs text-[#6B7280] leading-relaxed">
            Reputation is calculated based on verified post-session feedback from peers, conceptual clarity, and helpfulness.
          </p>
        </div>

        {/* Achievements */}
        <div className="p-6 rounded-2xl bg-white border border-[#E5EAE7] space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1F2933] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#3F6B5B]" />
              <span>Achievements</span>
            </h2>
            <span className="text-xs text-[#6B7280]">4 Badges Earned</span>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-[#F7F8F5] border border-[#E5EAE7] flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-[#DCE9E2] text-[#3F6B5B] flex items-center justify-center text-xs font-bold">
                ⭐
              </span>
              <div>
                <p className="text-xs font-semibold text-[#1F2933]">Rising Mentor Award</p>
                <p className="text-[11px] text-[#6B7280]">Completed 10+ high-clarity doubt sessions</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#F7F8F5] border border-[#E5EAE7] flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-[#DCE9E2] text-[#3F6B5B] flex items-center justify-center text-xs font-bold">
                ⚡
              </span>
              <div>
                <p className="text-xs font-semibold text-[#1F2933]">Quick Responder</p>
                <p className="text-[11px] text-[#6B7280]">Helped peers in under 5 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. SKILLS TO LEARN & SKILLS TO TEACH */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Skills to Learn */}
        <div className="p-6 rounded-2xl bg-white border border-[#E5EAE7] space-y-4 shadow-xs">
          <h2 className="text-base font-bold text-[#1F2933] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#3F6B5B]" />
            <span>Skills to Learn</span>
          </h2>

          <div className="space-y-2.5">
            <div className="p-3.5 rounded-xl bg-[#F7F8F5] border border-[#E5EAE7] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#1F2933]">Python Loops &amp; Algorithms</p>
                <p className="text-[11px] text-[#6B7280]">Nested Loops, Matrix Traversal, Big-O</p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#DCE9E2] text-[#3F6B5B]">
                In Progress
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F8F5] border border-[#E5EAE7] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#1F2933]">Distributed State Management</p>
                <p className="text-[11px] text-[#6B7280]">Caching, Consensus, RPC protocols</p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#DCE9E2] text-[#3F6B5B]">
                Target Skill
              </span>
            </div>
          </div>
        </div>

        {/* Skills to Teach */}
        <div className="p-6 rounded-2xl bg-white border border-[#E5EAE7] space-y-4 shadow-xs">
          <h2 className="text-base font-bold text-[#1F2933] flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#3F6B5B]" />
            <span>Skills to Teach</span>
          </h2>

          <div className="space-y-2.5">
            <div className="p-3.5 rounded-xl bg-[#F7F8F5] border border-[#E5EAE7] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#1F2933]">UI/UX Design Systems</p>
                <p className="text-[11px] text-[#6B7280]">Figma Variables, Tokens, Component Sets</p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#DCE9E2] text-[#387B62]">
                Verified
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F8F5] border border-[#E5EAE7] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#1F2933]">Modern Web Development</p>
                <p className="text-[11px] text-[#6B7280]">React, TypeScript, Semantic HTML/CSS</p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#DCE9E2] text-[#387B62]">
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. CAREER GOALS, LEARNING PREFERENCES, AVAILABILITY */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Career Goals */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5EAE7] space-y-2.5 shadow-xs">
          <h3 className="text-xs font-bold text-[#1F2933] uppercase tracking-wide flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-[#3F6B5B]" />
            <span>Career Goals</span>
          </h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Aspiring Software Engineer focused on high-performance frontend architecture and human-computer interaction systems.
          </p>
        </div>

        {/* Learning Preferences */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5EAE7] space-y-2.5 shadow-xs">
          <h3 className="text-xs font-bold text-[#1F2933] uppercase tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#3F6B5B]" />
            <span>Learning Preferences</span>
          </h3>
          <ul className="text-xs text-[#6B7280] space-y-1">
            <li>• 1-on-1 concept walkthroughs</li>
            <li>• Practical scratchpad code examples</li>
            <li>• Real-world mental models &amp; analogies</li>
          </ul>
        </div>

        {/* Availability */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5EAE7] space-y-2.5 shadow-xs">
          <h3 className="text-xs font-bold text-[#1F2933] uppercase tracking-wide flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#3F6B5B]" />
            <span>Availability</span>
          </h3>
          <p className="text-xs text-[#1F2933] font-semibold">
            Mon, Wed, Fri &amp; Weekends
          </p>
          <p className="text-xs text-[#6B7280]">
            4:00 PM – 8:00 PM PST (Instant quick doubts welcome while online)
          </p>
        </div>
      </div>
    </div>
  );
};
