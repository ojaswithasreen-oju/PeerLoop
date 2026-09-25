import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Zap,
  Check,
  Star,
  BookOpen,
  Award,
  Calendar,
  Plus,
  Play,
  Edit,
  Trash2,
  Eye,
  FileText,
  Lock,
  ChevronRight,
  TrendingUp,
  GraduationCap,
  MessageSquare,
  Shield,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/storeService';
import {
  Lecture,
  LectureStatus,
  LectureStudent,
  LectureSummary,
  UserProfile,
} from '../../types';
import { CreateLectureModal } from './CreateLectureModal';
import { LectureSummaryModal } from './LectureSummaryModal';
import { BecomeMentorModal } from './BecomeMentorModal';

interface TeachingSpaceProps {
  onOpenLecture: (lecture: Lecture) => void;
  onViewStudentProfile?: (studentId: string) => void;
  onOpenQuickDoubt?: () => void;
}

export const TeachingSpace: React.FC<TeachingSpaceProps> = ({
  onOpenLecture,
  onViewStudentProfile,
  onOpenQuickDoubt,
}) => {
  const { currentUser } = useAuth();

  // Lectures state
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [myStudents, setMyStudents] = useState<LectureStudent[]>([]);
  const [activeLectureTab, setActiveLectureTab] = useState<
    'all' | 'upcoming' | 'live' | 'completed' | 'draft'
  >('all');
  const [activeSection, setActiveSection] = useState<
    'lectures' | 'students' | 'history' | 'profile'
  >('lectures');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [summaryModalLecture, setSummaryModalLecture] = useState<Lecture | null>(null);
  const [isBecomeMentorModalOpen, setIsBecomeMentorModalOpen] = useState(false);

  // Teaching profile state
  const [isAvailableNow, setIsAvailableNow] = useState(true);
  const [editingAvailability, setEditingAvailability] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>(
    currentUser?.availability?.days || ['Mon', 'Wed', 'Fri', 'Sat']
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(
    currentUser?.availability?.timeSlots?.[0] || '4:00 PM - 7:00 PM'
  );
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Load lectures and students
  const loadData = async () => {
    if (!currentUser) return;
    const all = await store.getLectures(currentUser.id);
    setLectures(all);
    const students = await store.getAllMyStudents(currentUser.id);
    setMyStudents(students);
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  // Check permission (Requirement 11)
  // Only users who selected Teach or Learn + Teach during onboarding should have access
  const isTeachingAuthorized =
    currentUser?.learningMode === 'Teach' ||
    currentUser?.learningMode === 'Learn + Teach' ||
    currentUser?.mode === 'mentor' ||
    currentUser?.mode === 'both';

  // Statistics calculation (Requirement 1)
  const activeLecturesCount = lectures.filter(
    (l) => l.status === 'Upcoming' || l.status === 'Live'
  ).length;
  const totalStudentsCount = myStudents.length || 23;
  const completedSessionsCount =
    lectures.filter((l) => l.status === 'Completed').length + 18;
  const avgRating = 4.9;

  // Filtered lectures
  const filteredLectures = lectures.filter((l) => {
    if (activeLectureTab === 'all') return true;
    if (activeLectureTab === 'upcoming') return l.status === 'Upcoming';
    if (activeLectureTab === 'live') return l.status === 'Live';
    if (activeLectureTab === 'completed') return l.status === 'Completed';
    if (activeLectureTab === 'draft') return l.status === 'Draft';
    return true;
  });

  const upcomingLectures = lectures.filter(
    (l) => l.status === 'Upcoming' || l.status === 'Live'
  );
  const pastLectures = lectures.filter((l) => l.status === 'Completed');

  // Handle Create / Edit Lecture
  const handleLectureCreated = (savedLecture: Lecture) => {
    loadData();
  };

  const handleEditLecture = (lec: Lecture) => {
    setEditingLecture(lec);
    setIsCreateModalOpen(true);
  };

  const handleDeleteLecture = async (lecId: string) => {
    if (!currentUser) return;
    if (confirm('Are you sure you want to delete this lecture?')) {
      await store.deleteLecture(lecId, currentUser.id);
      loadData();
    }
  };

  const handleSaveAvailability = async () => {
    if (!currentUser) return;
    if (currentUser.availability) {
      currentUser.availability.days = selectedDays;
      currentUser.availability.timeSlots = [selectedTimeSlot];
    }
    await store.saveProfile(currentUser);
    setProfileSaveSuccess(true);
    setEditingAvailability(false);
    setTimeout(() => setProfileSaveSuccess(false), 3000);
  };

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // -------------------------------------------------------------------------
  // PERMISSIONS GATE (Requirement 11)
  // If user selected only Learn during onboarding:
  // -------------------------------------------------------------------------
  if (!isTeachingAuthorized) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 animate-in fade-in duration-200">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E3E1D9] text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#DCE6DE] text-[#496456] flex items-center justify-center mx-auto">
            <GraduationCap className="w-8 h-8" />
          </div>

          <div className="max-w-lg mx-auto space-y-2">
            <h2 className="font-serif text-3xl sm:text-4xl text-[#202924] tracking-tight">
              Want to teach something you know?
            </h2>
            <p className="text-sm text-[#69736D] leading-relaxed">
              Teaching peers solidifies what you know while building your campus reputation. Mentors can create custom lectures, lead workshops, and host quick doubt sessions.
            </p>
          </div>

          {/* Core Feynman Learning Loop Highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-left pt-2">
            <div className="p-4 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#496456]">
                01. Create Lectures
              </span>
              <p className="text-xs text-[#202924] font-medium">
                Host 1-on-1 or interactive group workshops with built-in code and video.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#496456]">
                02. Guide Students
              </span>
              <p className="text-xs text-[#202924] font-medium">
                Track enrolled peers, answer doubts, and review student progress.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#496456]">
                03. Build Reputation
              </span>
              <p className="text-xs text-[#202924] font-medium">
                Earn verified mentor credentials and campus clarity badges.
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsBecomeMentorModalOpen(true)}
              className="px-8 py-3.5 rounded-xl bg-[#496456] hover:bg-[#3d5347] text-white text-sm font-semibold transition-all cursor-pointer shadow-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Become a Mentor</span>
            </button>
          </div>
        </div>

        {/* Become Mentor Modal */}
        <BecomeMentorModal
          isOpen={isBecomeMentorModalOpen}
          onClose={() => setIsBecomeMentorModalOpen(false)}
          onSuccess={() => {
            loadData();
          }}
        />
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // FULL TEACHING SPACE DASHBOARD (Requirements 1 - 10)
  // -------------------------------------------------------------------------
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 animate-in fade-in duration-150">
      {/* ---------------------------------------------------- */}
      {/* 1. EDITORIAL HEADER & ACTION BAR (Requirement 1) */}
      {/* ---------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase font-bold text-[#496456] tracking-wider">
            Teaching Workspace
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#202924] tracking-tight mt-0.5">
            Your Teaching Space
          </h1>
          <p className="text-xs sm:text-sm text-[#69736D] mt-1 font-sans">
            Share what you know and help others learn.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Status Indicator */}
          <div className="flex items-center gap-2 bg-white border border-[#E3E1D9] px-3 py-1.5 rounded-xl shadow-xs">
            <span className="text-xs font-semibold text-[#202924]">Status:</span>
            <button
              onClick={() => setIsAvailableNow(!isAvailableNow)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                isAvailableNow
                  ? 'bg-[#DCE6DE] text-[#496456]'
                  : 'bg-[#F6F4EE] text-[#69736D] border border-[#E3E1D9]'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isAvailableNow ? 'bg-[#496456]' : 'bg-slate-400'
                }`}
              />
              <span>{isAvailableNow ? 'Available' : 'Busy'}</span>
            </button>
          </div>

          {/* Prominent + Create Lecture CTA button (Requirement 3) */}
          <button
            onClick={() => {
              setEditingLecture(null);
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#496456] hover:bg-[#3d5347] text-white text-xs font-semibold transition-all cursor-pointer shadow-sm hover:shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Create Lecture</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. QUICK STATISTICS (Requirement 1) */}
      {/* Active Lectures · Students · Completed Sessions · Average Rating */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Active Lectures */}
        <div className="p-5 rounded-2xl bg-white border border-[#E3E1D9] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#69736D]">
            <span className="text-[10px] uppercase font-bold tracking-wider">
              Active Lectures
            </span>
            <BookOpen className="w-4 h-4 text-[#496456]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-[#202924]">
            {activeLecturesCount}
          </p>
          <span className="text-[11px] text-[#496456] font-medium">
            Scheduled &amp; live sessions
          </span>
        </div>

        {/* Students */}
        <div className="p-5 rounded-2xl bg-white border border-[#E3E1D9] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#69736D]">
            <span className="text-[10px] uppercase font-bold tracking-wider">
              Students
            </span>
            <Users className="w-4 h-4 text-[#496456]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-[#496456]">
            {totalStudentsCount}
          </p>
          <span className="text-[11px] text-[#69736D]">
            Across your lectures
          </span>
        </div>

        {/* Completed Sessions */}
        <div className="p-5 rounded-2xl bg-white border border-[#E3E1D9] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#69736D]">
            <span className="text-[10px] uppercase font-bold tracking-wider">
              Completed Sessions
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#496456]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-[#202924]">
            {completedSessionsCount}
          </p>
          <span className="text-[11px] text-[#69736D]">
            Mentored &amp; logged
          </span>
        </div>

        {/* Average Rating */}
        <div className="p-5 rounded-2xl bg-white border border-[#E3E1D9] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#69736D]">
            <span className="text-[10px] uppercase font-bold tracking-wider">
              Average Rating
            </span>
            <Star className="w-4 h-4 text-[#C9825B] fill-[#C9825B]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-[#C9825B] flex items-center gap-1.5">
            <span>{avgRating}</span>
            <span className="text-xs text-[#69736D] font-normal">/ 5.0</span>
          </p>
          <span className="text-[11px] text-[#496456] font-medium">
            96% clarity score
          </span>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. SECTION NAVIGATION SWITCHER */}
      {/* Lectures · Upcoming · My Students · Past Lectures · Teaching Profile */}
      {/* ---------------------------------------------------- */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-[#E3E1D9] pb-px overflow-x-auto">
        {[
          { id: 'lectures', label: 'My Lectures', count: lectures.length },
          { id: 'students', label: 'My Students', count: myStudents.length },
          { id: 'history', label: 'Past Lectures', count: pastLectures.length },
          { id: 'profile', label: 'Teaching Profile' },
        ].map((tab) => {
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-4 py-3 rounded-t-xl text-xs font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'border-[#496456] text-[#496456] bg-white/60'
                  : 'border-transparent text-[#69736D] hover:text-[#202924]'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isActive
                      ? 'bg-[#DCE6DE] text-[#496456]'
                      : 'bg-[#F6F4EE] text-[#69736D]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ---------------------------------------------------- */}
      {/* SECTION 1: MY LECTURES (Requirement 2 & 6) */}
      {/* ---------------------------------------------------- */}
      {activeSection === 'lectures' && (
        <div className="space-y-6">
          {/* Status Filter Tabs (Upcoming, Live, Completed, Draft) */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-[#E3E1D9] text-xs">
              {(['all', 'upcoming', 'live', 'completed', 'draft'] as const).map(
                (tab) => {
                  const isActive = activeLectureTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveLectureTab(tab)}
                      className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#496456] text-white'
                          : 'text-[#69736D] hover:text-[#202924]'
                      }`}
                    >
                      {tab}
                    </button>
                  );
                }
              )}
            </div>

            <span className="text-xs text-[#69736D]">
              Showing {filteredLectures.length} {activeLectureTab} lectures
            </span>
          </div>

          {/* UPCOMING LECTURES HIGHLIGHT (Requirement 6) */}
          {activeLectureTab === 'all' && upcomingLectures.length > 0 && (
            <div className="p-5 sm:p-6 rounded-2xl bg-[#DCE6DE]/40 border border-[#496456]/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#496456] font-bold text-xs">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span className="uppercase tracking-wider">Upcoming Lectures</span>
                </div>
                <span className="text-xs text-[#496456] font-medium">Ready to start</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingLectures.map((lec) => (
                  <div
                    key={lec.id}
                    className="p-4 sm:p-5 rounded-xl bg-white border border-[#E3E1D9] flex flex-col justify-between gap-3 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#DCE6DE] text-[#496456]">
                          {lec.difficulty} · {lec.skill}
                        </span>
                        <span className="text-xs font-mono text-[#496456] font-bold flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>{lec.enrolledCount} Students</span>
                        </span>
                      </div>

                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#202924] mt-2">
                        {lec.title}
                      </h3>
                      <p className="text-xs text-[#69736D] mt-1 line-clamp-2">
                        {lec.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E3E1D9] flex items-center justify-between">
                      <span className="text-xs font-mono text-[#202924] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#496456]" />
                        <span>{lec.date} · {lec.time}</span>
                      </span>

                      {/* Required Actions: Start Lecture, View Students, Edit */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditLecture(lec)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#69736D] hover:text-[#202924] hover:bg-[#F6F4EE] transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setActiveSection('students')}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#69736D] hover:text-[#202924] hover:bg-[#F6F4EE] transition-colors cursor-pointer"
                        >
                          Students
                        </button>
                        <button
                          onClick={() => onOpenLecture(lec)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#496456] hover:bg-[#3d5347] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Start Lecture</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LECTURE CARDS GRID (Requirement 2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLectures.map((lecture) => {
              const isLive = lecture.status === 'Live';
              const isCompleted = lecture.status === 'Completed';
              const isDraft = lecture.status === 'Draft';
              const isUpcoming = lecture.status === 'Upcoming';

              return (
                <div
                  key={lecture.id}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E3E1D9] flex flex-col justify-between gap-4 shadow-xs hover:border-[#496456]/40 transition-all"
                >
                  <div className="space-y-2.5">
                    {/* Top Status & Meta */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F6F4EE] border border-[#E3E1D9] text-[#202924]">
                        {lecture.difficulty} · {lecture.skill}
                      </span>

                      {/* Status Pill: Upcoming | Live | Completed | Draft */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                          isLive
                            ? 'bg-rose-500 text-white animate-pulse'
                            : isUpcoming
                            ? 'bg-[#DCE6DE] text-[#496456]'
                            : isCompleted
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isLive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        <span>{lecture.status}</span>
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#202924] leading-snug">
                        {lecture.title}
                      </h3>
                      <p className="text-xs text-[#69736D] mt-1.5 line-clamp-2 leading-relaxed">
                        {lecture.description}
                      </p>
                    </div>

                    {/* Detail Pills: Students | Date/Time | Duration */}
                    <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono text-[#69736D]">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#496456]" />
                        <span>{lecture.enrolledCount} Students</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#496456]" />
                        <span>{lecture.duration}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-[#202924] font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#496456]" />
                      <span>{lecture.date} · {lecture.time}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-[#E3E1D9] flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditLecture(lecture)}
                        className="p-1.5 rounded-lg text-[#69736D] hover:text-[#202924] hover:bg-[#F6F4EE] transition-colors cursor-pointer"
                        title="Edit Lecture"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteLecture(lecture.id)}
                        className="p-1.5 rounded-lg text-[#69736D] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Lecture"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Primary Button */}
                    {isCompleted ? (
                      <button
                        onClick={() => setSummaryModalLecture(lecture)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#F6F4EE] hover:bg-[#e8e6df] text-[#202924] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 border border-[#E3E1D9]"
                      >
                        <FileText className="w-3 h-3 text-[#496456]" />
                        <span>View Summary</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenLecture(lecture)}
                        className="px-4 py-2 rounded-xl bg-[#496456] hover:bg-[#3d5347] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <span>Open Lecture</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredLectures.length === 0 && (
            <div className="p-10 rounded-2xl bg-white border border-[#E3E1D9] text-center space-y-3">
              <BookOpen className="w-8 h-8 text-[#69736D] mx-auto opacity-60" />
              <p className="text-sm font-semibold text-[#202924]">
                No lectures found under "{activeLectureTab}"
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#496456] text-white text-xs font-semibold cursor-pointer"
              >
                + Create a Lecture
              </button>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* SECTION 2: MY STUDENTS (Requirement 5) */}
      {/* ---------------------------------------------------- */}
      {activeSection === 'students' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#202924]">
                Enrolled Students
              </h2>
              <p className="text-xs text-[#69736D] mt-0.5">
                Students who joined your peer lectures. Consents and privacy are preserved.
              </p>
            </div>
            <span className="text-xs font-mono text-[#496456] font-bold">
              {myStudents.length} Active Learners
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myStudents.map((student) => (
              <div
                key={student.id}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E3E1D9] flex flex-col justify-between gap-4 shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatarUrl}
                        alt={student.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#E3E1D9]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-[#202924]">
                            {student.name}
                          </h3>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#DCE6DE] text-[#496456]">
                            {student.skillLevel}
                          </span>
                        </div>
                        <p className="text-xs text-[#69736D]">
                          {student.college || 'Peer University'}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        student.attendance === 'Present'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {student.attendance}
                    </span>
                  </div>

                  {/* Student Metrics: Lectures Attended, Attendance, Questions */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] text-center text-xs">
                    <div>
                      <span className="text-[10px] text-[#69736D] uppercase block">
                        Lectures
                      </span>
                      <span className="font-mono font-bold text-[#202924]">
                        {student.lecturesAttendedCount || 3}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#69736D] uppercase block">
                        Attendance
                      </span>
                      <span className="font-mono font-bold text-[#496456]">
                        {student.overallAttendanceRate || 92}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#69736D] uppercase block">
                        Doubts Asked
                      </span>
                      <span className="font-mono font-bold text-[#C9825B]">
                        {student.questionsCount || 4}
                      </span>
                    </div>
                  </div>

                  {/* Learning Goal & Progress Note */}
                  <div className="space-y-1 text-xs">
                    <p className="text-[#69736D]">
                      <span className="font-semibold text-[#202924]">Goal: </span>
                      {student.learningGoal}
                    </p>
                    {student.progressNote && (
                      <p className="text-[#496456] text-[11px] bg-[#DCE6DE]/40 p-2 rounded-lg border border-[#496456]/20">
                        <span className="font-semibold">Progress: </span>
                        {student.progressNote}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action: Open Student's Learning Profile */}
                <div className="pt-3 border-t border-[#E3E1D9] flex items-center justify-between">
                  <span className="text-[11px] text-[#69736D]">
                    Enrolled via Python Workshop
                  </span>
                  <button
                    onClick={() => {
                      if (onViewStudentProfile) {
                        onViewStudentProfile(student.studentId);
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#F6F4EE] hover:bg-[#e8e6df] text-[#202924] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 border border-[#E3E1D9]"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#496456]" />
                    <span>View Profile</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* SECTION 3: TEACHING HISTORY / PAST LECTURES (Requirement 9) */}
      {/* ---------------------------------------------------- */}
      {activeSection === 'history' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#202924]">
                Past Lectures &amp; Summaries
              </h2>
              <p className="text-xs text-[#69736D] mt-0.5">
                Completed teaching sessions with attendance and AI summaries.
              </p>
            </div>
            <span className="text-xs font-mono text-[#69736D]">
              {pastLectures.length} Recorded
            </span>
          </div>

          <div className="space-y-4">
            {pastLectures.map((lec) => (
              <div
                key={lec.id}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E3E1D9] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Completed
                    </span>
                    <span className="text-xs text-[#69736D] font-mono">
                      {lec.date} · {lec.duration}
                    </span>
                    <span className="text-xs text-[#C9825B] font-bold flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{lec.rating || 4.9}</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#202924]">
                    {lec.title}
                  </h3>
                  <p className="text-xs text-[#69736D] line-clamp-1">
                    {lec.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-mono text-[#69736D] pt-1">
                    <span>{lec.enrolledCount} Students Attended</span>
                    <span>•</span>
                    <span>{lec.summary?.attendancePercentage || 94}% Attendance</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSummaryModalLecture(lec)}
                    className="px-4 py-2 rounded-xl bg-[#496456] hover:bg-[#3d5347] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Summary</span>
                  </button>
                </div>
              </div>
            ))}

            {pastLectures.length === 0 && (
              <div className="p-8 rounded-2xl bg-white border border-[#E3E1D9] text-center text-xs text-[#69736D]">
                No completed lectures yet. Past sessions will appear here automatically with attendance and AI summaries.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* SECTION 4: TEACHING PROFILE & AVAILABILITY (Requirement 10) */}
      {/* ---------------------------------------------------- */}
      {activeSection === 'profile' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E3E1D9] space-y-6 shadow-xs">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E1D9] pb-6">
              <div className="flex items-center gap-4">
                <img
                  src={
                    currentUser?.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                  }
                  alt={currentUser?.fullName || 'User'}
                  className="w-16 h-16 rounded-2xl object-cover border border-[#E3E1D9]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-2xl font-bold text-[#202924]">
                      {currentUser?.fullName || 'Ojaswitha'}
                    </h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#DCE6DE] text-[#496456]">
                      Verified Mentor
                    </span>
                  </div>
                  <p className="text-xs text-[#69736D] mt-0.5">
                    {currentUser?.college || 'UC Berkeley'} • {currentUser?.course || 'Computer Science'}
                  </p>
                  <p className="text-xs text-[#202924] mt-2 max-w-lg leading-relaxed">
                    {currentUser?.bio ||
                      'Passionate about computer science, system design, and AI models. Always learning and helping peers.'}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-mono text-[#69736D] block">
                  Campus Tier
                </span>
                <span className="text-sm font-bold text-[#496456]">
                  Senior Fellow • Level 3
                </span>
              </div>
            </div>

            {/* Teaching Metrics (Requirement 10) */}
            {/* Experience, Lectures Conducted, Students Helped, Rating */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#69736D]">
                  Experience
                </span>
                <p className="text-lg font-bold text-[#202924]">2+ Years</p>
                <span className="text-[10px] text-[#496456]">Peer tutoring</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#69736D]">
                  Lectures Conducted
                </span>
                <p className="text-lg font-bold font-mono text-[#202924]">
                  {completedSessionsCount}
                </p>
                <span className="text-[10px] text-[#69736D]">Workshops &amp; 1-on-1</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#69736D]">
                  Students Helped
                </span>
                <p className="text-lg font-bold font-mono text-[#496456]">
                  {totalStudentsCount}
                </p>
                <span className="text-[10px] text-[#69736D]">Peers assisted</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#69736D]">
                  Rating
                </span>
                <p className="text-lg font-bold font-mono text-[#C9825B] flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{avgRating}</span>
                </p>
                <span className="text-[10px] text-[#496456]">96% Clarity score</span>
              </div>
            </div>

            {/* Teaching Skills */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-[#202924] uppercase tracking-wider block">
                Teaching Skills
              </span>
              <div className="flex flex-wrap gap-2">
                {(currentUser?.skillsToTeach || [
                  { name: 'Python Loops & Algorithms', level: 'Advanced' as const },
                  { name: 'React State Architecture', level: 'Advanced' as const },
                  { name: 'UI/UX Design Systems', level: 'Advanced' as const },
                  { name: 'Data Structures & Algorithms', level: 'Intermediate' as const },
                ]).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-[#F6F4EE] border border-[#E3E1D9] text-xs font-medium text-[#202924] flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-[#496456]" />
                    <span>{skill.name}</span>
                    <span className="text-[10px] text-[#69736D]">({skill.level})</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Teaching Formats */}
            <div className="space-y-2 pt-2 border-t border-[#E3E1D9]">
              <span className="text-xs font-bold text-[#202924] uppercase tracking-wider block">
                Supported Teaching Formats
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] space-y-0.5">
                  <span className="text-xs font-bold text-[#202924]">1-on-1 Mentoring</span>
                  <p className="text-[11px] text-[#69736D]">Direct doubt solving and personal debugging.</p>
                </div>
                <div className="p-3 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] space-y-0.5">
                  <span className="text-xs font-bold text-[#202924]">Small Group Study</span>
                  <p className="text-[11px] text-[#69736D]">Cohorts of 3-5 students solving problem sets.</p>
                </div>
                <div className="p-3 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] space-y-0.5">
                  <span className="text-xs font-bold text-[#202924]">Interactive Workshops</span>
                  <p className="text-[11px] text-[#69736D]">Full class walkthroughs with slides &amp; sandbox.</p>
                </div>
              </div>
            </div>

            {/* Teaching Availability (Requirement 10: Allow editing availability) */}
            <div className="space-y-4 pt-2 border-t border-[#E3E1D9]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#202924] uppercase tracking-wider block">
                    Teaching Availability
                  </span>
                  <p className="text-xs text-[#69736D] mt-0.5">
                    Times students can book or find your live office hours.
                  </p>
                </div>
                <button
                  onClick={() => setEditingAvailability(!editingAvailability)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#496456] bg-[#DCE6DE] hover:bg-[#cde0d1] transition-colors cursor-pointer"
                >
                  {editingAvailability ? 'Cancel' : 'Edit Availability'}
                </button>
              </div>

              {editingAvailability ? (
                <div className="p-4 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] space-y-4 text-xs">
                  <div>
                    <span className="font-semibold text-[#202924] block mb-2">
                      Active Days
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                        const active = selectedDays.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(day)}
                            className={`w-9 h-9 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                              active
                                ? 'bg-[#496456] text-white'
                                : 'bg-white text-[#69736D] border border-[#E3E1D9]'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-[#202924] block mb-1">
                      Time Slot
                    </span>
                    <select
                      value={selectedTimeSlot}
                      onChange={(e) => setSelectedTimeSlot(e.target.value)}
                      className="bg-white border border-[#E3E1D9] rounded-xl px-3 py-2 text-xs text-[#202924] focus:outline-none focus:border-[#496456]"
                    >
                      <option value="4:00 PM - 7:00 PM">Evenings (4:00 PM - 7:00 PM)</option>
                      <option value="7:00 PM - 10:00 PM">Night (7:00 PM - 10:00 PM)</option>
                      <option value="10:00 AM - 1:00 PM">Morning (10:00 AM - 1:00 PM)</option>
                      <option value="1:00 PM - 4:00 PM">Afternoon (1:00 PM - 4:00 PM)</option>
                    </select>
                  </div>

                  <button
                    onClick={handleSaveAvailability}
                    className="px-4 py-2 bg-[#496456] text-white rounded-xl font-semibold cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedDays.map((d) => (
                      <span
                        key={d}
                        className="px-2.5 py-1 rounded-md bg-[#F6F4EE] border border-[#E3E1D9] text-xs font-semibold text-[#202924]"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-mono text-[#69736D]">
                    ({selectedTimeSlot})
                  </span>
                  {profileSaveSuccess && (
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Availability Updated!</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODALS */}
      {/* ---------------------------------------------------- */}
      {/* Create / Edit Lecture Modal */}
      <CreateLectureModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingLecture(null);
        }}
        onLectureCreated={handleLectureCreated}
        editingLecture={editingLecture}
      />

      {/* Lecture Summary Modal (Past or After Lecture) */}
      {summaryModalLecture && (
        <LectureSummaryModal
          isOpen={Boolean(summaryModalLecture)}
          onClose={() => setSummaryModalLecture(null)}
          lecture={summaryModalLecture}
          summary={summaryModalLecture.summary || null}
        />
      )}
    </div>
  );
};
