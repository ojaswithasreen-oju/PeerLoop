import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Clock,
  ArrowRight,
  Star,
  Users,
  Play,
  Calendar,
  Search,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/storeService';
import { LearningSession, UserProfile } from '../../types';

interface HomeDashboardProps {
  onNavigate: (tab: string) => void;
  onOpenQuickDoubt: () => void;
  onStartSession: (session: LearningSession) => void;
  onViewProfile: (userId: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  onOpenQuickDoubt,
  onStartSession,
  onViewProfile,
}) => {
  const { currentUser } = useAuth();
  const [mentors, setMentors] = useState<UserProfile[]>([]);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const load = async () => {
      const allMentors = await store.getAllMentors();
      setMentors(allMentors.filter((m) => m.id !== currentUser?.id));
    };
    load();
  }, [currentUser]);

  // Dynamic time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('learn');
  };

  // Sample upcoming session
  const upcomingSession: LearningSession = {
    id: 'upcoming-session-1',
    learnerId: currentUser?.id || 'user-ojaswitha',
    learnerName: currentUser?.fullName || 'Ojaswitha',
    learnerAvatar: currentUser?.avatarUrl || '',
    learnerCollege: currentUser?.college || 'UC Berkeley',
    mentorId: 'user-rahul',
    mentorName: 'Rahul',
    mentorAvatar:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    mentorCollege: 'UC Berkeley',
    skill: 'Python',
    topic: 'Python Doubt Session — Nested Loops',
    status: 'scheduled',
    durationMinutes: 20,
    isRecording: false,
    recordingConsentLearner: false,
    recordingConsentMentor: false,
    recordingSeconds: 0,
    sharedNotes: 'Notes for Nested Loops & List Comprehensions session with Rahul.',
    chatMessages: [],
    copilotItems: [],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in duration-200">
      {/* ---------------------------------------------------- */}
      {/* 1. TOP GREETING & COMMAND BAR */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
            {getGreeting()}, {currentUser?.fullName || 'Ojaswitha'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            What do you want to learn today?
          </p>
        </div>

        {/* Prominent Search / Prompt Bar */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none text-[#94A3B8]">
            <Search className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Ask for help, find a mentor, or explore a skill..."
            className="w-full bg-[#11182B] border border-[#1E2A47] rounded-2xl pl-11 pr-28 py-3.5 text-xs sm:text-sm text-[#F8FAFC] placeholder-[#94A3B8]/70 focus:outline-hidden focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition-all shadow-md shadow-black/20"
          />
          <button
            type="submit"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Quick Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-xl bg-[#11182B] border border-[#1E2A47] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold text-sm">
            <Flame className="w-4 h-4 fill-current" />
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8]">Learning Streak</p>
            <p className="text-sm font-bold text-[#F8FAFC] font-mono tabular-nums">7 Days 🔥</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#11182B] border border-[#1E2A47] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#8B5CF6]/10 text-[#C4B5FD] border border-[#8B5CF6]/20 flex items-center justify-center font-bold text-sm">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8]">Learners Helped</p>
            <p className="text-sm font-bold text-[#F8FAFC] font-mono tabular-nums">23 Students</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#11182B] border border-[#1E2A47] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/20 flex items-center justify-center font-bold text-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8]">Teaching Score</p>
            <p className="text-sm font-bold text-[#22D3EE] font-mono tabular-nums">96 / 100</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#11182B] border border-[#1E2A47] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8]">Sessions Done</p>
            <p className="text-sm font-bold text-[#F8FAFC] font-mono tabular-nums">18 Completed</p>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. CORE ACTION HERO TILES (Continue Learning & Quick Help) */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Continue Learning Card (7 Cols) */}
        <div className="md:col-span-7 p-6 rounded-2xl bg-[#151E33] border border-[#1E2A47] hover:border-[#8B5CF6]/50 transition-all shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/30">
                Continue Learning
              </span>
              <span className="text-xs font-mono font-bold text-[#22D3EE] tabular-nums">
                68% Completed
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC] tracking-tight">
                Python — Nested Loops &amp; Comprehensions
              </h3>
              <p className="text-xs text-[#94A3B8] mt-1">
                Last reviewed: 2D Matrix traversal with Rahul (4 hours ago). Ready for next practice checkpoint.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-[#0B1020] h-2 rounded-full overflow-hidden border border-[#1E2A47]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] transition-all duration-500"
                  style={{ width: '68%' }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
                <span>Topic 4 of 6</span>
                <span>Next: Dictionary Mapping</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-[#1E2A47] flex items-center justify-between">
            <span className="text-xs text-[#94A3B8] hidden sm:inline">
              12 peer mentors available
            </span>
            <button
              onClick={() => {
                const session: LearningSession = {
                  id: `session-cont-${Date.now()}`,
                  learnerId: currentUser?.id || 'user-ojaswitha',
                  learnerName: currentUser?.fullName || 'Ojaswitha',
                  learnerAvatar: currentUser?.avatarUrl || '',
                  learnerCollege: currentUser?.college || 'UC Berkeley',
                  mentorId: 'user-rahul',
                  mentorName: 'Rahul',
                  mentorAvatar:
                    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
                  mentorCollege: 'UC Berkeley',
                  skill: 'Python',
                  topic: 'Python — Nested Loops & Comprehensions',
                  status: 'active',
                  durationMinutes: 20,
                  isRecording: false,
                  recordingConsentLearner: false,
                  recordingConsentMentor: false,
                  recordingSeconds: 0,
                  sharedNotes: 'Continuing notes on Python 2D nested loops and matrix manipulation.',
                  chatMessages: [],
                  copilotItems: [],
                };
                onStartSession(session);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white text-xs font-bold transition-all shadow-md shadow-[#8B5CF6]/20 cursor-pointer flex items-center gap-2"
            >
              <span>Continue Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Help Card (5 Cols) */}
        <div className="md:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-[#151E33] via-[#11182B] to-[#0B1020] border border-[#1E2A47] hover:border-[#22D3EE]/50 transition-all shadow-md flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/20 text-[#22D3EE] border border-[#8B5CF6]/30 flex items-center justify-center">
              <Zap className="w-5 h-5 fill-current" />
            </div>

            <h3 className="text-lg font-bold text-[#F8FAFC]">Stuck on something?</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Don’t spend hours in frustration. Ask a quick doubt and connect with someone who knows it in 5 to 30 minutes.
            </p>
          </div>

          <div className="pt-4 border-t border-[#1E2A47] space-y-2">
            <button
              onClick={onOpenQuickDoubt}
              className="w-full py-2.5 rounded-xl bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-[#0B1020] text-xs font-extrabold transition-all shadow-md shadow-[#22D3EE]/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Get Help</span>
            </button>
            <p className="text-[11px] text-center text-[#94A3B8]">
              Connect with someone who knows it.
            </p>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. UPCOMING SESSIONS (PYTHON DOUBT SESSION) */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-[#F8FAFC] tracking-tight flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#8B5CF6]" />
            <span>Upcoming Sessions</span>
          </h2>
          <button
            onClick={() => onNavigate('sessions')}
            className="text-xs font-semibold text-[#22D3EE] hover:underline cursor-pointer"
          >
            View all sessions
          </button>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#151E33] border border-[#1E2A47] hover:border-[#8B5CF6]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={upcomingSession.mentorAvatar}
                alt={upcomingSession.mentorName}
                className="w-12 h-12 rounded-xl object-cover border border-[#8B5CF6]/40"
              />
              <span className="w-3 h-3 rounded-full bg-[#34D399] ring-2 ring-[#151E33] absolute -bottom-0.5 -right-0.5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#F8FAFC]">
                  {upcomingSession.topic}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Confirmed
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                {upcomingSession.mentorName} × {currentUser?.fullName || 'Ojaswitha'}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-[#94A3B8] mt-1 font-mono">
                <span className="flex items-center gap-1 text-[#22D3EE]">
                  <Clock className="w-3 h-3" /> Today · 6:30 PM
                </span>
                <span>•</span>
                <span>20 minutes</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onStartSession(upcomingSession)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white text-xs font-bold shadow-md shadow-[#8B5CF6]/20 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Join Session</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. RECOMMENDED MENTORS (HORIZONTAL CARDS) */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#F8FAFC] tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#22D3EE]" />
              <span>Recommended Mentors</span>
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Ranked by topic expertise, clarity rating, and schedule alignment.
            </p>
          </div>

          <button
            onClick={() => onNavigate('learn')}
            className="text-xs font-semibold text-[#8B5CF6] hover:text-[#C4B5FD] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Explore all</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mentors.slice(0, 3).map((mentor) => {
            const primarySkill = mentor.skillsToTeach[0] || {
              name: 'Python',
              level: 'Advanced',
            };
            const matchScore = mentor.id === 'user-rahul' ? 94 : 91;

            return (
              <div
                key={mentor.id}
                className="p-5 rounded-2xl bg-[#151E33] border border-[#1E2A47] hover:border-[#8B5CF6]/50 transition-all shadow-md flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Match & Availability */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#8B5CF6]/20 text-[#22D3EE] border border-[#8B5CF6]/30 font-mono">
                      {matchScore}% Match
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-[11px] text-[#34D399] font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
                      Available now
                    </span>
                  </div>

                  {/* Mentor Header */}
                  <div className="flex items-start gap-3">
                    <img
                      src={mentor.avatarUrl}
                      alt={mentor.fullName}
                      className="w-12 h-12 rounded-xl object-cover border border-[#1E2A47] group-hover:border-[#8B5CF6]/60 transition-colors shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-[#F8FAFC] truncate">
                        {mentor.fullName}
                      </h3>
                      <p className="text-xs font-medium text-[#22D3EE]">
                        {primarySkill.name} Mentor
                      </p>
                      <p className="text-[11px] text-[#94A3B8] truncate">
                        {mentor.course} • {mentor.college}
                      </p>
                    </div>
                  </div>

                  {/* Quantitative Stats Row */}
                  <div className="flex items-center gap-3 text-xs text-[#94A3B8] font-mono pt-1">
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      ⭐ {mentor.reputation.averageRating}
                    </span>
                    <span>•</span>
                    <span>{mentor.reputation.learnersHelped} helped</span>
                    <span>•</span>
                    <span className="text-[#34D399]">95% clarity</span>
                  </div>

                  <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                    {mentor.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1E2A47] flex items-center gap-2">
                  <button
                    onClick={() => onViewProfile(mentor.id)}
                    className="flex-1 py-2 rounded-xl bg-[#11182B] hover:bg-[#1A2540] text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer text-center"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      const session: LearningSession = {
                        id: `session-conn-${Date.now()}`,
                        learnerId: currentUser?.id || 'user-ojaswitha',
                        learnerName: currentUser?.fullName || 'Ojaswitha',
                        learnerAvatar: currentUser?.avatarUrl || '',
                        learnerCollege: currentUser?.college || 'UC Berkeley',
                        mentorId: mentor.id,
                        mentorName: mentor.fullName,
                        mentorAvatar: mentor.avatarUrl,
                        mentorCollege: mentor.college,
                        skill: primarySkill.name,
                        topic: `1-on-1 Session: ${primarySkill.name}`,
                        status: 'active',
                        durationMinutes: 20,
                        isRecording: false,
                        recordingConsentLearner: false,
                        recordingConsentMentor: false,
                        recordingSeconds: 0,
                        sharedNotes: '',
                        chatMessages: [],
                        copilotItems: [],
                      };
                      onStartSession(session);
                    }}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white text-xs font-bold transition-all shadow-xs cursor-pointer text-center"
                  >
                    Connect
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
