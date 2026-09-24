import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Globe,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, SkillLevel, UserSkill } from '../../types';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const COMMON_SKILLS = [
  'Python',
  'Data Structures & Algorithms',
  'React & Next.js',
  'TypeScript',
  'Machine Learning Basics',
  'SQL & Databases',
  'C++ Systems',
  'Figma UI Design',
  'HTML & Modern CSS',
  'Git & GitHub',
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const { currentUser, completeOnboarding } = useAuth();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 5;

  // Step 1: Basic Info
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [college, setCollege] = useState(currentUser?.college || 'UC Berkeley');
  const [course, setCourse] = useState(currentUser?.course || 'Computer Science');
  const [year, setYear] = useState(currentUser?.year || '2nd Year (Sophomore)');
  const [location, setLocation] = useState(currentUser?.location || 'Berkeley, CA');
  const [bio, setBio] = useState(
    currentUser?.bio ||
      'Interested in mastering computer science fundamentals and helping peers understand code.'
  );

  // Step 2: Learning Information
  const [selectedLearnSkills, setSelectedLearnSkills] = useState<string[]>(
    currentUser?.skillsToLearn.map((s) => s.name) || ['Python', 'Data Structures & Algorithms']
  );
  const [learnLevel, setLearnLevel] = useState<SkillLevel>('Beginner');
  const [careerGoal, setCareerGoal] = useState('Full Stack Software Engineer');
  const [preferredLanguage, setPreferredLanguage] = useState(currentUser?.preferredLanguage || 'English');
  const [learningFormat, setLearningFormat] = useState<
    'Visual & Hands-on' | 'Code Walkthrough' | 'Conceptual' | 'Problem Solving'
  >(currentUser?.learningFormat || 'Visual & Hands-on');

  // Step 3: Teaching Information
  const [selectedTeachSkills, setSelectedTeachSkills] = useState<string[]>(
    currentUser?.skillsToTeach.map((s) => s.name) || ['HTML & Modern CSS', 'Figma UI Design']
  );
  const [teachLevel, setTeachLevel] = useState<SkillLevel>('Intermediate');
  const [teachTopics, setTeachTopics] = useState('Responsive layouts, flexbox, grid, design systems');

  // Step 4: Availability
  const [availableDays, setAvailableDays] = useState<string[]>(
    currentUser?.availability.days || ['Mon', 'Wed', 'Fri', 'Sat']
  );
  const [preferredDuration, setPreferredDuration] = useState<number>(
    currentUser?.availability.preferredDurationMinutes || 20
  );
  const [timeSlots, setTimeSlots] = useState<string[]>(
    currentUser?.availability.timeSlots || ['4:00 PM - 7:00 PM', '8:00 PM - 10:00 PM']
  );

  // Step 5: Mode
  const [mode, setMode] = useState<UserRole>(currentUser?.mode || 'both');

  const toggleLearnSkill = (s: string) => {
    setSelectedLearnSkills((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  const toggleTeachSkill = (s: string) => {
    setSelectedTeachSkills((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  const toggleDay = (day: string) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleFinish = async () => {
    const formattedLearnSkills: UserSkill[] = selectedLearnSkills.map((name, i) => ({
      id: `learn-s-${i}-${Date.now()}`,
      name,
      level: learnLevel,
      category: 'Programming',
      verified: false,
    }));

    const formattedTeachSkills: UserSkill[] = selectedTeachSkills.map((name, i) => ({
      id: `teach-s-${i}-${Date.now()}`,
      name,
      level: teachLevel,
      category: 'Programming',
      verified: true,
      verifiedMethod: 'Skill Assessment Passed',
    }));

    await completeOnboarding({
      fullName,
      college,
      course,
      year,
      location,
      bio,
      mode,
      preferredLanguage,
      learningFormat,
      skillsToLearn: formattedLearnSkills,
      skillsToTeach: formattedTeachSkills,
      availability: {
        status: 'available',
        days: availableDays,
        timeSlots,
        preferredDurationMinutes: preferredDuration,
      },
    });

    onComplete();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-indigo-400">Step {step} of {totalSteps}</span>
            <span>
              {step === 1 && 'Basic Information'}
              {step === 2 && 'Learning Goals'}
              {step === 3 && 'Teaching Profile'}
              {step === 4 && 'Availability'}
              {step === 5 && 'Platform Mode'}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-300 rounded-full"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Tell us about yourself</h2>
              <p className="text-xs text-slate-400 mt-1">
                Your university background helps match you with peers in related courses.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Ojaswitha S."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">College / University</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. UC Berkeley, Stanford, MIT"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Course / Major</label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Computer Science, Data Science"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Academic Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option>1st Year (Freshman)</option>
                  <option>2nd Year (Sophomore)</option>
                  <option>3rd Year (Junior)</option>
                  <option>4th Year (Senior)</option>
                  <option>Graduate / Master</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Short Bio</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                placeholder="What topics are you passionate about?"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Learning Information */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">What do you want to learn?</h2>
              <p className="text-xs text-slate-400 mt-1">
                Select skills you need help with. AI matching uses this to recommend top student mentors.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Select Skills</label>
              <div className="flex flex-wrap gap-2">
                {COMMON_SKILLS.map((skill) => {
                  const isSelected = selectedLearnSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleLearnSkill(skill)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Current Skill Level</label>
                <div className="flex gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced'] as SkillLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setLearnLevel(lvl)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                        learnLevel === lvl
                          ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Learning Format</label>
                <select
                  value={learningFormat}
                  onChange={(e: any) => setLearningFormat(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option>Visual & Hands-on</option>
                  <option>Code Walkthrough</option>
                  <option>Problem Solving</option>
                  <option>Conceptual</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Career / Study Goal</label>
              <input
                type="text"
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                placeholder="e.g. Master algorithms for summer tech internships"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Teaching Information */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">What can you teach or share?</h2>
              <p className="text-xs text-slate-400 mt-1">
                Teaching reinforces your own knowledge and builds verified peer reputation.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Skills you can mentor in
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_SKILLS.map((skill) => {
                  const isSelected = selectedTeachSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleTeachSkill(skill)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-600/20'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Teaching Level</label>
                <div className="flex gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced'] as SkillLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setTeachLevel(lvl)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                        teachLevel === lvl
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Specific Topics</label>
                <input
                  type="text"
                  value={teachTopics}
                  onChange={(e) => setTeachTopics(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. CSS Grid, Flexbox, useState debugging"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Availability */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">When are you available?</h2>
              <p className="text-xs text-slate-400 mt-1">
                Set your study hours so peers and mentors can connect at convenient times.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Available Days</label>
              <div className="flex flex-wrap gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                  const isDaySelected = availableDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`w-11 h-11 rounded-lg text-xs font-semibold border flex items-center justify-center transition-all ${
                        isDaySelected
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Preferred Session Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 20, 30].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setPreferredDuration(dur)}
                    className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                      preferredDuration === dur
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {dur} min
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Mode Selection */}
        {step === 5 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Choose your primary focus</h2>
              <p className="text-xs text-slate-400 mt-1">
                You can switch between learning and teaching mode anytime with a single click.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'learner',
                  title: 'I WANT TO LEARN',
                  desc: 'Find peer mentors, submit quick doubt requests, and get AI-assisted 1-on-1 walkthroughs.',
                  icon: BookOpen,
                  color: 'indigo',
                },
                {
                  id: 'mentor',
                  title: 'I WANT TO TEACH',
                  desc: 'Answer student doubts, run peer sessions, build verified reputation, and earn mentor badges.',
                  icon: Sparkles,
                  color: 'emerald',
                },
                {
                  id: 'both',
                  title: 'I WANT TO LEARN + TEACH (Recommended)',
                  desc: 'The complete PeerLoop experience: get help when stuck, teach what you know, and build genuine proof of skills.',
                  icon: GraduationCap,
                  color: 'cyan',
                },
              ].map((opt) => {
                const isChosen = mode === opt.id;
                const Icon = opt.icon;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setMode(opt.id as UserRole)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isChosen
                        ? 'bg-slate-800/90 border-indigo-500 ring-1 ring-indigo-500'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isChosen ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white">{opt.title}</h4>
                          {isChosen && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors"
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
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-lg shadow-emerald-600/25"
            >
              <Sparkles className="w-4 h-4" />
              <span>Enter PeerLoop Dashboard</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
