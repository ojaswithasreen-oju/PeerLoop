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
  HelpCircle,
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

  // Left panel view: 'notes' | 'resources'
  const [leftTab, setLeftTab] = useState<'notes' | 'resources'>('notes');

  // Right panel view: 'copilot' | 'chat'
  const [rightTab, setRightTab] = useState<'copilot' | 'chat'>('copilot');

  // Mobile active tab: 'center' | 'left' | 'right'
  const [mobileTab, setMobileTab] = useState<'center' | 'left' | 'right'>('center');

  // Elapsed timer
  const [elapsedSeconds, setElapsedSeconds] = useState(session.recordingSeconds || 420);

  // Recording state
  const [isRecording, setIsRecording] = useState(session.isRecording || false);
  const [showRecordingConsentModal, setShowRecordingConsentModal] = useState(false);

  // Copilot prompt input & state
  const [copilotPromptInput, setCopilotPromptInput] = useState('');
  const [copilotLoading, setCopilotLoading] = useState(false);

  // Live Chat
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<SessionChatMessage[]>(session.chatMessages || []);

  // Shared Notes & Scratchpad Code
  const [sharedNotes, setSharedNotes] = useState(
    session.sharedNotes ||
      `# PeerLoop Learning Notes: ${session.topic}
• Mentor: ${session.mentorName}
• Learner: ${session.learnerName}

Key Concept Insights:
1. Outer loop index controls row traversal.
2. Inner loop traverses column items within that row.
3. List comprehension syntax: [val for row in matrix for val in row]
`
  );
  const [scratchpadCode, setScratchpadCode] = useState(
    session.scratchpadCode ||
      `# Collaborative Workspace: ${session.topic}
# Type code or test examples together in real-time

def explore_nested_loops():
    matrix = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ]
    
    print("--- Row by row ---")
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
          // Camera fallback
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

    setMessages((prev) => [...prev, newMsg]);
    setChatInput('');
  };

  const handleAskCopilot = async (customPrompt?: string) => {
    const promptToUse = customPrompt || copilotPromptInput;
    if (!promptToUse.trim()) return;

    setCopilotLoading(true);
    setCopilotPromptInput('');

    try {
      const result = await getSessionCopilotAssistance(
        session.topic,
        messages.slice(-4).map((m) => `${m.senderName}: ${m.text}`).join('\n') || promptToUse,
        sharedNotes,
        session.mentorName,
        session.learnerName
      );

      if (result.items && result.items.length > 0) {
        setSession((prev) => ({
          ...prev,
          copilotItems: [...result.items, ...prev.copilotItems],
        }));
      } else {
        const newItem: AIInterruptionItem = {
          id: `cp-${Date.now()}`,
          type: 'clarification',
          level: 'suggestion',
          confidenceText: 'Quick clarification',
          title: 'Concept Anchor: ' + session.topic,
          content:
            'Think of nested loops like the hands of a clock: the minute hand must complete 60 minutes (inner loop) before the hour hand advances by 1 (outer loop).',
          targetAudience: isMentor ? 'mentor' : 'learner',
          status: 'active',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setSession((prev) => ({
          ...prev,
          copilotItems: [newItem, ...prev.copilotItems],
        }));
      }
    } catch {
      // Fallback response
      const fallbackItem: AIInterruptionItem = {
        id: `cp-${Date.now()}`,
        type: 'clarification',
        level: 'suggestion',
        confidenceText: 'Quick clarification',
        title: 'Simplified Concept Breakdown',
        content:
          'Think of nested loops like the hands of a clock: the minute hand must complete 60 minutes (inner loop) before the hour hand advances by 1 (outer loop).',
        targetAudience: isMentor ? 'mentor' : 'learner',
        status: 'active',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setSession((prev) => ({
        ...prev,
        copilotItems: [fallbackItem, ...prev.copilotItems],
      }));
    } finally {
      setCopilotLoading(false);
    }
  };

  const handleStartRecording = () => {
    if (!isRecording) {
      setShowRecordingConsentModal(true);
    } else {
      setIsRecording(false);
    }
  };

  const handleConfirmRecordingConsent = () => {
    setIsRecording(true);
    setShowRecordingConsentModal(false);
  };

  const handleEndSession = async () => {
    setIsEndingSession(true);

    const summary = await generateSessionSummary(
      session.topic,
      session.skill,
      messages.map((m) => `${m.senderName}: ${m.text}`).join('\n'),
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
    <div className="fixed inset-0 z-50 bg-[#F6F4EE] flex flex-col overflow-hidden text-[#202924] font-sans selection:bg-[#DCE6DE] selection:text-[#496456]">
      {/* ---------------------------------------------------- */}
      {/* 1. TOP BAR */}
      {/* ---------------------------------------------------- */}
      <header className="h-16 border-b border-[#E3E1D9] bg-white px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0">
        {/* Left: Topic & Skill */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#496456] shrink-0" />
          <h2 className="text-sm sm:text-base font-bold text-[#202924] truncate">
            {session.topic || 'Python — Nested Loops'}
          </h2>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-[#DCE6DE] text-[#496456] hidden sm:inline">
            {session.skill || 'Python'}
          </span>
        </div>

        {/* Mobile View Switcher */}
        <div className="flex lg:hidden items-center gap-1 bg-[#F6F4EE] p-1 rounded-lg border border-[#E3E1D9]">
          <button
            onClick={() => setMobileTab('left')}
            className={`px-2.5 py-1 rounded text-xs font-semibold ${
              mobileTab === 'left' ? 'bg-white text-[#496456] shadow-xs' : 'text-[#69736D]'
            }`}
          >
            Notes
          </button>
          <button
            onClick={() => setMobileTab('center')}
            className={`px-2.5 py-1 rounded text-xs font-semibold ${
              mobileTab === 'center' ? 'bg-white text-[#496456] shadow-xs' : 'text-[#69736D]'
            }`}
          >
            Session
          </button>
          <button
            onClick={() => setMobileTab('right')}
            className={`px-2.5 py-1 rounded text-xs font-semibold ${
              mobileTab === 'right' ? 'bg-white text-[#496456] shadow-xs' : 'text-[#69736D]'
            }`}
          >
            Copilot
          </button>
        </div>

        {/* Right: Timer, Recording, Leave */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Recording badge */}
          {isRecording ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
              <span>REC</span>
            </div>
          ) : (
            <span className="text-xs text-[#69736D] hidden md:inline">Not Recording</span>
          )}

          {/* Session Timer */}
          <div className="font-mono text-xs font-semibold text-[#202924] bg-[#F6F4EE] px-2.5 py-1 rounded-md border border-[#E3E1D9]">
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
      </header>

      {/* ---------------------------------------------------- */}
      {/* 2. THREE-COLUMN DESKTOP WORKSPACE LAYOUT */}
      {/* LEFT: Notes / Resources */}
      {/* CENTER: Mentor session */}
      {/* RIGHT: AI Copilot / Chat */}
      {/* ---------------------------------------------------- */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#F6F4EE]">
        {/* ==================================================== */}
        {/* LEFT COLUMN: NOTES / RESOURCES */}
        {/* ==================================================== */}
        <div
          className={`w-full lg:w-80 xl:w-96 border-b lg:border-b-0 lg:border-r border-[#E3E1D9] bg-white flex flex-col ${
            mobileTab === 'left' ? 'flex-1' : 'hidden lg:flex'
          }`}
        >
          {/* Header tabs: Notes / Resources */}
          <div className="h-11 border-b border-[#E3E1D9] px-4 flex items-center justify-between bg-[#F6F4EE]/50">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLeftTab('notes')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  leftTab === 'notes'
                    ? 'bg-white text-[#496456] shadow-xs border border-[#E3E1D9]'
                    : 'text-[#69736D] hover:text-[#202924]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Notes</span>
              </button>
              <button
                onClick={() => setLeftTab('resources')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  leftTab === 'resources'
                    ? 'bg-white text-[#496456] shadow-xs border border-[#E3E1D9]'
                    : 'text-[#69736D] hover:text-[#202924]'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Resources &amp; Code</span>
              </button>
            </div>
            <span className="text-[10px] font-mono text-[#69736D]">Syncing</span>
          </div>

          {/* Left Body */}
          <div className="flex-1 p-3 overflow-hidden flex flex-col">
            {leftTab === 'notes' ? (
              <div className="flex-1 flex flex-col bg-white rounded-xl border border-[#E3E1D9] overflow-hidden">
                <div className="px-3 py-2 bg-[#F6F4EE] border-b border-[#E3E1D9] flex items-center justify-between text-[11px] text-[#69736D]">
                  <span className="font-semibold text-[#202924]">Collaborative Notes</span>
                  <span>Auto-saved</span>
                </div>
                <textarea
                  value={sharedNotes}
                  onChange={(e) => setSharedNotes(e.target.value)}
                  placeholder="Record insights, questions, and concept reminders together..."
                  className="flex-1 w-full p-3.5 text-xs text-[#202924] placeholder-[#69736D] focus:outline-none resize-none leading-relaxed font-sans"
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col bg-white rounded-xl border border-[#E3E1D9] overflow-hidden">
                <div className="px-3 py-2 bg-[#F6F4EE] border-b border-[#E3E1D9] flex items-center justify-between text-[11px] text-[#69736D]">
                  <span className="font-mono font-semibold text-[#202924]">scratchpad.py</span>
                  <span className="text-[#387B62] font-semibold">Shared Python</span>
                </div>
                <textarea
                  value={scratchpadCode}
                  onChange={(e) => setScratchpadCode(e.target.value)}
                  className="flex-1 w-full bg-[#FAFAF8] p-3.5 font-mono text-xs text-[#202924] focus:outline-none resize-none leading-relaxed"
                  spellCheck={false}
                />
              </div>
            )}
          </div>
        </div>

        {/* ==================================================== */}
        {/* CENTER COLUMN: MENTOR SESSION */}
        {/* ==================================================== */}
        <div
          className={`flex-1 flex flex-col overflow-hidden bg-[#F6F4EE] ${
            mobileTab === 'center' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Main Stage Grid: Peer and Learner feeds */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col justify-center gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto w-full">
              {/* 1. Peer / Mentor Card */}
              <div className="relative rounded-2xl bg-white border border-[#E3E1D9] overflow-hidden flex flex-col items-center justify-center p-8 shadow-xs min-h-[260px]">
                <div className="relative flex flex-col items-center">
                  <img
                    src={isMentor ? session.learnerAvatar : session.mentorAvatar}
                    alt="Peer"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-[#DCE6DE]"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#496456] border-2 border-white flex items-center justify-center shadow-xs">
                    <Volume2 className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <p className="text-sm font-bold text-[#202924] mt-3.5">
                  {isMentor ? session.learnerName : session.mentorName}
                </p>
                <p className="text-xs text-[#69736D]">
                  {isMentor ? session.learnerCollege : session.mentorCollege}
                </p>
                <div className="absolute top-3 left-3 text-[10px] font-semibold text-[#496456] bg-[#DCE6DE] px-2.5 py-0.5 rounded-full">
                  {isMentor ? 'Learner' : 'Mentor'}
                </div>
              </div>

              {/* 2. Self Video Card */}
              <div className="relative rounded-2xl bg-white border border-[#E3E1D9] overflow-hidden flex flex-col items-center justify-center p-8 shadow-xs min-h-[260px]">
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
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-[#E3E1D9]"
                    />
                    <p className="text-sm font-bold text-[#202924] mt-3.5">
                      You ({currentUser?.fullName})
                    </p>
                    <span className="text-xs text-[#69736D] mt-0.5">Camera Off</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 text-[10px] font-semibold text-[#202924] bg-[#F6F4EE] border border-[#E3E1D9] px-2.5 py-0.5 rounded-full">
                  You {!isMicOn && '• Muted'}
                </div>
              </div>
            </div>
          </div>

          {/* Center Call Controls Bar */}
          <div className="h-16 border-t border-[#E3E1D9] bg-white px-4 flex items-center justify-center gap-3 shrink-0">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                isMicOn
                  ? 'bg-white border-[#E3E1D9] text-[#202924] hover:bg-[#F6F4EE]'
                  : 'bg-rose-50 border-rose-200 text-rose-600'
              }`}
              title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
            >
              {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsCameraOn(!isCameraOn)}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                isCameraOn
                  ? 'bg-white border-[#E3E1D9] text-[#202924] hover:bg-[#F6F4EE]'
                  : 'bg-rose-50 border-rose-200 text-rose-600'
              }`}
              title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {isCameraOn ? <VideoIcon className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                isScreenSharing
                  ? 'bg-[#496456] text-white border-[#496456]'
                  : 'bg-white border-[#E3E1D9] text-[#202924] hover:bg-[#F6F4EE]'
              }`}
              title="Screen Share"
            >
              <Monitor className="w-4 h-4" />
            </button>

            <button
              onClick={handleStartRecording}
              className={`px-3 py-2 rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                isRecording
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-white border-[#E3E1D9] text-[#202924] hover:bg-[#F6F4EE]'
              }`}
              title="Session Recording"
            >
              <Circle className={`w-3.5 h-3.5 ${isRecording ? 'fill-current' : 'text-rose-500'}`} />
              <span className="hidden sm:inline">{isRecording ? 'Stop REC' : 'Record'}</span>
            </button>
          </div>
        </div>

        {/* ==================================================== */}
        {/* RIGHT COLUMN: AI COPILOT / CHAT */}
        {/* ==================================================== */}
        <div
          className={`w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-[#E3E1D9] bg-white flex flex-col ${
            mobileTab === 'right' ? 'flex-1' : 'hidden lg:flex'
          }`}
        >
          {/* Header Tabs: AI Copilot / Chat */}
          <div className="h-11 border-b border-[#E3E1D9] px-4 flex items-center justify-between bg-[#F6F4EE]/50">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setRightTab('copilot')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  rightTab === 'copilot'
                    ? 'bg-white text-[#496456] shadow-xs border border-[#E3E1D9]'
                    : 'text-[#69736D] hover:text-[#202924]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#496456]" />
                <span>AI Copilot</span>
              </button>
              <button
                onClick={() => setRightTab('chat')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  rightTab === 'chat'
                    ? 'bg-white text-[#496456] shadow-xs border border-[#E3E1D9]'
                    : 'text-[#69736D] hover:text-[#202924]'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>
            </div>
            <span className="text-[10px] text-[#496456] font-semibold bg-[#DCE6DE] px-2 py-0.5 rounded-full">
              Supportive
            </span>
          </div>

          {/* TAB 1: AI COPILOT */}
          {rightTab === 'copilot' && (
            <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-4">
              {/* Contextual Copilot Prompt Card */}
              <div className="p-4 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#DCE6DE] text-[#496456] flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h4 className="text-[11px] font-bold text-[#496456] uppercase tracking-wide">
                      AI Copilot
                    </h4>
                    <p className="text-xs font-semibold text-[#202924]">
                      “Want a simpler explanation?”
                    </p>
                  </div>
                </div>

                {/* Actions: Explain, Give Example, Practice */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <button
                    onClick={() => handleAskCopilot('Explain nested loops with an everyday intuitive analogy')}
                    className="px-2 py-1.5 rounded-lg bg-white border border-[#E3E1D9] hover:bg-[#DCE6DE] text-[11px] font-semibold text-[#202924] transition-colors cursor-pointer text-center"
                  >
                    Explain
                  </button>
                  <button
                    onClick={() => handleAskCopilot('Give a practical code example of nested loops')}
                    className="px-2 py-1.5 rounded-lg bg-white border border-[#E3E1D9] hover:bg-[#DCE6DE] text-[11px] font-semibold text-[#202924] transition-colors cursor-pointer text-center"
                  >
                    Give Example
                  </button>
                  <button
                    onClick={() => handleAskCopilot('Provide a short practice question to verify understanding')}
                    className="px-2 py-1.5 rounded-lg bg-white border border-[#E3E1D9] hover:bg-[#DCE6DE] text-[11px] font-semibold text-[#202924] transition-colors cursor-pointer text-center"
                  >
                    Practice
                  </button>
                </div>
              </div>

              {/* Copilot Stream */}
              <div className="flex-1 overflow-y-auto space-y-3">
                {session.copilotItems.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#69736D] space-y-1">
                    <p className="font-medium text-[#202924]">Supportive learning copilot</p>
                    <p className="text-[11px]">
                      AI assists the human mentoring session quietly without interrupting the flow.
                    </p>
                  </div>
                ) : (
                  session.copilotItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-white border border-[#E3E1D9] space-y-1.5 text-xs shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#496456] flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-[#C9825B]" />
                          <span>{item.title}</span>
                        </span>
                        <span className="text-[10px] text-[#69736D] font-mono">{item.timestamp}</span>
                      </div>
                      <p className="text-[#202924] leading-relaxed font-sans">{item.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Custom Copilot Query Input */}
              <div className="pt-2 border-t border-[#E3E1D9]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={copilotPromptInput}
                    onChange={(e) => setCopilotPromptInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAskCopilot()}
                    placeholder="Ask Copilot a question..."
                    className="flex-1 bg-[#F6F4EE] border border-[#E3E1D9] rounded-lg px-3 py-1.5 text-xs text-[#202924] placeholder-[#69736D] focus:outline-none focus:border-[#496456]"
                  />
                  <button
                    onClick={() => handleAskCopilot()}
                    disabled={copilotLoading || !copilotPromptInput.trim()}
                    className="px-3 py-1.5 rounded-lg bg-[#496456] hover:bg-[#3d5347] text-white text-xs font-semibold disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    Ask
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CHAT */}
          {rightTab === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5">
                {messages.map((m) => {
                  const isMe = m.senderId === currentUser?.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-[#69736D] mb-0.5">
                        {isMe ? 'You' : m.senderName} • {m.timestamp}
                      </span>
                      <div
                        className={`p-2.5 rounded-xl text-xs max-w-[85%] leading-relaxed ${
                          isMe
                            ? 'bg-[#496456] text-white'
                            : 'bg-[#F6F4EE] border border-[#E3E1D9] text-[#202924]'
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
              <form onSubmit={handleSendMessage} className="p-3 border-t border-[#E3E1D9] flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Send a message..."
                  className="flex-1 bg-[#F6F4EE] border border-[#E3E1D9] rounded-lg px-3 py-1.5 text-xs text-[#202924] placeholder-[#69736D] focus:outline-none focus:border-[#496456]"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-2 rounded-lg bg-[#496456] hover:bg-[#3d5347] text-white disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. MODALS */}
      {/* ---------------------------------------------------- */}
      {/* Recording Consent Modal */}
      <Modal
        isOpen={showRecordingConsentModal}
        onClose={() => setShowRecordingConsentModal(false)}
        title="Session Recording"
        subtitle="Consent required for recording"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#69736D] leading-relaxed">
            Recordings allow both participants to review key explanations and code walkthroughs later.
            Both peers are notified when recording starts.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setShowRecordingConsentModal(false)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#69736D] hover:bg-[#F6F4EE]"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmRecordingConsent}
              className="px-4 py-2 rounded-lg bg-[#496456] hover:bg-[#3d5347] text-white text-xs font-semibold"
            >
              Start Recording
            </button>
          </div>
        </div>
      </Modal>

      {/* Feedback Modal for Learner */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => {
          setShowFeedbackModal(false);
          onLeaveSession();
        }}
        session={session}
        onFeedbackSubmitted={(_updatedRep) => {
          setShowFeedbackModal(false);
          onLeaveSession();
        }}
      />

      {/* Summary Modal for Mentor */}
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
