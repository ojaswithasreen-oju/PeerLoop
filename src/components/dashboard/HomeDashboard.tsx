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
  BookOpen,
  Sparkles,
  Check,
  Code,
  FileText,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/storeService';
import { LearningSession, UserProfile } from '../../types';
import { Modal } from '../common/Modal';

interface HomeDashboardProps {
  onNavigate: (tab: string) => void;
  onOpenQuickDoubt: () => void;
  onStartSession: (session: LearningSession) => void;
  onViewProfile: (userId: string) => void;
}

interface JourneyNode {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'upcoming';
  progress: number;
  resources: { title: string; type: string }[];
  practice: string;
  mentors: { name: string; avatar: string; match: string }[];
  nextSkill: string;
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
  const [selectedJourneyNode, setSelectedJourneyNode] = useState<JourneyNode | null>(null);

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

  // ---------------------------------------------------------------------------
  // YOUR LEARNING JOURNEY DATA
  // Python Basics ✓ → Loops ✓ → Nested Loops ● Current → Functions → Projects
  // ---------------------------------------------------------------------------
  const journeySteps: JourneyNode[] = [
    {
      id: 'step-1',
      name: 'Python Basics',
      status: 'completed',
      progress: 100,
      resources: [
        { title: 'Variables, Types & Operators Guide', type: 'Cheatsheet' },
        { title: 'Conditionals & Branching Logic', type: 'Interactive Notebook' },
      ],
      practice: '12 practice problems solved with 100% test pass rate.',
      mentors: [{ name: 'Maya', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80', match: '96%' }],
      nextSkill: 'Control Flow & Iteration',
    },
    {
      id: 'step-2',
      name: 'Loops',
      status: 'completed',
      progress: 100,
      resources: [
        { title: 'For vs While Execution Cycles', type: 'Mental Model' },
        { title: 'Loop Jump Statements (break, continue)', type: 'Practice Walkthrough' },
      ],
      practice: 'Constructed prime sieve and Fibonacci sequence generators.',
      mentors: [{ name: 'David', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80', match: '92%' }],
      nextSkill: 'Nested Loops & Multidimensional Arrays',
    },
    {
      id: 'step-3',
      name: 'Nested Loops',
      status: 'current',
      progress: 68,
      resources: [
        { title: '2D Matrix Coordinate Traversal', type: 'Visual Guide' },
        { title: 'List Comprehensions with Nested Iteration', type: 'Syntax Card' },
      ],
      practice: 'Rotate a 3x3 matrix 90 degrees clockwise in-place.',
      mentors: [
        { name: 'Rahul', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80', match: '94%' },
        { name: 'Ananya', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80', match: '89%' },
      ],
      nextSkill: 'Functions & Scope',
    },
    {
      id: 'step-4',
      name: 'Functions',
      status: 'upcoming',
      progress: 0,
      resources: [
        { title: 'Parameters, Default Values & *args / **kwargs', type: 'Concept Document' },
        { title: 'First-Class Functions & Closures', type: 'Advanced Article' },
      ],
      practice: 'Refactor procedural matrix scripts into pure functional pipelines.',
      mentors: [{ name: 'Elena', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80', match: '95%' }],
      nextSkill: 'Object-Oriented Programming (OOP)',
    },
    {
      id: 'step-5',
      name: 'Projects',
      status: 'upcoming',
      progress: 0,
      resources: [
        { title: 'Terminal Maze Solver Engine', type: 'Capstone Spec' },
        { title: 'Algorithmic Complexity Benchmarking', type: 'Performance Suite' },
      ],
      practice: 'Build and deploy a full CLI simulation project with peer review.',
      mentors: [{ name: 'Marcus', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80', match: '97%' }],
      nextSkill: 'Data Structures & Algorithms',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 animate-in fade-in duration-150">
      {/* ---------------------------------------------------- */}
      {/* 1. EDITORIAL HEADER & PROMPT BAR */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#202924] tracking-tight">
            {getGreeting()}, {currentUser?.fullName || 'Ojaswitha'}
          </h1>
          <p className="text-sm text-[#69736D] mt-1 font-sans">
            “What would you like to work on today?”
          </p>
        </div>

        {/* Prompt Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
          <Search className="w-4 h-4 text-[#69736D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Ask for help, find a mentor, or explore a skill..."
            className="w-full bg-white border border-[#E3E1D9] rounded-xl pl-10 pr-24 py-3 text-xs sm:text-sm text-[#202924] placeholder-[#69736D] focus:outline-none focus:border-[#496456] transition-all shadow-xs"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-lg bg-[#496456] hover:bg-[#3d5347] text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Explore
          </button>
        </form>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. SIGNATURE COMPONENT: YOUR LEARNING JOURNEY */}
      {/* Python Basics ✓ → Loops ✓ → Nested Loops ● Current → Functions → Projects */}
      {/* ---------------------------------------------------- */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E3E1D9] space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#496456]">
              Personal Curriculum
            </span>
            <h2 className="font-serif text-xl sm:text-2xl text-[#202924]">
              Your Learning Journey
            </h2>
          </div>
          <p className="text-xs text-[#69736D]">
            Click any skill to review progress, practice problems, and compatible mentors.
          </p>
        </div>

        {/* Visual Continuous Progression Path */}
        <div className="pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {journeySteps.map((step, idx) => {
              const isCurrent = step.status === 'current';
              const isCompleted = step.status === 'completed';

              return (
                <div
                  key={step.id}
                  onClick={() => setSelectedJourneyNode(step)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative group text-left ${
                    isCurrent
                      ? 'bg-[#F6F4EE] border-[#496456] shadow-xs ring-1 ring-[#496456]/20'
                      : isCompleted
                      ? 'bg-white border-[#DCE6DE] hover:border-[#496456]'
                      : 'bg-white border-[#E3E1D9] hover:border-[#69736D]/40 opacity-75 hover:opacity-100'
                  }`}
                >
                  {/* Status Indicator */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-[#69736D]">
                      0{idx + 1}
                    </span>
                    {isCompleted ? (
                      <span className="w-5 h-5 rounded-full bg-[#DCE6DE] text-[#496456] flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </span>
                    ) : isCurrent ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#496456] text-white text-[9px] font-bold">
                        ● Current
                      </span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-[#E3E1D9]" />
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-[#202924] group-hover:text-[#496456] transition-colors">
                    {step.name}
                  </h3>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#69736D]">
                    <span>
                      {isCompleted
                        ? 'Completed'
                        : isCurrent
                        ? `${step.progress}% done`
                        : 'Next in path'}
                    </span>
                    <ChevronRight className="w-3 h-3 text-[#69736D] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. ASYMMETRIC BENTO GRID */}
      {/* Continue Learning | Quick Help | People Who Can Help | Upcoming Session */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* BENTO CARD 1: CONTINUE LEARNING (7 cols) */}
        <div className="md:col-span-7 p-6 rounded-2xl bg-white border border-[#E3E1D9] flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-[#DCE6DE] text-[#496456]">
                Continue Learning
              </span>
              <span className="text-xs font-mono font-bold text-[#496456]">
                68%
              </span>
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-[#202924]">
                Python — Nested Loops
              </h3>
              <p className="text-xs text-[#69736D] mt-1 leading-relaxed">
                Reviewed 2D matrix traversal with Rahul 4 hours ago. Ready for dictionary comprehensions checkpoint.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="w-full bg-[#F6F4EE] h-2 rounded-full overflow-hidden border border-[#E3E1D9]">
                <div
                  className="h-full rounded-full bg-[#496456] transition-all duration-300"
                  style={{ width: '68%' }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#69736D]">
                <span>Topic 4 of 6</span>
                <span>Next: Dictionary Comprehensions</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E3E1D9] flex items-center justify-between">
            <span className="text-xs text-[#69736D]">
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
              className="px-5 py-2.5 rounded-xl bg-[#496456] hover:bg-[#3d5347] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2"
            >
              <span>Continue Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* BENTO CARD 2: QUICK HELP (5 cols) */}
        <div className="md:col-span-5 p-6 rounded-2xl bg-[#F1DED3]/30 border border-[#C9825B]/25 flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F1DED3] text-[#C9825B] flex items-center justify-center">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#202924]">
                Stuck on something?
              </h3>
              <p className="text-xs text-[#69736D] mt-1 leading-relaxed">
                Find someone who can help in a 5 to 30-minute peer sync.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#C9825B]/20 space-y-2">
            <button
              onClick={onOpenQuickDoubt}
              className="w-full py-2.5 rounded-xl bg-[#496456] hover:bg-[#3d5347] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Get Help</span>
            </button>
            <p className="text-[11px] text-center text-[#69736D]">
              Fast matching with active mentors on campus.
            </p>
          </div>
        </div>

        {/* BENTO CARD 3: PEOPLE WHO CAN HELP (6 cols) */}
        <div className="md:col-span-6 p-6 rounded-2xl bg-white border border-[#E3E1D9] flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#202924]">
                People Who Can Help
              </h3>
              <button
                onClick={() => onNavigate('learn')}
                className="text-xs font-semibold text-[#496456] hover:underline cursor-pointer"
              >
                Browse all
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80"
                  alt="Rahul"
                  className="w-12 h-12 rounded-xl object-cover border border-[#E3E1D9]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-[#202924]">Rahul — Python</h4>
                    <span className="text-[10px] text-[#496456] bg-[#DCE6DE] px-1.5 py-0.2 rounded font-mono font-bold">
                      94% Match
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#69736D] mt-0.5 font-mono">
                    <span className="text-[#C9825B] font-bold">⭐ 4.8</span>
                    <span>•</span>
                    <span className="text-[#387B62] font-semibold">Available now</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  const session: LearningSession = {
                    id: `session-conn-${Date.now()}`,
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
                    topic: '1-on-1 Mentoring: Python Nested Loops',
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
                className="px-4 py-2 rounded-xl bg-[#496456] hover:bg-[#3d5347] text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
              >
                Connect
              </button>
            </div>
          </div>

          <p className="text-xs text-[#69736D]">
            Matched with Rahul because of strong ratings in Python loops &amp; 2D algorithms.
          </p>
        </div>

        {/* BENTO CARD 4: UPCOMING SESSION (6 cols) */}
        <div className="md:col-span-6 p-6 rounded-2xl bg-white border border-[#E3E1D9] flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#202924]">
                Upcoming Session
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#DCE6DE] text-[#496456]">
                Confirmed
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#DCE6DE] text-[#496456] flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#202924]">
                    Python · Today · 6:30 PM
                  </h4>
                  <p className="text-[11px] text-[#69736D]">
                    With Rahul • 20 minutes duration
                  </p>
                </div>
              </div>

              <button
                onClick={() => onStartSession(upcomingSession)}
                className="px-4 py-2 rounded-xl bg-[#496456] hover:bg-[#3d5347] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Join Session</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#69736D]">
            <span>Reminder will ping 5m before start.</span>
            <button
              onClick={() => onNavigate('sessions')}
              className="text-[#496456] hover:underline font-semibold"
            >
              View calendar
            </button>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. MODAL: DETAILED LEARNING JOURNEY NODE SLIDE-OVER */}
      {/* Triggered by clicking any skill on the path */}
      {/* ---------------------------------------------------- */}
      {selectedJourneyNode && (
        <Modal
          isOpen={!!selectedJourneyNode}
          onClose={() => setSelectedJourneyNode(null)}
          title={`Skill Path: ${selectedJourneyNode.name}`}
          subtitle="Interactive curriculum node checkpoint & resources"
          maxWidth="lg"
        >
          <div className="space-y-5 text-[#202924]">
            {/* Progress strip */}
            <div className="p-4 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold">Current Mastery Level</span>
                <span className="font-mono font-bold text-[#496456]">
                  {selectedJourneyNode.progress}%
                </span>
              </div>
              <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#E3E1D9]">
                <div
                  className="h-full bg-[#496456] rounded-full transition-all"
                  style={{ width: `${selectedJourneyNode.progress}%` }}
                />
              </div>
            </div>

            {/* Resources Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wide text-[#202924] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#496456]" />
                <span>Curated Resources</span>
              </h4>
              <div className="space-y-2">
                {selectedJourneyNode.resources.map((res, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-[#F6F4EE] border border-[#E3E1D9] flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-[#202924]">{res.title}</span>
                    <span className="text-[10px] text-[#69736D] bg-white px-2 py-0.5 rounded border border-[#E3E1D9]">
                      {res.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Practice Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wide text-[#202924] flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-[#C9825B]" />
                <span>Practice Checkpoint</span>
              </h4>
              <div className="p-3.5 rounded-lg bg-[#F6F4EE] border border-[#E3E1D9] text-xs text-[#69736D] leading-relaxed">
                {selectedJourneyNode.practice}
              </div>
            </div>

            {/* Mentors Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wide text-[#202924] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#496456]" />
                <span>Mentors Who Know This</span>
              </h4>
              <div className="space-y-2">
                {selectedJourneyNode.mentors.map((m, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-white border border-[#E3E1D9] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-[#202924]">{m.name}</p>
                        <p className="text-[10px] text-[#496456] font-mono">{m.match} compatibility</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedJourneyNode(null);
                        onNavigate('quick-help');
                      }}
                      className="px-3 py-1 rounded-md bg-[#496456] text-white text-xs font-semibold hover:bg-[#3d5347]"
                    >
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Next Skill */}
            <div className="p-3 rounded-lg bg-[#DCE6DE]/50 border border-[#496456]/20 flex items-center justify-between text-xs">
              <span className="text-[#496456] font-medium">Recommended Next:</span>
              <strong className="text-[#202924]">{selectedJourneyNode.nextSkill}</strong>
            </div>

            {/* Close */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedJourneyNode(null)}
                className="px-4 py-2 rounded-lg bg-[#F6F4EE] border border-[#E3E1D9] text-xs font-semibold text-[#202924] hover:bg-[#E3E1D9]"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
