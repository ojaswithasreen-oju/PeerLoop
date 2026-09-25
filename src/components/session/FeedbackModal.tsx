import React, { useState } from 'react';
import { Star, CheckCircle2, ThumbsUp } from 'lucide-react';
import { Modal } from '../common/Modal';
import { LearningSession, SessionFeedback, UserProfile } from '../../types';
import { store } from '../../services/storeService';
import { calculateReputation } from '../../services/reputationService';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: LearningSession;
  onFeedbackSubmitted: (updatedRep: UserProfile['reputation']) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  session,
  onFeedbackSubmitted,
}) => {
  const [helpfulness, setHelpfulness] = useState(5);
  const [clarity, setClarity] = useState(5);
  const [knowledge, setKnowledge] = useState(5);
  const [accuracy, setAccuracy] = useState(5);
  const [communication, setCommunication] = useState(5);

  const [qExplainedClearly, setQExplainedClearly] = useState(true);
  const [qUnderstoodBetter, setQUnderstoodBetter] = useState(true);
  const [qNoticedConfusion, setQNoticedConfusion] = useState(false);
  const [qLearnAgain, setQLearnAgain] = useState(true);

  const [writtenFeedback, setWrittenFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleStarClick = (setter: React.Dispatch<React.SetStateAction<number>>, val: number) => {
    setter(val);
  };

  const renderStarPicker = (val: number, setter: React.Dispatch<React.SetStateAction<number>>) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleStarClick(setter, star)}
          className="p-1 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
        >
          <Star
            className={`w-4 h-4 ${
              star <= val ? 'text-[#D99B26] fill-current' : 'text-[#E5EAE7]'
            }`}
          />
        </button>
      ))}
      <span className="text-xs font-semibold text-[#1F2933] ml-1.5">{val}/5</span>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const feedbackItem: SessionFeedback = {
      id: `fb-${Date.now()}`,
      sessionId: session.id,
      learnerId: session.learnerId,
      mentorId: session.mentorId,
      ratings: {
        overallHelpfulness: helpfulness,
        explanationClarity: clarity,
        knowledge,
        accuracy,
        communication,
      },
      qExplainedClearly,
      qUnderstoodBetter,
      qNoticedConfusion,
      qLearnAgain,
      writtenFeedback: writtenFeedback.trim() || 'Great session! Explained the concept very clearly with practical examples.',
      createdAt: new Date().toISOString(),
    };

    await store.submitFeedback(feedbackItem);

    const mentorProfile = await store.getProfile(session.mentorId);
    if (mentorProfile) {
      const updatedRep = calculateReputation(mentorProfile.reputation, feedbackItem);
      const updatedMentor: UserProfile = {
        ...mentorProfile,
        reputation: updatedRep,
      };
      await store.saveProfile(updatedMentor);
      onFeedbackSubmitted(updatedRep);
    }

    setSubmitting(false);
    setCompleted(true);
    setTimeout(() => {
      setCompleted(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Session Feedback"
      subtitle={`Evaluate your session on "${session.topic}" with ${session.mentorName}`}
      maxWidth="lg"
    >
      {completed ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#DCE9E2] text-[#387B62] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-[#1F2933]">Thank You for Your Feedback!</h4>
          <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
            Your evaluation directly updates {session.mentorName}&apos;s verified peer reputation.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating Criteria Grid */}
          <div className="p-4 rounded-xl bg-[#F7F8F5] border border-[#E5EAE7] space-y-3">
            <h4 className="text-xs font-bold text-[#1F2933] uppercase tracking-wide">
              Evaluation
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#1F2933] font-medium">Overall Helpfulness</span>
                {renderStarPicker(helpfulness, setHelpfulness)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#1F2933] font-medium">Explanation Clarity</span>
                {renderStarPicker(clarity, setClarity)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#1F2933] font-medium">Subject Knowledge</span>
                {renderStarPicker(knowledge, setKnowledge)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#1F2933] font-medium">Technical Accuracy</span>
                {renderStarPicker(accuracy, setAccuracy)}
              </div>
              <div className="flex items-center justify-between sm:col-span-2">
                <span className="text-[#1F2933] font-medium">Communication &amp; Patience</span>
                {renderStarPicker(communication, setCommunication)}
              </div>
            </div>
          </div>

          {/* Qualitative Questions */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F7F8F5] border border-[#E5EAE7]">
              <span className="text-[#1F2933]">Did the mentor explain the topic clearly?</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setQExplainedClearly(true)}
                  className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                    qExplainedClearly ? 'bg-[#3F6B5B] text-white' : 'text-[#6B7280] bg-white border border-[#E5EAE7]'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setQExplainedClearly(false)}
                  className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                    !qExplainedClearly ? 'bg-[#3F6B5B] text-white' : 'text-[#6B7280] bg-white border border-[#E5EAE7]'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F7F8F5] border border-[#E5EAE7]">
              <span className="text-[#1F2933]">Would you learn from this mentor again?</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setQLearnAgain(true)}
                  className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                    qLearnAgain ? 'bg-[#3F6B5B] text-white' : 'text-[#6B7280] bg-white border border-[#E5EAE7]'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setQLearnAgain(false)}
                  className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                    !qLearnAgain ? 'bg-[#3F6B5B] text-white' : 'text-[#6B7280] bg-white border border-[#E5EAE7]'
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>

          {/* Written Feedback */}
          <div>
            <label className="block text-xs font-semibold text-[#1F2933] mb-1">
              Comments &amp; Key Takeaways
            </label>
            <textarea
              rows={2}
              value={writtenFeedback}
              onChange={(e) => setWrittenFeedback(e.target.value)}
              placeholder="What specifically helped you most during this session?"
              className="w-full bg-[#F7F8F5] border border-[#E5EAE7] rounded-lg px-3 py-2 text-xs text-[#1F2933] placeholder-[#6B7280] focus:outline-none focus:border-[#3F6B5B]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5EAE7]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-[#6B7280] hover:text-[#1F2933]"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-lg bg-[#3F6B5B] hover:bg-[#34594B] text-white text-xs font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors"
            >
              {submitting ? (
                <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Submit Feedback</span>
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
