import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  FileText,
  Link as LinkIcon,
  HelpCircle,
  BookOpen,
  Calendar,
  Clock,
  Users,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/storeService';
import { Lecture, LectureFormat, LectureResource, SkillLevel } from '../../types';

interface CreateLectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLectureCreated: (lecture: Lecture) => void;
  editingLecture?: Lecture | null;
}

export const CreateLectureModal: React.FC<CreateLectureModalProps> = ({
  isOpen,
  onClose,
  onLectureCreated,
  editingLecture,
}) => {
  const { currentUser } = useAuth();

  const [title, setTitle] = useState(
    editingLecture?.title || 'Python Fundamentals: Loops & List Comprehensions'
  );
  const [description, setDescription] = useState(
    editingLecture?.description ||
      'Interactive deep-dive into writing clean, memory-efficient nested loops and multi-dimensional array operations.'
  );
  const [skill, setSkill] = useState(editingLecture?.skill || 'Python');
  const [difficulty, setDifficulty] = useState<SkillLevel>(
    editingLecture?.difficulty || 'Beginner'
  );
  const [learningObjectives, setLearningObjectives] = useState<string[]>(
    editingLecture?.learningObjectives || [
      'Master the row-by-column index mental model for matrix manipulations',
      'Translate procedural for-loops into readable list comprehensions',
      'Avoid classic IndexError and off-by-one boundary bugs',
    ]
  );
  const [newObjective, setNewObjective] = useState('');
  const [duration, setDuration] = useState(editingLecture?.duration || '60 min');
  const [date, setDate] = useState(editingLecture?.date || 'Today');
  const [time, setTime] = useState(editingLecture?.time || '6:30 PM');
  const [maxStudents, setMaxStudents] = useState<number>(
    editingLecture?.maxStudents || 15
  );
  const [format, setFormat] = useState<LectureFormat>(
    editingLecture?.format || 'Workshop'
  );

  // Optional resources
  const [privateNotes, setPrivateNotes] = useState(
    editingLecture?.privateNotes ||
      'Cover memory tracing with live diagram at 20 min mark. Assign 10 min paired breakout challenge.'
  );
  const [resources, setResources] = useState<LectureResource[]>(
    editingLecture?.resources || [
      {
        id: 'res-1',
        title: 'Nested Loops Cheat Sheet (PDF)',
        type: 'PDF',
        url: 'https://docs.python.org/3/tutorial/controlflow.html',
      },
      {
        id: 'res-2',
        title: 'Interactive Python Sandbox Link',
        type: 'Link',
        url: 'https://colab.research.google.com',
      },
    ]
  );
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceType, setResourceType] = useState<'Notes' | 'PDF' | 'Link' | 'Practice'>('Link');
  const [resourceUrl, setResourceUrl] = useState('');

  const [practiceQuestions, setPracticeQuestions] = useState<string[]>(
    editingLecture?.practiceQuestions || [
      'Write a function that flattens a 2D matrix into a 1D array filtering negative numbers.',
      'What is the space complexity difference between nested loop append vs comprehension generator?',
    ]
  );
  const [newQuestion, setNewQuestion] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddObjective = (e: React.FormEvent) => {
    e.preventDefault();
    if (newObjective.trim()) {
      setLearningObjectives([...learningObjectives, newObjective.trim()]);
      setNewObjective('');
    }
  };

  const handleRemoveObjective = (index: number) => {
    setLearningObjectives(learningObjectives.filter((_, i) => i !== index));
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (resourceTitle.trim()) {
      setResources([
        ...resources,
        {
          id: `res-${Date.now()}`,
          title: resourceTitle.trim(),
          type: resourceType,
          url: resourceUrl.trim() || undefined,
        },
      ]);
      setResourceTitle('');
      setResourceUrl('');
    }
  };

  const handleRemoveResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestion.trim()) {
      setPracticeQuestions([...practiceQuestions, newQuestion.trim()]);
      setNewQuestion('');
    }
  };

  const handleRemoveQuestion = (index: number) => {
    setPracticeQuestions(practiceQuestions.filter((_, i) => i !== index));
  };

  const handleSave = async (status: 'Draft' | 'Upcoming') => {
    if (!currentUser || !title.trim() || !skill.trim()) return;
    setIsSubmitting(true);

    const lectureId = editingLecture?.id || `lec-${Date.now()}`;
    const lectureData: Lecture = {
      id: lectureId,
      teacherId: currentUser.id,
      teacherName: currentUser.fullName || currentUser.name || 'Mentor',
      teacherAvatar: currentUser.avatarUrl,
      teacherCollege: currentUser.college,
      title: title.trim(),
      description: description.trim(),
      skill: skill.trim(),
      difficulty,
      learningObjectives: learningObjectives.length > 0 ? learningObjectives : ['Master fundamental concepts'],
      duration,
      date,
      time,
      format,
      maxStudents: Number(maxStudents) || 15,
      enrolledCount: editingLecture?.enrolledCount || 1,
      studentsPresentCount: editingLecture?.studentsPresentCount || 0,
      status,
      resources,
      privateNotes,
      practiceQuestions,
      createdAt: editingLecture?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rating: editingLecture?.rating || 5.0,
    };

    try {
      await store.saveLecture(lectureData);
      setIsSubmitting(false);
      onLectureCreated(lectureData);
      onClose();
    } catch (err) {
      console.error('Failed to save lecture:', err);
      setIsSubmitting(false);
      onLectureCreated(lectureData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-[#E3E1D9] rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-[#E3E1D9] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#496456] tracking-wider">
              {editingLecture ? 'Update Lecture' : 'New Teaching Session'}
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#202924] mt-0.5">
              {editingLecture ? 'Edit Lecture Details' : 'Create Lecture'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#69736D] hover:text-[#202924] hover:bg-[#F6F4EE] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* 1. Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#202924] mb-1">
                Lecture Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Python Fundamentals: Mastering Loops & Comprehensions"
                className="w-full bg-[#F6F4EE] border border-[#E3E1D9] rounded-xl px-4 py-2.5 text-xs text-[#202924] focus:outline-none focus:border-[#496456]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202924] mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Give students context on the prerequisites, structure, and what to expect..."
                className="w-full bg-[#F6F4EE] border border-[#E3E1D9] rounded-xl px-4 py-2.5 text-xs text-[#202924] focus:outline-none focus:border-[#496456]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#202924] mb-1">
                  Skill / Topic Domain *
                </label>
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  placeholder="e.g. Python, React, UI/UX, DSA"
                  className="w-full bg-[#F6F4EE] border border-[#E3E1D9] rounded-xl px-3.5 py-2 text-xs text-[#202924] focus:outline-none focus:border-[#496456]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202924] mb-1">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced'] as SkillLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDifficulty(lvl)}
                      className={`py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-center ${
                        difficulty === lvl
                          ? 'bg-[#496456] text-white shadow-xs'
                          : 'bg-[#F6F4EE] text-[#69736D] hover:text-[#202924] border border-[#E3E1D9]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. What students will learn (Learning Objectives) */}
          <div className="space-y-3 pt-2 border-t border-[#E3E1D9]">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#202924] uppercase tracking-wider">
                What Students Will Learn
              </label>
              <span className="text-[11px] text-[#69736D]">
                Clear outcomes help students find your lecture
              </span>
            </div>

            <div className="space-y-2">
              {learningObjectives.map((obj, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9]"
                >
                  <span className="w-5 h-5 rounded-full bg-[#DCE6DE] text-[#496456] flex items-center justify-center text-[10px] font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span className="flex-1 text-xs text-[#202924]">{obj}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveObjective(idx)}
                    className="text-[#69736D] hover:text-rose-600 transition-colors cursor-pointer p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddObjective(e);
                  }
                }}
                placeholder="Add learning objective (e.g. Master matrix indexing)..."
                className="flex-1 bg-[#F6F4EE] border border-[#E3E1D9] rounded-xl px-3.5 py-2 text-xs text-[#202924] focus:outline-none focus:border-[#496456]"
              />
              <button
                type="button"
                onClick={handleAddObjective}
                className="px-3.5 py-2 bg-[#DCE6DE] hover:bg-[#cde0d1] text-[#496456] font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                + Add
              </button>
            </div>
          </div>

          {/* 3. Schedule, Format, Duration, Max Students */}
          <div className="space-y-4 pt-2 border-t border-[#E3E1D9]">
            <label className="block text-xs font-bold text-[#202924] uppercase tracking-wider">
              Format &amp; Scheduling
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[11px] font-semibold text-[#69736D] block mb-1">
                  Format
                </span>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as LectureFormat)}
                  className="w-full bg-[#F6F4EE] border border-[#E3E1D9] rounded-xl px-3 py-2 text-xs text-[#202924] focus:outline-none focus:border-[#496456]"
                >
                  <option value="1-on-1">1-on-1 Mentoring</option>
                  <option value="Small Group">Small Group (3-8 peers)</option>
                  <option value="Workshop">Workshop (10-30 peers)</option>
                </select>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#69736D] block mb-1">
                  Duration
                </span>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-[#F6F4EE] border border-[#E3E1D9] rounded-xl px-3 py-2 text-xs text-[#202924] focus:outline-none focus:border-[#496456]"
                >
                  <option value="30 min">30 min</option>
                  <option value="45 min">45 min</option>
                  <option value="60 min">60 min</option>
                  <option value="90 min">90 min</option>
                </select>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#69736D] block mb-1">
                  Max Students
                </span>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={maxStudents}
                  onChange={(e) => setMaxStudents(parseInt(e.target.value) || 10)}
                  className="w-full bg-[#F6F4EE] border border-[#E3E1D9] rounded-xl px-3 py-2 text-xs text-[#202924] focus:outline-none focus:border-[#496456]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] font-semibold text-[#69736D] block mb-1">
                  Date
                </span>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. Today, Tomorrow, or Oct 2"
                  className="w-full bg-[#F6F4EE] border border-[#E3E1D9] rounded-xl px-3.5 py-2 text-xs text-[#202924] focus:outline-none focus:border-[#496456]"
                />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-[#69736D] block mb-1">
                  Time
                </span>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 6:30 PM"
                  className="w-full bg-[#F6F4EE] border border-[#E3E1D9] rounded-xl px-3.5 py-2 text-xs text-[#202924] focus:outline-none focus:border-[#496456]"
                />
              </div>
            </div>
          </div>

          {/* 4. Optional Resources & Private Notes */}
          <div className="space-y-4 pt-2 border-t border-[#E3E1D9]">
            <label className="block text-xs font-bold text-[#202924] uppercase tracking-wider">
              Lecture Resources &amp; Notes (Optional)
            </label>

            {/* Private Notes */}
            <div>
              <span className="text-[11px] font-semibold text-[#69736D] block mb-1">
                Private Teacher Notes (Only visible to you during lecture)
              </span>
              <textarea
                value={privateNotes}
                onChange={(e) => setPrivateNotes(e.target.value)}
                rows={2}
                placeholder="Pacing notes, student reminder cues, or solution checkpoints..."
                className="w-full bg-[#F6F4EE] border border-[#E3E1D9] rounded-xl px-3.5 py-2 text-xs text-[#202924] focus:outline-none focus:border-[#496456]"
              />
            </div>

            {/* Resources List */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-[#69736D] block">
                Attached PDFs, Slides, or Links for Students:
              </span>
              {resources.map((res, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#DCE6DE] text-[#496456]">
                      {res.type}
                    </span>
                    <span className="font-semibold text-xs text-[#202924]">{res.title}</span>
                    {res.url && (
                      <span className="text-[10px] text-[#69736D] truncate max-w-[200px]">
                        {res.url}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveResource(idx)}
                    className="text-[#69736D] hover:text-rose-600 transition-colors cursor-pointer p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    value={resourceTitle}
                    onChange={(e) => setResourceTitle(e.target.value)}
                    placeholder="Resource title (e.g. Cheat sheet)"
                    className="w-full bg-[#F6F4EE] border border-[#E3E1D9] rounded-xl px-3 py-1.5 text-xs text-[#202924] focus:outline-none focus:border-[#496456]"
                  />
                </div>
                <div className="sm:col-span-3">
                  <select
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value as any)}
                    className="w-full bg-[#F6F4EE] border border-[#E3E1D9] rounded-xl px-2 py-1.5 text-xs text-[#202924] focus:outline-none focus:border-[#496456]"
                  >
                    <option value="Link">Link</option>
                    <option value="PDF">PDF</option>
                    <option value="Notes">Notes</option>
                    <option value="Practice">Practice</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    value={resourceUrl}
                    onChange={(e) => setResourceUrl(e.target.value)}
                    placeholder="URL (optional)"
                    className="w-full bg-[#F6F4EE] border border-[#E3E1D9] rounded-xl px-3 py-1.5 text-xs text-[#202924] focus:outline-none focus:border-[#496456]"
                  />
                </div>
                <div className="sm:col-span-1">
                  <button
                    type="button"
                    onClick={handleAddResource}
                    className="w-full h-full py-1.5 bg-[#DCE6DE] hover:bg-[#cde0d1] text-[#496456] font-bold rounded-xl text-xs flex items-center justify-center transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Practice Questions */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-semibold text-[#69736D] block">
                Practice Questions (for live breakout or student practice):
              </span>
              {practiceQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] flex items-center justify-between"
                >
                  <span className="text-xs text-[#202924]">
                    Q{idx + 1}. {q}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(idx)}
                    className="text-[#69736D] hover:text-rose-600 transition-colors cursor-pointer p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddQuestion(e);
                    }
                  }}
                  placeholder="Add a practice question for students..."
                  className="flex-1 bg-[#F6F4EE] border border-[#E3E1D9] rounded-xl px-3.5 py-2 text-xs text-[#202924] focus:outline-none focus:border-[#496456]"
                />
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="px-3.5 py-2 bg-[#DCE6DE] hover:bg-[#cde0d1] text-[#496456] font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-[#E3E1D9] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#69736D] hover:text-[#202924] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave('Draft')}
              className="px-4 py-2 rounded-xl bg-[#F6F4EE] hover:bg-[#e8e6df] text-[#202924] border border-[#E3E1D9] text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              type="button"
              disabled={isSubmitting || !title.trim()}
              onClick={() => handleSave('Upcoming')}
              className="px-6 py-2.5 rounded-xl bg-[#496456] hover:bg-[#3d5347] text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Publish Lecture</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
