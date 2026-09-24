import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Award,
  ShieldCheck,
  Star,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  TrendingUp,
  Flame,
  Check,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/storeService';
import { LearningRequest, LearningSession } from '../../types';

interface MentorPortalProps {
  onStartSession: (session: LearningSession) => void;
  onOpenQuickDoubt: () => void;
}

export const MentorPortal: React.FC<MentorPortalProps> = ({
  onStartSession,
  onOpenQuickDoubt,
}) => {
  const { currentUser, updateProfile } = useAuth();
  const [requests, setRequests] = useState<LearningRequest[]>([]);
  const [isAvailableNow, setIsAvailableNow] = useState(true);

  // Form State for "Create Teaching Session"
  const [sessionSkill, setSessionSkill] = useState('Python');
  const [sessionTopic, setSessionTopic] = useState('Mastering Nested Loops & Comprehensions');
  const [sessionDifficulty, setSessionDifficulty] = useState('Beginner');
  const [sessionDuration, setSessionDuration] = useState('20 min');
  const [sessionAvailability, setSessionAvailability] = useState('Available Now');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  useEffect(() => {
    setRequests(store.getRequests().filter((r) => r.status === 'open'));
  }, []);

  const handleStartTeaching = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);

    setTimeout(() => {
      setIsPublishing(false);
      setPublishSuccess(true);

      setTimeout(() => {
        // Launch live teaching session
        const session: LearningSession = {
          id: `session-teach-${Date.now()}`,
          learnerId: 'user-priya',
          learnerName: 'Priya N.',
          learnerAvatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
          learnerCollege: 'Georgia Tech',
          mentorId: currentUser?.id || 'user-ojaswitha',
          mentorName: currentUser?.fullName || 'Ojaswitha',
          mentorAvatar: currentUser?.avatarUrl || '',
          mentorCollege: currentUser?.college || 'UC Berkeley',
          skill: sessionSkill,
          topic: sessionTopic,
          status: 'active',
          durationMinutes: parseInt(sessionDuration) || 20,
          isRecording: false,
          recordingConsentLearner: false,
          recordingConsentMentor: false,
          recordingSeconds: 0,
          sharedNotes: `Teaching Session: ${sessionTopic}\nMentor: ${currentUser?.fullName}\nDifficulty: ${sessionDifficulty}`,
          chatMessages: [
            {
              id: 'm1',
              senderId: 'user-priya',
              senderName: 'Priya N.',
              senderRole: 'learner',
              text: `Hello ${currentUser?.fullName}! Excited to learn ${sessionTopic} with you today!`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ],
          copilotItems: [],
        };
        onStartSession(session);
      }, 800);
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10 animate-in fade-in duration-200">
      {/* ---------------------------------------------------- */}
      {/* 1. HEADER */}
      {/* ---------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
            Share what you know.
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Solidify your understanding by mentoring peers, hosting focused micro-sessions, and earning reputation.
          </p>
        </div>

        {/* Live Availability Toggle */}
        <div className="flex items-center gap-3 bg-[#151E33] border border-[#1E2A47] px-4 py-2 rounded-2xl shadow-xs shrink-0">
          <span className="text-xs font-semibold text-[#F8FAFC]">Live Status:</span>
          <button
            onClick={() => setIsAvailableNow(!isAvailableNow)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isAvailableNow
                ? 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40'
                : 'bg-[#11182B] text-[#94A3B8] border border-[#1E2A47]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isAvailableNow ? 'bg-[#34D399] animate-pulse' : 'bg-stone-500'
              }`}
            />
            <span>{isAvailableNow ? 'Available for Doubts' : 'Away / Busy'}</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. YOUR TEACHING PROFILE CARD */}
      {/* ---------------------------------------------------- */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#151E33] border border-[#1E2A47] shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2A47] pb-5">
          <div className="flex items-center gap-4">
            <img
              src={
                currentUser?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
              }
              alt={currentUser?.fullName || 'User'}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-[#8B5CF6]/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#F8FAFC]">
                  {currentUser?.fullName || 'Ojaswitha'}
                </h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#8B5CF6]/20 text-[#22D3EE] border border-[#8B5CF6]/30">
                  Verified Mentor
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                {currentUser?.course} • {currentUser?.college}
              </p>
            </div>
          </div>

          {/* Core Stats as requested in Prompt */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 bg-[#0B1020] px-5 py-3 rounded-2xl border border-[#1E2A47] text-center font-mono">
            <div>
              <p className="text-base sm:text-lg font-extrabold text-[#F8FAFC] tabular-nums">23</p>
              <p className="text-[11px] text-[#94A3B8]">learners helped</p>
            </div>
            <div className="border-x border-[#1E2A47] px-2 sm:px-4">
              <p className="text-base sm:text-lg font-extrabold text-[#22D3EE] tabular-nums">18</p>
              <p className="text-[11px] text-[#94A3B8]">sessions</p>
            </div>
            <div>
              <p className="text-base sm:text-lg font-extrabold text-amber-400 tabular-nums">⭐ 4.8</p>
              <p className="text-[11px] text-[#94A3B8]">rating</p>
            </div>
          </div>
        </div>

        {/* Teaching Skills Chips */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
              Skills You Can Teach
            </span>
            <span className="text-xs text-[#8B5CF6] hover:underline cursor-pointer">
              + Add another skill
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Skill 1: Python */}
            <div className="p-3.5 rounded-xl bg-[#11182B] border border-[#1E2A47] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#F8FAFC]">Python</p>
                <p className="text-[11px] text-[#94A3B8]">Loops, Algorithms, Data Structures</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-[#34D399] border border-emerald-500/30">
                Verified
              </span>
            </div>

            {/* Skill 2: UI/UX */}
            <div className="p-3.5 rounded-xl bg-[#11182B] border border-[#1E2A47] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#F8FAFC]">UI/UX</p>
                <p className="text-[11px] text-[#94A3B8]">Figma, Design Systems, Wireframing</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-[#34D399] border border-emerald-500/30">
                Verified
              </span>
            </div>

            {/* Skill 3: Web Development */}
            <div className="p-3.5 rounded-xl bg-[#11182B] border border-[#1E2A47] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#F8FAFC]">Web Development</p>
                <p className="text-[11px] text-[#94A3B8]">HTML/CSS, React, Tailwind, APIs</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-[#34D399] border border-emerald-500/30">
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. CREATE TEACHING SESSION FORM */}
      {/* ---------------------------------------------------- */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#151E33] border border-[#1E2A47] shadow-xl space-y-6">
        <div>
          <h2 className="text-lg font-bold text-[#F8FAFC] tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
            <span>Create Teaching Session</span>
          </h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Host a focused 1-on-1 or micro-workshop for learners on the platform.
          </p>
        </div>

        <form onSubmit={handleStartTeaching} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Skill Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                Skill
              </label>
              <select
                value={sessionSkill}
                onChange={(e) => setSessionSkill(e.target.value)}
                className="w-full bg-[#0B1020] border border-[#1E2A47] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#F8FAFC] focus:outline-hidden focus:border-[#8B5CF6] transition-all"
              >
                <option value="Python">Python</option>
                <option value="UI/UX">UI/UX Design</option>
                <option value="Web Development">Web Development</option>
                <option value="Data Structures & Algorithms">Data Structures &amp; Algorithms</option>
              </select>
            </div>

            {/* Difficulty */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSessionDifficulty(diff)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                      sessionDifficulty === diff
                        ? 'bg-[#8B5CF6] text-white shadow-xs'
                        : 'bg-[#0B1020] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#1E2A47]'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Input */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                Session Topic
              </label>
              <input
                type="text"
                value={sessionTopic}
                onChange={(e) => setSessionTopic(e.target.value)}
                placeholder="e.g. Master Nested Loops & Comprehensions"
                className="w-full bg-[#0B1020] border border-[#1E2A47] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-hidden focus:border-[#8B5CF6] transition-all"
              />
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['15 min', '20 min', '30 min', '45 min'].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setSessionDuration(dur)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center font-mono ${
                      sessionDuration === dur
                        ? 'bg-[#22D3EE] text-[#0B1020] shadow-xs'
                        : 'bg-[#0B1020] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#1E2A47]'
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                Availability Slot
              </label>
              <select
                value={sessionAvailability}
                onChange={(e) => setSessionAvailability(e.target.value)}
                className="w-full bg-[#0B1020] border border-[#1E2A47] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#F8FAFC] focus:outline-hidden focus:border-[#8B5CF6] transition-all"
              >
                <option value="Available Now">Available Now (Instant broadcast)</option>
                <option value="Today · 6:00 PM">Today · 6:00 PM</option>
                <option value="Today · 8:30 PM">Today · 8:30 PM</option>
                <option value="Tomorrow · 4:00 PM">Tomorrow · 4:00 PM</option>
              </select>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-[#1E2A47] flex items-center justify-between">
            <p className="text-xs text-[#94A3B8]">
              Published sessions are matched with students actively stuck on this topic.
            </p>

            <button
              type="submit"
              disabled={isPublishing}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white text-xs font-bold shadow-md shadow-[#8B5CF6]/25 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isPublishing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Launching Session...</span>
                </>
              ) : publishSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Session Live! Entering...</span>
                </>
              ) : (
                <>
                  <span>Start Teaching</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. LIVE OPEN DOUBT QUEUE */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#F8FAFC] tracking-tight">
              Students Waiting for Help in Your Skills
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Instant requests from peers actively studying Python and UI/UX
            </p>
          </div>
          <span className="text-xs font-mono text-[#22D3EE] font-bold">
            {requests.length} students waiting
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.slice(0, 4).map((req) => (
            <div
              key={req.id}
              className="p-5 rounded-2xl bg-[#151E33] border border-[#1E2A47] hover:border-[#8B5CF6]/50 transition-all flex flex-col justify-between space-y-3 shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#8B5CF6]/20 text-[#22D3EE] border border-[#8B5CF6]/30">
                    {req.skill}
                  </span>
                  <span className="text-xs font-mono text-[#94A3B8] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#22D3EE]" /> {req.durationMinutes}m budget
                  </span>
                </div>

                <h4 className="text-xs font-bold text-[#F8FAFC]">
                  &ldquo;{req.topic}&rdquo;
                </h4>

                <p className="text-xs text-[#94A3B8] line-clamp-2">
                  {req.description}
                </p>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-[#94A3B8]">
                  <span>{req.learnerName}</span>
                  <span>•</span>
                  <span>{req.learnerCollege}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1E2A47] flex justify-end">
                <button
                  onClick={() => {
                    const session: LearningSession = {
                      id: `session-acc-${Date.now()}`,
                      learnerId: req.learnerId,
                      learnerName: req.learnerName,
                      learnerAvatar: req.learnerAvatar,
                      learnerCollege: req.learnerCollege,
                      mentorId: currentUser?.id || 'user-ojaswitha',
                      mentorName: currentUser?.fullName || 'Ojaswitha',
                      mentorAvatar: currentUser?.avatarUrl || '',
                      mentorCollege: currentUser?.college || 'UC Berkeley',
                      skill: req.skill,
                      topic: req.topic,
                      status: 'active',
                      durationMinutes: req.durationMinutes,
                      isRecording: false,
                      recordingConsentLearner: false,
                      recordingConsentMentor: false,
                      recordingSeconds: 0,
                      sharedNotes: `Solving Doubt: ${req.topic}\nLearner: ${req.learnerName}`,
                      chatMessages: [],
                      copilotItems: [],
                    };
                    onStartSession(session);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 fill-current text-[#22D3EE]" />
                  <span>Accept &amp; Help</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
