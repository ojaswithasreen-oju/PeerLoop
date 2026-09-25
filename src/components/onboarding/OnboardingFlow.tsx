import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Plus,
  X,
  Compass,
  User,
  MapPin,
  Languages,
  Target,
  Layers,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SkillLevel, OnboardingData } from '../../types';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const POPULAR_LEARN_SKILLS = [
  'Python',
  'Data Structures & Algorithms',
  'React & Next.js',
  'Machine Learning',
  'SQL & Databases',
  'TypeScript',
  'System Design',
  'C++ Systems',
  'Figma UI Design',
  'Discrete Mathematics',
];

const POPULAR_TEACH_SKILLS = [
  'Python Basics',
  'HTML & Modern CSS',
  'Git & GitHub',
  'JavaScript / TypeScript',
  'Data Structures',
  'Java Programming',
  'Figma UI Design',
  'Calculus & Linear Algebra',
  'React Fundamentals',
  'SQL Queries',
];

const COLLEGE_SUGGESTIONS = [
  'UC Berkeley',
  'Stanford University',
  'MIT',
  'Carnegie Mellon University',
  'University of Washington',
  'UT Austin',
  'Georgia Tech',
  'UCLA',
];

const COURSE_SUGGESTIONS = [
  'Computer Science',
  'Electrical Engineering & CS',
  'Data Science & AI',
  'Software Engineering',
  'Information Technology',
  'Mathematics & Computing',
];

const YEAR_OPTIONS = [
  '1st Year (Freshman)',
  '2nd Year (Sophomore)',
  '3rd Year (Junior)',
  '4th Year (Senior)',
  'Graduate / Master’s',
  'PhD / Postgrad',
];

const LANGUAGE_OPTIONS = [
  'English',
  'Spanish',
  'Hindi',
  'French',
  'German',
  'Mandarin',
  'Japanese',
  'Portuguese',
  'Korean',
  'Arabic',
];

const CAREER_GOAL_PRESETS = [
  'Software Engineer at a high-growth tech company',
  'AI / Machine Learning Research Engineer',
  'Full-Stack Developer & Product Builder',
  'Ace coursework & crack summer SWE internships',
  'Data Scientist & Quantitative Analyst',
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const { currentUser, completeOnboarding } = useAuth();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 4;

  const [name, setName] = useState(currentUser?.fullName || '');
  const [college, setCollege] = useState(currentUser?.college || '');
  const [course, setCourse] = useState(currentUser?.course || '');
  const [year, setYear] = useState(currentUser?.year || '2nd Year (Sophomore)');
  const [location, setLocation] = useState(currentUser?.location || '');

  const [learningMode, setLearningMode] = useState<'Learn' | 'Teach' | 'Learn + Teach'>('Learn + Teach');

  const [skillsToLearn, setSkillsToLearn] = useState<Array<{ name: string; level: SkillLevel }>>(
    currentUser?.skillsToLearn?.length
      ? currentUser.skillsToLearn
      : [
          { name: 'Python', level: 'Beginner' },
          { name: 'Data Structures & Algorithms', level: 'Beginner' },
        ]
  );
  const [newLearnSkillName, setNewLearnSkillName] = useState('');
  const [newLearnSkillLevel, setNewLearnSkillLevel] = useState<SkillLevel>('Beginner');

  const [skillsToTeach, setSkillsToTeach] = useState<Array<{ name: string; level: SkillLevel }>>(
    currentUser?.skillsToTeach?.length
      ? currentUser.skillsToTeach
      : [{ name: 'Python Basics', level: 'Intermediate' }]
  );
  const [newTeachSkillName, setNewTeachSkillName] = useState('');
  const [newTeachSkillLevel, setNewTeachSkillLevel] = useState<SkillLevel>('Intermediate');

  const [careerGoals, setCareerGoals] = useState(
    currentUser?.careerGoals || 'Software Engineer at a top technology company'
  );
  const [preferredLanguage, setPreferredLanguage] = useState(currentUser?.preferredLanguage || 'English');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddLearnSkill = (skillName?: string) => {
    const val = (skillName || newLearnSkillName).trim();
    if (!val) return;
    if (skillsToLearn.some((s) => s.name.toLowerCase() === val.toLowerCase())) return;
    setSkillsToLearn([...skillsToLearn, { name: val, level: newLearnSkillLevel }]);
    if (!skillName) setNewLearnSkillName('');
  };

  const handleRemoveLearnSkill = (skillName: string) => {
    setSkillsToLearn(skillsToLearn.filter((s) => s.name !== skillName));
  };

  const handleUpdateLearnLevel = (skillName: string, level: SkillLevel) => {
    setSkillsToLearn(
      skillsToLearn.map((s) => (s.name === skillName ? { ...s, level } : s))
    );
  };

  const handleAddTeachSkill = (skillName?: string) => {
    const val = (skillName || newTeachSkillName).trim();
    if (!val) return;
    if (skillsToTeach.some((s) => s.name.toLowerCase() === val.toLowerCase())) return;
    setSkillsToTeach([...skillsToTeach, { name: val, level: newTeachSkillLevel }]);
    if (!skillName) setNewTeachSkillName('');
  };

  const handleRemoveTeachSkill = (skillName: string) => {
    setSkillsToTeach(skillsToTeach.filter((s) => s.name !== skillName));
  };

  const handleUpdateTeachLevel = (skillName: string, level: SkillLevel) => {
    setSkillsToTeach(
      skillsToTeach.map((s) => (s.name === skillName ? { ...s, level } : s))
    );
  };

  const handleNext = () => {
    setErrorMessage(null);
    if (step === 1) {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (!college.trim()) {
        setErrorMessage('Please provide your university or college name.');
        return;
      }
      if (!course.trim()) {
        setErrorMessage('Please provide your major or course of study.');
        return;
      }
    } else if (step === 3) {
      if (learningMode === 'Learn' && skillsToLearn.length === 0) {
        setErrorMessage('Please select at least one skill you want to learn.');
        return;
      }
      if (learningMode === 'Teach' && skillsToTeach.length === 0) {
        setErrorMessage('Please add at least one skill you feel comfortable teaching.');
        return;
      }
      if (learningMode === 'Learn + Teach' && (skillsToLearn.length === 0 || skillsToTeach.length === 0)) {
        setErrorMessage('Please add at least one skill to learn and one skill to teach.');
        return;
      }
    }

    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const payload: OnboardingData = {
        name: name.trim() || 'Peer Learner',
        college: college.trim() || 'University',
        course: course.trim() || 'Computer Science',
        year: year || '2nd Year (Sophomore)',
        location: location.trim() || 'Campus',
        learningMode: learningMode,
        skillsToLearn:
          skillsToLearn.length > 0
            ? skillsToLearn
            : [{ name: 'Computer Science', level: 'Beginner' }],
        skillsToTeach:
          skillsToTeach.length > 0
            ? skillsToTeach
            : [{ name: 'Foundational Programming', level: 'Intermediate' }],
        careerGoals: careerGoals.trim() || 'Excel in university & build peer connections',
        preferredLanguage: preferredLanguage || 'English',
      };

      await completeOnboarding(payload);
      onComplete();
    } catch (err: unknown) {
      const errorObj = err as Error;
      setErrorMessage(errorObj.message || 'Failed to save onboarding details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#1F2933] flex flex-col justify-between p-4 sm:p-6 md:p-8 font-sans">
      {/* Header Container */}
      <header className="w-full max-w-3xl mx-auto flex items-center justify-between pb-5 border-b border-[#E5EAE7]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#3F6B5B] flex items-center justify-center text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-[#1F2933]">
              PeerLoop
            </span>
            <span className="block text-xs text-[#6B7280]">
              Campus Onboarding Setup
            </span>
          </div>
        </div>

        {/* Step Badge */}
        <div className="flex items-center gap-2 bg-white border border-[#E5EAE7] px-3 py-1.5 rounded-full text-xs font-medium text-[#1F2933]">
          <span className="w-2 h-2 rounded-full bg-[#3F6B5B]" />
          <span>
            Step <strong className="text-[#3F6B5B] font-bold">{step}</strong> of {totalSteps}
          </span>
        </div>
      </header>

      {/* Main Form Body */}
      <main className="w-full max-w-3xl mx-auto my-6 sm:my-8 bg-white border border-[#E5EAE7] rounded-xl p-6 sm:p-8">
        {/* Step Progress Bar & Titles */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2 font-medium">
            <span className="text-[#3F6B5B] font-semibold uppercase tracking-wider text-[11px]">
              {step === 1 && 'Step 1 — Personal Details'}
              {step === 2 && 'Step 2 — Learning Mode'}
              {step === 3 && 'Step 3 — Skills'}
              {step === 4 && 'Step 4 — Preferences'}
            </span>
            <span>{Math.round((step / totalSteps) * 100)}% Completed</span>
          </div>

          <div className="w-full h-1.5 bg-[#EEF2EE] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#3F6B5B] transition-all duration-300 rounded-full"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-600 hover:text-rose-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 1 — Personal Details */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1F2933] flex items-center gap-2">
                <User className="w-5 h-5 text-[#3F6B5B]" />
                Personal Details
              </h2>
              <p className="text-xs text-[#6B7280] mt-1">
                Help fellow students recognize you and match with classmates from your university.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#1F2933] mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ojaswitha S."
                  className="w-full bg-[#F7F8F5] border border-[#E5EAE7] rounded-lg px-3 py-2 text-xs text-[#1F2933] placeholder-[#6B7280] focus:outline-none focus:border-[#3F6B5B]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#1F2933] mb-1 flex items-center justify-between">
                  <span>
                    College / University <span className="text-rose-500">*</span>
                  </span>
                  <span className="text-[11px] text-[#6B7280]">Campus network</span>
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. UC Berkeley, Stanford, MIT"
                  className="w-full bg-[#F7F8F5] border border-[#E5EAE7] rounded-lg px-3 py-2 text-xs text-[#1F2933] placeholder-[#6B7280] focus:outline-none focus:border-[#3F6B5B]"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {COLLEGE_SUGGESTIONS.slice(0, 4).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCollege(c)}
                      className={`text-[11px] px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                        college === c
                          ? 'bg-[#3F6B5B] text-white border-[#3F6B5B]'
                          : 'bg-[#F7F8F5] border-[#E5EAE7] text-[#6B7280] hover:text-[#1F2933]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2933] mb-1">
                  Course / Major <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full bg-[#F7F8F5] border border-[#E5EAE7] rounded-lg px-3 py-2 text-xs text-[#1F2933] placeholder-[#6B7280] focus:outline-none focus:border-[#3F6B5B]"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {COURSE_SUGGESTIONS.slice(0, 2).map((crs) => (
                    <button
                      key={crs}
                      type="button"
                      onClick={() => setCourse(crs)}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#F7F8F5] border border-[#E5EAE7] text-[#6B7280] hover:text-[#1F2933] cursor-pointer"
                    >
                      {crs}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2933] mb-1">
                  Academic Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-[#F7F8F5] border border-[#E5EAE7] rounded-lg px-3 py-2 text-xs text-[#1F2933] focus:outline-none focus:border-[#3F6B5B] cursor-pointer"
                >
                  {YEAR_OPTIONS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#1F2933] mb-1 flex items-center justify-between">
                  <span>Location</span>
                  <span className="text-[11px] text-[#6B7280]">
                    Helps with in-person or same-timezone study sessions
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Berkeley, CA / Campus Dorms / Remote"
                    className="w-full bg-[#F7F8F5] border border-[#E5EAE7] rounded-lg px-3 py-2 text-xs text-[#1F2933] placeholder-[#6B7280] focus:outline-none focus:border-[#3F6B5B]"
                  />
                  <MapPin className="w-4 h-4 text-[#6B7280] absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 — Learning Mode */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1F2933] flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#3F6B5B]" />
                Choose Your Learning Mode
              </h2>
              <p className="text-xs text-[#6B7280] mt-1">
                Select your primary approach to the PeerLoop network. You can always switch or participate in both anytime.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'Learn',
                  title: 'Learn',
                  badge: 'Get Help Fast',
                  desc: 'Ask doubt questions, discover top student mentors, and book focused 1-on-1 walkthroughs when you are stuck.',
                  icon: BookOpen,
                },
                {
                  id: 'Teach',
                  title: 'Teach',
                  badge: 'Share & Earn Cred',
                  desc: 'Answer fellow students’ doubts, guide junior peers, host study sessions, and build verified reputation badges.',
                  icon: Sparkles,
                },
                {
                  id: 'Learn + Teach',
                  title: 'Learn + Teach',
                  badge: 'Recommended',
                  desc: 'The complete PeerLoop experience: request quick help when facing tough assignments, and teach what you have mastered to reinforce your knowledge.',
                  icon: GraduationCap,
                },
              ].map((opt) => {
                const isSelected = learningMode === opt.id;
                const Icon = opt.icon;

                return (
                  <div
                    key={opt.id}
                    onClick={() => setLearningMode(opt.id as 'Learn' | 'Teach' | 'Learn + Teach')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#EEF2EE] border-[#3F6B5B]'
                        : 'bg-[#F7F8F5] border-[#E5EAE7] hover:border-[#DCE9E2]'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`p-2.5 rounded-lg shrink-0 ${isSelected ? 'bg-[#3F6B5B] text-white' : 'bg-white text-[#3F6B5B] border border-[#E5EAE7]'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-[#1F2933]">{opt.title}</h3>
                            <span
                              className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                                isSelected
                                  ? 'bg-[#DCE9E2] text-[#3F6B5B]'
                                  : 'bg-white text-[#6B7280] border border-[#E5EAE7]'
                              }`}
                            >
                              {opt.badge}
                            </span>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-[#3F6B5B] shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                          {opt.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3 — Skills */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1F2933] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#3F6B5B]" />
                Your Skills & Mastery
              </h2>
              <p className="text-xs text-[#6B7280] mt-1">
                Tell us what you want to learn and what you can teach. Assign each skill your current comfort level.
              </p>
            </div>

            {/* SECTION A: Skills they want to learn */}
            {(learningMode === 'Learn' || learningMode === 'Learn + Teach') && (
              <div className="bg-[#F7F8F5] border border-[#E5EAE7] rounded-xl p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#3F6B5B]" />
                    <h3 className="text-xs font-bold text-[#1F2933] uppercase tracking-wide">Skills you want to learn</h3>
                  </div>
                  <span className="text-[11px] text-[#3F6B5B] font-semibold">
                    {skillsToLearn.length} selected
                  </span>
                </div>

                {/* Popular Skill Badges */}
                <div>
                  <span className="block text-[11px] text-[#6B7280] mb-1.5 font-medium">
                    Quick suggestions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_LEARN_SKILLS.map((sk) => {
                      const isAdded = skillsToLearn.some((s) => s.name === sk);
                      return (
                        <button
                          key={sk}
                          type="button"
                          onClick={() => {
                            if (isAdded) {
                              handleRemoveLearnSkill(sk);
                            } else {
                              handleAddLearnSkill(sk);
                            }
                          }}
                          className={`text-xs px-2.5 py-1 rounded-md border transition-all flex items-center gap-1.5 cursor-pointer ${
                            isAdded
                              ? 'bg-[#3F6B5B] border-[#3F6B5B] text-white font-medium'
                              : 'bg-white border-[#E5EAE7] text-[#6B7280] hover:text-[#1F2933]'
                          }`}
                        >
                          {sk}
                          {isAdded ? (
                            <X className="w-3 h-3 text-white" />
                          ) : (
                            <Plus className="w-3 h-3 text-[#6B7280]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom skill adder */}
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <input
                    type="text"
                    value={newLearnSkillName}
                    onChange={(e) => setNewLearnSkillName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddLearnSkill();
                      }
                    }}
                    placeholder="Add custom topic (e.g. Computer Networks)..."
                    className="flex-1 bg-white border border-[#E5EAE7] rounded-lg px-3 py-1.5 text-xs text-[#1F2933] placeholder-[#6B7280] focus:outline-none focus:border-[#3F6B5B]"
                  />
                  <div className="flex gap-2">
                    <select
                      value={newLearnSkillLevel}
                      onChange={(e) => setNewLearnSkillLevel(e.target.value as SkillLevel)}
                      className="bg-white border border-[#E5EAE7] rounded-lg px-2.5 py-1.5 text-xs text-[#1F2933] focus:outline-none"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleAddLearnSkill()}
                      className="px-3 py-1.5 rounded-lg bg-[#3F6B5B] hover:bg-[#34594B] text-white font-semibold text-xs flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Configured Learn Skills List */}
                {skillsToLearn.length > 0 && (
                  <div className="pt-2 space-y-1.5">
                    <span className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                      Selected Learning Goals:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {skillsToLearn.map((s) => (
                        <div
                          key={s.name}
                          className="flex items-center justify-between p-2 bg-white border border-[#E5EAE7] rounded-lg"
                        >
                          <span className="text-xs font-medium text-[#1F2933] truncate mr-2">
                            {s.name}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <select
                              value={s.level}
                              onChange={(e) =>
                                handleUpdateLearnLevel(s.name, e.target.value as SkillLevel)
                              }
                              className="text-[11px] bg-[#F7F8F5] border border-[#E5EAE7] text-[#3F6B5B] rounded px-1.5 py-0.5 focus:outline-none font-medium"
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => handleRemoveLearnSkill(s.name)}
                              className="text-[#6B7280] hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECTION B: Skills they can teach */}
            {(learningMode === 'Teach' || learningMode === 'Learn + Teach') && (
              <div className="bg-[#F7F8F5] border border-[#E5EAE7] rounded-xl p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#3F6B5B]" />
                    <h3 className="text-xs font-bold text-[#1F2933] uppercase tracking-wide">Skills you can teach</h3>
                  </div>
                  <span className="text-[11px] text-[#3F6B5B] font-semibold">
                    {skillsToTeach.length} selected
                  </span>
                </div>

                {/* Popular Teach Badges */}
                <div>
                  <span className="block text-[11px] text-[#6B7280] mb-1.5 font-medium">
                    Quick suggestions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_TEACH_SKILLS.map((sk) => {
                      const isAdded = skillsToTeach.some((s) => s.name === sk);
                      return (
                        <button
                          key={sk}
                          type="button"
                          onClick={() => {
                            if (isAdded) {
                              handleRemoveTeachSkill(sk);
                            } else {
                              handleAddTeachSkill(sk);
                            }
                          }}
                          className={`text-xs px-2.5 py-1 rounded-md border transition-all flex items-center gap-1.5 cursor-pointer ${
                            isAdded
                              ? 'bg-[#3F6B5B] border-[#3F6B5B] text-white font-medium'
                              : 'bg-white border-[#E5EAE7] text-[#6B7280] hover:text-[#1F2933]'
                          }`}
                        >
                          {sk}
                          {isAdded ? (
                            <X className="w-3 h-3 text-white" />
                          ) : (
                            <Plus className="w-3 h-3 text-[#6B7280]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom skill adder */}
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <input
                    type="text"
                    value={newTeachSkillName}
                    onChange={(e) => setNewTeachSkillName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTeachSkill();
                      }
                    }}
                    placeholder="Add skill you can teach (e.g. Operating Systems)..."
                    className="flex-1 bg-white border border-[#E5EAE7] rounded-lg px-3 py-1.5 text-xs text-[#1F2933] placeholder-[#6B7280] focus:outline-none focus:border-[#3F6B5B]"
                  />
                  <div className="flex gap-2">
                    <select
                      value={newTeachSkillLevel}
                      onChange={(e) => setNewTeachSkillLevel(e.target.value as SkillLevel)}
                      className="bg-white border border-[#E5EAE7] rounded-lg px-2.5 py-1.5 text-xs text-[#1F2933] focus:outline-none"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleAddTeachSkill()}
                      className="px-3 py-1.5 rounded-lg bg-[#3F6B5B] hover:bg-[#34594B] text-white font-semibold text-xs flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Configured Teach Skills List */}
                {skillsToTeach.length > 0 && (
                  <div className="pt-2 space-y-1.5">
                    <span className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                      Selected Teaching Expertise:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {skillsToTeach.map((s) => (
                        <div
                          key={s.name}
                          className="flex items-center justify-between p-2 bg-white border border-[#E5EAE7] rounded-lg"
                        >
                          <span className="text-xs font-medium text-[#1F2933] truncate mr-2">
                            {s.name}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <select
                              value={s.level}
                              onChange={(e) =>
                                handleUpdateTeachLevel(s.name, e.target.value as SkillLevel)
                              }
                              className="text-[11px] bg-[#F7F8F5] border border-[#E5EAE7] text-[#3F6B5B] rounded px-1.5 py-0.5 focus:outline-none font-medium"
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => handleRemoveTeachSkill(s.name)}
                              className="text-[#6B7280] hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 4 — Preferences */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1F2933] flex items-center gap-2">
                <Target className="w-5 h-5 text-[#3F6B5B]" />
                Goals & Preferences
              </h2>
              <p className="text-xs text-[#6B7280] mt-1">
                Customize your study ambitions and preferred language for 1-on-1 walkthroughs.
              </p>
            </div>

            {/* Career Goals */}
            <div>
              <label className="block text-xs font-semibold text-[#1F2933] mb-1 flex items-center justify-between">
                <span>Career / Learning Goals</span>
                <span className="text-[11px] text-[#6B7280]">What are you striving for?</span>
              </label>
              <textarea
                rows={3}
                value={careerGoals}
                onChange={(e) => setCareerGoals(e.target.value)}
                placeholder="e.g. Master algorithms to crack summer internships and become a Full Stack Software Engineer."
                className="w-full bg-[#F7F8F5] border border-[#E5EAE7] rounded-lg px-3 py-2 text-xs text-[#1F2933] placeholder-[#6B7280] focus:outline-none focus:border-[#3F6B5B] resize-none"
              />
              {/* Presets */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {CAREER_GOAL_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setCareerGoals(preset)}
                    className={`text-[11px] px-2.5 py-1 rounded-md border text-left transition-all cursor-pointer ${
                      careerGoals === preset
                        ? 'bg-[#3F6B5B] text-white border-[#3F6B5B]'
                        : 'bg-[#F7F8F5] border-[#E5EAE7] text-[#6B7280] hover:text-[#1F2933]'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Language */}
            <div>
              <label className="block text-xs font-semibold text-[#1F2933] mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Languages className="w-4 h-4 text-[#3F6B5B]" />
                  Preferred Language
                </span>
                <span className="text-[11px] text-[#6B7280]">
                  Language for explanations & notes
                </span>
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full bg-[#F7F8F5] border border-[#E5EAE7] rounded-lg px-3 py-2 text-xs text-[#1F2933] focus:outline-none focus:border-[#3F6B5B] cursor-pointer"
              >
                {LANGUAGE_OPTIONS.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Profile Snapshot Preview */}
            <div className="p-4 rounded-xl bg-[#F7F8F5] border border-[#E5EAE7]">
              <span className="block text-[11px] font-semibold text-[#3F6B5B] uppercase tracking-wider mb-2">
                Profile Preview
              </span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#DCE9E2] text-[#3F6B5B] flex items-center justify-center font-bold text-sm">
                  {name.charAt(0) || 'P'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#1F2933] truncate">{name || 'Peer Learner'}</h4>
                    <span className="text-[10px] bg-[#DCE9E2] text-[#3F6B5B] px-2 py-0.5 rounded-full font-medium">
                      {learningMode}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7280] truncate">
                    {course} • {college} ({year})
                  </p>
                  <p className="text-[11px] text-[#6B7280] truncate mt-0.5">
                    {skillsToLearn.length} to learn • {skillsToTeach.length} to teach • {preferredLanguage}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Actions */}
        <div className="flex items-center justify-between pt-5 mt-6 border-t border-[#E5EAE7]">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-[#6B7280] hover:text-[#1F2933] transition-colors disabled:opacity-50 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#3F6B5B] hover:bg-[#34594B] text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#3F6B5B] hover:bg-[#34594B] text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Complete Setup & Enter Dashboard</span>
                </>
              )}
            </button>
          )}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="w-full max-w-3xl mx-auto text-center text-xs text-[#6B7280] py-3">
        PeerLoop Campus Network • Your academic profile is saved securely to your account.
      </footer>
    </div>
  );
};
