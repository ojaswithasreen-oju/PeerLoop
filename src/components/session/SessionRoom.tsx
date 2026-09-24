import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Monitor,
  Circle,
  Square,
  Pause,
  Play,
  Trash2,
  PhoneOff,
  Sparkles,
  MessageSquare,
  FileText,
  Code,
  Send,
  HelpCircle,
  Lightbulb,
  AlertCircle,
  Check,
  X,
  Volume2,
  Shield,
  Layers,
  ArrowRight,
  Maximize2,
} from 'lucide-react';
import { LearningSession, AIInterruptionItem, SessionChatMessage, UserProfile } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/storeService';
import { getSessionCopilotAssistance, generateSessionSummary } from '../../services/geminiService';
import { Modal } from '../common/Modal';
import { FeedbackModal } from './FeedbackModal';
import { SessionSummaryModal } from './SessionSummaryModal';

interface SessionRoomProps {
  session: LearningSession;
  onLeaveSession: () => void;
}

export const SessionRoom: React.FC<SessionRoomProps> = ({ session: initialSession, onLeaveSession }) => {
  const { currentUser } = useAuth();
  const [session, setSession] = useState<LearningSession>(initialSession);

  // Call device state
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeCenterTab, setActiveCenterTab] = useState<'video' | 'code' | 'notes'>('video');

  // Elapsed timer
  const [elapsedSeconds, setElapsedSeconds] = useState(session.recordingSeconds || 420);

  // Recording state
  const [isRecording, setIsRecording] = useState(session.isRecording || false);
  const [isRecordingPaused, setIsRecordingPaused] = useState(false);
  const [showRecordingConsentModal, setShowRecordingConsentModal] = useState(false);

  // Side panel tabs: 'copilot' | 'chat' | 'notes'
  const [sideTab, setSideTab] = useState<'copilot' | 'chat' | 'notes'>('copilot');

  // Copilot interruption filter: 'silent' | 'suggestion' | 'important_clarification' | 'all'
  const [copilotFilter, setCopilotFilter] = useState<'all' | 'suggestion' | 'important_clarification'>('all');
  const [copilotPromptInput, setCopilotPromptInput] = useState('');
  const [copilotLoading, setCopilotLoading] = useState(false);

  // Live Chat
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<SessionChatMessage[]>(session.chatMessages || []);

  // Shared Notes & Scratchpad Code
  const [sharedNotes, setSharedNotes] = useState(session.sharedNotes || '');
  const [scratchpadCode, setScratchpadCode] = useState(
    session.scratchpadCode ||
      `# Collaborative Scratchpad: ${session.topic}
# Type code or test edge cases together in real-time

def explore_solution():
    print("Testing concept with mentor...")
`
  );

  // Post-Session Modals
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [isEndingSession, setIsEndingSession] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const isMentor = currentUser?.id === session.mentorId;

  // Real or simulated video track
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isCameraOn) {
      navigator.mediaDevices
        ?.getUserMedia({ video: true, audio: false })
        .then((s) => {
          stream = s;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          // Camera permission or device fallback
        });
    } else {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOn]);

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Chat message send
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !currentUser) return;

    const newMsg: SessionChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      senderRole: isMentor ? 'mentor' : 'learner',
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    setChatInput('');

    // Trigger AI Copilot reflection after every few exchanges
    if (updated.length % 2 === 0) {
      triggerCopilotAnalysis(updated);
    }
  };

  // Trigger Copilot assistance
  const triggerCopilotAnalysis = async (currentMsgs: SessionChatMessage[]) => {
    setCopilotLoading(true);
    const recentDialogue = currentMsgs
      .slice(-4)
      .map((m) => `${m.senderName} (${m.senderRole}): ${m.text}`)
      .join('\n');

    try {
      const res = await getSessionCopilotAssistance(
        session.topic,
        recentDialogue,
        sharedNotes,
        session.mentorName,
        session.learnerName
      );

      if (res.items && res.items.length > 0) {
        setSession((prev) => ({
          ...prev,
          copilotItems: [...prev.copilotItems, ...res.items],
        }));
      }
    } finally {
      setCopilotLoading(false);
    }
  };

  // Ask Copilot explicitly
  const handleAskCopilot = async (customPrompt?: string) => {
    const promptToUse = customPrompt || copilotPromptInput;
    if (!promptToUse.trim()) return;

    setCopilotLoading(true);
    const newLearnerItem: AIInterruptionItem = {
      id: `ai-ask-${Date.now()}`,
      type: 'clarification',
      level: 'suggestion',
      confidenceText: 'Quick clarification',
      title: `Query: "${promptToUse}"`,
      content: `Analyzing "${promptToUse}" in relation to ${session.topic}... For nested operations, the inner scope executes completely before returning control to the outer iteration frame.`,
      targetAudience: isMentor ? 'mentor' : 'learner',
      status: 'active',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setSession((prev) => ({
      ...prev,
      copilotItems: [newLearnerItem, ...prev.copilotItems],
    }));
    setCopilotPromptInput('');
    setCopilotLoading(false);
  };

  // Copilot item actions
  const handleCopilotItemAction = (itemId: string, action: 'accept' | 'dismiss') => {
    setSession((prev) => ({
      ...prev,
      copilotItems: prev.copilotItems.map((item) =>
        item.id === itemId
          ? { ...item, status: action === 'accept' ? 'accepted' : 'dismissed' }
          : item
      ),
    }));
  };

  // Handle Recording Consent
  const handleStartRecording = () => {
    if (!isRecording) {
      setShowRecordingConsentModal(true);
    } else {
      setIsRecording(false);
    }
  };

  const confirmRecordingConsent = () => {
    setIsRecording(true);
    setShowRecordingConsentModal(false);
  };

  // End Session Flow
  const handleEndSession = async () => {
    setIsEndingSession(true);

    const transcriptText = messages
      .map((m) => `${m.timestamp} - ${m.senderName}: ${m.text}`)
      .join('\n');

    // Call Gemini to synthesize session summary
    const summary = await generateSessionSummary(
      session.topic,
      session.skill,
      transcriptText,
      sharedNotes,
      Math.max(1, Math.round(elapsedSeconds / 60))
    );

    const completedSession: LearningSession = {
      ...session,
      status: 'completed',
      endedAt: new Date().toISOString(),
      durationMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
      sharedNotes,
      scratchpadCode,
      chatMessages: messages,
      summary,
    };

    await store.saveSession(completedSession);
    setSession(completedSession);
    setIsEndingSession(false);

    // If current user is learner, open feedback modal first, else show summary
    if (!isMentor) {
      setShowFeedbackModal(true);
    } else {
      setShowSummaryModal(true);
    }
  };

  const visibleCopilotItems = session.copilotItems.filter((item) => {
    if (item.status === 'dismissed') return false;
    if (copilotFilter === 'all') return true;
    return item.level === copilotFilter;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col overflow-hidden">
      {/* Top Session Header */}
      <div className="h-14 border-b border-slate-800 bg-slate-900/90 px-4 flex items-center justify-between gap-4">
        {/* Topic & Role Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
              {session.topic}
            </h2>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-medium hidden sm:inline">
            {session.skill}
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
              isMentor
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
            }`}
          >
            {isMentor ? 'Teaching' : 'Learning'}
          </span>
        </div>

        {/* Timer & Recording Status */}
        <div className="flex items-center gap-3">
          {/* Recording Badge */}
          {isRecording ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>REC</span>
            </div>
          ) : (
            <span className="text-[11px] text-slate-500 hidden sm:inline">Not Recording</span>
          )}

          {/* Session Timer */}
          <div className="font-mono text-xs font-semibold text-slate-200 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            {formatTimer(elapsedSeconds)}
          </div>

          {/* End Session Button */}
          <button
            onClick={handleEndSession}
            disabled={isEndingSession}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition-all disabled:opacity-50"
          >
            {isEndingSession ? (
              <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <PhoneOff className="w-3.5 h-3.5" />
                <span>End Session</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Workspace (Stage + AI Side Panel) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left / Center Area: Stage */}
        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
          {/* Center Tabs: Video Stage / Code Scratchpad / Shared Notes */}
          <div className="h-10 border-b border-slate-800/80 bg-slate-900/50 px-4 flex items-center gap-2">
            <button
              onClick={() => setActiveCenterTab('video')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                activeCenterTab === 'video'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <VideoIcon className="w-3.5 h-3.5" />
              <span>Video Grid</span>
            </button>
            <button
              onClick={() => setActiveCenterTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                activeCenterTab === 'code'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Scratchpad</span>
            </button>
            <button
              onClick={() => setActiveCenterTab('notes')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                activeCenterTab === 'notes'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Shared Notes</span>
            </button>
          </div>

          {/* Center Content Stage */}
          <div className="flex-1 p-3 sm:p-4 overflow-hidden flex flex-col">
            {activeCenterTab === 'video' && (
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 overflow-hidden">
                {/* Remote Participant Box */}
                <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col items-center justify-center shadow-xl">
                  {/* Avatar / Speaking simulation */}
                  <div className="relative flex flex-col items-center">
                    <div className="relative">
                      <img
                        src={isMentor ? session.learnerAvatar : session.mentorAvatar}
                        alt="Peer participant"
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-indigo-500/60 shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                        <Volume2 className="w-3.5 h-3.5 text-white animate-pulse" />
                      </div>
                    </div>
                    <p className="text-sm font-bold text-white mt-3">
                      {isMentor ? session.learnerName : session.mentorName}
                    </p>
                    <p className="text-xs text-slate-400">
                      {isMentor ? session.learnerCollege : session.mentorCollege}
                    </p>
                  </div>

                  {/* Audio Visualizer Pill */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-950/70 backdrop-blur-md text-[11px] text-slate-300">
                    <span className="w-1.5 h-3 bg-emerald-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-4 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1.5 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                    <span>Speaking</span>
                  </div>

                  <div className="absolute bottom-3 left-3 text-[11px] text-slate-400 bg-slate-950/70 px-2 py-0.5 rounded">
                    {isMentor ? 'Learner' : 'Mentor'}
                  </div>
                </div>

                {/* Local Participant Box */}
                <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col items-center justify-center shadow-xl">
                  {isCameraOn ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform -scale-x-100"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <img
                        src={currentUser?.avatarUrl}
                        alt="You"
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-slate-700 shadow-lg"
                      />
                      <p className="text-sm font-bold text-white mt-3">You ({currentUser?.fullName})</p>
                      <span className="text-xs text-slate-500 mt-1">Camera Off</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 text-[11px] text-slate-300 bg-slate-950/70 px-2 py-0.5 rounded backdrop-blur-md">
                    You {!isMicOn && '• Mic Muted'}
                  </div>
                </div>
              </div>
            )}

            {activeCenterTab === 'code' && (
              <div className="flex-1 flex flex-col bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                <div className="p-2.5 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>solution.py</span>
                  <span className="text-[11px] text-emerald-400">● Live Connected</span>
                </div>
                <textarea
                  value={scratchpadCode}
                  onChange={(e) => setScratchpadCode(e.target.value)}
                  className="flex-1 w-full bg-slate-950 p-4 font-mono text-xs sm:text-sm text-cyan-300 focus:outline-none resize-none leading-relaxed"
                  spellCheck={false}
                />
              </div>
            )}

            {activeCenterTab === 'notes' && (
              <div className="flex-1 flex flex-col bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                <div className="p-2.5 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Collaborative Markdown Notes</span>
                  <span className="text-[11px] text-indigo-400">Auto-saved to session summary</span>
                </div>
                <textarea
                  value={sharedNotes}
                  onChange={(e) => setSharedNotes(e.target.value)}
                  placeholder="Record insights, syntax snippets, and analogies here..."
                  className="flex-1 w-full bg-slate-950 p-4 text-xs sm:text-sm text-slate-200 focus:outline-none resize-none leading-relaxed"
                />
              </div>
            )}
          </div>

          {/* Call Control Bar */}
          <div className="h-16 border-t border-slate-800 bg-slate-900/90 px-4 flex items-center justify-center gap-3">
            {/* Mic Toggle */}
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                isMicOn
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
              title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            {/* Camera Toggle */}
            <button
              onClick={() => setIsCameraOn(!isCameraOn)}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                isCameraOn
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
              title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {isCameraOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            {/* Screen Share */}
            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                isScreenSharing
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Screen Share"
            >
              <Monitor className="w-5 h-5" />
            </button>

            {/* Chat Toggle */}
            <button
              onClick={() => setSideTab('chat')}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                sideTab === 'chat'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Chat"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            {/* Notes Toggle */}
            <button
              onClick={() => setSideTab('notes')}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                sideTab === 'notes'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Notes"
            >
              <FileText className="w-5 h-5" />
            </button>

            {/* Recording Controls */}
            <button
              onClick={handleStartRecording}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isRecording
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Toggle Session Recording (requires consent)"
            >
              <Circle className={`w-3.5 h-3.5 ${isRecording ? 'fill-white text-white' : 'text-rose-400'}`} />
              <span className="hidden sm:inline">{isRecording ? 'Stop REC' : 'Record'}</span>
            </button>

            {/* Leave Session */}
            <button
              onClick={handleEndSession}
              disabled={isEndingSession}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50"
              title="Leave Session"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Leave</span>
            </button>
          </div>
        </div>

        {/* Right Area: AI Learning Copilot & Live Chat Panel */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900/95 flex flex-col h-80 lg:h-full">
          {/* Panel Header Tabs */}
          <div className="h-12 border-b border-slate-800 px-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSideTab('copilot')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  sideTab === 'copilot'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Copilot</span>
                {session.copilotItems.length > 0 && (
                  <span className="text-[10px] bg-indigo-900/60 px-1 rounded">
                    {session.copilotItems.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setSideTab('chat')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  sideTab === 'chat'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>

              <button
                onClick={() => setSideTab('notes')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  sideTab === 'notes'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Notes</span>
              </button>
            </div>

            <span className="text-[10px] text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-mono">
              Live
            </span>
          </div>

          {/* TAB 1: AI LEARNING COPILOT */}
          {sideTab === 'copilot' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Subtle Assistant Box: "Want a simpler explanation?" */}
              <div className="p-3 border-b border-slate-800 bg-slate-950/60 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Want a simpler explanation?</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => handleAskCopilot('Explain this concept differently using a simple real-world analogy')}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-300 transition-colors cursor-pointer"
                  >
                    Explain differently
                  </button>
                  <button
                    onClick={() => handleAskCopilot('Give a practical code example with clear step-by-step comments')}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-cyan-300 transition-colors cursor-pointer"
                  >
                    Give example
                  </button>
                  <button
                    onClick={() => handleAskCopilot('Give a quick practice question to test my understanding right now')}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-emerald-400 transition-colors cursor-pointer"
                  >
                    Practice
                  </button>
                </div>
              </div>
              {/* Filter / Interruption level control */}
              <div className="p-2 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">Interruption Control:</span>
                <div className="flex gap-1">
                  {(['all', 'suggestion', 'important_clarification'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setCopilotFilter(filter)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                        copilotFilter === filter
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {filter === 'all'
                        ? 'All'
                        : filter === 'suggestion'
                        ? 'Suggestions'
                        : 'Clarifications'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Copilot Feed List */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                {visibleCopilotItems.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500 space-y-2">
                    <Sparkles className="w-8 h-8 text-indigo-400/40 mx-auto" />
                    <p>Copilot is listening silently.</p>
                    <p className="text-[11px] text-slate-600 max-w-xs mx-auto">
                      Observations, factual checks, and practice questions will appear here without interrupting.
                    </p>
                  </div>
                ) : (
                  visibleCopilotItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border transition-all ${
                        item.level === 'important_clarification'
                          ? 'bg-amber-950/30 border-amber-500/30'
                          : 'bg-slate-950/70 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider ${
                              item.confidenceText === 'Potential correction'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : item.confidenceText === 'Quick clarification'
                                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {item.confidenceText}
                          </span>
                          <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                        </div>

                        <span className="text-[10px] text-slate-400">
                          For: {item.targetAudience}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white mt-1.5">{item.title}</h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.content}</p>

                      {/* Mentor Interactive Actions */}
                      {isMentor && (
                        <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-800/80">
                          <button
                            onClick={() => handleCopilotItemAction(item.id, 'accept')}
                            className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30 transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleCopilotItemAction(item.id, 'dismiss')}
                            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 text-[11px] transition-colors"
                          >
                            <X className="w-3 h-3" />
                            <span>Dismiss</span>
                          </button>
                          <button
                            onClick={() => {
                              handleAskCopilot(`Explain differently: ${item.title}`);
                            }}
                            className="text-[11px] text-indigo-400 hover:underline ml-auto"
                          >
                            Explain differently
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Ask Copilot Form */}
              <div className="p-3 border-t border-slate-800 bg-slate-950/70 space-y-2">
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={copilotPromptInput}
                    onChange={(e) => setCopilotPromptInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAskCopilot()}
                    placeholder="Ask Copilot (e.g. give an analogy, check syntax)..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() => handleAskCopilot()}
                    disabled={copilotLoading || !copilotPromptInput.trim()}
                    className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-colors"
                    title="Send to Copilot"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quick Prompts */}
                <div className="flex flex-wrap gap-1">
                  {[
                    'Explain with an analogy',
                    'Generate 2 practice questions',
                    'Check for potential inaccuracies',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAskCopilot(preset)}
                      className="text-[10px] text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 px-2 py-0.5 rounded border border-slate-800 transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE CHAT */}
          {sideTab === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                {messages.map((m) => {
                  const isMe = m.senderId === currentUser?.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-0.5">
                        <span className="font-semibold text-slate-400">{m.senderName}</span>
                        <span>•</span>
                        <span>{m.timestamp}</span>
                      </div>
                      <div
                        className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-br-xs'
                            : 'bg-slate-800 text-slate-200 rounded-bl-xs'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950/70">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type message or paste code..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Recording Consent Modal */}
      <Modal
        isOpen={showRecordingConsentModal}
        onClose={() => setShowRecordingConsentModal(false)}
        title="Record This Learning Session?"
        subtitle="Participant privacy & mutual consent required"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold">
              <Shield className="w-4 h-4" />
              <span>Transparent Recording Policy</span>
            </div>
            <p>
              Recording will generate an AI transcript and personalized study summary after the session.
              Both participants can pause or delete the recording at any time.
            </p>
            <p className="text-[11px] text-slate-400">
              A visible 🔴 REC indicator will remain on screen while recording is active.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowRecordingConsentModal(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmRecordingConsent}
              className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 flex items-center gap-2"
            >
              <Circle className="w-3 h-3 fill-white text-white" />
              <span>Consent & Start Recording</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Post-Session Feedback Modal (For Learner) */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => {
          setShowFeedbackModal(false);
          setShowSummaryModal(true);
        }}
        session={session}
        onFeedbackSubmitted={(updatedRep) => {
          // Handled in store
        }}
      />

      {/* Post-Session Summary Modal */}
      <SessionSummaryModal
        isOpen={showSummaryModal}
        onClose={() => {
          setShowSummaryModal(false);
          onLeaveSession();
        }}
        summary={session.summary || null}
        sessionTopic={session.topic}
        mentorName={session.mentorName}
      />
    </div>
  );
};
