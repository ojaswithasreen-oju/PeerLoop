import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Video,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
  Zap,
  Star,
  Clock,
  Search,
  MessageSquare,
  HelpCircle,
  Brain,
  HeartHandshake,
  TrendingUp,
  ChevronRight,
  Menu,
  X,
  Compass,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { DEMO_USERS } from '../../services/seedData';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onTestDrive: (userId: string) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onSignIn,
  onTestDrive,
  onNavigateToTab,
}) => {
  // Mobile navigation state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Quick Help Interactive state
  const [selectedDuration, setSelectedDuration] = useState<number>(10);
  const [stuckTopic, setStuckTopic] = useState<string>(
    "I don't understand nested loops in Python."
  );
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [requestSent, setRequestSent] = useState<boolean>(false);

  const handleQuickHelpRequest = () => {
    setIsRequesting(true);
    setTimeout(() => {
      setIsRequesting(false);
      setRequestSent(true);
      setTimeout(() => {
        // Test-drive directly into learner mode with the doubt
        onTestDrive(DEMO_USERS[0].id);
      }, 1000);
    }, 600);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-stone-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* ---------------------------------------------------- */}
      {/* STICKY TOP NAVIGATION BAR (Top Bar Contract: 3 Zones) */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-50 w-full bg-[#FAFAF9]/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2">
            <a
              href="#"
              className="text-xl font-bold tracking-tight text-stone-900 hover:text-indigo-600 transition-colors"
            >
              PeerLoop
            </a>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-stone-950 transition-colors py-1 cursor-pointer"
            >
              How it Works
            </button>
            <button
              onClick={() => (onNavigateToTab ? onNavigateToTab('learn') : onGetStarted())}
              className="hover:text-stone-950 transition-colors py-1 cursor-pointer"
            >
              Learn
            </button>
            <button
              onClick={() => (onNavigateToTab ? onNavigateToTab('teach') : onGetStarted())}
              className="hover:text-stone-950 transition-colors py-1 cursor-pointer"
            >
              Teach
            </button>
            <button
              onClick={() => (onNavigateToTab ? onNavigateToTab('community') : onGetStarted())}
              className="hover:text-stone-950 transition-colors py-1 cursor-pointer"
            >
              Community
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onSignIn}
              className="px-3.5 py-2 text-sm font-medium text-stone-700 hover:text-stone-950 transition-colors cursor-pointer"
            >
              Log in
            </button>
            <button
              onClick={onGetStarted}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              Get Started
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onGetStarted}
              className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-600 hover:text-stone-900 rounded-md focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-b border-stone-200 bg-[#FAFAF9] px-4 pt-2 pb-6 space-y-3">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left py-2 text-sm font-medium text-stone-700 hover:text-stone-950"
            >
              How it Works
            </button>
            <button
              onClick={() => (onNavigateToTab ? onNavigateToTab('learn') : onGetStarted())}
              className="block w-full text-left py-2 text-sm font-medium text-stone-700 hover:text-stone-950"
            >
              Learn
            </button>
            <button
              onClick={() => (onNavigateToTab ? onNavigateToTab('teach') : onGetStarted())}
              className="block w-full text-left py-2 text-sm font-medium text-stone-700 hover:text-stone-950"
            >
              Teach
            </button>
            <button
              onClick={() => (onNavigateToTab ? onNavigateToTab('community') : onGetStarted())}
              className="block w-full text-left py-2 text-sm font-medium text-stone-700 hover:text-stone-950"
            >
              Community
            </button>
            <div className="pt-2 border-t border-stone-200 flex flex-col gap-2">
              <button
                onClick={onSignIn}
                className="w-full py-2.5 text-center text-sm font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50"
              >
                Log in
              </button>
              <button
                onClick={onGetStarted}
                className="w-full py-2.5 text-center text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ---------------------------------------------------- */}
      {/* 1. BRAND & HERO SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Hero Typography & CTAs */}
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.12] text-balance">
              Learn from someone who’s{' '}
              <span className="text-indigo-600 underline decoration-indigo-200 decoration-wavy underline-offset-4">
                been where you are.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
              PeerLoop helps students learn from peers, get quick help, teach what they know, and grow through meaningful learning experiences.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onTestDrive(DEMO_USERS[1].id)}
                className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-stone-800 bg-white border border-stone-200/90 rounded-xl hover:bg-stone-50 hover:border-stone-300 shadow-xs transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Become a Mentor
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="w-full sm:w-auto px-5 py-3 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              >
                See How PeerLoop Works
              </button>
            </div>
          </div>

          {/* Hero Visual: Realistic PeerLoop Interface Mockup */}
          <div className="mt-14 sm:mt-18 relative max-w-5xl mx-auto">
            {/* Ambient subtle glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100/40 via-stone-100/20 to-transparent rounded-3xl blur-2xl -z-10" />

            {/* Main Product Window Frame */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden">
              {/* Product Top Chrome */}
              <div className="px-5 py-3.5 border-b border-stone-200/80 bg-stone-50/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-stone-300" />
                  <div className="w-3 h-3 rounded-full bg-stone-300" />
                  <div className="w-3 h-3 rounded-full bg-stone-300" />
                  <span className="text-xs font-medium text-stone-500 ml-2 hidden sm:inline">
                    app.peerloop.edu/learn
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>248 students online</span>
                </div>
              </div>

              {/* Product Inner Canvas */}
              <div className="p-6 sm:p-8 bg-[#FBFBFA] grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Sample Mentor Card */}
                <div className="lg:col-span-5 bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      AI Recommended Mentor
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Available now
                    </span>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg border border-indigo-200 shrink-0">
                      R
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-stone-900">Rahul</h3>
                      <p className="text-xs font-medium text-indigo-600">Python Mentor</p>
                      <p className="text-xs text-stone-500">Computer Science · UC Berkeley</p>
                    </div>
                  </div>

                  {/* Quantitative Stats with Tabular Numerals */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-stone-50 rounded-lg border border-stone-100 text-center">
                    <div>
                      <p className="text-[11px] text-stone-500">Match</p>
                      <p className="text-sm font-bold text-stone-900 font-mono tabular-nums">94%</p>
                    </div>
                    <div className="border-x border-stone-200/80">
                      <p className="text-[11px] text-stone-500">Rating</p>
                      <p className="text-sm font-bold text-stone-900 font-mono tabular-nums">⭐ 4.8</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-stone-500">Helped</p>
                      <p className="text-sm font-bold text-stone-900 font-mono tabular-nums">23</p>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    “Helps beginners build intuition around loops, recursion, and data structures. Clear visual analogies.”
                  </p>

                  <div className="pt-1 flex items-center gap-2">
                    <button
                      onClick={onGetStarted}
                      className="w-full py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer text-center"
                    >
                      Connect 1-on-1 (20m)
                    </button>
                  </div>
                </div>

                {/* Right Column: Live Session & AI Copilot Preview */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Floating Notification Item 1: AI Match Found */}
                  <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-stone-900">AI Match Found</h4>
                        <p className="text-xs text-stone-500">
                          Matched with 3 peers online for &ldquo;Python Loops &amp; DFS&rdquo;
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-stone-400">Just now</span>
                  </div>

                  {/* Floating Notification Item 2: Quick Help Request in Flight */}
                  <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-bold text-stone-900">Quick Help Broadcast</span>
                      </div>
                      <span className="text-[11px] text-indigo-700 font-medium bg-indigo-50 px-2 py-0.5 rounded">
                        10 min targeted doubt
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                      &ldquo;Why does my recursive base case return None instead of an empty array?&rdquo;
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                      <span>Learner: Priya N. (Georgia Tech)</span>
                      <span className="font-semibold text-emerald-600">2 mentors ready</span>
                    </div>
                  </div>

                  {/* Floating Notification Item 3: Learning Progress */}
                  <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">Weekly Learning Goal</span>
                      <span className="text-xs font-mono text-indigo-600 font-semibold tabular-nums">
                        3 of 4 Sessions
                      </span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full w-3/4 transition-all" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-stone-500 pt-0.5">
                      <span>Python Fundamentals Mastery</span>
                      <span>Next: Tree Traversal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 2. THE PROBLEM */}
      {/* ---------------------------------------------------- */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section Heading */}
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              The Reality of Higher Education
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Learning shouldn’t stop when class ends.
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Every college student runs into hurdles that traditional office hours and isolated textbooks cannot resolve quickly.
            </p>
          </div>

          {/* 4 Clean Problem Cards with Minimal Icons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Problem 1 */}
            <div className="p-6 rounded-2xl bg-[#FAFAF9] border border-stone-200/90 space-y-3 hover:border-stone-300 transition-all shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900">Stuck on a concept</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic">
                &ldquo;I understand the theory, but I still can’t solve the problem.&rdquo;
              </p>
              <p className="text-xs text-stone-500 pt-1">
                Hours wasted staring at a compiler or formula without a nudge in the right direction.
              </p>
            </div>

            {/* Problem 2 */}
            <div className="p-6 rounded-2xl bg-[#FAFAF9] border border-stone-200/90 space-y-3 hover:border-stone-300 transition-all shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900">Don’t know who to ask</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic">
                &ldquo;There are people who know the answer, but I don’t know who to approach.&rdquo;
              </p>
              <p className="text-xs text-stone-500 pt-1">
                Classmates are busy, teaching assistants have long queues, and discussion boards lag.
              </p>
            </div>

            {/* Problem 3 */}
            <div className="p-6 rounded-2xl bg-[#FAFAF9] border border-stone-200/90 space-y-3 hover:border-stone-300 transition-all shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900">Want to teach</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic">
                &ldquo;I know something well and want to help someone else learn it.&rdquo;
              </p>
              <p className="text-xs text-stone-500 pt-1">
                Explaining concepts solidifies your own mastery, but there is no structured way to do it.
              </p>
            </div>

            {/* Problem 4 */}
            <div className="p-6 rounded-2xl bg-[#FAFAF9] border border-stone-200/90 space-y-3 hover:border-stone-300 transition-all shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900">Learning feels disconnected</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic">
                &ldquo;Classes, practice, doubts, and people are all separated.&rdquo;
              </p>
              <p className="text-xs text-stone-500 pt-1">
                Notes on one app, calls on another, doubts in group chats with no continuous feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 3. THE PEERLOOP SOLUTION */}
      {/* ---------------------------------------------------- */}
      <section id="solution" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#FAFAF9]">
        <div className="max-w-6xl mx-auto space-y-14">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              The PeerLoop Model
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              One place to learn, help, and grow.
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              We unite peer-to-peer collaboration, targeted doubt solving, and AI learning assistance into a continuous loop.
            </p>
          </div>

          {/* Three Core Actions Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* LEARN */}
            <div className="p-7 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-lg font-bold text-stone-900">LEARN</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Find students and mentors who can help you understand a skill. Connect with students who recently passed the same courses with flying colors.
              </p>
            </div>

            {/* GET HELP */}
            <div className="p-7 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-lg font-bold text-stone-900">GET HELP</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Ask questions and quickly connect with someone who knows the topic. Choose 5, 10, 20, or 30 minute focused micro-sessions without scheduling friction.
              </p>
            </div>

            {/* TEACH */}
            <div className="p-7 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-lg font-bold text-stone-900">TEACH</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Share your knowledge, help other students, and build your reputation. Earn verified badges that showcase your teaching ability and deep technical clarity.
              </p>
            </div>
          </div>

          {/* Visual Core Loop Flywheel */}
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-6">
            <div className="text-center space-y-1">
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                The Engine
              </p>
              <h3 className="text-xl font-bold text-stone-900">The Continuous PeerLoop</h3>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold text-stone-800">
              <div className="px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-bold">
                LEARN
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" />
              <div className="px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-bold">
                GET HELP
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" />
              <div className="px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-bold">
                PRACTICE
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" />
              <div className="px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-bold">
                TEACH
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" />
              <div className="px-4 py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold">
                GROW
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 4. HOW PEERLOOP WORKS (5-Step Timeline) */}
      {/* ---------------------------------------------------- */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Simple 5-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              How PeerLoop Works
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              From signing up to teaching your first peer, here is how you turn confusion into confidence.
            </p>
          </div>

          {/* Desktop Horizontal Timeline / Mobile Vertical Timeline */}
          <div className="relative">
            {/* Desktop connecting hairline */}
            <div className="hidden lg:block absolute top-10 left-10 right-10 h-0.5 bg-stone-200 -z-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-4 relative z-10">
              {/* Step 1 */}
              <div className="p-5 rounded-2xl bg-[#FAFAF9] border border-stone-200 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-indigo-600 font-bold text-sm flex items-center justify-center font-mono shadow-xs">
                    01
                  </div>
                  <h3 className="text-sm font-bold text-stone-900">Create Your Profile</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Add your skills, interests, experience, learning goals, and availability.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-5 rounded-2xl bg-[#FAFAF9] border border-stone-200 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-indigo-600 font-bold text-sm flex items-center justify-center font-mono shadow-xs">
                    02
                  </div>
                  <h3 className="text-sm font-bold text-stone-900">Set Your Goals</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Tell PeerLoop what you want to learn or improve this semester.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-5 rounded-2xl bg-[#FAFAF9] border border-stone-200 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-indigo-600 font-bold text-sm flex items-center justify-center font-mono shadow-xs">
                    03
                  </div>
                  <h3 className="text-sm font-bold text-stone-900">Find the Right People</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    PeerLoop helps connect you with students who match your learning needs.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-5 rounded-2xl bg-[#FAFAF9] border border-stone-200 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-indigo-600 font-bold text-sm flex items-center justify-center font-mono shadow-xs">
                    04
                  </div>
                  <h3 className="text-sm font-bold text-stone-900">Learn Together</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Connect through peer-learning sessions, shared code, and discussions.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="p-5 rounded-2xl bg-[#FAFAF9] border border-stone-200 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-indigo-600 font-bold text-sm flex items-center justify-center font-mono shadow-xs">
                    05
                  </div>
                  <h3 className="text-sm font-bold text-stone-900">Give Back</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Teach others, help students, and build your learning reputation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 6. QUICK HELP (Interactive Feature Preview) */}
      {/* ---------------------------------------------------- */}
      <section id="quick-help" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#FAFAF9] border-t border-stone-200">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Fast Micro-Sessions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Stuck? Get help from someone who knows.
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Don’t wait days for office hours. Ask your exact doubt, pick a time budget, and connect in minutes.
            </p>
          </div>

          {/* Interactive Quick Help Card */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-md p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                What are you stuck on?
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={stuckTopic}
                  onChange={(e) => setStuckTopic(e.target.value)}
                  placeholder="e.g. I don't understand nested loops in Python."
                  className="w-full bg-[#FAFAF9] border border-stone-300 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Select Duration Pills */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Select Session Duration
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {[5, 10, 20, 30].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setSelectedDuration(dur)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedDuration === dur
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {dur} min
                  </button>
                ))}
              </div>
            </div>

            {/* Matching Mentors Grid */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-medium text-stone-700">Available Peer Mentors</span>
                <span>Sorted by topic relevance &amp; clarity</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mentor 1: Rahul */}
                <div className="p-4 rounded-xl border border-stone-200 bg-[#FAFAF9] hover:border-indigo-200 transition-all space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                        R
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-stone-900">Rahul — Python</h4>
                        <p className="text-xs text-stone-500">UC Berkeley · CS Major</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Available now
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-stone-600 font-mono tabular-nums">
                    <span>94% Match</span>
                    <span>·</span>
                    <span>⭐ 4.8</span>
                    <span>·</span>
                    <span>23 helped</span>
                  </div>
                </div>

                {/* Mentor 2: Ananya */}
                <div className="p-4 rounded-xl border border-stone-200 bg-[#FAFAF9] hover:border-indigo-200 transition-all space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">
                        A
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-stone-900">Ananya — Programming</h4>
                        <p className="text-xs text-stone-500">Stanford · Sophomore</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      Available in 10 min
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-stone-600 font-mono tabular-nums">
                    <span>89% Match</span>
                    <span>·</span>
                    <span>⭐ 4.7</span>
                    <span>·</span>
                    <span>18 helped</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Request Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-stone-500">
                PeerLoop automatically matches you with verified students who have proven mastery in this topic.
              </p>

              <button
                type="button"
                disabled={isRequesting || requestSent}
                onClick={handleQuickHelpRequest}
                className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer shrink-0 disabled:opacity-75 flex items-center justify-center gap-2"
              >
                {isRequesting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Matching with mentors...</span>
                  </>
                ) : requestSent ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Connected! Entering session...</span>
                  </>
                ) : (
                  <>
                    <span>Request Help ({selectedDuration}m)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 8. HUMAN + AI (Split Visual) */}
      {/* ---------------------------------------------------- */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section Heading */}
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              The Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Better learning happens when humans and AI work together.
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              AI supports the student and mentor behind the scenes—it never replaces the human learning experience.
            </p>
          </div>

          {/* Split Visual Container */}
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-center">
            {/* Left: HUMAN */}
            <div className="lg:col-span-5 p-7 rounded-2xl bg-[#FAFAF9] border border-stone-200 shadow-xs space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900">HUMAN</h3>
                  <p className="text-xs text-stone-500">The Student &amp; Mentor Connection</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-stone-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900">Real experience:</span> Knows exactly how the professor tests and where peers stumble.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900">Personal explanations:</span> Uses intuitive campus references, metaphors, and real-life parallels.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900">Encouragement &amp; empathy:</span> Calms exam anxiety and builds genuine learning confidence.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900">Context &amp; communication:</span> Adapts pacing when reading a peer&apos;s hesitation or confusion.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900">Different ways of explaining:</span> Shifts angles if one definition doesn&apos;t click immediately.
                  </div>
                </div>
              </div>
            </div>

            {/* Center Statement Bridge */}
            <div className="lg:col-span-1 text-center py-4 lg:py-0">
              <div className="inline-flex lg:flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white border border-stone-200 shadow-xs text-center">
                <span className="text-xs font-bold text-stone-900">+</span>
                <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">
                  Together
                </span>
              </div>
            </div>

            {/* Right: AI */}
            <div className="lg:col-span-5 p-7 rounded-2xl bg-[#FAFAF9] border border-stone-200 shadow-xs space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-800 flex items-center justify-center">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900">AI</h3>
                  <p className="text-xs text-stone-500">The Silent Learning Copilot</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-stone-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900">Quick clarification:</span> Instantly verifies facts, syntax rules, or formula definitions.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900">Real-time examples:</span> Generates code snippets and edge-case diagrams on the fly.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900">Practice questions:</span> Tailors test problems with subtle hints to verify understanding.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900">Session summaries:</span> Extracts key takeaways, mental models, and next steps automatically.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900">Learning recommendations:</span> Points learners to high-yield guides based on session roadblocks.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Statement Banner */}
          <div className="p-6 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-center max-w-xl mx-auto">
            <h4 className="text-base sm:text-lg font-bold text-indigo-950">
              &ldquo;Human connection + AI assistance.&rdquo;
            </h4>
            <p className="text-xs sm:text-sm text-indigo-700 mt-1">
              Technology handles note-taking, fact-checking, and matching so students can focus on talking, thinking, and solving.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* FINAL CALL TO ACTION */}
      {/* ---------------------------------------------------- */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#FAFAF9] border-t border-stone-200">
        <div className="max-w-4xl mx-auto p-8 sm:p-12 rounded-3xl bg-white border border-stone-200 shadow-sm text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Ready to learn faster with your peers?
          </h2>
          <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Join students from top universities who are mastering complex courses, helping others, and building authentic proof of what they know.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer"
            >
              Start Learning Today
            </button>
            <button
              onClick={() => onTestDrive(DEMO_USERS[0].id)}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
            >
              Explore Demo Experience
            </button>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 17. FOOTER */}
      {/* ---------------------------------------------------- */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Left Side: Brand & Tagline */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xl font-bold tracking-tight text-stone-900">PeerLoop</h3>
            <p className="text-sm text-stone-600 leading-relaxed max-w-sm">
              Learn from peers. Grow together.
            </p>
            <p className="text-xs text-stone-400">
              The AI-powered peer learning network for university students.
            </p>
          </div>

          {/* Nav Column 1: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>
                <button
                  onClick={() => (onNavigateToTab ? onNavigateToTab('learn') : onGetStarted())}
                  className="hover:text-stone-900 transition-colors"
                >
                  Learn
                </button>
              </li>
              <li>
                <button
                  onClick={() => (onNavigateToTab ? onNavigateToTab('teach') : onGetStarted())}
                  className="hover:text-stone-900 transition-colors"
                >
                  Teach
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('quick-help')}
                  className="hover:text-stone-900 transition-colors"
                >
                  Quick Help
                </button>
              </li>
              <li>
                <button
                  onClick={onGetStarted}
                  className="hover:text-stone-900 transition-colors"
                >
                  AI Copilot
                </button>
              </li>
            </ul>
          </div>

          {/* Nav Column 2: Community */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Community</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>
                <button
                  onClick={() => (onNavigateToTab ? onNavigateToTab('community') : onGetStarted())}
                  className="hover:text-stone-900 transition-colors"
                >
                  Community
                </button>
              </li>
              <li>
                <button
                  onClick={() => (onNavigateToTab ? onNavigateToTab('sessions') : onGetStarted())}
                  className="hover:text-stone-900 transition-colors"
                >
                  Sessions
                </button>
              </li>
              <li>
                <button
                  onClick={() => (onNavigateToTab ? onNavigateToTab('learn') : onGetStarted())}
                  className="hover:text-stone-900 transition-colors"
                >
                  Mentors
                </button>
              </li>
            </ul>
          </div>

          {/* Nav Column 3: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>
                <a href="#about" className="hover:text-stone-900 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="mailto:support@peerloop.edu" className="hover:text-stone-900 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-stone-900 transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-stone-900 transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 PeerLoop. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-stone-800 transition-colors">
              Privacy Policy
            </a>
            <span>·</span>
            <a href="#terms" className="hover:text-stone-800 transition-colors">
              Terms of Service
            </a>
            <span>·</span>
            <a href="#conduct" className="hover:text-stone-800 transition-colors">
              Community Guidelines
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
