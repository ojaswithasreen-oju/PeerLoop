import React, { useState } from 'react';
import { Star, CheckCircle2, ShieldCheck, ThumbsUp, MessageSquare } from 'lucide-react';
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
          className="p-1 focus:outline-none transition-transform hover:scale-110"
        >
          <Star
            className={`w-5 h-5 ${
              star <= val ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
            }`}
          />
        </button>
      ))}
      <span className="text-xs font-semibold text-slate-300 ml-1.5">{val}/5</span>
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

    // Save feedback to store
    await store.submitFeedback(feedbackItem);

    // Retrieve mentor profile and calculate updated reputation (Quality > Quantity)
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
    }, 1500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Session Feedback & Mentor Rating"
      subtitle={`Evaluate your session on "${session.topic}" with ${session.mentorName}`}
      maxWidth="lg"
    >
      {completed ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-white">Thank You for Your Feedback!</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Your evaluation directly updates {session.mentorName}&apos;s verified peer reputation and badge milestones.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating Criteria Grid */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Core Evaluation (1 to 5 Stars)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Overall Helpfulness</span>
                {renderStarPicker(helpfulness, setHelpfulness)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Explanation Clarity</span>
                {renderStarPicker(clarity, setClarity)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Subject Knowledge</span>
                {renderStarPicker(knowledge, setKnowledge)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Technical Accuracy</span>
                {renderStarPicker(accuracy, setAccuracy)}
              </div>
              <div className="flex items-center justify-between sm:col-span-2">
                <span className="text-slate-300 font-medium">Communication & Patience</span>
                {renderStarPicker(communication, setCommunication)}
              </div>
            </div>
          </div>

          {/* Qualitative Questions */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Qualitative Check
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Did the mentor explain the topic clearly?</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setQExplainedClearly(true)}
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      qExplainedClearly ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-900'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setQExplainedClearly(false)}
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      !qExplainedClearly ? 'bg-rose-600 text-white' : 'text-slate-400 bg-slate-900'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Did you understand the topic better?</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setQUnderstoodBetter(true)}
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      qUnderstoodBetter ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-900'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setQUnderstoodBetter(false)}
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      !qUnderstoodBetter ? 'bg-rose-600 text-white' : 'text-slate-400 bg-slate-900'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Did you notice anything incorrect or confusing?</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setQNoticedConfusion(true)}
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      qNoticedConfusion ? 'bg-rose-600 text-white' : 'text-slate-400 bg-slate-900'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setQNoticedConfusion(false)}
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      !qNoticedConfusion ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-900'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Would you learn from this mentor again?</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setQLearnAgain(true)}
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      qLearnAgain ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-900'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setQLearnAgain(false)}
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      !qLearnAgain ? 'bg-rose-600 text-white' : 'text-slate-400 bg-slate-900'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Written Feedback */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Written Comments & Key Takeaways
            </label>
            <textarea
              rows={2}
              value={writtenFeedback}
              onChange={(e) => setWrittenFeedback(e.target.value)}
              placeholder="What specifically helped you most during this session?"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/25 disabled:opacity-50 transition-all"
            >
              {submitting ? (
                <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Submit Verified Feedback</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
