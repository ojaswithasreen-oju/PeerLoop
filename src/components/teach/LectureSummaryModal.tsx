import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  Users,
  Award,
  Sparkles,
  Share2,
  Download,
  BookOpen,
  MessageSquare,
  Bookmark,
} from 'lucide-react';
import { Lecture, LectureSummary } from '../../types';

interface LectureSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lecture: Lecture | null;
  summary: LectureSummary | null;
  onSaveSummary?: (summary: LectureSummary) => void;
}

export const LectureSummaryModal: React.FC<LectureSummaryModalProps> = ({
  isOpen,
  onClose,
  lecture,
  summary,
  onSaveSummary,
}) => {
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !lecture || !summary) return null;

  const handleSave = () => {
    if (onSaveSummary) {
      onSaveSummary({ ...summary, savedAt: new Date().toISOString() });
    }
    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-[#E3E1D9] rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-[#E3E1D9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DCE6DE] text-[#496456] flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#496456] tracking-wider">
                Lecture Completed
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#202924] mt-0.5">
                {lecture.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#69736D] hover:text-[#202924] hover:bg-[#F6F4EE] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* 1. Quick Statistics Pill Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#69736D] tracking-wide block">
                Duration
              </span>
              <p className="text-xl font-bold font-mono text-[#202924]">
                {summary.lectureDuration}
              </p>
              <span className="text-[10px] text-[#496456]">Full session</span>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#69736D] tracking-wide block">
                Attended
              </span>
              <p className="text-xl font-bold font-mono text-[#496456]">
                {summary.studentsAttended} Peers
              </p>
              <span className="text-[10px] text-[#69736D]">Enrolled active</span>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#69736D] tracking-wide block">
                Attendance Rate
              </span>
              <p className="text-xl font-bold font-mono text-[#C9825B]">
                {summary.attendancePercentage}%
              </p>
              <span className="text-[10px] text-[#69736D]">On-time completion</span>
            </div>
          </div>

          {/* 2. AI-Generated Summary */}
          <div className="p-5 rounded-2xl bg-[#DCE6DE]/40 border border-[#496456]/20 space-y-2">
            <div className="flex items-center gap-2 text-[#496456] font-bold text-xs">
              <Sparkles className="w-4 h-4 fill-current" />
              <span>AI Lecture Synthesis &amp; Takeaways</span>
            </div>
            <p className="text-xs text-[#202924] leading-relaxed">
              {summary.aiGeneratedSummary}
            </p>
          </div>

          {/* 3. Topics Covered */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#202924] uppercase tracking-wider block">
              Topics Covered
            </span>
            <div className="flex flex-wrap gap-2">
              {summary.topicsCovered.map((topic, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-[#F6F4EE] border border-[#E3E1D9] text-xs font-medium text-[#202924] flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#496456]" />
                  <span>{topic}</span>
                </span>
              ))}
            </div>
          </div>

          {/* 4. Questions Asked by Students */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#202924] uppercase tracking-wider block">
              Questions &amp; Doubts Answered
            </span>
            <div className="space-y-2">
              {summary.questionsAsked.map((q, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] flex items-start gap-2.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#496456] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#202924] leading-relaxed">
                    “{q}”
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Resources Shared */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#202924] uppercase tracking-wider block">
              Resources Shared with Class
            </span>
            <div className="space-y-1.5">
              {summary.resourcesShared.map((res, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] flex items-center gap-2 text-xs text-[#202924]"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#496456]" />
                  <span>{res}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-[#E3E1D9] flex items-center justify-between">
          <span className="text-xs text-[#69736D]">
            Summary automatically added to your Teaching History.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#69736D] hover:text-[#202924] transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-[#496456] hover:bg-[#3d5347] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Bookmark className="w-4 h-4" />
              <span>{isSaved ? 'Summary Saved!' : 'Save Summary'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
