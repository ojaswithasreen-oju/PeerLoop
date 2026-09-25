import React, { useState, useEffect } from 'react';
import {
  Search,
  Star,
  Users,
  ArrowRight,
  BookOpen,
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

  const categories = [
    'Programming',
    'AI / ML',
    'Web Development',
    'UI/UX',
    'Design',
    'Business',
    'Communication',
  ];

  // Learning cards with required fields:
  // Skill name, Difficulty, Learners, Available mentors, Progress if already started
  const learningSkills = [
    {
      id: 'skill-1',
      name: 'Python — Nested Loops & Logic',
      category: 'Programming',
      difficulty: 'Beginner',
      learners: '342 learners',
      availableMentors: 12,
      progress: 68,
      description: 'Master variables, conditionals, nested loops, list comprehensions, and recursion.',
    },
    {
      id: 'skill-2',
      name: 'Modern Full-Stack React & APIs',
      category: 'Web Development',
      difficulty: 'Intermediate',
      learners: '280 learners',
      availableMentors: 18,
      progress: 45,
      description: 'Build fast full-stack applications with React, TypeScript, APIs, and state systems.',
    },
    {
      id: 'skill-3',
      name: 'Data Structures & Algorithms',
      category: 'Programming',
      difficulty: 'Intermediate',
      learners: '410 learners',
      availableMentors: 15,
      progress: 25,
      description: 'Problem solving with trees, graphs, dynamic programming, and binary search.',
    },
    {
      id: 'skill-4',
      name: 'UI/UX & Product Design Systems',
      category: 'UI/UX',
      difficulty: 'Intermediate',
      learners: '190 learners',
      availableMentors: 9,
      progress: 90,
      description: 'Design accessible interfaces in Figma with auto-layout and component design tokens.',
    },
    {
      id: 'skill-5',
      name: 'Foundations of Machine Learning',
      category: 'AI / ML',
      difficulty: 'Advanced',
      learners: '215 learners',
      availableMentors: 11,
      progress: null,
      description: 'Understanding linear algebra, gradient descent, neural networks, and model fine-tuning.',
    },
    {
      id: 'skill-6',
      name: 'Technical Pitching & Communication',
      category: 'Communication',
      difficulty: 'Beginner',
      learners: '128 learners',
      availableMentors: 8,
      progress: null,
      description: 'Communicate complex technical trade-offs clearly to teammates, users, and reviewers.',
    },
    {
      id: 'skill-7',
      name: 'Product Strategy & Metrics',
      category: 'Business',
      difficulty: 'Beginner',
      learners: '164 learners',
      availableMentors: 7,
      progress: null,
      description: 'Define problem statements, product requirements, user metrics, and go-to-market loops.',
    },
    {
      id: 'skill-8',
      name: 'Visual Brand Identity & Typography',
      category: 'Design',
      difficulty: 'Intermediate',
      learners: '145 learners',
      availableMentors: 6,
      progress: null,
      description: 'Master typographic hierarchy, palette restraint, spatial rhythm, and brand design guidelines.',
    },
  ];

  const filteredSkills = learningSkills.filter((item) => {
    const matchesCat =
      !selectedCategory ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in duration-150">
      {/* ---------------------------------------------------- */}
      {/* 1. HEADER & SEARCH BAR */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2933] tracking-tight">
            Explore Skills
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Discover topics, track your progress, and connect with peer mentors who can explain them clearly.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What do you want to learn?"
            className="w-full bg-white border border-[#E5EAE7] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-[#1F2933] placeholder-[#6B7280] focus:outline-none focus:border-[#3F6B5B] transition-all shadow-xs"
          />
        </div>

        {/* Sage-colored Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#3F6B5B] text-white'
                    : 'bg-[#DCE9E2] text-[#3F6B5B] hover:bg-[#CBDCD3]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. LEARNING CARDS GRID */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#1F2933] tracking-tight">
            Curated Skill Paths ({filteredSkills.length})
          </h2>
          <span className="text-xs text-[#6B7280]">
            Filtered by: {selectedCategory}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-5 rounded-2xl bg-white border border-[#E5EAE7] hover:border-[#DCE9E2] transition-all flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#DCE9E2] text-[#3F6B5B]">
                    {skill.category}
                  </span>
                  <span className="text-xs text-[#6B7280]">
                    Difficulty: <span className="font-semibold text-[#1F2933]">{skill.difficulty}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#1F2933]">
                  {skill.name}
                </h3>

                <p className="text-xs text-[#6B7280] leading-relaxed">
                  {skill.description}
                </p>

                {/* Progress if already started */}
                {skill.progress !== null && (
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-medium text-[#6B7280]">
                      <span>In progress</span>
                      <span className="font-mono text-[#3F6B5B] font-bold">{skill.progress}%</span>
                    </div>
                    <div className="w-full bg-[#F7F8F5] h-1.5 rounded-full overflow-hidden border border-[#E5EAE7]">
                      <div
                        className="h-full rounded-full bg-[#3F6B5B]"
                        style={{ width: `${skill.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#E5EAE7] flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                  <span>{skill.learners}</span>
                  <span>•</span>
                  <span>{skill.availableMentors} mentors</span>
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
                      skill: skill.name,
                      topic: skill.name,
                      status: 'active',
                      durationMinutes: 20,
                      isRecording: false,
                      recordingConsentLearner: false,
                      recordingConsentMentor: false,
                      recordingSeconds: 0,
                      sharedNotes: `Study notes for ${skill.name}`,
                      chatMessages: [],
                      copilotItems: [],
                    };
                    onStartSession(session);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#3F6B5B] hover:bg-[#34594B] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>{skill.progress ? 'Continue' : 'Start Learning'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. ACTIVE PEER MENTORS IN THIS CATEGORY */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#1F2933] tracking-tight">
              Peer Mentors in {selectedCategory}
            </h2>
            <p className="text-xs text-[#6B7280]">
              Verified students who have helped others understand this subject.
            </p>
          </div>
          <span className="text-xs font-mono text-[#3F6B5B] font-semibold">
            {filteredMentors.length} mentors ready
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
                className="p-5 rounded-2xl bg-white border border-[#E5EAE7] hover:border-[#DCE9E2] transition-all flex flex-col justify-between space-y-4 shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={mentor.avatarUrl}
                      alt={mentor.fullName}
                      className="w-11 h-11 rounded-xl object-cover border border-[#E5EAE7] shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#1F2933] truncate">
                        {mentor.fullName}
                      </h4>
                      <p className="text-xs text-[#3F6B5B] font-medium">
                        {primarySkill.name}
                      </p>
                      <p className="text-[11px] text-[#6B7280] truncate">
                        {mentor.college}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 text-xs text-[#6B7280] font-mono">
                    <span className="text-[#D99B26] font-bold">
                      ⭐ {mentor.reputation.averageRating}
                    </span>
                    <span>•</span>
                    <span>{mentor.reputation.learnersHelped} helped</span>
                    <span>•</span>
                    <span className="text-[#387B62]">Available now</span>
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
