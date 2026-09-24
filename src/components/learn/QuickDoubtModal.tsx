import React, { useState } from 'react';
import { Sparkles, Clock, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/storeService';
import { LearningRequest, SkillLevel } from '../../types';

interface QuickDoubtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestCreated: (req: LearningRequest) => void;
}

export const QuickDoubtModal: React.FC<QuickDoubtModalProps> = ({
  isOpen,
  onClose,
  onRequestCreated,
}) => {
  const { currentUser } = useAuth();

  const [skill, setSkill] = useState('Python');
  const [topic, setTopic] = useState('');
  const [currentLevel, setCurrentLevel] = useState<SkillLevel>('Beginner');
  const [description, setDescription] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState(currentUser?.preferredLanguage || 'English');
  const [durationMinutes, setDurationMinutes] = useState<5 | 10 | 20 | 30>(20);
  const [availabilityNote, setAvailabilityNote] = useState('Available now (next 2 hours)');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!topic.trim()) return;

    setLoading(true);

    const newRequest: LearningRequest = {
      id: `req-${Date.now()}`,
      learnerId: currentUser.id,
      learnerName: currentUser.fullName,
      learnerCollege: currentUser.college || 'University Student',
      learnerAvatar: currentUser.avatarUrl,
      skill,
      topic,
      currentLevel,
      description: description.trim() || `Need quick help understanding ${topic} in ${skill}.`,
      preferredLanguage,
      durationMinutes,
      availabilityNote,
      status: 'open',
      createdAt: new Date().toISOString(),
      tags: [skill, topic.split(' ')[0], currentLevel],
    };

    await store.createRequest(newRequest);
    onRequestCreated(newRequest);

    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Quick Doubt Request"
      subtitle="Connect with an active peer mentor in under 5 minutes for targeted doubt solving"
      maxWidth="lg"
    >
      {success ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-white">Doubt Request Published!</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Online mentors with matching skills have been alerted. You can also match directly with a recommended mentor.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Skill Area</label>
              <select
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option>Python</option>
                <option>Data Structures & Algorithms</option>
                <option>React & Next.js</option>
                <option>TypeScript</option>
                <option>SQL & Databases</option>
                <option>Machine Learning Basics</option>
                <option>C++ Systems</option>
                <option>Figma UI Design</option>
                <option>HTML & Modern CSS</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Current Skill Level</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Beginner', 'Intermediate', 'Advanced'] as SkillLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setCurrentLevel(lvl)}
                    className={`py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                      currentLevel === lvl
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Specific Topic or Concept <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Nested loops in 2D array traversal"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              What are you stuck on?
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe where you get confused or paste the error / logic roadblock..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Preferred Duration</span>
              </label>
              <span className="text-[11px] text-slate-500">Quick solve focused</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 20, 30].map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setDurationMinutes(dur as any)}
                  className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                    durationMinutes === dur
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {dur} mins
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Language</label>
              <input
                type="text"
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">When can you meet?</label>
              <input
                type="text"
                value={availabilityNote}
                onChange={(e) => setAvailabilityNote(e.target.value)}
                placeholder="e.g. Right now or within 1 hour"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/25 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Broadcast Doubt Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
