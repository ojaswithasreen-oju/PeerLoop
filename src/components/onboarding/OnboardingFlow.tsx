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
  School,
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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // STEP 1 — Personal Details
  // ---------------------------------------------------------------------------
  const [name, setName] = useState(currentUser?.fullName || currentUser?.name || '');
  const [college, setCollege] = useState(currentUser?.college || 'UC Berkeley');
  const [course, setCourse] = useState(currentUser?.course || 'Computer Science');
  const [year, setYear] = useState(currentUser?.year || '2nd Year (Sophomore)');
  const [location, setLocation] = useState(currentUser?.location || 'Berkeley, CA');

  // ---------------------------------------------------------------------------
  // STEP 2 — Learning Mode
  // ---------------------------------------------------------------------------
  const [learningMode, setLearningMode] = useState<'Learn' | 'Teach' | 'Learn + Teach'>('Learn + Teach');

  // ---------------------------------------------------------------------------
  // STEP 3 — Skills
  // ---------------------------------------------------------------------------
  // Skills they want to learn
  const [skillsToLearn, setSkillsToLearn] = useState<{ name: string; level: SkillLevel }[]>([
    { name: 'Python', level: 'Intermediate' },
    { name: 'Data Structures & Algorithms', level: 'Beginner' },
  ]);
  const [newLearnSkillName, setNewLearnSkillName] = useState('');
  const [newLearnSkillLevel, setNewLearnSkillLevel] = useState<SkillLevel>('Beginner');

  // Skills they can teach
  const [skillsToTeach, setSkillsToTeach] = useState<{ name: string; level: SkillLevel }[]>([
    { name: 'HTML & Modern CSS', level: 'Intermediate' },
    { name: 'Git & GitHub', level: 'Advanced' },
  ]);
  const [newTeachSkillName, setNewTeachSkillName] = useState('');
  const [newTeachSkillLevel, setNewTeachSkillLevel] = useState<SkillLevel>('Intermediate');

  // ---------------------------------------------------------------------------
  // STEP 4 — Preferences
  // ---------------------------------------------------------------------------
  const [careerGoals, setCareerGoals] = useState(
    currentUser?.careerGoals || 'Software Engineer at a high-growth tech company'
  );
  const [preferredLanguage, setPreferredLanguage] = useState(currentUser?.preferredLanguage || 'English');

  // Skills handlers
  const handleAddLearnSkill = (skillName?: string) => {
    const sName = (skillName || newLearnSkillName).trim();
    if (!sName) return;
    if (skillsToLearn.some((s) => s.name.toLowerCase() === sName.toLowerCase())) {
      setNewLearnSkillName('');
      return;
    }
    setSkillsToLearn((prev) => [...prev, { name: sName, level: newLearnSkillLevel }]);
    setNewLearnSkillName('');
  };

  const handleRemoveLearnSkill = (nameToRemove: string) => {
    setSkillsToLearn((prev) => prev.filter((s) => s.name !== nameToRemove));
  };

  const handleUpdateLearnLevel = (skillName: string, level: SkillLevel) => {
    setSkillsToLearn((prev) =>
      prev.map((s) => (s.name === skillName ? { ...s, level } : s))
    );
  };

  const handleAddTeachSkill = (skillName?: string) => {
    const sName = (skillName || newTeachSkillName).trim();
    if (!sName) return;
    if (skillsToTeach.some((s) => s.name.toLowerCase() === sName.toLowerCase())) {
      setNewTeachSkillName('');
      return;
    }
    setSkillsToTeach((prev) => [...prev, { name: sName, level: newTeachSkillLevel }]);
    setNewTeachSkillName('');
  };

  const handleRemoveTeachSkill = (nameToRemove: string) => {
    setSkillsToTeach((prev) => prev.filter((s) => s.name !== nameToRemove));
  };

  const handleUpdateTeachLevel = (skillName: string, level: SkillLevel) => {
    setSkillsToTeach((prev) =>
      prev.map((s) => (s.name === skillName ? { ...s, level } : s))
    );
  };

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return false;
    }
    if (!college.trim()) {
      setErrorMessage('Please enter your college or university.');
      return false;
    }
    if (!course.trim()) {
      setErrorMessage('Please enter your course or major.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  // Step 3 Validation
  const validateStep3 = (): boolean => {
    if (learningMode === 'Learn' && skillsToLearn.length === 0) {
      setErrorMessage('Please select or add at least one skill you want to learn.');
      return false;
    }
    if (learningMode === 'Teach' && skillsToTeach.length === 0) {
      setErrorMessage('Please select or add at least one skill you can teach.');
      return false;
    }
    if (learningMode === 'Learn + Teach') {
      if (skillsToLearn.length === 0 && skillsToTeach.length === 0) {
        setErrorMessage('Please add at least one skill you want to learn or teach.');
        return false;
      }
    }
    setErrorMessage(null);
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 3 && !validateStep3()) return;
    setErrorMessage(null);
    setStep((prev) => Math.min(totalSteps, prev + 1));
  };

  const handleBack = () => {
    setErrorMessage(null);
    setStep((prev) => Math.max(1, prev - 1));
  };

  // Final submit handler
  const handleFinish = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload: OnboardingData = {
        name: name.trim() || 'Peer Learner',
        college: college.trim() || 'University Campus',
        course: course.trim() || 'Computer Science',
        year: year || '1st Year (Freshman)',
        location: location.trim() || 'Campus',
        learningMode,
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
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8 relative selection:bg-cyan-500/20">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-indigo-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Header Container */}
      <header className="relative z-10 w-full max-w-3xl mx-auto flex items-center justify-between pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <GraduationCap className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight text-white">
              Peer<span className="text-cyan-400">Loop</span>
            </span>
            <span className="block text-[11px] font-mono text-slate-400 -mt-0.5">
              Campus Onboarding Setup
            </span>
          </div>
        </div>

        {/* Step Badge */}
        <div className="flex items-center gap-2 bg-[#151E33] border border-slate-800 px-3 py-1.5 rounded-full text-xs font-medium text-slate-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>
            Step <strong className="text-white font-bold">{step}</strong> of {totalSteps}
          </span>
        </div>
      </header>

      {/* Main Form Body */}
      <main className="relative z-10 w-full max-w-3xl mx-auto my-6 sm:my-8 bg-[#111827]/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
        {/* Step Progress Bar & Titles */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
            <span className="text-cyan-400 font-semibold uppercase tracking-wider text-[11px]">
              {step === 1 && 'Step 1 — Personal Details'}
              {step === 2 && 'Step 2 — Learning Mode'}
              {step === 3 && 'Step 3 — Skills'}
              {step === 4 && 'Step 4 — Preferences'}
            </span>
            <span>{Math.round((step / totalSteps) * 100)}% Completed</span>
          </div>

          <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 transition-all duration-500 ease-out rounded-full shadow-sm shadow-cyan-500/30"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* STEP 1 — Personal Details */}
        {/* ----------------------------------------------------------------- */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <User className="w-6 h-6 text-cyan-400" />
                Personal Details
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Help fellow students recognize you and match with classmates from your university.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ojaswitha S."
                    className="w-full bg-[#151E33] border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>
              </div>

              {/* College / University */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>
                    College / University <span className="text-cyan-400">*</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal">Campus network</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. UC Berkeley, Stanford, MIT"
                    className="w-full bg-[#151E33] border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>
                {/* Suggestions */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {COLLEGE_SUGGESTIONS.slice(0, 4).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCollege(c)}
                      className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                        college === c
                          ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Course / Major */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Course / Major <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full bg-[#151E33] border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {COURSE_SUGGESTIONS.slice(0, 2).map((crs) => (
                    <button
                      key={crs}
                      type="button"
                      onClick={() => setCourse(crs)}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                    >
                      {crs}
                    </button>
                  ))}
                </div>
              </div>

              {/* Academic Year */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Academic Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-[#151E33] border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all cursor-pointer"
                >
                  {YEAR_OPTIONS.map((y) => (
                    <option key={y} value={y} className="bg-slate-900 text-white">
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Location</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    Helps with in-person or same-timezone study sessions
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Berkeley, CA / Campus Dorms / Remote"
                    className="w-full bg-[#151E33] border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                  <MapPin className="w-4 h-4 text-slate-500 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* STEP 2 — Learning Mode */}
        {/* ----------------------------------------------------------------- */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Compass className="w-6 h-6 text-cyan-400" />
                Choose Your Learning Mode
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Select your primary approach to the PeerLoop network. You can always switch or participate in both anytime.
              </p>
            </div>

            <div className="space-y-3.5">
              {[
                {
                  id: 'Learn',
                  title: 'Learn',
                  badge: 'Get Help Fast',
                  desc: 'Ask doubt questions, discover top student mentors, and book focused 1-on-1 walkthroughs when you are stuck.',
                  icon: BookOpen,
                  accentBorder: 'border-indigo-500 ring-1 ring-indigo-500/50 bg-indigo-500/10',
                  iconBg: 'bg-indigo-600 text-white',
                },
                {
                  id: 'Teach',
                  title: 'Teach',
                  badge: 'Share & Earn Cred',
                  desc: 'Answer fellow students’ doubts, guide junior peers, host study sessions, and build verified reputation badges.',
                  icon: Sparkles,
                  accentBorder: 'border-emerald-500 ring-1 ring-emerald-500/50 bg-emerald-500/10',
                  iconBg: 'bg-emerald-600 text-white',
                },
                {
                  id: 'Learn + Teach',
                  title: 'Learn + Teach',
                  badge: 'Recommended • Full Loop',
                  desc: 'The complete PeerLoop experience: request quick help when facing tough assignments, and teach what you have mastered to reinforce your knowledge.',
                  icon: GraduationCap,
                  accentBorder: 'border-cyan-500 ring-1 ring-cyan-500/50 bg-cyan-500/10',
                  iconBg: 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-bold',
                },
              ].map((opt) => {
                const isSelected = learningMode === opt.id;
                const Icon = opt.icon;

                return (
                  <div
                    key={opt.id}
                    onClick={() => setLearningMode(opt.id as 'Learn' | 'Teach' | 'Learn + Teach')}
                    className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? opt.accentBorder
                        : 'bg-[#151E33]/70 border-slate-800 hover:border-slate-700 hover:bg-[#151E33]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl shrink-0 ${opt.iconBg}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-white">{opt.title}</h3>
                            <span
                              className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                                isSelected
                                  ? 'bg-white/10 text-white'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {opt.badge}
                            </span>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300/80 mt-1.5 leading-relaxed">
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

        {/* ----------------------------------------------------------------- */}
        {/* STEP 3 — Skills */}
        {/* ----------------------------------------------------------------- */}
        {step === 3 && (
          <div className="space-y-7 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Layers className="w-6 h-6 text-cyan-400" />
                Your Skills & Mastery
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Tell us what you want to learn and what you can teach. Assign each skill your current comfort level.
              </p>
            </div>

            {/* SECTION A: Skills they want to learn */}
            {(learningMode === 'Learn' || learningMode === 'Learn + Teach') && (
              <div className="bg-[#151E33]/60 border border-slate-800/90 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white">Skills you want to learn</h3>
                  </div>
                  <span className="text-[11px] text-cyan-400 font-mono">
                    {skillsToLearn.length} selected
                  </span>
                </div>

                {/* Popular Skill Badges */}
                <div>
                  <span className="block text-[11px] text-slate-400 mb-2 font-medium">
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
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                            isAdded
                              ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-medium'
                              : 'bg-[#0E1526] border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {sk}
                          {isAdded ? (
                            <X className="w-3 h-3 text-cyan-400" />
                          ) : (
                            <Plus className="w-3 h-3 text-slate-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom skill adder */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
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
                    className="flex-1 bg-[#0E1526] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <div className="flex gap-2">
                    <select
                      value={newLearnSkillLevel}
                      onChange={(e) => setNewLearnSkillLevel(e.target.value as SkillLevel)}
                      className="bg-[#0E1526] border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-300 focus:outline-none"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleAddLearnSkill()}
                      className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Configured Learn Skills List */}
                {skillsToLearn.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <span className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                      Selected Learning Goals:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {skillsToLearn.map((s) => (
                        <div
                          key={s.name}
                          className="flex items-center justify-between p-2.5 bg-[#0E1526] border border-slate-800/80 rounded-xl"
                        >
                          <span className="text-xs font-medium text-white truncate mr-2">
                            {s.name}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <select
                              value={s.level}
                              onChange={(e) =>
                                handleUpdateLearnLevel(s.name, e.target.value as SkillLevel)
                              }
                              className="text-[11px] bg-slate-900 border border-slate-800 text-cyan-400 rounded-lg px-2 py-1 focus:outline-none"
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => handleRemoveLearnSkill(s.name)}
                              className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
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
              <div className="bg-[#151E33]/60 border border-slate-800/90 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Skills you can teach</h3>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    {skillsToTeach.length} selected
                  </span>
                </div>

                {/* Popular Teach Badges */}
                <div>
                  <span className="block text-[11px] text-slate-400 mb-2 font-medium">
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
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                            isAdded
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-medium'
                              : 'bg-[#0E1526] border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {sk}
                          {isAdded ? (
                            <X className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Plus className="w-3 h-3 text-slate-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom skill adder */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
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
                    className="flex-1 bg-[#0E1526] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <div className="flex gap-2">
                    <select
                      value={newTeachSkillLevel}
                      onChange={(e) => setNewTeachSkillLevel(e.target.value as SkillLevel)}
                      className="bg-[#0E1526] border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-300 focus:outline-none"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleAddTeachSkill()}
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Configured Teach Skills List */}
                {skillsToTeach.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <span className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                      Selected Teaching Expertise:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {skillsToTeach.map((s) => (
                        <div
                          key={s.name}
                          className="flex items-center justify-between p-2.5 bg-[#0E1526] border border-slate-800/80 rounded-xl"
                        >
                          <span className="text-xs font-medium text-white truncate mr-2">
                            {s.name}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <select
                              value={s.level}
                              onChange={(e) =>
                                handleUpdateTeachLevel(s.name, e.target.value as SkillLevel)
                              }
                              className="text-[11px] bg-slate-900 border border-slate-800 text-emerald-400 rounded-lg px-2 py-1 focus:outline-none"
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => handleRemoveTeachSkill(s.name)}
                              className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
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

        {/* ----------------------------------------------------------------- */}
        {/* STEP 4 — Preferences */}
        {/* ----------------------------------------------------------------- */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Target className="w-6 h-6 text-cyan-400" />
                Goals & Preferences
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Customize your study ambitions and preferred language for 1-on-1 walkthroughs.
              </p>
            </div>

            {/* Career Goals */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Career / Learning Goals</span>
                <span className="text-[11px] text-slate-500 font-normal">What are you striving for?</span>
              </label>
              <textarea
                rows={3}
                value={careerGoals}
                onChange={(e) => setCareerGoals(e.target.value)}
                placeholder="e.g. Master algorithms to crack summer internships and become a Full Stack Software Engineer."
                className="w-full bg-[#151E33] border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
              />
              {/* Presets */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {CAREER_GOAL_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setCareerGoals(preset)}
                    className={`text-[11px] px-2.5 py-1 rounded-md border text-left transition-all ${
                      careerGoals === preset
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 font-medium'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Language */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Languages className="w-4 h-4 text-cyan-400" />
                  Preferred Language
                </span>
                <span className="text-[11px] text-slate-500 font-normal">
                  Language for explanations & notes
                </span>
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full bg-[#151E33] border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all cursor-pointer"
              >
                {LANGUAGE_OPTIONS.map((lang) => (
                  <option key={lang} value={lang} className="bg-slate-900 text-white">
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Final Profile Snapshot Preview */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900/90 to-[#151E33]/90 border border-slate-800">
              <span className="block text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-2">
                Profile Preview
              </span>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-base">
                  {name.charAt(0) || 'P'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white truncate">{name}</h4>
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-medium">
                      {learningMode}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">
                    {course} • {college} ({year})
                  </p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {skillsToLearn.length} to learn • {skillsToTeach.length} to teach • {preferredLanguage}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Navigation Actions */}
        {/* ----------------------------------------------------------------- */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800/80">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors disabled:opacity-50"
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
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-slate-950 text-xs font-extrabold transition-all shadow-lg shadow-indigo-500/25 cursor-pointer disabled:opacity-50"
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
      <footer className="relative z-10 w-full max-w-3xl mx-auto text-center text-xs text-slate-500 py-3">
        PeerLoop Campus Network • Your academic profile is saved securely to your account.
      </footer>
    </div>
  );
};
