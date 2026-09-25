import React, { useState, useEffect } from 'react';
import {
  Search,
  ArrowRight,
  Star,
  Users,
  Play,
  Calendar,
  Clock,
  ChevronRight,
  Flame,
  CheckCircle2,
  Zap,
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in duration-150">
      {/* ---------------------------------------------------- */}
      {/* 1. HEADER & SEARCH */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2933] tracking-tight">
            {getGreeting()}, {currentUser?.fullName || 'Ojaswitha'} 👋
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            What would you like to learn today?
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
          <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Ask for help, find a mentor, or explore a skill..."
            className="w-full bg-white border border-[#E5EAE7] rounded-xl pl-10 pr-24 py-3 text-xs sm:text-sm text-[#1F2933] placeholder-[#6B7280] focus:outline-none focus:border-[#3F6B5B] transition-all shadow-xs"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-lg bg-[#3F6B5B] hover:bg-[#34594B] text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Explore
          </button>
        </form>
      </div>

      {/* Quick Overview Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-[#E5EAE7] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#F7F8F5] text-[#3F6B5B] border border-[#E5EAE7] flex items-center justify-center font-bold text-sm">
            <Flame className="w-4 h-4 text-[#D99B26] fill-current" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#6B7280]">Learning Streak</p>
            <p className="text-sm font-bold text-[#1F2933] font-mono tabular-nums">7 Days</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E5EAE7] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#DCE9E2] text-[#3F6B5B] flex items-center justify-center font-bold text-sm">
            <Users className="w-4 h-4 text-[#3F6B5B]" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#6B7280]">Learners Helped</p>
            <p className="text-sm font-bold text-[#1F2933] font-mono tabular-nums">23 Students</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E5EAE7] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#F7F8F5] text-[#3F6B5B] border border-[#E5EAE7] flex items-center justify-center font-bold text-sm">
            <Star className="w-4 h-4 text-[#D99B26] fill-current" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#6B7280]">Teaching Rating</p>
            <p className="text-sm font-bold text-[#1F2933] font-mono tabular-nums">4.8 / 5.0</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E5EAE7] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#DCE9E2] text-[#387B62] flex items-center justify-center font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-[#387B62]" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#6B7280]">Sessions Completed</p>
            <p className="text-sm font-bold text-[#1F2933] font-mono tabular-nums">18 Sessions</p>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. CONTINUE LEARNING & QUICK HELP (HERO CARDS) */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Continue Learning Card */}
        <div className="md:col-span-7 p-6 rounded-2xl bg-white border border-[#E5EAE7] transition-all flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-[#DCE9E2] text-[#3F6B5B]">
                Continue Learning
              </span>
              <span className="text-xs font-mono font-bold text-[#3F6B5B] tabular-nums">
                68% Completed
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#1F2933] tracking-tight">
                Python — Nested Loops
              </h3>
              <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                Last reviewed: 2D Matrix traversal with Rahul (4 hours ago). Ready for next practice checkpoint.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="w-full bg-[#F7F8F5] h-2 rounded-full overflow-hidden border border-[#E5EAE7]">
                <div
                  className="h-full rounded-full bg-[#3F6B5B] transition-all duration-300"
                  style={{ width: '68%' }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
                <span>Topic 4 of 6</span>
                <span>Next: Dictionary Comprehensions</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5EAE7] flex items-center justify-between">
            <span className="text-xs text-[#6B7280]">
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
                  topic: 'Python — Nested Loops',
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
              className="px-5 py-2.5 rounded-xl bg-[#3F6B5B] hover:bg-[#34594B] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2"
            >
              <span>Continue Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Help Card (Highlighted Sage/Cream Card) */}
        <div className="md:col-span-5 p-6 rounded-2xl bg-[#F0F4F1] border border-[#DCE9E2] transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#DCE9E2] text-[#3F6B5B] flex items-center justify-center">
              <Zap className="w-5 h-5 fill-current" />
            </div>

            <h3 className="text-lg font-bold text-[#1F2933]">Stuck on something?</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Find someone who can help you understand it in a 5 to 30-minute peer sync.
            </p>
          </div>

          <div className="pt-4 border-t border-[#DCE9E2] space-y-2">
            <button
              onClick={onOpenQuickDoubt}
              className="w-full py-2.5 rounded-xl bg-[#3F6B5B] hover:bg-[#34594B] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Get Help</span>
            </button>
            <p className="text-[11px] text-center text-[#6B7280]">
              Fast matching with active mentors on campus.
            </p>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. UPCOMING SESSIONS */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#1F2933] tracking-tight flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#3F6B5B]" />
            <span>Upcoming Sessions</span>
          </h2>
          <button
            onClick={() => onNavigate('sessions')}
            className="text-xs font-semibold text-[#3F6B5B] hover:underline cursor-pointer"
          >
            View all sessions
          </button>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5EAE7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={upcomingSession.mentorAvatar}
                alt={upcomingSession.mentorName}
                className="w-12 h-12 rounded-xl object-cover border border-[#E5EAE7]"
              />
              <span className="w-3 h-3 rounded-full bg-[#387B62] ring-2 ring-white absolute -bottom-0.5 -right-0.5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-[#1F2933]">
                  {upcomingSession.topic}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#DCE9E2] text-[#3F6B5B]">
                  Confirmed
                </span>
              </div>
              <p className="text-xs text-[#6B7280] mt-0.5">
                {upcomingSession.mentorName} × {currentUser?.fullName || 'Ojaswitha'}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-[#6B7280] mt-1 font-mono">
                <span className="flex items-center gap-1 text-[#3F6B5B] font-semibold">
                  <Clock className="w-3 h-3" /> Today · 6:30 PM
                </span>
                <span>•</span>
                <span>20 minutes</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onStartSession(upcomingSession)}
            className="px-5 py-2.5 rounded-xl bg-[#3F6B5B] hover:bg-[#34594B] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Join Session</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. RECOMMENDED MENTORS */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#1F2933] tracking-tight">
              Recommended Mentors
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Ranked by topic expertise, clarity rating, and schedule alignment.
            </p>
          </div>

          <button
            onClick={() => onNavigate('learn')}
            className="text-xs font-semibold text-[#3F6B5B] hover:underline flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Explore all</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Clean White Mentor Cards */}
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
                className="p-5 rounded-2xl bg-white border border-[#E5EAE7] hover:border-[#DCE9E2] transition-all flex flex-col justify-between space-y-4 group shadow-xs"
              >
                <div className="space-y-3">
                  {/* Top Match & Availability */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#DCE9E2] text-[#3F6B5B] font-mono">
                      {matchScore}% Match
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-[11px] text-[#387B62] font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#387B62]" />
                      Available now
                    </span>
                  </div>

                  {/* Mentor Header */}
                  <div className="flex items-start gap-3">
                    <img
                      src={mentor.avatarUrl}
                      alt={mentor.fullName}
                      className="w-12 h-12 rounded-xl object-cover border border-[#E5EAE7] shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-[#1F2933] truncate">
                        {mentor.fullName}
                      </h3>
                      <p className="text-xs font-medium text-[#3F6B5B]">
                        {primarySkill.name} Mentor
                      </p>
                      <p className="text-[11px] text-[#6B7280] truncate">
                        {mentor.course} • {mentor.college}
                      </p>
                    </div>
                  </div>

                  {/* Quantitative Stats Row */}
                  <div className="flex items-center gap-2.5 text-xs text-[#6B7280] font-mono pt-1">
                    <span className="text-[#D99B26] font-bold flex items-center gap-1">
                      ⭐ {mentor.reputation.averageRating}
                    </span>
                    <span>•</span>
                    <span>{mentor.reputation.learnersHelped} helped</span>
                    <span>•</span>
                    <span className="text-[#387B62]">95% clarity</span>
                  </div>

                  <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
                    {mentor.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E5EAE7] flex items-center gap-2">
                  <button
                    onClick={() => onViewProfile(mentor.id)}
                    className="flex-1 py-2 rounded-lg bg-[#F7F8F5] hover:bg-[#EEF2EE] text-xs font-semibold text-[#6B7280] hover:text-[#1F2933] transition-colors cursor-pointer text-center"
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
                    className="flex-1 py-2 rounded-lg bg-[#3F6B5B] hover:bg-[#34594B] text-white text-xs font-semibold transition-colors cursor-pointer text-center"
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
