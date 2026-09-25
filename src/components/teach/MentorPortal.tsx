import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Zap,
  Check,
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
}) => {
  const { currentUser } = useAuth();
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
      }, 700);
    }, 500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in duration-150">
      {/* ---------------------------------------------------- */}
      {/* 1. HEADER */}
      {/* ---------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2933] tracking-tight">
            Share what you know.
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Solidify your understanding by mentoring peers and hosting focused learning sessions.
          </p>
        </div>

        {/* Live Status Toggle */}
        <div className="flex items-center gap-2.5 bg-white border border-[#E5EAE7] px-3.5 py-1.5 rounded-xl shrink-0">
          <span className="text-xs font-semibold text-[#1F2933]">Availability:</span>
          <button
            onClick={() => setIsAvailableNow(!isAvailableNow)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              isAvailableNow
                ? 'bg-[#DCE9E2] text-[#387B62]'
                : 'bg-[#F7F8F5] text-[#6B7280] border border-[#E5EAE7]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isAvailableNow ? 'bg-[#387B62]' : 'bg-slate-400'
              }`}
            />
            <span>{isAvailableNow ? 'Available' : 'Away'}</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. STUDENT'S TEACHING PROFILE */}
      {/* ---------------------------------------------------- */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E5EAE7] space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5EAE7] pb-5">
          <div className="flex items-center gap-3.5">
            <img
              src={
                currentUser?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
              }
              alt={currentUser?.fullName || 'User'}
              className="w-13 h-13 rounded-xl object-cover border border-[#E5EAE7]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#1F2933]">
                  {currentUser?.fullName || 'Ojaswitha'}
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#DCE9E2] text-[#3F6B5B]">
                  Verified Mentor
                </span>
              </div>
              <p className="text-xs text-[#6B7280]">
                {currentUser?.course} • {currentUser?.college}
              </p>
            </div>
          </div>

          {/* Stats: Learners Helped, Sessions Completed, Rating */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 bg-[#F7F8F5] px-4 py-2.5 rounded-xl border border-[#E5EAE7] text-center font-mono">
            <div>
              <p className="text-base sm:text-lg font-bold text-[#1F2933] tabular-nums">23</p>
              <p className="text-[11px] text-[#6B7280]">Learners helped</p>
            </div>
            <div className="border-x border-[#E5EAE7] px-2 sm:px-4">
              <p className="text-base sm:text-lg font-bold text-[#3F6B5B] tabular-nums">18</p>
              <p className="text-[11px] text-[#6B7280]">Sessions completed</p>
            </div>
            <div>
              <p className="text-base sm:text-lg font-bold text-[#D99B26] tabular-nums">⭐ 4.8</p>
              <p className="text-[11px] text-[#6B7280]">Rating</p>
            </div>
          </div>
        </div>

        {/* Skills They Teach */}
        <div className="space-y-2.5">
          <span className="text-xs font-semibold text-[#1F2933]">
            Skills you teach
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#F7F8F5] border border-[#E5EAE7] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#1F2933]">Python</p>
                <p className="text-[11px] text-[#6B7280]">Loops, Algorithms, Data Structures</p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#DCE9E2] text-[#387B62]">
                Verified
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F8F5] border border-[#E5EAE7] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#1F2933]">UI/UX Design</p>
                <p className="text-[11px] text-[#6B7280]">Figma, Design Systems, Tokens</p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#DCE9E2] text-[#387B62]">
                Verified
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F8F5] border border-[#E5EAE7] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#1F2933]">Web Development</p>
                <p className="text-[11px] text-[#6B7280]">React, TypeScript, Responsive CSS</p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#DCE9E2] text-[#387B62]">
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. CREATE TEACHING SESSION FORM */}
      {/* ---------------------------------------------------- */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E5EAE7] space-y-5 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#1F2933] tracking-tight">
            Create Teaching Session
          </h2>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Host a focused 1-on-1 session or topic review for peers.
          </p>
        </div>

        <form onSubmit={handleStartTeaching} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Skill */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#1F2933]">
                Skill
              </label>
              <select
                value={sessionSkill}
                onChange={(e) => setSessionSkill(e.target.value)}
                className="w-full bg-[#F7F8F5] border border-[#E5EAE7] rounded-lg px-3.5 py-2 text-xs text-[#1F2933] focus:outline-none focus:border-[#3F6B5B]"
              >
                <option value="Python">Python</option>
                <option value="UI/UX">UI/UX Design</option>
                <option value="Web Development">Web Development</option>
                <option value="Data Structures & Algorithms">Data Structures &amp; Algorithms</option>
              </select>
            </div>

            {/* Difficulty Level */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#1F2933]">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSessionDifficulty(diff)}
                    className={`py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-center ${
                      sessionDifficulty === diff
                        ? 'bg-[#3F6B5B] text-white'
                        : 'bg-[#F7F8F5] text-[#6B7280] hover:text-[#1F2933] border border-[#E5EAE7]'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Input */}
            <div className="space-y-1 md:col-span-2">
              <label className="block text-xs font-semibold text-[#1F2933]">
                Session Topic
              </label>
              <input
                type="text"
                value={sessionTopic}
                onChange={(e) => setSessionTopic(e.target.value)}
                placeholder="e.g. Master Nested Loops & Comprehensions"
                className="w-full bg-[#F7F8F5] border border-[#E5EAE7] rounded-lg px-3.5 py-2 text-xs text-[#1F2933] placeholder-[#6B7280] focus:outline-none focus:border-[#3F6B5B]"
              />
            </div>

            {/* Duration */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#1F2933]">
                Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['15 min', '20 min', '30 min', '45 min'].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setSessionDuration(dur)}
                    className={`py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-center font-mono ${
                      sessionDuration === dur
                        ? 'bg-[#3F6B5B] text-white'
                        : 'bg-[#F7F8F5] text-[#6B7280] hover:text-[#1F2933] border border-[#E5EAE7]'
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#1F2933]">
                Availability Slot
              </label>
              <select
                value={sessionAvailability}
                onChange={(e) => setSessionAvailability(e.target.value)}
                className="w-full bg-[#F7F8F5] border border-[#E5EAE7] rounded-lg px-3.5 py-2 text-xs text-[#1F2933] focus:outline-none focus:border-[#3F6B5B]"
              >
                <option value="Available Now">Available Now</option>
                <option value="Today · 6:00 PM">Today · 6:00 PM</option>
                <option value="Today · 8:30 PM">Today · 8:30 PM</option>
                <option value="Tomorrow · 4:00 PM">Tomorrow · 4:00 PM</option>
              </select>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-3 border-t border-[#E5EAE7] flex items-center justify-between">
            <p className="text-xs text-[#6B7280]">
              Matches students searching for help in this topic.
            </p>

            <button
              type="submit"
              disabled={isPublishing}
              className="px-6 py-2.5 rounded-lg bg-[#3F6B5B] hover:bg-[#34594B] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isPublishing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Launching Session...</span>
                </>
              ) : publishSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Session Live! Joining...</span>
                </>
              ) : (
                <>
                  <span>Create Teaching Session</span>
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
            <h2 className="text-base font-bold text-[#1F2933] tracking-tight">
              Students Waiting for Help in Your Skills
            </h2>
            <p className="text-xs text-[#6B7280]">
              Instant requests from peers actively studying Python and UI/UX.
            </p>
          </div>
          <span className="text-xs font-mono text-[#3F6B5B] font-semibold">
            {requests.length} students waiting
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.slice(0, 4).map((req) => (
            <div
              key={req.id}
              className="p-5 rounded-2xl bg-white border border-[#E5EAE7] hover:border-[#DCE9E2] transition-all flex flex-col justify-between space-y-3 shadow-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#DCE9E2] text-[#3F6B5B]">
                    {req.skill}
                  </span>
                  <span className="text-xs font-mono text-[#6B7280] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#3F6B5B]" /> {req.durationMinutes}m budget
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-[#1F2933]">
                  &ldquo;{req.topic}&rdquo;
                </h4>

                <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
                  {req.description}
                </p>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-[#6B7280]">
                  <span>{req.learnerName}</span>
                  <span>•</span>
                  <span>{req.learnerCollege}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E5EAE7] flex justify-end">
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
                  className="px-4 py-2 rounded-lg bg-[#3F6B5B] hover:bg-[#34594B] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
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
