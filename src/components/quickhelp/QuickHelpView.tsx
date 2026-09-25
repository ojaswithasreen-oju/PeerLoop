import React, { useState } from 'react';
import {
  Zap,
  Clock,
  ArrowRight,
  Check,
  RefreshCw,
  Star,
  Users,
  ShieldCheck,
  History,
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
  const [selectedDuration, setSelectedDuration] = useState<number>(10);
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

  const handleFindPeer = () => {
    setMatchingState('matching');
    setTimeout(() => {
      setMatchingState('results');
    }, 800);
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
        durationMinutes: selectedDuration,
        isRecording: false,
        recordingConsentLearner: false,
        recordingConsentMentor: false,
        recordingSeconds: 0,
        sharedNotes: `Quick Help Session (${selectedDuration} min)\nDoubt: ${doubtText}`,
        chatMessages: [
          {
            id: 'msg-init-1',
            senderId: mentor.id,
            senderName: mentor.fullName,
            senderRole: 'mentor',
            text: `Hi ${currentUser?.fullName || 'there'}! I saw your doubt: "${doubtText}". Let's jump right in!`,
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

  // Matches based on: Skill, Availability, Learning level, Compatibility, Session history
  const matchedMentors = [
    {
      ...DEMO_USERS[1], // Rahul
      compatibility: 94,
      availabilityText: 'Available now (2m avg reply)',
      learningLevel: 'Beginner to Intermediate friendly',
      sessionHistory: '18 completed doubt sessions • 100% positive feedback',
      skillConfidence: 'Advanced in Python loops, comprehensions & algorithms',
    },
    {
      ...DEMO_USERS[2], // Ananya
      compatibility: 89,
      availabilityText: 'Available now (5m avg reply)',
      learningLevel: 'Intermediate code-review specialist',
      sessionHistory: '12 completed doubt sessions • 95% clarity rating',
      skillConfidence: 'Strong in Python syntax, DSA recursion & clean code',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 animate-in fade-in duration-150">
      {/* ---------------------------------------------------- */}
      {/* 1. EDITORIAL HEADER */}
      {/* ---------------------------------------------------- */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="font-serif text-3xl sm:text-4xl text-[#202924] tracking-tight">
          What are you stuck on?
        </h1>
        <p className="text-xs sm:text-sm text-[#69736D] font-sans">
          Tell us what you're struggling with, pick a duration, and connect with a peer mentor who knows the concept.
        </p>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. MAIN CARD */}
      {/* ---------------------------------------------------- */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E3E1D9] space-y-6 shadow-xs">
        {/* Input: “Tell us what you're struggling with...” */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#202924]">
            Describe your problem:
          </label>
          <textarea
            rows={3}
            value={doubtText}
            onChange={(e) => setDoubtText(e.target.value)}
            placeholder="Tell us what you're struggling with..."
            className="w-full bg-[#F6F4EE] border border-[#E3E1D9] rounded-xl p-4 text-xs sm:text-sm text-[#202924] placeholder-[#69736D] focus:outline-none focus:border-[#496456] focus:bg-white transition-all resize-none"
          />
        </div>

        {/* Duration: 5 min · 10 min · 20 min · 30 min & Skill Picker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
          {/* Duration Options */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#202924]">
              Duration Budget
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 20, 30].map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setSelectedDuration(dur)}
                  className={`py-2 rounded-lg text-xs font-semibold font-mono transition-colors cursor-pointer text-center ${
                    selectedDuration === dur
                      ? 'bg-[#496456] text-white font-bold'
                      : 'bg-[#F6F4EE] text-[#69736D] hover:text-[#202924] border border-[#E3E1D9]'
                  }`}
                >
                  {dur} min
                </button>
              ))}
            </div>
          </div>

          {/* Skill Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#202924]">
              Skill Domain: <span className="text-[#496456] font-bold">{selectedSkill}</span>
            </label>
            <div className="flex flex-wrap items-center gap-1.5 max-h-24 overflow-y-auto">
              {skillsList.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => setSelectedSkill(skill)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    selectedSkill === skill
                      ? 'bg-[#DCE6DE] text-[#496456] font-semibold border border-[#496456]/30'
                      : 'bg-[#F6F4EE] text-[#69736D] hover:text-[#202924] border border-[#E3E1D9]'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CTA: Find a peer → */}
        {matchingState === 'idle' && (
          <div className="pt-4 border-t border-[#E3E1D9] flex justify-end">
            <button
              type="button"
              onClick={handleFindPeer}
              disabled={!doubtText.trim()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#496456] hover:bg-[#3d5347] text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 shadow-xs"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Find a peer → ({selectedDuration}m)</span>
            </button>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 3. MATCHING ANIMATION */}
        {/* ---------------------------------------------------- */}
        {matchingState === 'matching' && (
          <div className="pt-6 border-t border-[#E3E1D9] py-6 text-center space-y-3 animate-in fade-in duration-150">
            <div className="w-8 h-8 mx-auto rounded-full border-2 border-[#DCE6DE] border-t-[#496456] animate-spin" />
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-[#202924]">
                Matching with compatible peers...
              </h3>
              <p className="text-xs text-[#69736D]">
                Evaluating skill compatibility, live availability, and past mentoring history
              </p>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 4. MATCH RESULTS DISPLAY */}
        {/* Matches based on: Skill, Availability, Learning level, Compatibility, Session history */}
        {/* ---------------------------------------------------- */}
        {(matchingState === 'results' || matchingState === 'requested') && (
          <div className="pt-6 border-t border-[#E3E1D9] space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#202924]">
                  Compatible Mentors Found
                </h3>
                <p className="text-xs text-[#69736D]">
                  Matched based on skill domain, availability, level, and session history
                </p>
              </div>

              <button
                onClick={() => setMatchingState('idle')}
                className="text-xs text-[#69736D] hover:text-[#202924] flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Change details
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchedMentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="p-5 rounded-2xl bg-white border border-[#E3E1D9] hover:border-[#DCE6DE] transition-all space-y-4 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={mentor.avatarUrl}
                          alt={mentor.fullName}
                          className="w-12 h-12 rounded-xl object-cover border border-[#E3E1D9]"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-[#202924]">
                            {mentor.fullName}
                          </h4>
                          <p className="text-xs font-medium text-[#496456]">
                            {selectedSkill} Mentor
                          </p>
                          <p className="text-[11px] text-[#69736D]">
                            {mentor.college}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#DCE6DE] text-[#496456]">
                        {mentor.compatibility}% Match
                      </span>
                    </div>

                    {/* Criteria Box based on prompt requirements */}
                    <div className="p-3 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 text-[#202924]">
                        <span className="w-2 h-2 rounded-full bg-[#387B62] shrink-0" />
                        <span className="font-medium">{mentor.availabilityText}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#69736D]">
                        <span className="font-semibold text-[#202924]">Level:</span>
                        <span>{mentor.learningLevel}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#69736D]">
                        <History className="w-3.5 h-3.5 text-[#496456] shrink-0" />
                        <span>{mentor.sessionHistory}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      disabled={matchingState === 'requested'}
                      onClick={() => handleRequestHelp(mentor)}
                      className="w-full py-2.5 rounded-xl bg-[#496456] hover:bg-[#3d5347] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75"
                    >
                      {matchingState === 'requested' ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Connecting with {mentor.fullName}...</span>
                        </>
                      ) : (
                        <>
                          <span>Connect for Help ({selectedDuration}m)</span>
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
