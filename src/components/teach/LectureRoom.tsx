import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Share2,
  PhoneOff,
  Users,
  MessageSquare,
  FileText,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Monitor,
  Copy,
  Check,
  Eye,
  Maximize2,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/storeService';
import { Lecture, LectureStudent, LectureSummary } from '../../types';

interface LectureRoomProps {
  lecture: Lecture;
  onClose: () => void;
  onEndLecture: (summary: LectureSummary) => void;
  onViewStudentProfile?: (studentId: string) => void;
}

interface ChatMsg {
  id: string;
  senderName: string;
  isTeacher: boolean;
  avatarUrl: string;
  text: string;
  time: string;
}

export const LectureRoom: React.FC<LectureRoomProps> = ({
  lecture,
  onClose,
  onEndLecture,
  onViewStudentProfile,
}) => {
  const { currentUser } = useAuth();

  // Session Media Controls
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeTab, setActiveTab] = useState<'students' | 'chat' | 'notes' | 'copilot'>('students');

  // Elapsed Session Timer
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Enrolled / Present Students
  const [students, setStudents] = useState<LectureStudent[]>([]);
  const [presentCount, setPresentCount] = useState(lecture.studentsPresentCount || 5);

  // Private Teacher Notes
  const [teacherNotes, setTeacherNotes] = useState(
    lecture.privateNotes ||
      `Private Lecture Notes: ${lecture.title}\n\n1. Concept intro & row-column matrix visual (0-15m)\n2. Common bug: arr[col][row] vs arr[row][col] indexing\n3. Breakout prompt: Matrix clockwise 90-degree transpose`
  );

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    {
      id: 'c1',
      senderName: 'Priya N.',
      isTeacher: false,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      text: 'Good evening! Ready for the nested loop session.',
      time: '6:30 PM',
    },
    {
      id: 'c2',
      senderName: currentUser?.fullName || 'Teacher',
      isTeacher: true,
      avatarUrl: currentUser?.avatarUrl || '',
      text: 'Welcome everyone! Today we will master nested loops and convert them to clean list comprehensions.',
      time: '6:31 PM',
    },
    {
      id: 'c3',
      senderName: 'David K.',
      isTeacher: false,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      text: 'Can we also touch on when comprehensions become too dense to read?',
      time: '6:32 PM',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  // AI Copilot State
  const [copilotPrompt, setCopilotPrompt] = useState('');
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotSuggestions, setCopilotSuggestions] = useState<
    Array<{
      id: string;
      category: 'Concept' | 'Example' | 'Practice Question' | 'Doubt Answer';
      title: string;
      content: string;
      copied?: boolean;
    }>
  >([
    {
      id: 'cp-1',
      category: 'Concept',
      title: 'Mental Model: Matrix Row vs Column',
      content:
        'Think of the outer loop as pointing to the floor of a building (row `i`), and the inner loop as walking through each room on that floor (column `j`). `matrix[i][j]` never confuses students when explained this way.',
    },
    {
      id: 'cp-2',
      category: 'Example',
      title: 'Safe 2D Transpose Example',
      content:
        '# Idiomatic Python 2D Transpose\ntransposed = [[row[i] for row in matrix] for i in range(len(matrix[0]))]\n# Point out: reads outer-to-inner column traversal.',
    },
    {
      id: 'cp-3',
      category: 'Practice Question',
      title: 'Interactive Breakout Challenge',
      content:
        'Challenge for students: "Write a 1-line list comprehension that extracts the diagonal elements of any N x N square matrix." (Hint: `matrix[i][i]`)',
    },
  ]);

  // Confirmation Modal for "End Lecture"
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);

  // Load students for this lecture
  useEffect(() => {
    async function loadData() {
      const list = await store.getStudentsForLecture(lecture.id);
      if (list.length > 0) {
        setStudents(list);
        setPresentCount(list.filter((s) => s.attendance === 'Present' || s.attendance === 'Joined').length);
      } else {
        // Fallback default students
        const fallback = await store.getAllMyStudents(lecture.teacherId);
        setStudents(fallback);
        setPresentCount(fallback.length);
      }
    }
    loadData();
  }, [lecture.id, lecture.teacherId]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg: ChatMsg = {
      id: `c-${Date.now()}`,
      senderName: currentUser?.fullName || 'Teacher',
      isTeacher: true,
      avatarUrl: currentUser?.avatarUrl || '',
      text: inputMsg.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setInputMsg('');
  };

  const handleCopySuggestion = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopilotSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, copied: true } : s))
    );
    setTimeout(() => {
      setCopilotSuggestions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, copied: false } : s))
      );
    }, 2000);
  };

  const handleSendToChat = (text: string) => {
    const newMsg: ChatMsg = {
      id: `c-${Date.now()}`,
      senderName: `${currentUser?.fullName || 'Teacher'} (via Copilot)`,
      isTeacher: true,
      avatarUrl: currentUser?.avatarUrl || '',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setActiveTab('chat');
  };

  const handleGenerateCopilotAssistance = (type: string) => {
    setCopilotLoading(true);
    setTimeout(() => {
      let newItem = {
        id: `cp-${Date.now()}`,
        category: 'Concept' as any,
        title: `${type}: ${lecture.skill}`,
        content: '',
      };

      if (type === 'Explain Concept') {
        newItem = {
          id: `cp-${Date.now()}`,
          category: 'Concept',
          title: `Visual Analogy: ${lecture.skill}`,
          content: `When students ask why ` + lecture.skill + ` index logic behaves this way: compare zero-based indexing to an offset distance from the starting address in memory. An offset of 0 is the immediate start.`,
        };
      } else if (type === 'Generate Example') {
        newItem = {
          id: `cp-${Date.now()}`,
          category: 'Example',
          title: `Step-by-Step Code Walkthrough`,
          content: `# Practice snippet for live breakdown:\ndef rotate_matrix_90(mat):\n    return [list(row) for row in zip(*mat[::-1])]\n# Ask students to predict the output step-by-step!`,
        };
      } else if (type === 'Practice Question') {
        newItem = {
          id: `cp-${Date.now()}`,
          category: 'Practice Question',
          title: `Quick 5-Minute Student Quiz`,
          content: `Given a 3x3 matrix: What does \`[matrix[i][2-i] for i in range(3)]\` return? (Expected answer: the anti-diagonal elements)`,
        };
      } else {
        newItem = {
          id: `cp-${Date.now()}`,
          category: 'Doubt Answer',
          title: `Answering Student Doubt on Nested Comprehensions`,
          content: `Rule of thumb to share with class: If a comprehension exceeds 2 loops or requires more than 1 nested conditional, break it out into a standard for-loop for readability and debugging clarity.`,
        };
      }

      setCopilotSuggestions((prev) => [newItem, ...prev]);
      setCopilotLoading(false);
    }, 600);
  };

  // Confirm End Lecture
  const handleConfirmEndLecture = async () => {
    setShowEndConfirmation(false);

    const lectureMins = Math.max(1, Math.round(secondsElapsed / 60));
    const attendancePct = students.length > 0
      ? Math.round((presentCount / students.length) * 100)
      : 92;

    const summary: LectureSummary = {
      lectureDuration: `${lectureMins} min`,
      studentsAttended: presentCount,
      attendancePercentage: attendancePct,
      topicsCovered: lecture.learningObjectives.slice(0, 3),
      questionsAsked: [
        'How do we safely transpose non-square matrices in list comprehensions?',
        'What is the performance difference between zip(*matrix) and nested loops?',
        'How does zero-indexing map to memory address offsets?',
      ],
      resourcesShared: lecture.resources.map((r) => r.title),
      aiGeneratedSummary: `In this live lecture, ${currentUser?.fullName || 'the mentor'} led ${presentCount} students through ${lecture.title}. The class demonstrated solid progress on ${lecture.skill} concepts, with high interactive participation during the live practice exercises.`,
      savedAt: new Date().toISOString(),
    };

    // Update lecture status in database
    await store.updateLectureSummary(lecture.id, summary);
    onEndLecture(summary);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A221E] text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* ---------------------------------------------------- */}
      {/* 1. TOP STATUS BAR */}
      {/* ---------------------------------------------------- */}
      <header className="h-16 px-4 sm:px-6 bg-[#202924] border-b border-[#2C3831] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
            </span>
            <span className="font-mono text-xs font-bold text-rose-400 uppercase tracking-widest">
              LIVE
            </span>
          </div>

          <div className="h-4 w-px bg-[#2C3831] hidden sm:block" />

          <div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight truncate max-w-[200px] sm:max-w-md">
              {lecture.title}
            </h1>
            <p className="text-[11px] text-[#A2ADA6] hidden sm:block">
              {lecture.difficulty} • {lecture.skill} • {lecture.format}
            </p>
          </div>
        </div>

        {/* Center: Live Timer & Present Counter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#28352F] border border-[#35463D] text-xs font-mono text-[#DCE6DE]">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{formatTimer(secondsElapsed)}</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#28352F] border border-[#35463D] text-xs text-[#A2ADA6]">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-white font-bold">{presentCount}</span>
            <span>present</span>
          </div>
        </div>

        {/* Right: End Lecture Primary Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowEndConfirmation(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
          >
            <PhoneOff className="w-4 h-4" />
            <span className="hidden sm:inline">End Lecture</span>
          </button>
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* 2. MAIN WORKSPACE: Lecture Area (left) + Side Workspace (right) */}
      {/* ---------------------------------------------------- */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT: LECTURE AREA (Video Grid + Slide / Code Stage + Media Controls) */}
        <div className="flex-1 flex flex-col bg-[#141A17] p-3 sm:p-4 gap-3 overflow-y-auto">
          {/* Main Visual Stage (Teacher Camera or Screen Share) */}
          <div className="flex-1 rounded-2xl bg-[#1C2520] border border-[#2C3831] relative overflow-hidden flex flex-col justify-between p-4 min-h-[300px] shadow-inner">
            {/* Stage Tag */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-white">
                  {currentUser?.fullName || 'Teacher'} (Host • Screen Feed)
                </span>
              </div>

              {isScreenSharing && (
                <div className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                  Screen Sharing Active
                </div>
              )}
            </div>

            {/* Stage Screen Presentation / Whiteboard content */}
            <div className="flex-1 flex items-center justify-center p-4">
              {isVideoOn ? (
                <div className="w-full max-w-xl p-6 rounded-xl bg-[#222E28] border border-[#35463D] text-left space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-[#35463D] pb-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#DCE6DE]" />
                      <span className="text-xs font-mono font-bold text-[#DCE6DE]">
                        Slide 3 / 8: {lecture.skill} Execution Model
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#A2ADA6]">Interactive Stage</span>
                  </div>
                  <pre className="font-mono text-xs text-emerald-300 bg-[#161E1A] p-3.5 rounded-lg overflow-x-auto leading-relaxed border border-[#28352F]">
{`# 2D Grid Traversal Example
matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
]

# Outer loop = Rows (i), Inner loop = Columns (j)
for i in range(len(matrix)):
    for j in range(len(matrix[0])):
        print(f"cell({i},{j}) = {matrix[i][j]}")`}
                  </pre>
                  <p className="text-[11px] text-[#A2ADA6] italic">
                    Tip: Ask students to predict values at indices (1,2) and (2,0) in chat.
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-[#2C3831] text-[#DCE6DE] flex items-center justify-center font-bold text-xl mx-auto">
                    {currentUser?.fullName?.charAt(0) || 'T'}
                  </div>
                  <p className="text-xs text-[#A2ADA6]">Camera is muted. Audio stream active.</p>
                </div>
              )}
            </div>

            {/* Bottom Floating Stage Controls */}
            <div className="flex items-center justify-center gap-3 z-10 py-1">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
                  isMicOn
                    ? 'bg-[#2E3C34] hover:bg-[#394B41] text-white border border-[#3F5348]'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
                title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
              >
                {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
                  isVideoOn
                    ? 'bg-[#2E3C34] hover:bg-[#394B41] text-white border border-[#3F5348]'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
                title={isVideoOn ? 'Turn Off Video' : 'Turn On Video'}
              >
                {isVideoOn ? <VideoIcon className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
                  isScreenSharing
                    ? 'bg-amber-600 text-white'
                    : 'bg-[#2E3C34] hover:bg-[#394B41] text-white border border-[#3F5348]'
                }`}
                title="Share Screen"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Student Video / Avatar Strip */}
          <div className="h-28 flex items-center gap-2.5 overflow-x-auto pb-1 shrink-0">
            {students.map((student) => {
              const isPresent = student.attendance === 'Present' || student.attendance === 'Joined';
              return (
                <div
                  key={student.id}
                  className={`w-32 h-full rounded-xl p-2.5 flex flex-col justify-between border relative shrink-0 transition-colors ${
                    isPresent
                      ? 'bg-[#1C2520] border-[#35463D]'
                      : 'bg-[#161E1A] border-[#253029] opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#A2ADA6] truncate">
                      {student.college || 'Peer'}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isPresent ? 'bg-emerald-400' : 'bg-slate-500'
                      }`}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <img
                      src={student.avatarUrl}
                      alt={student.name}
                      className="w-7 h-7 rounded-full object-cover border border-white/10"
                    />
                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate">{student.name}</p>
                      <p className="text-[9px] text-[#A2ADA6] truncate">{student.skillLevel}</p>
                    </div>
                  </div>

                  <span className="text-[9px] text-emerald-400/90 font-mono">
                    {student.attendance}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: DEDICATED WORKSPACE PANEL (Tabs: Students, Chat, Notes, AI Copilot) */}
        <aside className="w-full lg:w-96 bg-[#1A221E] border-t lg:border-t-0 lg:border-l border-[#2C3831] flex flex-col shrink-0">
          {/* Tab Selector */}
          <div className="h-12 border-b border-[#2C3831] px-2 flex items-center justify-around bg-[#202924]">
            {[
              { id: 'students', label: `Students (${students.length})`, icon: Users },
              { id: 'chat', label: 'Chat', icon: MessageSquare },
              { id: 'notes', label: 'My Notes', icon: FileText },
              { id: 'copilot', label: 'AI Copilot', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#2E3C34] text-white border border-[#3F5348]'
                      : 'text-[#A2ADA6] hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : ''}`} />
                  <span className="text-[11px]">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: STUDENTS PANEL */}
          {activeTab === 'students' && (
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-[#2C3831]">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Enrolled Students ({students.length})
                </span>
                <span className="text-[11px] text-emerald-400 font-mono">
                  {presentCount} Present
                </span>
              </div>

              <div className="space-y-2.5">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="p-3 rounded-xl bg-[#222E28] border border-[#2E3C34] flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={student.avatarUrl}
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover border border-white/10"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white">
                              {student.name}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#2C3831] text-emerald-300 font-mono">
                              {student.skillLevel}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#A2ADA6]">
                            {student.college || 'Peer'}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          student.attendance === 'Present'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : student.attendance === 'Joined'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {student.attendance}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#C2CDC6] bg-[#1A221E] p-2 rounded-lg border border-[#2C3831]">
                      <span className="text-[#A2ADA6] font-semibold">Goal: </span>
                      {student.learningGoal}
                    </div>

                    {onViewStudentProfile && (
                      <button
                        onClick={() => onViewStudentProfile(student.studentId)}
                        className="self-end text-[10px] text-[#DCE6DE] hover:text-white flex items-center gap-1 cursor-pointer font-semibold transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Profile</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: LIVE CHAT */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col gap-1 ${
                      msg.isTeacher ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-[#A2ADA6]">
                      <span className="font-bold text-slate-200">{msg.senderName}</span>
                      <span>•</span>
                      <span>{msg.time}</span>
                    </div>
                    <div
                      className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                        msg.isTeacher
                          ? 'bg-[#2E3C34] text-white border border-[#3F5348]'
                          : 'bg-[#222E28] text-slate-200 border border-[#2E3C34]'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 border-t border-[#2C3831] bg-[#202924] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Send note or link to students..."
                  className="flex-1 bg-[#1A221E] border border-[#2C3831] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#A2ADA6] focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: PRIVATE NOTES */}
          {activeTab === 'notes' && (
            <div className="flex-1 p-4 flex flex-col gap-3 overflow-hidden">
              <div className="flex items-center justify-between pb-1 border-b border-[#2C3831]">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Private Teacher Notes
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Auto-saved</span>
              </div>
              <p className="text-[11px] text-[#A2ADA6]">
                Only visible to you. Use this to track lesson pacing, checkpoints, and hints.
              </p>
              <textarea
                value={teacherNotes}
                onChange={(e) => setTeacherNotes(e.target.value)}
                className="flex-1 w-full bg-[#222E28] border border-[#2C3831] rounded-xl p-3.5 text-xs text-slate-100 font-mono leading-relaxed focus:outline-none focus:border-emerald-500 resize-none"
                placeholder="Write private lecture cues and notes here..."
              />
            </div>
          )}

          {/* TAB 4: AI COPILOT */}
          {activeTab === 'copilot' && (
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Optional AI Teaching Copilot</span>
                </div>
                <p className="text-[11px] text-[#A2ADA6]">
                  Generate clear analogies, code examples, or practice quizzes without interrupting your lecture flow.
                </p>
              </div>

              {/* Quick Prompt Triggers */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Explain Concept',
                  'Generate Example',
                  'Practice Question',
                  'Answer Doubt',
                ].map((act) => (
                  <button
                    key={act}
                    onClick={() => handleGenerateCopilotAssistance(act)}
                    disabled={copilotLoading}
                    className="p-2.5 rounded-xl bg-[#222E28] hover:bg-[#2A3932] border border-[#2E3C34] text-left text-xs font-semibold text-slate-200 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    + {act}
                  </button>
                ))}
              </div>

              {copilotLoading && (
                <div className="p-4 rounded-xl bg-[#222E28] border border-[#2E3C34] flex items-center justify-center gap-2 text-xs text-[#A2ADA6]">
                  <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                  <span>Generating teaching assistance...</span>
                </div>
              )}

              {/* Suggestions Cards */}
              <div className="space-y-3">
                {copilotSuggestions.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-[#222E28] border border-[#2E3C34] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopySuggestion(item.id, item.content)}
                          className="p-1 rounded text-[#A2ADA6] hover:text-white transition-colors cursor-pointer"
                          title="Copy to clipboard"
                        >
                          {item.copied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleSendToChat(item.content)}
                          className="p-1 rounded text-[#A2ADA6] hover:text-emerald-400 transition-colors cursor-pointer"
                          title="Share to chat"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-bold text-white text-xs">{item.title}</h4>
                    <p className="text-[11px] text-[#C2CDC6] leading-relaxed whitespace-pre-line bg-[#1A221E] p-2.5 rounded-lg border border-[#28352F]">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. CONFIRMATION MODAL BEFORE ENDING LECTURE */}
      {/* ---------------------------------------------------- */}
      {showEndConfirmation && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[#202924] border border-[#2C3831] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">End Lecture Session?</h3>
                <p className="text-xs text-[#A2ADA6] mt-1 leading-relaxed">
                  Are you sure you want to end <span className="text-white font-semibold">{lecture.title}</span>? This will conclude the session for all {presentCount} active students and generate the post-lecture synthesis.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#2C3831]">
              <button
                onClick={() => setShowEndConfirmation(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#A2ADA6] hover:text-white transition-colors cursor-pointer"
              >
                Continue Lecture
              </button>
              <button
                onClick={handleConfirmEndLecture}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
              >
                Yes, End Lecture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
