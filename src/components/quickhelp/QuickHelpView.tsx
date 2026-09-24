import React, { useState } from 'react';
import {
  Zap,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Search,
  Check,
  ShieldCheck,
  Star,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_USERS } from '../../services/seedData';
import { LearningSession } from '../../types';

interface QuickHelpViewProps {
  onStartSession: (session: LearningSession) => void;
  onViewProfile: (userId: string) => void;
}

export const QuickHelpView: React.FC<QuickHelpViewProps> = ({
  onStartSession,
  onViewProfile,
}) => {
  const { currentUser } = useAuth();

  // Form State
  const [doubtText, setDoubtText] = useState(
    "I don't understand nested loops in Python."
  );
  const [selectedUrgency, setSelectedUrgency] = useState<number>(10);
  const [selectedSkill, setSelectedSkill] = useState<string>('Python');

  // Matching Flow State: 'idle' | 'matching' | 'results' | 'requested'
  const [matchingState, setMatchingState] = useState<
    'idle' | 'matching' | 'results' | 'requested'
  >('idle');

  const skillsList = [
    'Python',
    'DSA',
    'React',
    'JavaScript',
    'C++',
    'UI/UX Design',
    'Machine Learning',
    'SQL',
  ];

  const handleFindSomeone = () => {
    setMatchingState('matching');
    setTimeout(() => {
      setMatchingState('results');
    }, 1200);
  };

  const handleRequestHelp = (mentor: typeof DEMO_USERS[0]) => {
    setMatchingState('requested');
    setTimeout(() => {
      const session: LearningSession = {
        id: `session-qh-${Date.now()}`,
        learnerId: currentUser?.id || 'user-ojaswitha',
        learnerName: currentUser?.fullName || 'Ojaswitha',
        learnerAvatar: currentUser?.avatarUrl || '',
        learnerCollege: currentUser?.college || 'UC Berkeley',
        mentorId: mentor.id,
        mentorName: mentor.fullName,
        mentorAvatar: mentor.avatarUrl,
        mentorCollege: mentor.college,
        skill: selectedSkill,
        topic: doubtText || `Quick Doubt in ${selectedSkill}`,
        status: 'active',
        durationMinutes: selectedUrgency,
        isRecording: false,
        recordingConsentLearner: false,
        recordingConsentMentor: false,
        recordingSeconds: 0,
        sharedNotes: `Quick Help Session (${selectedUrgency} min)\nDoubt: ${doubtText}`,
        chatMessages: [
          {
            id: 'msg-init-1',
            senderId: mentor.id,
            senderName: mentor.fullName,
            senderRole: 'mentor',
            text: `Hi ${currentUser?.fullName || 'there'}! I saw your doubt regarding "${doubtText}". Let's break it down!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
        copilotItems: [
          {
            id: 'cp-qh-1',
            type: 'clarification',
            level: 'suggestion',
            confidenceText: 'Quick clarification',
            title: 'Concept Anchor: Nested Loops',
            content: 'In Python, the outer loop runs once, and for each iteration, the inner loop executes completely before moving to the next outer step.',
            targetAudience: 'learner',
            status: 'active',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      };
      onStartSession(session);
    }, 900);
  };

  const matchedMentors = [
    {
      ...DEMO_USERS[1], // Rahul
      matchPercent: 94,
      reasons: [
        'Knows Python',
        'Beginner-friendly',
        'Available now',
        'Similar learning goals',
      ],
    },
    {
      ...DEMO_USERS[2], // Ananya
      matchPercent: 89,
      reasons: [
        'Advanced Programming background',
        'Helped 18 students with Python syntax',
        'Available in 10 min',
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 animate-in fade-in duration-200">
      {/* ---------------------------------------------------- */}
      {/* 1. HEADER */}
      {/* ---------------------------------------------------- */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B5CF6]/20 text-[#22D3EE] border border-[#8B5CF6]/30 text-xs font-bold tracking-wide">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>MICRO-LEARNING ENGINE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
          What are you stuck on?
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8]">
          Get immediate 1-on-1 clarity. Ask your exact doubt, pick a time budget, and connect with a peer mentor.
        </p>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. MAIN INTERACTIVE CARD */}
      {/* ---------------------------------------------------- */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#151E33] border border-[#1E2A47] shadow-xl space-y-6 relative overflow-hidden">
        {/* Ambient accent ring */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-[#8B5CF6]/20 to-[#22D3EE]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Large Input Area */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
            Describe your doubt
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={doubtText}
              onChange={(e) => setDoubtText(e.target.value)}
              placeholder="e.g. I don't understand nested loops in Python."
              className="w-full bg-[#0B1020] border border-[#1E2A47] rounded-2xl p-4 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-hidden focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition-all resize-none shadow-inner"
            />
          </div>
        </div>

        {/* Urgency Selector & Skill Selector in 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Urgency / Duration */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
              Choose Urgency &amp; Duration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 20, 30].map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setSelectedUrgency(dur)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center font-mono ${
                    selectedUrgency === dur
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white shadow-md shadow-[#8B5CF6]/25 border border-[#8B5CF6]'
                      : 'bg-[#11182B] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1A2540] border border-[#1E2A47]'
                  }`}
                >
                  {dur} min
                </button>
              ))}
            </div>
          </div>

          {/* Select Skill */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
              Select Skill
            </label>
            <div className="flex flex-wrap items-center gap-1.5 max-h-24 overflow-y-auto">
              {skillsList.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => setSelectedSkill(skill)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedSkill === skill
                      ? 'bg-[#22D3EE] text-[#0B1020] font-bold shadow-xs'
                      : 'bg-[#11182B] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#1E2A47]'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Find Someone Button */}
        {matchingState === 'idle' && (
          <div className="pt-4 border-t border-[#1E2A47] flex justify-end">
            <button
              type="button"
              onClick={handleFindSomeone}
              disabled={!doubtText.trim()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] hover:from-[#7C3AED] hover:to-[#06B6D4] text-[#0B1020] font-extrabold text-sm transition-all shadow-lg shadow-[#8B5CF6]/20 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-current text-[#0B1020]" />
              <span>Find Someone ({selectedUrgency}m)</span>
              <ArrowRight className="w-4 h-4 text-[#0B1020]" />
            </button>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 3. MATCHING ANIMATION STATE */}
        {/* ---------------------------------------------------- */}
        {matchingState === 'matching' && (
          <div className="pt-6 border-t border-[#1E2A47] py-8 text-center space-y-4 animate-in fade-in duration-200">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-[#8B5CF6]/30 border-t-[#22D3EE] animate-spin" />
              <Sparkles className="w-6 h-6 text-[#22D3EE] animate-pulse" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#F8FAFC]">
                Finding people who can help...
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Scanning available peer mentors in {selectedSkill} with {selectedUrgency}m availability
              </p>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 4. MATCH RESULTS DISPLAY */}
        {/* ---------------------------------------------------- */}
        {(matchingState === 'results' || matchingState === 'requested') && (
          <div className="pt-6 border-t border-[#1E2A47] space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#22D3EE]" />
                  <span>Matching Mentors Found</span>
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Verified peers who have mastered this exact topic
                </p>
              </div>

              <button
                onClick={() => setMatchingState('idle')}
                className="text-xs text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Change topic
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchedMentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="p-5 rounded-2xl bg-[#11182B] border border-[#1E2A47] hover:border-[#8B5CF6]/60 transition-all space-y-4 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={mentor.avatarUrl}
                          alt={mentor.fullName}
                          className="w-12 h-12 rounded-xl object-cover border border-[#8B5CF6]/40"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-[#F8FAFC]">
                            {mentor.fullName}
                          </h4>
                          <p className="text-xs font-semibold text-[#22D3EE]">
                            {selectedSkill}
                          </p>
                          <p className="text-[11px] text-[#94A3B8]">
                            {mentor.college}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#8B5CF6]/20 text-[#22D3EE] border border-[#8B5CF6]/30">
                        {mentor.matchPercent}% Match
                      </span>
                    </div>

                    {/* Stats & Availability */}
                    <div className="flex items-center gap-3 text-xs text-[#94A3B8] font-mono">
                      <span className="text-amber-400 font-bold">⭐ {mentor.reputation.averageRating}</span>
                      <span>•</span>
                      <span className="text-[#34D399] font-medium">🟢 Available now</span>
                    </div>

                    {/* Why this match box */}
                    <div className="p-3 rounded-xl bg-[#0B1020] border border-[#1E2A47] space-y-1.5">
                      <p className="text-[10px] uppercase font-bold text-[#C4B5FD] tracking-wider">
                        Why this match?
                      </p>
                      <ul className="space-y-1">
                        {mentor.reasons.map((r, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
                            <Check className="w-3 h-3 text-[#34D399] shrink-0" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={matchingState === 'requested'}
                      onClick={() => handleRequestHelp(mentor)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white text-xs font-bold transition-all shadow-md shadow-[#8B5CF6]/20 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75"
                    >
                      {matchingState === 'requested' ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Connecting...</span>
                        </>
                      ) : (
                        <>
                          <span>Request Help ({selectedUrgency}m)</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
