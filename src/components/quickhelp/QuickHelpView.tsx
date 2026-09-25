import React, { useState } from 'react';
import {
  Zap,
  Clock,
  ArrowRight,
  Check,
  RefreshCw,
  Star,
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
    }, 900);
  };

  const handleRequestHelp = (mentor: (typeof DEMO_USERS)[0]) => {
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
            text: `Hi ${currentUser?.fullName || 'there'}! I saw your doubt regarding "${doubtText}". Let's walk through it together!`,
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
    }, 700);
  };

  const matchedMentors = [
    {
      ...DEMO_USERS[1], // Rahul
      matchPercent: 94,
      reasons: [
        'Extensive Python experience & beginner-friendly explanations',
        'Available now for a 10m session',
        'Helped 23 students with algorithms & nested iteration',
      ],
    },
    {
      ...DEMO_USERS[2], // Ananya
      matchPercent: 89,
      reasons: [
        'Strong programming fundamentals background',
        'Available now for 10m',
        'High student clarity rating in coding walkthroughs',
      ],
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 animate-in fade-in duration-150">
      {/* ---------------------------------------------------- */}
      {/* 1. HEADER */}
      {/* ---------------------------------------------------- */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2933] tracking-tight">
          What are you stuck on?
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280]">
          Describe your doubt, choose a time budget, and connect with a peer mentor who can explain it clearly.
        </p>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. MAIN CARD */}
      {/* ---------------------------------------------------- */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5EAE7] space-y-6 shadow-xs">
        {/* Large Clean Input */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#1F2933]">
            Describe your doubt...
          </label>
          <textarea
            rows={3}
            value={doubtText}
            onChange={(e) => setDoubtText(e.target.value)}
            placeholder="e.g. I don't understand nested loops in Python."
            className="w-full bg-[#F7F8F5] border border-[#E5EAE7] rounded-xl p-4 text-xs sm:text-sm text-[#1F2933] placeholder-[#6B7280] focus:outline-none focus:border-[#3F6B5B] focus:bg-white transition-all resize-none"
          />
        </div>

        {/* Urgency Selector & Skill Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
          {/* Options: 5 min | 10 min | 20 min | 30 min */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#1F2933]">
              Duration Options
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 20, 30].map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setSelectedUrgency(dur)}
                  className={`py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-center font-mono ${
                    selectedUrgency === dur
                      ? 'bg-[#3F6B5B] text-white font-bold'
                      : 'bg-[#F7F8F5] text-[#6B7280] hover:text-[#1F2933] border border-[#E5EAE7]'
                  }`}
                >
                  {dur} min
                </button>
              ))}
            </div>
          </div>

          {/* Select Skill */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#1F2933]">
              Select Skill: <span className="text-[#3F6B5B] font-bold">{selectedSkill}</span>
            </label>
            <div className="flex flex-wrap items-center gap-1.5 max-h-24 overflow-y-auto">
              {skillsList.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => setSelectedSkill(skill)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    selectedSkill === skill
                      ? 'bg-[#DCE9E2] text-[#3F6B5B] font-semibold border border-[#3F6B5B]/30'
                      : 'bg-[#F7F8F5] text-[#6B7280] hover:text-[#1F2933] border border-[#E5EAE7]'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CTA: Find Someone */}
        {matchingState === 'idle' && (
          <div className="pt-4 border-t border-[#E5EAE7] flex justify-end">
            <button
              type="button"
              onClick={handleFindSomeone}
              disabled={!doubtText.trim()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#3F6B5B] hover:bg-[#34594B] text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Find Someone ({selectedUrgency}m)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 3. MATCHING ANIMATION */}
        {/* ---------------------------------------------------- */}
        {matchingState === 'matching' && (
          <div className="pt-6 border-t border-[#E5EAE7] py-6 text-center space-y-3 animate-in fade-in duration-150">
            <div className="w-8 h-8 mx-auto rounded-full border-2 border-[#DCE9E2] border-t-[#3F6B5B] animate-spin" />
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-[#1F2933]">
                Matching with peer mentors...
              </h3>
              <p className="text-xs text-[#6B7280]">
                Scanning available students in {selectedSkill} ready for a {selectedUrgency}m doubt session
              </p>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 4. MATCH RESULTS DISPLAY */}
        {/* ---------------------------------------------------- */}
        {(matchingState === 'results' || matchingState === 'requested') && (
          <div className="pt-6 border-t border-[#E5EAE7] space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1F2933]">
                  Available Mentors Found
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Peers ready to help clarify this doubt right now
                </p>
              </div>

              <button
                onClick={() => setMatchingState('idle')}
                className="text-xs text-[#6B7280] hover:text-[#1F2933] flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Change details
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchedMentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="p-5 rounded-xl bg-white border border-[#E5EAE7] hover:border-[#DCE9E2] transition-all space-y-4 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={mentor.avatarUrl}
                          alt={mentor.fullName}
                          className="w-11 h-11 rounded-xl object-cover border border-[#E5EAE7]"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-[#1F2933]">
                            {mentor.fullName}
                          </h4>
                          <p className="text-xs font-medium text-[#3F6B5B]">
                            {selectedSkill} Mentor
                          </p>
                          <p className="text-[11px] text-[#6B7280]">
                            {mentor.college}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#DCE9E2] text-[#3F6B5B]">
                        {mentor.matchPercent}% Match
                      </span>
                    </div>

                    {/* Stats & Availability */}
                    <div className="flex items-center gap-2.5 text-xs text-[#6B7280] font-mono">
                      <span className="text-[#D99B26] font-bold flex items-center gap-1">
                        ⭐ {mentor.reputation.averageRating}
                      </span>
                      <span>•</span>
                      <span className="text-[#387B62] font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#387B62]" />
                        Available now
                      </span>
                    </div>

                    {/* Subtle Sage Highlight Box for Why they match */}
                    <div className="p-3 rounded-lg bg-[#F0F4F1] border border-[#DCE9E2] space-y-1.5">
                      <p className="text-[10px] uppercase font-semibold text-[#3F6B5B] tracking-wide">
                        Why this match
                      </p>
                      <ul className="space-y-1">
                        {mentor.reasons.map((r, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-[#1F2933]">
                            <Check className="w-3.5 h-3.5 text-[#387B62] shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      disabled={matchingState === 'requested'}
                      onClick={() => handleRequestHelp(mentor)}
                      className="w-full py-2.5 rounded-xl bg-[#3F6B5B] hover:bg-[#34594B] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75"
                    >
                      {matchingState === 'requested' ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Connecting with {mentor.fullName}...</span>
                        </>
                      ) : (
                        <>
                          <span>Connect for Quick Help ({selectedUrgency}m)</span>
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
