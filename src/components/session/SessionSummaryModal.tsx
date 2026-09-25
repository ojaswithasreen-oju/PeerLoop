import React, { useState } from 'react';
import {
  Clock,
  Download,
  CheckCircle2,
  Lightbulb,
  HelpCircle,
  Link as LinkIcon,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { SessionSummary } from '../../types';

interface SessionSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: SessionSummary | null;
  sessionTopic: string;
  mentorName: string;
}

export const SessionSummaryModal: React.FC<SessionSummaryModalProps> = ({
  isOpen,
  onClose,
  summary,
  sessionTopic,
  mentorName,
}) => {
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!summary) return null;

  const toggleHint = (idx: number) => {
    setRevealedHints((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleExport = () => {
    const markdown = `# Session Summary: ${sessionTopic}
Mentor: ${mentorName}

## What You Learned
${summary.learnedTopics.map((t) => `- ${t}`).join('\n')}

## Concepts Covered
${summary.conceptsCovered.map((c) => `- ${c}`).join('\n')}

## Areas of Difficulty
${summary.difficultTopics.map((d) => `- ${d}`).join('\n')}

## Key Explanations
${summary.keyExplanations.map((e) => `### ${e.concept}\n${e.explanation}`).join('\n\n')}

## Practice Questions
${summary.practiceQuestions.map((q, i) => `${i + 1}. ${q.question}\n   *Hint: ${q.hint}*`).join('\n\n')}

## Next Step
${summary.nextStep}
`;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PeerLoop-Summary-${sessionTopic.replace(/\s+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Session Summary"
      subtitle={`Synthesized for "${sessionTopic}" with ${mentorName}`}
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Next Step Banner */}
        <div className="p-4 rounded-xl bg-[#F0F4F1] border border-[#DCE9E2]">
          <span className="text-xs font-semibold text-[#3F6B5B] uppercase tracking-wide">
            Recommended Next Step
          </span>
          <p className="text-sm font-semibold text-[#1F2933] mt-1">{summary.nextStep}</p>
        </div>

        {/* Timestamps */}
        {summary.timestamps && summary.timestamps.length > 0 && (
          <div className="p-3.5 rounded-xl bg-[#F7F8F5] border border-[#E5EAE7]">
            <h4 className="text-xs font-bold text-[#1F2933] uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#3F6B5B]" />
              <span>Milestones &amp; Timestamps</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {summary.timestamps.map((ts, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white border border-[#E5EAE7] text-xs text-[#1F2933]"
                >
                  <span className="font-mono text-[#3F6B5B] font-semibold">{ts.time}</span>
                  <span>{ts.topic}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2-Column Grid: What You Learned & Difficulties */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Mastered */}
          <div className="p-4 rounded-xl bg-[#F7F8F5] border border-[#E5EAE7] space-y-2">
            <h4 className="text-xs font-bold text-[#387B62] uppercase tracking-wide flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#387B62]" />
              <span>What You Mastered</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-[#1F2933]">
              {summary.learnedTopics.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#387B62] font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas of Difficulty */}
          <div className="p-4 rounded-xl bg-[#F7F8F5] border border-[#E5EAE7] space-y-2">
            <h4 className="text-xs font-bold text-[#B47818] uppercase tracking-wide flex items-center gap-1.5">
              <span>Areas for Reinforcement</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-[#1F2933]">
              {summary.difficultTopics.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#B47818] font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Key Explanations */}
        {summary.keyExplanations && summary.keyExplanations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#1F2933] uppercase tracking-wide flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-[#3F6B5B]" />
              <span>Key Explanations &amp; Mental Models</span>
            </h4>
            <div className="space-y-2">
              {summary.keyExplanations.map((exp, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#F7F8F5] border border-[#E5EAE7]">
                  <p className="text-xs font-bold text-[#3F6B5B]">{exp.concept}</p>
                  <p className="text-xs text-[#1F2933] mt-1 leading-relaxed">{exp.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Practice Questions */}
        {summary.practiceQuestions && summary.practiceQuestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#1F2933] uppercase tracking-wide flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#3F6B5B]" />
              <span>Practice Questions to Test Retention</span>
            </h4>
            <div className="space-y-2">
              {summary.practiceQuestions.map((pq, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#F7F8F5] border border-[#E5EAE7] space-y-1">
                  <p className="text-xs font-medium text-[#1F2933]">{pq.question}</p>
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => toggleHint(idx)}
                      className="text-[11px] text-[#3F6B5B] hover:underline cursor-pointer"
                    >
                      {revealedHints[idx] ? 'Hide Hint' : 'Show Hint'}
                    </button>
                    {revealedHints[idx] && (
                      <span className="text-[11px] text-[#6B7280] italic bg-white px-2 py-0.5 rounded border border-[#E5EAE7]">
                        Hint: {pq.hint}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Resources */}
        {summary.recommendedResources && summary.recommendedResources.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#1F2933] uppercase tracking-wide flex items-center gap-1.5">
              <LinkIcon className="w-4 h-4 text-[#3F6B5B]" />
              <span>Recommended Study Materials</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {summary.recommendedResources.map((res, idx) => (
                <a
                  key={idx}
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-lg bg-[#F7F8F5] hover:bg-[#EEF2EE] border border-[#E5EAE7] transition-all block group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1F2933] group-hover:text-[#3F6B5B]">
                      {res.title}
                    </span>
                    <span className="text-[10px] text-[#6B7280] bg-white px-1.5 py-0.5 rounded border border-[#E5EAE7]">
                      {res.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B7280] mt-1 line-clamp-2">{res.reason}</p>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E5EAE7]">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F7F8F5] hover:bg-[#EEF2EE] border border-[#E5EAE7] text-xs font-semibold text-[#1F2933] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>{savedSuccess ? 'Downloaded!' : 'Export Markdown'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#3F6B5B] hover:bg-[#34594B] text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};
