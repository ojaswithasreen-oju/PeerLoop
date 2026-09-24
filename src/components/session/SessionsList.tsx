import React, { useState, useEffect } from 'react';
import {
  Video,
  Clock,
  Sparkles,
  Calendar,
  CheckCircle2,
  FileText,
  Star,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
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
  const { currentUser } = useAuth();
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
            Learning Sessions
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Track past and active peer sessions, AI summaries, notes, and practice checkpoints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'active', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                filter === tab
                  ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/20'
                  : 'text-[#94A3B8] bg-[#151E33] hover:text-[#F8FAFC] border border-[#1E2A47]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions Grid */}
      {filteredSessions.length === 0 ? (
        <div className="p-12 text-center bg-[#151E33] border border-[#1E2A47] rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#11182B] text-[#94A3B8] border border-[#1E2A47] flex items-center justify-center mx-auto">
            <Video className="w-6 h-6 text-[#8B5CF6]" />
          </div>
          <h3 className="text-base font-bold text-[#F8FAFC]">No sessions found</h3>
          <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
            Ready to learn or teach? Ask a quick doubt or connect with a recommended mentor to start a session.
          </p>
          <button
            onClick={onOpenQuickDoubt}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white text-xs font-bold shadow-md cursor-pointer"
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
                className="p-5 rounded-2xl bg-[#151E33] border border-[#1E2A47] flex flex-col justify-between hover:border-[#8B5CF6]/50 transition-all shadow-md space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#11182B] text-[#C4B5FD] border border-[#1E2A47]">
                      {session.skill}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        isActive
                          ? 'bg-emerald-500/20 text-[#34D399] border border-emerald-500/30 animate-pulse'
                          : 'bg-[#11182B] text-[#94A3B8] border border-[#1E2A47]'
                      }`}
                    >
                      {session.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#F8FAFC] leading-snug">{session.topic}</h3>

                  <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
                    <div className="flex items-center gap-1.5">
                      <img
                        src={session.mentorAvatar}
                        alt={session.mentorName}
                        className="w-5 h-5 rounded-full object-cover border border-[#1E2A47]"
                      />
                      <span>{session.mentorName}</span>
                    </div>
                    <span className="text-[#94A3B8]/40">•</span>
                    <div className="flex items-center gap-1.5">
                      <img
                        src={session.learnerAvatar}
                        alt={session.learnerName}
                        className="w-5 h-5 rounded-full object-cover border border-[#1E2A47]"
                      />
                      <span>{session.learnerName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-[#94A3B8] font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#22D3EE]" />
                      {session.durationMinutes} min
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#8B5CF6]" />
                      {session.startedAt ? new Date(session.startedAt).toLocaleDateString() : 'Today'}
                    </span>
                  </div>

                  {/* Summary preview snippet */}
                  {session.summary && (
                    <div className="p-3 rounded-xl bg-[#0B1020] border border-[#8B5CF6]/30 text-xs space-y-1">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-[#22D3EE]">
                        <Sparkles className="w-3 h-3" />
                        <span>AI Summary Available</span>
                      </div>
                      <p className="text-[11px] text-[#94A3B8] line-clamp-2">
                        Next: {session.summary.nextStep}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#1E2A47] flex items-center gap-2">
                  {isActive ? (
                    <button
                      onClick={() => onJoinSession(session)}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                    >
                      <Video className="w-4 h-4" />
                      <span>Re-enter Live Call</span>
                    </button>
                  ) : (
                    <>
                      {session.summary && (
                        <button
                          onClick={() => setViewingSummarySession(session)}
                          className="flex-1 py-2 rounded-xl bg-[#11182B] hover:bg-[#1A2540] border border-[#1E2A47] text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#22D3EE]" />
                          <span>View Summary</span>
                        </button>
                      )}
                      <button
                        onClick={() => onJoinSession(session)}
                        className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
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
