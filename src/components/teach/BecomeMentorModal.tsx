import React, { useState } from 'react';
import { X, Sparkles, Check, BookOpen, Clock, Award, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/storeService';
import { SkillLevel, UserSkill } from '../../types';

interface BecomeMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const COMMON_SKILLS = [
  'Python',
  'React & Next.js',
  'Data Structures & Algorithms',
  'UI/UX Design',
  'Database Design & SQL',
  'TypeScript',
  'Machine Learning Basics',
  'Web Development',
];

export const BecomeMentorModal: React.FC<BecomeMentorModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentUser, switchDemoUser } = useAuth();

  const [selectedSkills, setSelectedSkills] = useState<
    Array<{ name: string; level: SkillLevel }>
  >([
    { name: 'Python', level: 'Intermediate' },
    { name: 'Data Structures & Algorithms', level: 'Intermediate' },
  ]);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [selectedFormats, setSelectedFormats] = useState<string[]>([
    'Workshop',
    'Small Group',
    '1-on-1',
  ]);
  const [selectedDays, setSelectedDays] = useState<string[]>([
    'Mon',
    'Wed',
    'Fri',
    'Sat',
  ]);
  const [timeSlot, setTimeSlot] = useState('4:00 PM - 7:00 PM');
  const [mentorBio, setMentorBio] = useState(
    'Excited to help fellow students break down challenging concepts and build confidence through hands-on practice.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleSkill = (skillName: string) => {
    if (selectedSkills.some((s) => s.name === skillName)) {
      setSelectedSkills(selectedSkills.filter((s) => s.name !== skillName));
    } else {
      setSelectedSkills([...selectedSkills, { name: skillName, level: 'Intermediate' }]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkillInput.trim() && !selectedSkills.some((s) => s.name.toLowerCase() === customSkillInput.trim().toLowerCase())) {
      setSelectedSkills([
        ...selectedSkills,
        { name: customSkillInput.trim(), level: 'Intermediate' },
      ]);
      setCustomSkillInput('');
    }
  };

  const handleLevelChange = (skillName: string, level: SkillLevel) => {
    setSelectedSkills(
      selectedSkills.map((s) => (s.name === skillName ? { ...s, level } : s))
    );
  };

  const toggleFormat = (format: string) => {
    if (selectedFormats.includes(format)) {
      if (selectedFormats.length > 1) {
        setSelectedFormats(selectedFormats.filter((f) => f !== format));
      }
    } else {
      setSelectedFormats([...selectedFormats, format]);
    }
  };

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSubmitting(true);

    try {
      const formattedSkills: UserSkill[] = selectedSkills.map((s, idx) => ({
        id: `teach-skill-${idx}-${Date.now()}`,
        name: s.name,
        level: s.level,
        category: 'Programming',
        verified: true,
        verifiedMethod: 'Skill Assessment Passed',
        yearsOrMonthsExperience: '1+ year',
      }));

      await store.enableTeachingMode(currentUser.id, {
        skillsToTeach: formattedSkills,
        bio: mentorBio,
        availability: {
          status: 'available',
          days: selectedDays,
          timeSlots: [timeSlot],
          preferredDurationMinutes: 45,
        },
        teachingFormats: selectedFormats,
      });

      // Update in-memory state
      currentUser.learningMode = 'Learn + Teach';
      currentUser.mode = 'both';
      currentUser.skillsToTeach = formattedSkills;
      currentUser.bio = mentorBio;

      setIsSubmitting(false);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to enable teaching mode:', err);
      setIsSubmitting(false);
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-[#E3E1D9] rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-[#E3E1D9] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#DCE6DE] text-[#496456] flex items-center justify-center">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#202924]">
                Become a Mentor
              </h2>
              <p className="text-xs text-[#69736D] mt-0.5">
                Enable Teaching Mode to host lectures and guide campus peers.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#69736D] hover:text-[#202924] hover:bg-[#F6F4EE] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* Banner */}
          <div className="p-4 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] flex items-start gap-3">
            <Shield className="w-4 h-4 text-[#496456] shrink-0 mt-0.5" />
            <p className="text-[#202924] leading-relaxed">
              Teaching sharpens your own mastery through the{' '}
              <span className="font-semibold text-[#496456]">Feynman Technique</span>. You’ll be able to create lectures, help peers with live doubts, and earn mentor reputation badges.
            </p>
          </div>

          {/* 1. Skills you can teach */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#202924] uppercase tracking-wider">
              1. Skills you can teach or explain
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_SKILLS.map((skill) => {
                const isSelected = selectedSkills.some((s) => s.name === skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#496456] text-white'
                        : 'bg-[#F6F4EE] text-[#202924] border border-[#E3E1D9] hover:border-[#496456]'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom skill input */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                placeholder="Add other skill (e.g. Kotlin, Docker, Figma)..."
                className="flex-1 bg-[#F6F4EE] border border-[#E3E1D9] rounded-xl px-3.5 py-2 text-xs text-[#202924] focus:outline-none focus:border-[#496456]"
              />
              <button
                type="button"
                onClick={handleAddCustomSkill}
                className="px-3.5 py-2 bg-[#DCE6DE] hover:bg-[#cde0d1] text-[#496456] font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                + Add
              </button>
            </div>

            {/* Selected Skills level customization */}
            {selectedSkills.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-semibold text-[#69736D]">
                  Set your comfort level for each selected skill:
                </span>
                <div className="space-y-2">
                  {selectedSkills.map((s) => (
                    <div
                      key={s.name}
                      className="p-2.5 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] flex items-center justify-between"
                    >
                      <span className="font-semibold text-[#202924]">{s.name}</span>
                      <div className="flex gap-1.5">
                        {(['Beginner', 'Intermediate', 'Advanced'] as SkillLevel[]).map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => handleLevelChange(s.name, lvl)}
                            className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                              s.level === lvl
                                ? 'bg-[#496456] text-white'
                                : 'bg-white text-[#69736D] border border-[#E3E1D9]'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Teaching Formats */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#202924] uppercase tracking-wider">
              2. Preferred Teaching Formats
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'Workshop', label: 'Workshop (10-25 peers)' },
                { id: 'Small Group', label: 'Small Group (3-5 peers)' },
                { id: '1-on-1', label: '1-on-1 Mentoring' },
              ].map((fmt) => {
                const active = selectedFormats.includes(fmt.id);
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => toggleFormat(fmt.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      active
                        ? 'bg-[#DCE6DE]/60 border-[#496456] text-[#202924]'
                        : 'bg-[#F6F4EE] border-[#E3E1D9] text-[#69736D]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{fmt.id}</span>
                      {active && <Check className="w-3.5 h-3.5 text-[#496456]" />}
                    </div>
                    <span className="text-[10px] block mt-1 opacity-80">{fmt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Availability Days & Times */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#202924] uppercase tracking-wider">
              3. Weekly Availability
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                const active = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`w-9 h-9 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#496456] text-white'
                        : 'bg-[#F6F4EE] text-[#69736D] border border-[#E3E1D9]'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[11px] font-semibold text-[#69736D] block mb-1">
                  Preferred Time Window
                </span>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-[#F6F4EE] border border-[#E3E1D9] rounded-xl px-3 py-2 text-xs text-[#202924] focus:outline-none focus:border-[#496456]"
                >
                  <option value="4:00 PM - 7:00 PM">Evenings (4:00 PM - 7:00 PM)</option>
                  <option value="7:00 PM - 10:00 PM">Night (7:00 PM - 10:00 PM)</option>
                  <option value="10:00 AM - 1:00 PM">Morning (10:00 AM - 1:00 PM)</option>
                  <option value="1:00 PM - 4:00 PM">Afternoon (1:00 PM - 4:00 PM)</option>
                </select>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-[#69736D] block mb-1">
                  Short Teaching Bio
                </span>
                <input
                  type="text"
                  value={mentorBio}
                  onChange={(e) => setMentorBio(e.target.value)}
                  className="w-full bg-[#F6F4EE] border border-[#E3E1D9] rounded-xl px-3 py-2 text-xs text-[#202924] focus:outline-none focus:border-[#496456]"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#E3E1D9] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#69736D] hover:text-[#202924] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || selectedSkills.length === 0}
              className="px-6 py-2.5 rounded-xl bg-[#496456] hover:bg-[#3d5347] text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Activating Teaching Space...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Activate Teaching Mode</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
