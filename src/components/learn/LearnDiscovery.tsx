import React, { useState, useEffect } from 'react';
import {
  Search,
  Star,
  Users,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/storeService';
import { UserProfile, LearningSession } from '../../types';

interface LearnDiscoveryProps {
  onOpenQuickDoubt: () => void;
  onStartSession: (session: LearningSession) => void;
  onViewProfile: (userId: string) => void;
}

export const LearnDiscovery: React.FC<LearnDiscoveryProps> = ({
  onStartSession,
  onViewProfile,
}) => {
  const { currentUser } = useAuth();
  const [mentors, setMentors] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Programming');

  useEffect(() => {
    const load = async () => {
      const allMentors = await store.getAllMentors();
      setMentors(allMentors.filter((m) => m.id !== currentUser?.id));
    };
    load();
  }, [currentUser]);

  // Categories specified by prompt:
  // Programming, AI & ML, Web, Design, Business, Communication
  const categories = [
    'Programming',
    'AI & ML',
    'Web',
    'Design',
    'Business',
    'Communication',
  ];

  // Personalized learning paths specified by prompt:
  // e.g. Python → Functions → OOP → Projects
  const learningPaths = [
    {
      id: 'path-1',
      title: 'Python Core & Systems',
      category: 'Programming',
      sequence: ['Python', 'Functions', 'OOP', 'Projects'],
      learners: '342 studying',
      mentorsCount: 14,
      difficulty: 'Beginner to Advanced',
      description: 'Progress from fundamentals and conditionals to object-oriented structures and full application projects.',
      currentSkill: 'Nested Loops',
      progress: 68,
    },
    {
      id: 'path-2',
      title: 'Modern Full-Stack Architecture',
      category: 'Web',
      sequence: ['TypeScript', 'React 19', 'Server State', 'Full Stack APIs'],
      learners: '280 studying',
      mentorsCount: 18,
      difficulty: 'Intermediate',
      description: 'Master component composition, server actions, optimistic UI, and scalable backend integrations.',
      currentSkill: 'React 19 Hooks',
      progress: 45,
    },
    {
      id: 'path-3',
      title: 'Data Structures & Algorithmic Problem Solving',
      category: 'Programming',
      sequence: ['Arrays & Pointers', 'Binary Search', 'Trees & Graphs', 'Dynamic Programming'],
      learners: '410 studying',
      mentorsCount: 15,
      difficulty: 'Intermediate',
      description: 'Deep dive into computational complexity, graph traversals, recursion, and interview challenges.',
      currentSkill: 'Binary Search Trees',
      progress: 30,
    },
    {
      id: 'path-4',
      title: 'Product Design Systems & Tokens',
      category: 'Design',
      sequence: ['Wireframing', 'Auto-Layout 5', 'Design Tokens', 'Design Systems'],
      learners: '190 studying',
      mentorsCount: 9,
      difficulty: 'Intermediate',
      description: 'Craft responsive, tokenized component libraries in Figma ready for production engineering handoff.',
      currentSkill: 'Design Tokens',
      progress: 90,
    },
    {
      id: 'path-5',
      title: 'Machine Learning Foundations',
      category: 'AI & ML',
      sequence: ['Linear Algebra', 'Gradient Descent', 'Neural Networks', 'Model Evaluation'],
      learners: '215 studying',
      mentorsCount: 11,
      difficulty: 'Advanced',
      description: 'Mathematical intuition behind optimization functions, loss landscapes, and transformer architectures.',
      currentSkill: 'Linear Algebra',
      progress: 15,
    },
    {
      id: 'path-6',
      title: 'Technical Communication & Leadership',
      category: 'Communication',
      sequence: ['System Docs', 'Design Reviews', 'Peer Mentoring', 'Executive Summaries'],
      learners: '128 studying',
      mentorsCount: 8,
      difficulty: 'All Levels',
      description: 'Synthesize complex engineering trade-offs into compelling documentation, code reviews, and presentations.',
      currentSkill: 'Design Reviews',
      progress: null,
    },
  ];

  const filteredPaths = learningPaths.filter((item) => {
    const matchesCat =
      !selectedCategory ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sequence.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const filteredMentors = mentors.filter((m) => {
    const matchesCat = m.skillsToTeach.some(
      (s) =>
        s.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        s.name.toLowerCase().includes(selectedCategory.toLowerCase())
    );
    const matchesSearch =
      !searchQuery.trim() ||
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.skillsToTeach.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 animate-in fade-in duration-150">
      {/* ---------------------------------------------------- */}
      {/* 1. EDITORIAL HEADER & SEARCH */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#202924] tracking-tight">
            Explore skills
          </h1>
          <p className="text-sm text-[#69736D] mt-1 font-sans">
            Personalized learning paths designed to guide you step-by-step with peer support.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <Search className="w-4 h-4 text-[#69736D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What do you want to learn?"
            className="w-full bg-white border border-[#E3E1D9] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-[#202924] placeholder-[#69736D] focus:outline-none focus:border-[#496456] transition-all shadow-xs"
          />
        </div>

        {/* Categories: Programming, AI & ML, Web, Design, Business, Communication */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#496456] text-white'
                    : 'bg-[#DCE6DE] text-[#496456] hover:bg-[#cde0d1]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. PERSONALIZED LEARNING PATHS */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl sm:text-2xl text-[#202924]">
            Learning Paths ({filteredPaths.length})
          </h2>
          <span className="text-xs text-[#69736D]">
            Category: {selectedCategory}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPaths.map((path) => (
            <div
              key={path.id}
              className="p-6 rounded-2xl bg-white border border-[#E3E1D9] hover:border-[#DCE6DE] transition-all flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-[#DCE6DE] text-[#496456]">
                    {path.category}
                  </span>
                  <span className="text-xs text-[#69736D]">
                    {path.difficulty}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-[#202924]">
                  {path.title}
                </h3>

                <p className="text-xs text-[#69736D] leading-relaxed">
                  {path.description}
                </p>

                {/* Personalized Sequence Display: e.g. Python → Functions → OOP → Projects */}
                <div className="p-3 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#496456]">
                    Personalized Path Sequence
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-[#202924]">
                    {path.sequence.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <span className="px-2 py-0.5 bg-white rounded border border-[#E3E1D9]">
                          {step}
                        </span>
                        {idx < path.sequence.length - 1 && (
                          <span className="text-[#69736D]">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Progress bar if started */}
                {path.progress !== null && (
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px] text-[#69736D]">
                      <span>Current: <strong className="text-[#202924]">{path.currentSkill}</strong></span>
                      <span className="font-mono text-[#496456] font-bold">{path.progress}%</span>
                    </div>
                    <div className="w-full bg-[#F6F4EE] h-1.5 rounded-full overflow-hidden border border-[#E3E1D9]">
                      <div
                        className="h-full bg-[#496456] rounded-full"
                        style={{ width: `${path.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#E3E1D9] flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-[#69736D]">
                  <span>{path.learners}</span>
                  <span>•</span>
                  <span>{path.mentorsCount} mentors</span>
                </div>

                <button
                  onClick={() => {
                    const session: LearningSession = {
                      id: `session-path-${Date.now()}`,
                      learnerId: currentUser?.id || 'user-ojaswitha',
                      learnerName: currentUser?.fullName || 'Ojaswitha',
                      learnerAvatar: currentUser?.avatarUrl || '',
                      learnerCollege: currentUser?.college || 'UC Berkeley',
                      mentorId: 'user-rahul',
                      mentorName: 'Rahul',
                      mentorAvatar:
                        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
                      mentorCollege: 'UC Berkeley',
                      skill: path.title,
                      topic: path.currentSkill || path.title,
                      status: 'active',
                      durationMinutes: 20,
                      isRecording: false,
                      recordingConsentLearner: false,
                      recordingConsentMentor: false,
                      recordingSeconds: 0,
                      sharedNotes: `Curriculum study notes for ${path.title}`,
                      chatMessages: [],
                      copilotItems: [],
                    };
                    onStartSession(session);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#496456] hover:bg-[#3d5347] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>{path.progress ? 'Continue' : 'Start Path'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. PEER MENTORS IN THIS CATEGORY */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl text-[#202924]">
              Peer Mentors in {selectedCategory}
            </h2>
            <p className="text-xs text-[#69736D]">
              Verified students ready for 1-on-1 walkthroughs and doubt sessions.
            </p>
          </div>
          <span className="text-xs font-mono text-[#496456] font-semibold">
            {filteredMentors.length} mentors available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredMentors.map((mentor) => {
            const primarySkill = mentor.skillsToTeach[0] || {
              name: selectedCategory,
              level: 'Advanced',
            };

            return (
              <div
                key={mentor.id}
                className="p-5 rounded-2xl bg-white border border-[#E3E1D9] hover:border-[#DCE6DE] transition-all flex flex-col justify-between space-y-4 shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={mentor.avatarUrl}
                      alt={mentor.fullName}
                      className="w-11 h-11 rounded-xl object-cover border border-[#E3E1D9] shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#202924] truncate">
                        {mentor.fullName}
                      </h4>
                      <p className="text-xs text-[#496456] font-medium">
                        {primarySkill.name} Mentor
                      </p>
                      <p className="text-[11px] text-[#69736D] truncate">
                        {mentor.college}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 text-xs text-[#69736D] font-mono">
                    <span className="text-[#C9825B] font-bold">
                      ⭐ {mentor.reputation.averageRating}
                    </span>
                    <span>•</span>
                    <span>{mentor.reputation.learnersHelped} helped</span>
                    <span>•</span>
                    <span className="text-[#387B62] font-semibold">Available now</span>
                  </div>

                  <p className="text-xs text-[#69736D] line-clamp-2 leading-relaxed">
                    {mentor.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E3E1D9] flex items-center gap-2">
                  <button
                    onClick={() => onViewProfile(mentor.id)}
                    className="flex-1 py-2 rounded-lg bg-[#F6F4EE] hover:bg-[#E3E1D9] text-xs font-semibold text-[#69736D] hover:text-[#202924] transition-colors cursor-pointer text-center"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      const session: LearningSession = {
                        id: `session-m-${Date.now()}`,
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
                    className="flex-1 py-2 rounded-lg bg-[#496456] hover:bg-[#3d5347] text-white text-xs font-semibold transition-colors cursor-pointer text-center"
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
