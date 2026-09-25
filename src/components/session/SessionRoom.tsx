import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Monitor,
  Circle,
  PhoneOff,
  Sparkles,
  MessageSquare,
  FileText,
  Code,
  Send,
  Volume2,
  Shield,
  BookOpen,
  Check,
  X,
} from 'lucide-react';
import { LearningSession, AIInterruptionItem, SessionChatMessage } from '../../types';
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
  const [activeCenterTab, setActiveCenterTab] = useState<'video' | 'notes' | 'resources'>('video');

  // Elapsed timer
  const [elapsedSeconds, setElapsedSeconds] = useState(session.recordingSeconds || 420);

  // Recording state
  const [isRecording, setIsRecording] = useState(session.isRecording || false);
  const [showRecordingConsentModal, setShowRecordingConsentModal] = useState(false);

  // Side panel tabs: 'copilot' | 'chat' | 'notes' | 'resources'
  const [sideTab, setSideTab] = useState<'copilot' | 'chat' | 'notes' | 'resources'>('copilot');

  // Copilot prompt input & state
  const [copilotPromptInput, setCopilotPromptInput] = useState('');
  const [copilotLoading, setCopilotLoading] = useState(false);

  // Live Chat
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<SessionChatMessage[]>(session.chatMessages || []);

  // Shared Notes & Scratchpad Code
  const [sharedNotes, setSharedNotes] = useState(session.sharedNotes || '');
  const [scratchpadCode, setScratchpadCode] = useState(
    session.scratchpadCode ||
      `# Collaborative Workspace: ${session.topic}
# Type code or test examples together in real-time

def explore_nested_loops():
    matrix = [[1, 2, 3], [4, 5, 6]]
    for row in matrix:
        for val in row:
            print(val, end=" ")
        print()

explore_nested_loops()
`
  );

  // Post-Session Modals
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [isEndingSession, setIsEndingSession] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const isMentor = currentUser?.id === session.mentorId;

  // Video stream initialization
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
          // Camera device fallback
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

    if (updated.length % 2 === 0) {
      triggerCopilotAnalysis(updated);
    }
  };

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

  const handleAskCopilot = async (customPrompt?: string) => {
    const promptToUse = customPrompt || copilotPromptInput;
    if (!promptToUse.trim()) return;

    setCopilotLoading(true);
    const newCopilotItem: AIInterruptionItem = {
      id: `ai-ask-${Date.now()}`,
      type: 'clarification',
      level: 'suggestion',
      confidenceText: 'Quick clarification',
      title: `${promptToUse}`,
      content:
        promptToUse.toLowerCase().includes('analogy')
          ? 'Think of nested loops like a digital clock: the minute hand (outer loop) ticks once only after the second hand (inner loop) has completed all 60 steps.'
          : promptToUse.toLowerCase().includes('practice')
          ? 'Question: Given a 3x3 grid, how many times will a nested loop print an element? (Answer: 9 times, because outer runs 3 times and inner runs 3 times for each).'
          : 'Nested loops execute from top to bottom. For each outer iteration, the entire inner block runs until its condition is fulfilled before advancing.',
      targetAudience: isMentor ? 'mentor' : 'learner',
      status: 'active',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setSession((prev) => ({
      ...prev,
      copilotItems: [newCopilotItem, ...prev.copilotItems],
    }));
    setCopilotPromptInput('');
    setCopilotLoading(false);
  };

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

  const handleEndSession = async () => {
    setIsEndingSession(true);

    const transcriptText = messages
      .map((m) => `${m.timestamp} - ${m.senderName}: ${m.text}`)
      .join('\n');

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

    if (!isMentor) {
      setShowFeedbackModal(true);
    } else {
      setShowSummaryModal(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F8F5] flex flex-col overflow-hidden text-[#1F2933]">
      {/* ---------------------------------------------------- */}
      {/* 1. TOP BAR */}
      {/* ---------------------------------------------------- */}
      <div className="h-16 border-b border-[#E5EAE7] bg-white px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Topic Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#387B62] shrink-0" />
          <h2 className="text-sm sm:text-base font-bold text-[#1F2933] truncate">
            {session.topic || 'Python — Nested Loops'}
          </h2>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-[#DCE9E2] text-[#3F6B5B] hidden sm:inline">
            {session.skill || 'Python'}
          </span>
        </div>

        {/* Status, Timer, Leave */}
        <div className="flex items-center gap-3">
          {/* Recording status badge */}
          {isRecording ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
              <span>REC</span>
            </div>
          ) : (
            <span className="text-xs text-[#6B7280] hidden sm:inline">Not Recording</span>
          )}

          {/* Session Timer */}
          <div className="font-mono text-xs font-semibold text-[#1F2933] bg-[#F7F8F5] px-2.5 py-1 rounded-md border border-[#E5EAE7]">
            {formatTimer(elapsedSeconds)}
          </div>

          {/* Leave Session */}
          <button
            onClick={handleEndSession}
            disabled={isEndingSession}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            {isEndingSession ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <PhoneOff className="w-3.5 h-3.5" />
                <span>Leave</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. WORKSPACE AREA */}
      {/* ---------------------------------------------------- */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Main Stage */}
        <div className="flex-1 flex flex-col bg-[#F7F8F5] overflow-hidden">
          {/* Stage Switcher Tabs */}
          <div className="h-10 border-b border-[#E5EAE7] bg-white px-4 flex items-center gap-2">
            <button
              onClick={() => setActiveCenterTab('video')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeCenterTab === 'video'
                  ? 'bg-[#DCE9E2] text-[#3F6B5B]'
                  : 'text-[#6B7280] hover:text-[#1F2933]'
              }`}
            >
              <VideoIcon className="w-3.5 h-3.5" />
              <span>Video</span>
            </button>
            <button
              onClick={() => setActiveCenterTab('notes')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeCenterTab === 'notes'
                  ? 'bg-[#DCE9E2] text-[#3F6B5B]'
                  : 'text-[#6B7280] hover:text-[#1F2933]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Notes</span>
            </button>
            <button
              onClick={() => setActiveCenterTab('resources')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeCenterTab === 'resources'
                  ? 'bg-[#DCE9E2] text-[#3F6B5B]'
                  : 'text-[#6B7280] hover:text-[#1F2933]'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Resources &amp; Code</span>
            </button>
          </div>

          {/* Stage Body */}
          <div className="flex-1 p-4 overflow-hidden flex flex-col">
            {activeCenterTab === 'video' && (
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-hidden">
                {/* Peer / Mentor Video Card */}
                <div className="relative rounded-2xl bg-white border border-[#E5EAE7] overflow-hidden flex flex-col items-center justify-center p-6 shadow-xs">
                  <div className="relative flex flex-col items-center">
                    <img
                      src={isMentor ? session.learnerAvatar : session.mentorAvatar}
                      alt="Peer"
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-[#DCE9E2]"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#387B62] border-2 border-white flex items-center justify-center">
                      <Volume2 className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  <p className="text-sm font-bold text-[#1F2933] mt-3">
                    {isMentor ? session.learnerName : session.mentorName}
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    {isMentor ? session.learnerCollege : session.mentorCollege}
                  </p>
                  <div className="absolute bottom-3 left-3 text-[11px] text-[#6B7280] bg-[#F7F8F5] border border-[#E5EAE7] px-2 py-0.5 rounded">
                    {isMentor ? 'Learner' : 'Mentor'}
                  </div>
                </div>

                {/* You Video Card */}
                <div className="relative rounded-2xl bg-white border border-[#E5EAE7] overflow-hidden flex flex-col items-center justify-center p-6 shadow-xs">
                  {isCameraOn ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform -scale-x-100 rounded-xl"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <img
                        src={currentUser?.avatarUrl}
                        alt="You"
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-[#E5EAE7]"
                      />
                      <p className="text-sm font-bold text-[#1F2933] mt-3">You ({currentUser?.fullName})</p>
                      <span className="text-xs text-[#6B7280] mt-0.5">Camera Off</span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 text-[11px] text-[#6B7280] bg-[#F7F8F5] border border-[#E5EAE7] px-2 py-0.5 rounded">
                    You {!isMicOn && '• Mic Muted'}
                  </div>
                </div>
              </div>
            )}

            {activeCenterTab === 'notes' && (
              <div className="flex-1 flex flex-col bg-white rounded-2xl border border-[#E5EAE7] overflow-hidden">
                <div className="p-3 bg-[#F7F8F5] border-b border-[#E5EAE7] flex items-center justify-between text-xs text-[#6B7280]">
                  <span className="font-semibold text-[#1F2933]">Session Notes</span>
                  <span>Auto-saved to session summary</span>
                </div>
                <textarea
                  value={sharedNotes}
                  onChange={(e) => setSharedNotes(e.target.value)}
                  placeholder="Record insights, questions, and concept reminders here..."
                  className="flex-1 w-full bg-white p-4 text-xs sm:text-sm text-[#1F2933] focus:outline-none resize-none leading-relaxed"
                />
              </div>
            )}

            {activeCenterTab === 'resources' && (
              <div className="flex-1 flex flex-col bg-white rounded-2xl border border-[#E5EAE7] overflow-hidden">
                <div className="p-3 bg-[#F7F8F5] border-b border-[#E5EAE7] flex items-center justify-between text-xs text-[#6B7280]">
                  <span className="font-mono font-semibold text-[#1F2933]">nested_loops.py</span>
                  <span className="text-[#387B62] font-semibold">Live Shared</span>
                </div>
                <textarea
                  value={scratchpadCode}
                  onChange={(e) => setScratchpadCode(e.target.value)}
                  className="flex-1 w-full bg-[#FAFAF8] p-4 font-mono text-xs sm:text-sm text-[#1F2933] focus:outline-none resize-none leading-relaxed"
                  spellCheck={false}
                />
              </div>
            )}
          </div>

          {/* Controls Bar: Mic, Camera, Screen Share, Chat, Notes, Leave */}
          <div className="h-16 border-t border-[#E5EAE7] bg-white px-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
                isMicOn
                  ? 'bg-white border-[#E5EAE7] text-[#1F2933] hover:bg-[#F7F8F5]'
                  : 'bg-rose-50 border-rose-200 text-rose-600'
              }`}
              title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
            >
              {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsCameraOn(!isCameraOn)}
              className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
                isCameraOn
                  ? 'bg-white border-[#E5EAE7] text-[#1F2933] hover:bg-[#F7F8F5]'
                  : 'bg-rose-50 border-rose-200 text-rose-600'
              }`}
              title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {isCameraOn ? <VideoIcon className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
                isScreenSharing
                  ? 'bg-[#3F6B5B] text-white border-[#3F6B5B]'
                  : 'bg-white border-[#E5EAE7] text-[#1F2933] hover:bg-[#F7F8F5]'
              }`}
              title="Screen Share"
            >
              <Monitor className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSideTab('chat')}
              className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
                sideTab === 'chat'
                  ? 'bg-[#3F6B5B] text-white border-[#3F6B5B]'
                  : 'bg-white border-[#E5EAE7] text-[#1F2933] hover:bg-[#F7F8F5]'
              }`}
              title="Chat"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setActiveCenterTab('notes');
                setSideTab('notes');
              }}
              className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
                sideTab === 'notes'
                  ? 'bg-[#3F6B5B] text-white border-[#3F6B5B]'
                  : 'bg-white border-[#E5EAE7] text-[#1F2933] hover:bg-[#F7F8F5]'
              }`}
              title="Notes"
            >
              <FileText className="w-4 h-4" />
            </button>

            <button
              onClick={handleStartRecording}
              className={`p-2.5 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                isRecording
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-white border-[#E5EAE7] text-[#1F2933] hover:bg-[#F7F8F5]'
              }`}
              title="Recording"
            >
              <Circle className={`w-3.5 h-3.5 ${isRecording ? 'fill-current' : 'text-rose-500'}`} />
              <span className="hidden sm:inline">{isRecording ? 'Stop REC' : 'Record'}</span>
            </button>

            <button
              onClick={handleEndSession}
              disabled={isEndingSession}
              className="px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>Leave</span>
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* 3. RIGHT SIDE PANEL (AI COPILOT & CHAT) */}
        {/* ---------------------------------------------------- */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-[#E5EAE7] bg-white flex flex-col h-80 lg:h-full">
          {/* Header Tabs */}
          <div className="h-12 border-b border-[#E5EAE7] px-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSideTab('copilot')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  sideTab === 'copilot'
                    ? 'bg-[#DCE9E2] text-[#3F6B5B]'
                    : 'text-[#6B7280] hover:text-[#1F2933]'
                }`}
              >
                AI Copilot
              </button>
              <button
                onClick={() => setSideTab('chat')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  sideTab === 'chat'
                    ? 'bg-[#DCE9E2] text-[#3F6B5B]'
                    : 'text-[#6B7280] hover:text-[#1F2933]'
                }`}
              >
                Chat
              </button>
            </div>

            <span className="text-[10px] text-[#387B62] font-semibold bg-[#DCE9E2] px-2 py-0.5 rounded">
              Active
            </span>
          </div>

          {/* TAB: AI COPILOT */}
          {sideTab === 'copilot' && (
            <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-4">
              {/* Subtle Sage Highlighted Panel */}
              <div className="p-4 rounded-xl bg-[#F0F4F1] border border-[#DCE9E2] space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-[#3F6B5B] uppercase tracking-wide">
                    AI Copilot
                  </h4>
                  <p className="text-sm font-semibold text-[#1F2933] mt-0.5">
                    &ldquo;Would you like a simpler explanation?&rdquo;
                  </p>
                </div>

                {/* Copilot Action Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <button
                    onClick={() => handleAskCopilot('Explain nested loops with an everyday analogy')}
                    className="px-2.5 py-1 rounded-md bg-white border border-[#E5EAE7] hover:bg-[#DCE9E2] text-xs font-medium text-[#1F2933] transition-colors cursor-pointer"
                  >
                    Explain differently
                  </button>
                  <button
                    onClick={() => handleAskCopilot('Give a practical code example of nested loops')}
                    className="px-2.5 py-1 rounded-md bg-white border border-[#E5EAE7] hover:bg-[#DCE9E2] text-xs font-medium text-[#1F2933] transition-colors cursor-pointer"
                  >
                    Give example
                  </button>
                  <button
                    onClick={() => handleAskCopilot('Provide a quick practice question to test understanding')}
                    className="px-2.5 py-1 rounded-md bg-white border border-[#E5EAE7] hover:bg-[#DCE9E2] text-xs font-medium text-[#1F2933] transition-colors cursor-pointer"
                  >
                    Practice
                  </button>
                </div>
              </div>

              {/* Copilot Stream of Contextual Notes */}
              <div className="flex-1 overflow-y-auto space-y-3">
                {session.copilotItems.length === 0 ? (
                  <div className="py-6 text-center text-xs text-[#6B7280] space-y-1">
                    <p>Copilot supports the session quietly in the background.</p>
                    <p className="text-[11px]">Click an action above or type below for assistance.</p>
                  </div>
                ) : (
                  session.copilotItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-white border border-[#E5EAE7] space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#3F6B5B]">{item.title}</span>
                        <span className="text-[10px] text-[#6B7280]">{item.timestamp}</span>
                      </div>
                      <p className="text-[#1F2933] leading-relaxed">{item.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Copilot Input */}
              <div className="pt-2 border-t border-[#E5EAE7]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={copilotPromptInput}
                    onChange={(e) => setCopilotPromptInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAskCopilot()}
                    placeholder="Ask Copilot a question..."
                    className="flex-1 bg-[#F7F8F5] border border-[#E5EAE7] rounded-lg px-3 py-1.5 text-xs text-[#1F2933] placeholder-[#6B7280] focus:outline-none focus:border-[#3F6B5B]"
                  />
                  <button
                    onClick={() => handleAskCopilot()}
                    disabled={copilotLoading || !copilotPromptInput.trim()}
                    className="px-3 py-1.5 rounded-lg bg-[#3F6B5B] hover:bg-[#34594B] text-white text-xs font-semibold disabled:opacity-50 transition-colors"
                  >
                    Ask
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CHAT */}
          {sideTab === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
                {messages.map((m) => {
                  const isMe = m.senderId === currentUser?.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1 text-[10px] text-[#6B7280] mb-0.5">
                        <span className="font-semibold">{m.senderName}</span>
                        <span>•</span>
                        <span>{m.timestamp}</span>
                      </div>
                      <div
                        className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                          isMe
                            ? 'bg-[#3F6B5B] text-white'
                            : 'bg-[#F7F8F5] border border-[#E5EAE7] text-[#1F2933]'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={chatBottomRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-3 border-t border-[#E5EAE7] bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type message..."
                    className="flex-1 bg-[#F7F8F5] border border-[#E5EAE7] rounded-lg px-3 py-1.5 text-xs text-[#1F2933] placeholder-[#6B7280] focus:outline-none focus:border-[#3F6B5B]"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="p-2 rounded-lg bg-[#3F6B5B] hover:bg-[#34594B] text-white disabled:opacity-50 transition-colors"
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
          <div className="p-4 rounded-xl bg-[#F0F4F1] border border-[#DCE9E2] text-xs text-[#1F2933] space-y-2">
            <div className="flex items-center gap-2 text-[#3F6B5B] font-semibold">
              <Shield className="w-4 h-4" />
              <span>Transparent Recording Policy</span>
            </div>
            <p className="text-[#6B7280] leading-relaxed">
              Recording creates an AI session summary and structured study notes after the session finishes.
              Either participant can pause or stop the recording at any time.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowRecordingConsentModal(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-[#6B7280] hover:text-[#1F2933]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmRecordingConsent}
              className="px-5 py-2 rounded-lg bg-[#3F6B5B] hover:bg-[#34594B] text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Circle className="w-3 h-3 fill-white" />
              <span>Start Recording</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Post-Session Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => {
          setShowFeedbackModal(false);
          setShowSummaryModal(true);
        }}
        session={session}
        onFeedbackSubmitted={() => {}}
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
