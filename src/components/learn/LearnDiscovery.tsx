import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  Star,
  Users,
  Clock,
  ArrowRight,
  BookOpen,
  Filter,
  CheckCircle2,
  TrendingUp,
  Flame,
  ChevronRight,
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
  onOpenQuickDoubt,
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

  const categories = [
    'Programming',
    'AI / ML',
    'Web Development',
    'UI/UX',
    'Design',
    'Business',
    'Communication',
    'Other',
  ];

  // Recommended learning topics
  const recommendedCourses = [
    {
      id: 'rec-1',
      title: 'Python Fundamentals & Logic',
      category: 'Programming',
      level: 'Beginner',
      mentorsCount: 12,
      rating: 4.8,
      description: 'Master variables, conditionals, nested loops, list comprehensions, and recursion.',
      topics: ['Control Flow', 'Nested Loops', 'Functions', 'Dictionary Ops'],
      gradient: 'from-[#8B5CF6]/20 to-[#22D3EE]/20',
      accentColor: '#8B5CF6',
    },
    {
      id: 'rec-2',
      title: 'Modern Full-Stack Web Development',
      category: 'Web Development',
      level: 'Intermediate',
      mentorsCount: 18,
      rating: 4.9,
      description: 'Build fast full-stack applications with React, TypeScript, APIs, and state systems.',
      topics: ['React 19', 'TypeScript', 'Server State', 'Tailwind CSS'],
      gradient: 'from-[#22D3EE]/20 to-emerald-500/20',
      accentColor: '#22D3EE',
    },
    {
      id: 'rec-3',
      title: 'Data Structures & Algorithms in C++',
      category: 'Programming',
      level: 'Intermediate',
      mentorsCount: 15,
      rating: 4.8,
      description: 'Cracking problem solving with trees, graphs, dynamic programming, and binary search.',
      topics: ['Binary Trees', 'DFS / BFS', 'Two Pointers', 'Big-O Analysis'],
      gradient: 'from-amber-500/20 to-rose-500/20',
      accentColor: '#F59E0B',
    },
    {
      id: 'rec-4',
      title: 'UI/UX & Product Design Systems',
      category: 'UI/UX',
      level: 'Intermediate',
      mentorsCount: 9,
      rating: 4.9,
      description: 'Design beautiful, accessible interfaces in Figma with auto-layout and design tokens.',
      topics: ['Figma Variants', 'Design Tokens', 'Micro-interactions', 'User Testing'],
      gradient: 'from-purple-500/20 to-pink-500/20',
      accentColor: '#C084FC',
    },
  ];

  // Trending Skills (horizontally scrollable)
  const trendingSkills = [
    { name: 'Python Loops & DSA', learners: '342 studying', tag: 'High Demand', hot: true },
    { name: 'Transformer Architecture', learners: '210 studying', tag: 'AI / ML', hot: true },
    { name: 'Next.js 15 & React 19', learners: '188 studying', tag: 'Web Dev', hot: false },
    { name: 'System Design Basics', learners: '154 studying', tag: 'Architecture', hot: false },
    { name: 'Figma Auto-Layout 5.0', learners: '129 studying', tag: 'UI/UX', hot: false },
    { name: 'Rust Memory Model', learners: '98 studying', tag: 'Systems', hot: false },
  ];

  const filteredMentors = mentors.filter((m) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      m.skillsToTeach.some(
        (s) =>
          s.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          s.name.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    const matchesSearch =
      !searchQuery.trim() ||
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.skillsToTeach.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10 animate-in fade-in duration-200">
      {/* ---------------------------------------------------- */}
      {/* 1. HEADER & SEARCH */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
            Explore what you want to learn.
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Browse skills, discover top peer mentors from leading colleges, and learn in focused sessions.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#8B5CF6] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills, topics, or peer mentors..."
            className="w-full bg-[#11182B] border border-[#1E2A47] rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-[#F8FAFC] placeholder-[#94A3B8]/70 focus:outline-hidden focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition-all shadow-md shadow-black/20"
          />
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/20'
                    : 'bg-[#151E33] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1A2540] border border-[#1E2A47]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. TRENDING SKILLS (Horizontally scrollable) */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#22D3EE]" />
            <span>Trending Skills</span>
          </h2>
          <span className="text-xs text-[#94A3B8]">Updated hourly based on student searches</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
          {trendingSkills.map((ts, idx) => (
            <div
              key={idx}
              onClick={() => setSearchQuery(ts.name)}
              className="p-3.5 rounded-xl bg-[#151E33] border border-[#1E2A47] hover:border-[#22D3EE]/50 transition-all cursor-pointer shrink-0 w-56 flex flex-col justify-between group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#11182B] text-[#C4B5FD] border border-[#1E2A47]">
                  {ts.tag}
                </span>
                {ts.hot && (
                  <span className="flex items-center gap-1 text-[10px] text-amber-400 font-bold">
                    <Flame className="w-3 h-3 fill-current" /> Hot
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-[#F8FAFC] mt-2 group-hover:text-[#22D3EE] transition-colors truncate">
                {ts.name}
              </h4>
              <p className="text-[11px] text-[#94A3B8] mt-1 font-mono">{ts.learners}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. RECOMMENDED FOR YOU (Visually Rich Cards) */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#F8FAFC] tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
              <span>Recommended For You</span>
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Personalized based on your goals in Python and Computer Science
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recommendedCourses.map((course) => (
            <div
              key={course.id}
              className="p-6 rounded-2xl bg-[#151E33] border border-[#1E2A47] hover:border-[#8B5CF6]/60 transition-all shadow-md flex flex-col justify-between space-y-4 group relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#11182B] text-[#C4B5FD] border border-[#1E2A47]">
                    {course.category} • {course.level}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-400 font-mono">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-[#22D3EE] transition-colors">
                  {course.title}
                </h3>

                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  {course.description}
                </p>

                {/* Subtopic Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {course.topics.map((tp, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-[#11182B] text-[#94A3B8] border border-[#1E2A47]"
                    >
                      {tp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#1E2A47] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                  <Users className="w-3.5 h-3.5 text-[#22D3EE]" />
                  <span>{course.mentorsCount} peer mentors ready</span>
                </div>

                <button
                  onClick={() => {
                    const session: LearningSession = {
                      id: `session-learn-${Date.now()}`,
                      learnerId: currentUser?.id || 'user-ojaswitha',
                      learnerName: currentUser?.fullName || 'Ojaswitha',
                      learnerAvatar: currentUser?.avatarUrl || '',
                      learnerCollege: currentUser?.college || 'UC Berkeley',
                      mentorId: 'user-rahul',
                      mentorName: 'Rahul',
                      mentorAvatar:
                        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
                      mentorCollege: 'UC Berkeley',
                      skill: course.title,
                      topic: course.title,
                      status: 'active',
                      durationMinutes: 20,
                      isRecording: false,
                      recordingConsentLearner: false,
                      recordingConsentMentor: false,
                      recordingSeconds: 0,
                      sharedNotes: `Study notes for ${course.title}`,
                      chatMessages: [],
                      copilotItems: [],
                    };
                    onStartSession(session);
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>Learn</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. ACTIVE PEER MENTORS IN THIS DOMAIN */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#F8FAFC] tracking-tight">
              Peer Mentors in {selectedCategory}
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Verified students from UC Berkeley, Stanford, CMU &amp; Georgia Tech
            </p>
          </div>
          <span className="text-xs font-mono text-[#22D3EE]">
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
                className="p-5 rounded-2xl bg-[#151E33] border border-[#1E2A47] hover:border-[#8B5CF6]/50 transition-all flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={mentor.avatarUrl}
                        alt={mentor.fullName}
                        className="w-11 h-11 rounded-xl object-cover border border-[#1E2A47]"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-[#F8FAFC]">
                          {mentor.fullName}
                        </h4>
                        <p className="text-xs text-[#22D3EE] font-medium">
                          {primarySkill.name}
                        </p>
                        <p className="text-[11px] text-[#94A3B8]">
                          {mentor.college}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#94A3B8] font-mono">
                    <span className="text-amber-400 font-bold">
                      ⭐ {mentor.reputation.averageRating}
                    </span>
                    <span>•</span>
                    <span>{mentor.reputation.learnersHelped} helped</span>
                    <span>•</span>
                    <span className="text-emerald-400">🟢 Online</span>
                  </div>

                  <p className="text-xs text-[#94A3B8] line-clamp-2">
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
                        topic: `Session with ${mentor.fullName}`,
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
