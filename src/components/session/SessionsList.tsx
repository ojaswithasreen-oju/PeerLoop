import React, { useState, useEffect } from 'react';
import {
  Video,
  Clock,
  Calendar,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { store } from '../../services/storeService';
import { LearningSession } from '../../types';
import { SessionSummaryModal } from './SessionSummaryModal';

interface SessionsListProps {
  onJoinSession: (session: LearningSession) => void;
  onOpenQuickDoubt: () => void;
}

export const SessionsList: React.FC<SessionsListProps> = ({
  onJoinSession,
  onOpenQuickDoubt,
}) => {
  const [sessions, setSessions] = useState<LearningSession[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [viewingSummarySession, setViewingSummarySession] = useState<LearningSession | null>(null);

  useEffect(() => {
    setSessions(store.getSessions());
  }, []);

  const filteredSessions = sessions.filter((s) => {
    if (filter === 'active') return s.status === 'active' || s.status === 'scheduled';
    if (filter === 'completed') return s.status === 'completed';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2933] tracking-tight">
            Sessions
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Track past and active peer sessions, notes, summaries, and practice checkpoints.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-[#F7F8F5] border border-[#E5EAE7] rounded-lg">
          {(['all', 'active', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-colors cursor-pointer ${
                filter === tab
                  ? 'bg-white text-[#1F2933] shadow-xs'
                  : 'text-[#6B7280] hover:text-[#1F2933]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions Grid */}
      {filteredSessions.length === 0 ? (
        <div className="p-12 text-center bg-white border border-[#E5EAE7] rounded-2xl space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#F7F8F5] text-[#3F6B5B] border border-[#E5EAE7] flex items-center justify-center mx-auto">
            <Video className="w-5 h-5 text-[#3F6B5B]" />
          </div>
          <h3 className="text-base font-bold text-[#1F2933]">No sessions found</h3>
          <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
            Ready to learn or teach? Ask a quick doubt or connect with a mentor to start a session.
          </p>
          <button
            onClick={onOpenQuickDoubt}
            className="px-5 py-2.5 rounded-lg bg-[#3F6B5B] hover:bg-[#34594B] text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Ask Quick Doubt
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSessions.map((session) => {
            const isCompleted = session.status === 'completed';
            const isActive = session.status === 'active';

            return (
              <div
                key={session.id}
                className="p-5 rounded-2xl bg-white border border-[#E5EAE7] flex flex-col justify-between hover:border-[#DCE9E2] transition-all shadow-xs space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#DCE9E2] text-[#3F6B5B]">
                      {session.skill}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide ${
                        isActive
                          ? 'bg-[#DCE9E2] text-[#387B62]'
                          : 'bg-[#F7F8F5] text-[#6B7280] border border-[#E5EAE7]'
                      }`}
                    >
                      {session.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#1F2933] leading-snug">{session.topic}</h3>

                  <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                    <div className="flex items-center gap-1.5">
                      <img
                        src={session.mentorAvatar}
                        alt={session.mentorName}
                        className="w-5 h-5 rounded-full object-cover border border-[#E5EAE7]"
                      />
                      <span>{session.mentorName}</span>
                    </div>
                    <span className="text-[#6B7280]/40">•</span>
                    <div className="flex items-center gap-1.5">
                      <img
                        src={session.learnerAvatar}
                        alt={session.learnerName}
                        className="w-5 h-5 rounded-full object-cover border border-[#E5EAE7]"
                      />
                      <span>{session.learnerName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-[#6B7280] font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#3F6B5B]" />
                      {session.durationMinutes} min
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#3F6B5B]" />
                      {session.startedAt ? new Date(session.startedAt).toLocaleDateString() : 'Today'}
                    </span>
                  </div>

                  {/* Summary preview snippet */}
                  {session.summary && (
                    <div className="p-3 rounded-xl bg-[#F0F4F1] border border-[#DCE9E2] text-xs space-y-1">
                      <p className="text-[11px] font-bold text-[#3F6B5B]">
                        Session Summary Available
                      </p>
                      <p className="text-[11px] text-[#6B7280] line-clamp-2">
                        Next: {session.summary.nextStep}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#E5EAE7] flex items-center gap-2">
                  {isActive ? (
                    <button
                      onClick={() => onJoinSession(session)}
                      className="w-full py-2.5 rounded-lg bg-[#3F6B5B] hover:bg-[#34594B] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Video className="w-4 h-4" />
                      <span>Re-enter Live Call</span>
                    </button>
                  ) : (
                    <>
                      {session.summary && (
                        <button
                          onClick={() => setViewingSummarySession(session)}
                          className="flex-1 py-2 rounded-lg bg-[#F7F8F5] hover:bg-[#EEF2EE] border border-[#E5EAE7] text-xs font-semibold text-[#6B7280] hover:text-[#1F2933] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#3F6B5B]" />
                          <span>Summary</span>
                        </button>
                      )}
                      <button
                        onClick={() => onJoinSession(session)}
                        className="flex-1 py-2 rounded-lg bg-[#3F6B5B] hover:bg-[#34594B] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Review Workspace</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Modal */}
      {viewingSummarySession && viewingSummarySession.summary && (
        <SessionSummaryModal
          isOpen={!!viewingSummarySession}
          onClose={() => setViewingSummarySession(null)}
          summary={viewingSummarySession.summary}
          sessionTopic={viewingSummarySession.topic}
          mentorName={viewingSummarySession.mentorName}
        />
      )}
    </div>
  );
};
