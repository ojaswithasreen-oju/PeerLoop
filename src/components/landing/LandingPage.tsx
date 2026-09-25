import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Users,
  Zap,
  Star,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Menu,
  X,
  Shield,
  Layers,
  Repeat,
  Heart,
  UserCheck,
} from 'lucide-react';
import { DEMO_USERS } from '../../services/seedData';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onTestDrive: (userId: string) => void;
  onNavigateToTab?: (tab: string) => void;
  onOpenApp?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onSignIn,
  onTestDrive,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Quick Help Interactive Preview state
  const [selectedDuration, setSelectedDuration] = useState<number>(10);
  const [stuckTopic, setStuckTopic] = useState<string>(
    "I don't understand nested loops in Python."
  );
  const [quickHelpRequested, setQuickHelpRequested] = useState<boolean>(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRequestHelp = () => {
    setQuickHelpRequested(true);
    setTimeout(() => {
      onTestDrive(DEMO_USERS[0].id);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F6F4EE] text-[#202924] flex flex-col font-sans selection:bg-[#DCE6DE] selection:text-[#496456]">
      {/* ---------------------------------------------------- */}
      {/* 1. STICKY MINIMAL NAVBAR */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-50 w-full bg-[#F6F4EE]/90 backdrop-blur-md border-b border-[#E3E1D9] transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#496456] text-white flex items-center justify-center font-bold text-sm">
              P
            </div>
            <span className="text-xl font-bold tracking-tight text-[#202924]">
              PeerLoop
            </span>
          </div>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#69736D]">
            <button
              onClick={() => scrollTo('how-it-works')}
              className="hover:text-[#202924] transition-colors cursor-pointer"
            >
              How it Works
            </button>
            <button
              onClick={() => scrollTo('solution')}
              className="hover:text-[#202924] transition-colors cursor-pointer"
            >
              Learn
            </button>
            <button
              onClick={() => scrollTo('learning-loop')}
              className="hover:text-[#202924] transition-colors cursor-pointer"
            >
              Teach
            </button>
            <button
              onClick={() => scrollTo('human-ai')}
              className="hover:text-[#202924] transition-colors cursor-pointer"
            >
              Community
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onSignIn}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-[#202924] hover:bg-[#E3E1D9]/50 transition-colors cursor-pointer"
            >
              Log in
            </button>
            <button
              onClick={onGetStarted}
              className="px-4 py-2 rounded-lg bg-[#496456] hover:bg-[#3d5347] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              Get Started
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#202924] hover:bg-[#E3E1D9]/50 rounded-lg cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#E3E1D9] bg-[#F6F4EE] px-4 py-4 space-y-3">
            <button
              onClick={() => scrollTo('how-it-works')}
              className="block w-full text-left py-2 text-sm font-medium text-[#202924]"
            >
              How it Works
            </button>
            <button
              onClick={() => scrollTo('solution')}
              className="block w-full text-left py-2 text-sm font-medium text-[#202924]"
            >
              Learn
            </button>
            <button
              onClick={() => scrollTo('learning-loop')}
              className="block w-full text-left py-2 text-sm font-medium text-[#202924]"
            >
              Teach
            </button>
            <button
              onClick={() => scrollTo('human-ai')}
              className="block w-full text-left py-2 text-sm font-medium text-[#202924]"
            >
              Community
            </button>
            <div className="pt-3 border-t border-[#E3E1D9] flex gap-3">
              <button
                onClick={onSignIn}
                className="flex-1 py-2 text-center text-xs font-semibold border border-[#E3E1D9] rounded-lg"
              >
                Log in
              </button>
              <button
                onClick={onGetStarted}
                className="flex-1 py-2 text-center text-xs font-semibold bg-[#496456] text-white rounded-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ---------------------------------------------------- */}
      {/* 2. HERO SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="pt-16 pb-16 sm:pt-24 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCE6DE] text-[#496456] text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Peer Learning Platform</span>
          </span>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#202924] leading-[1.12] tracking-tight">
            Learn from someone who's been where you are.
          </h1>

          <p className="text-base sm:text-lg text-[#69736D] leading-relaxed max-w-2xl mx-auto font-sans">
            PeerLoop helps students learn from peers, get quick help, teach what they know, and grow through meaningful learning experiences.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={onGetStarted}
              className="px-6 py-3 rounded-xl bg-[#496456] hover:bg-[#3d5347] text-white text-sm font-semibold transition-colors cursor-pointer shadow-sm flex items-center gap-2"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onGetStarted}
              className="px-6 py-3 rounded-xl bg-white hover:bg-[#F6F4EE] border border-[#E3E1D9] text-[#202924] text-sm font-semibold transition-colors cursor-pointer"
            >
              Become a Mentor
            </button>
          </div>
        </div>

        {/* Realistic Product UI Preview with Floating Elements */}
        <div className="mt-14 relative max-w-5xl mx-auto">
          {/* Floating Pill 1 (Top Left) */}
          <div className="hidden md:flex absolute -top-4 -left-6 z-20 items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white border border-[#E3E1D9] shadow-md text-xs font-medium text-[#202924] animate-bounce [animation-duration:5s]">
            <div className="w-2 h-2 rounded-full bg-[#496456]" />
            <span>Rahul accepted doubt request in 2m</span>
          </div>

          {/* Floating Pill 2 (Top Right) */}
          <div className="hidden md:flex absolute -top-3 -right-6 z-20 items-center gap-2 px-3.5 py-2 rounded-xl bg-[#DCE6DE] border border-[#496456]/20 shadow-md text-xs font-semibold text-[#496456]">
            <Star className="w-3.5 h-3.5 fill-current text-[#C9825B]" />
            <span>96% Concept Clarity Rating</span>
          </div>

          {/* Floating Pill 3 (Bottom Left) */}
          <div className="hidden md:flex absolute -bottom-4 -left-4 z-20 items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#E3E1D9] shadow-md text-xs font-medium text-[#202924]">
            <Sparkles className="w-3.5 h-3.5 text-[#C9825B]" />
            <span>AI Copilot: Analogy Anchor suggested</span>
          </div>

          {/* Main Dashboard Preview Container */}
          <div className="rounded-2xl border border-[#E3E1D9] bg-white shadow-xl overflow-hidden">
            {/* Mock Window Header */}
            <div className="h-10 px-4 bg-[#F6F4EE] border-b border-[#E3E1D9] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E3E1D9]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#E3E1D9]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#E3E1D9]" />
              </div>
              <span className="text-[11px] font-mono text-[#69736D]">
                peerloop.edu/workspace
              </span>
              <div className="text-[10px] font-semibold text-[#496456] bg-[#DCE6DE] px-2 py-0.5 rounded">
                Live Prototype
              </div>
            </div>

            {/* Dashboard Content Grid */}
            <div className="p-5 sm:p-6 bg-[#F6F4EE] space-y-4">
              {/* Header Greeting */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#202924]">
                    Good morning, Ojaswitha
                  </h3>
                  <p className="text-xs text-[#69736D]">
                    “What would you like to work on today?”
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#496456] bg-white px-2.5 py-1 rounded-md border border-[#E3E1D9]">
                  <span>Streak: 7 Days 🔥</span>
                </div>
              </div>

              {/* Bento Grid: 4 realistic cards */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* 1. Continue Learning (7 cols) */}
                <div className="md:col-span-7 p-4 rounded-xl bg-white border border-[#E3E1D9] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#DCE6DE] text-[#496456]">
                      Continue Learning
                    </span>
                    <span className="text-xs font-mono font-bold text-[#496456]">
                      68%
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#202924]">
                      Python — Nested Loops
                    </h4>
                    <p className="text-xs text-[#69736D] mt-0.5">
                      Last reviewed 2D matrix traversal with Rahul.
                    </p>
                  </div>
                  <div className="w-full bg-[#F6F4EE] h-2 rounded-full overflow-hidden border border-[#E3E1D9]">
                    <div className="h-full bg-[#496456] w-[68%] rounded-full" />
                  </div>
                  <div className="pt-1 flex items-center justify-between text-xs">
                    <span className="text-[#69736D]">Topic 4 of 6</span>
                    <button
                      onClick={() => onTestDrive(DEMO_USERS[0].id)}
                      className="text-[#496456] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* 2. Quick Help Card (5 cols) */}
                <div className="md:col-span-5 p-4 rounded-xl bg-[#F1DED3]/40 border border-[#C9825B]/30 flex flex-col justify-between space-y-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F1DED3] text-[#C9825B]">
                      Quick Help
                    </span>
                    <h4 className="text-sm font-bold text-[#202924]">
                      Stuck on something?
                    </h4>
                    <p className="text-xs text-[#69736D]">
                      Find someone who can help in a 5-30m sync.
                    </p>
                  </div>
                  <button
                    onClick={() => onTestDrive(DEMO_USERS[0].id)}
                    className="w-full py-2 rounded-lg bg-[#496456] hover:bg-[#3d5347] text-white text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Get Help Now
                  </button>
                </div>

                {/* 3. Mentor Recommendation (6 cols) */}
                <div className="md:col-span-6 p-4 rounded-xl bg-white border border-[#E3E1D9] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80"
                      alt="Rahul"
                      className="w-10 h-10 rounded-xl object-cover border border-[#E3E1D9]"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h5 className="text-xs font-bold text-[#202924]">Rahul</h5>
                        <span className="text-[10px] text-[#496456] bg-[#DCE6DE] px-1.5 py-0.2 rounded font-mono font-bold">
                          94% Match
                        </span>
                      </div>
                      <p className="text-[11px] text-[#69736D]">
                        Python Mentor • ⭐ 4.8
                      </p>
                      <span className="text-[10px] text-[#387B62] font-medium">
                        ● Available now
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onTestDrive(DEMO_USERS[0].id)}
                    className="px-3 py-1.5 rounded-lg bg-[#496456] hover:bg-[#3d5347] text-white text-xs font-semibold cursor-pointer shrink-0"
                  >
                    Connect
                  </button>
                </div>

                {/* 4. Upcoming Session & Subtle Copilot (6 cols) */}
                <div className="md:col-span-6 p-4 rounded-xl bg-white border border-[#E3E1D9] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#202924] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#496456]" />
                      <span>Python · Today · 6:30 PM</span>
                    </span>
                    <span className="text-[10px] text-[#496456] font-semibold bg-[#DCE6DE] px-2 py-0.5 rounded">
                      Confirmed
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F6F4EE] border border-[#E3E1D9] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-[#496456] uppercase">AI Copilot</span>
                      <p className="text-[11px] text-[#69736D]">“Want a simpler explanation?”</p>
                    </div>
                    <div className="flex gap-1 text-[10px]">
                      <span className="px-2 py-0.5 bg-white border border-[#E3E1D9] rounded text-[#202924]">Explain</span>
                      <span className="px-2 py-0.5 bg-white border border-[#E3E1D9] rounded text-[#202924]">Practice</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 3. PROBLEM SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="py-20 border-t border-[#E3E1D9] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#496456]">
              The Problem
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#202924] mt-2">
              Learning shouldn't stop when class ends.
            </h2>
            <p className="text-sm text-[#69736D] mt-2 leading-relaxed font-sans">
              Traditional classrooms give lectures, but mastery happens in the messy gaps between lectures, homework doubts, and late-night projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Problem 1 */}
            <div className="p-6 rounded-2xl bg-[#F6F4EE] border border-[#E3E1D9] flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-mono text-[#69736D]">01</span>
                <h3 className="text-base font-bold text-[#202924] mt-2">
                  Stuck on a concept
                </h3>
              </div>
              <blockquote className="text-sm text-[#69736D] italic border-l-2 border-[#496456] pl-3 leading-relaxed">
                “I understand the theory, but I still can't solve it.”
              </blockquote>
            </div>

            {/* Problem 2 */}
            <div className="p-6 rounded-2xl bg-[#F6F4EE] border border-[#E3E1D9] flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-mono text-[#69736D]">02</span>
                <h3 className="text-base font-bold text-[#202924] mt-2">
                  Don't know who to ask
                </h3>
              </div>
              <blockquote className="text-sm text-[#69736D] italic border-l-2 border-[#496456] pl-3 leading-relaxed">
                “Someone probably knows the answer, but who?”
              </blockquote>
            </div>

            {/* Problem 3 */}
            <div className="p-6 rounded-2xl bg-[#F6F4EE] border border-[#E3E1D9] flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-mono text-[#69736D]">03</span>
                <h3 className="text-base font-bold text-[#202924] mt-2">
                  Want to teach
                </h3>
              </div>
              <blockquote className="text-sm text-[#69736D] italic border-l-2 border-[#496456] pl-3 leading-relaxed">
                “I know something that could help someone else.”
              </blockquote>
            </div>

            {/* Problem 4 */}
            <div className="p-6 rounded-2xl bg-[#F6F4EE] border border-[#E3E1D9] flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-mono text-[#69736D]">04</span>
                <h3 className="text-base font-bold text-[#202924] mt-2">
                  Learning feels disconnected
                </h3>
              </div>
              <blockquote className="text-sm text-[#69736D] italic border-l-2 border-[#496456] pl-3 leading-relaxed">
                “Classes, doubts, practice, and people are all separate.”
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 4. SOLUTION */}
      {/* ---------------------------------------------------- */}
      <section id="solution" className="py-20 border-t border-[#E3E1D9] bg-[#F6F4EE]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#496456]">
              The Solution
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#202924] mt-2">
              One place to learn, help, and grow.
            </h2>
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full bg-white border border-[#E3E1D9] text-xs font-semibold text-[#496456]">
              <span>Learn</span>
              <span>→</span>
              <span>Practice</span>
              <span>→</span>
              <span>Teach</span>
              <span>→</span>
              <span>Grow</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* LEARN */}
            <div className="p-8 rounded-2xl bg-white border border-[#E3E1D9] space-y-4 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#DCE6DE] text-[#496456] flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#202924]">
                LEARN
              </h3>
              <p className="text-sm text-[#69736D] leading-relaxed">
                Discover skills and people who can help you learn. Follow curated skill paths from fundamentals to advanced projects.
              </p>
            </div>

            {/* GET HELP */}
            <div className="p-8 rounded-2xl bg-white border border-[#E3E1D9] space-y-4 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#F1DED3] text-[#C9825B] flex items-center justify-center font-bold">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#202924]">
                GET HELP
              </h3>
              <p className="text-sm text-[#69736D] leading-relaxed">
                Find peers who understand what you're struggling with. Never stay blocked on a homework question or algorithm error for hours.
              </p>
            </div>

            {/* TEACH */}
            <div className="p-8 rounded-2xl bg-white border border-[#E3E1D9] space-y-4 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#DCE6DE] text-[#496456] flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#202924]">
                TEACH
              </h3>
              <p className="text-sm text-[#69736D] leading-relaxed">
                Share your knowledge and help someone else grow. Teaching solidifies what you know while building your verified campus reputation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 5. HOW PEERLOOP WORKS (5-Step Visual Timeline) */}
      {/* ---------------------------------------------------- */}
      <section id="how-it-works" className="py-20 border-t border-[#E3E1D9] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#496456]">
              Step-by-step
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#202924] mt-2">
              How PeerLoop Works
            </h2>
            <p className="text-sm text-[#69736D] mt-2">
              A transparent, supportive loop connecting students at every level.
            </p>
          </div>

          {/* Clean 5-Step Visual Timeline */}
          <div className="relative">
            {/* Connecting horizontal line on desktop */}
            <div className="hidden lg:block absolute top-6 left-6 right-6 h-0.5 bg-[#E3E1D9]" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
              {/* Step 1 */}
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white border-2 border-[#496456] text-[#496456] font-mono font-bold text-sm flex items-center justify-center shadow-xs">
                  01
                </div>
                <h4 className="text-sm font-bold text-[#202924]">
                  Create your profile
                </h4>
                <p className="text-xs text-[#69736D] leading-relaxed">
                  Add skills, interests, goals, and availability.
                </p>
              </div>

              {/* Step 2 */}
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white border-2 border-[#496456] text-[#496456] font-mono font-bold text-sm flex items-center justify-center shadow-xs">
                  02
                </div>
                <h4 className="text-sm font-bold text-[#202924]">
                  Set your goals
                </h4>
                <p className="text-xs text-[#69736D] leading-relaxed">
                  Tell PeerLoop what you want to learn.
                </p>
              </div>

              {/* Step 3 */}
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white border-2 border-[#496456] text-[#496456] font-mono font-bold text-sm flex items-center justify-center shadow-xs">
                  03
                </div>
                <h4 className="text-sm font-bold text-[#202924]">
                  Find the right people
                </h4>
                <p className="text-xs text-[#69736D] leading-relaxed">
                  Discover compatible peers and mentors.
                </p>
              </div>

              {/* Step 4 */}
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white border-2 border-[#496456] text-[#496456] font-mono font-bold text-sm flex items-center justify-center shadow-xs">
                  04
                </div>
                <h4 className="text-sm font-bold text-[#202924]">
                  Learn together
                </h4>
                <p className="text-xs text-[#69736D] leading-relaxed">
                  Connect through sessions and discussions.
                </p>
              </div>

              {/* Step 5 */}
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white border-2 border-[#496456] text-[#496456] font-mono font-bold text-sm flex items-center justify-center shadow-xs">
                  05
                </div>
                <h4 className="text-sm font-bold text-[#202924]">
                  Give back
                </h4>
                <p className="text-xs text-[#69736D] leading-relaxed">
                  Teach others and build your reputation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 6. QUICK HELP PREVIEW (Interactive) */}
      {/* ---------------------------------------------------- */}
      <section className="py-20 border-t border-[#E3E1D9] bg-[#F6F4EE]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C9825B]">
              Real-time Micro-Mentoring
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#202924] mt-2">
              Quick Help in Action
            </h2>
            <p className="text-sm text-[#69736D] mt-2">
              Ask your exact doubt, pick a time budget, and connect with someone who knows it.
            </p>
          </div>

          {/* Interactive Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E3E1D9] shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-[#202924] mb-2">
                What are you stuck on?
              </label>
              <input
                type="text"
                value={stuckTopic}
                onChange={(e) => setStuckTopic(e.target.value)}
                className="w-full bg-[#F6F4EE] border border-[#E3E1D9] rounded-xl px-4 py-3 text-sm text-[#202924] focus:outline-none focus:border-[#496456]"
              />
            </div>

            {/* Duration Select */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#69736D]">
                Select Duration:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 20, 30].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setSelectedDuration(dur)}
                    className={`py-2 rounded-lg text-xs font-semibold font-mono transition-colors cursor-pointer text-center ${
                      selectedDuration === dur
                        ? 'bg-[#496456] text-white'
                        : 'bg-[#F6F4EE] text-[#69736D] hover:text-[#202924] border border-[#E3E1D9]'
                    }`}
                  >
                    {dur} min
                  </button>
                ))}
              </div>
            </div>

            {/* Matched Mentor Result Preview */}
            <div className="p-4 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80"
                  alt="Rahul"
                  className="w-12 h-12 rounded-xl object-cover border border-[#E3E1D9]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#202924]">Rahul — Python</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#DCE6DE] text-[#496456]">
                      94% Match
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#69736D] mt-0.5 font-mono">
                    <span className="text-[#C9825B] font-bold">⭐ 4.8</span>
                    <span>•</span>
                    <span className="text-[#387B62] font-semibold">Available now</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleRequestHelp}
                className="px-5 py-2.5 rounded-xl bg-[#496456] hover:bg-[#3d5347] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>{quickHelpRequested ? 'Connecting...' : 'Request Help →'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 7. HUMAN + AI COMPARISON */}
      {/* ---------------------------------------------------- */}
      <section id="human-ai" className="py-20 border-t border-[#E3E1D9] bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#496456]">
              Co-Intelligence Architecture
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#202924] mt-2">
              Better learning happens together.
            </h2>
            <p className="text-sm text-[#69736D] mt-2">
              AI supports the human learning relationship rather than replacing people.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* PEOPLE COLUMN */}
            <div className="p-7 rounded-2xl bg-[#F6F4EE] border border-[#E3E1D9] space-y-4">
              <div className="w-9 h-9 rounded-lg bg-[#DCE6DE] text-[#496456] flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#202924]">
                PEOPLE
              </h3>
              <ul className="space-y-2.5 text-xs text-[#202924]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#387B62]" />
                  <span>Real student experience</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#387B62]" />
                  <span>Personal explanation &amp; nuance</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#387B62]" />
                  <span>Encouragement &amp; empathy</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#387B62]" />
                  <span>Campus &amp; course context</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#387B62]" />
                  <span>Two-way communication</span>
                </li>
              </ul>
            </div>

            {/* CENTER CONNECTOR */}
            <div className="p-6 rounded-2xl bg-[#496456] text-white text-center space-y-3 shadow-md">
              <Sparkles className="w-7 h-7 mx-auto text-[#DCE6DE]" />
              <h4 className="font-serif text-lg font-bold">
                Human connection + AI assistance
              </h4>
              <p className="text-xs text-[#DCE6DE] leading-relaxed">
                Peers provide the empathy and intuitive mental model. AI handles summaries, practice questions, and real-time clarifications.
              </p>
            </div>

            {/* AI COLUMN */}
            <div className="p-7 rounded-2xl bg-[#F6F4EE] border border-[#E3E1D9] space-y-4">
              <div className="w-9 h-9 rounded-lg bg-[#F1DED3] text-[#C9825B] flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#202924]">
                AI
              </h3>
              <ul className="space-y-2.5 text-xs text-[#202924]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9825B]" />
                  <span>Instant clarifications</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9825B]" />
                  <span>Contextual code examples</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9825B]" />
                  <span>Retention practice checkpoints</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9825B]" />
                  <span>Post-session summaries</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9825B]" />
                  <span>Tailored mentor recommendations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 8. LEARNING LOOP (Distinctive Continuous Loop Visual) */}
      {/* ---------------------------------------------------- */}
      <section id="learning-loop" className="py-20 border-t border-[#E3E1D9] bg-[#F6F4EE]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#496456]">
              The PeerLoop Identity
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#202924] mt-2">
              The Continuous Learning Loop
            </h2>
            <p className="text-sm text-[#69736D] mt-2">
              Learning is not a one-way street. When students alternate between learning and teaching, deep mastery follows naturally.
            </p>
          </div>

          {/* Continuous Loop Flow Cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {[
              { step: '01', title: 'LEARN', desc: 'Acquire new skills & concepts' },
              { step: '02', title: 'GET HELP', desc: 'Overcome immediate hurdles' },
              { step: '03', title: 'PRACTICE', desc: 'Solve real-world checkpoints' },
              { step: '04', title: 'TEACH', desc: 'Share insights with peers' },
              { step: '05', title: 'BUILD REPUTATION', desc: 'Earn verified quality scores' },
              { step: '06', title: 'LEARN MORE', desc: 'Level up to advanced topics' },
            ].map((node, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white border border-[#E3E1D9] flex flex-col justify-between space-y-2 relative shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#496456]">
                    {node.step}
                  </span>
                  {i < 5 && (
                    <span className="hidden md:inline text-xs text-[#69736D]">→</span>
                  )}
                  {i === 5 && (
                    <Repeat className="w-3 h-3 text-[#496456]" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#202924]">{node.title}</h4>
                  <p className="text-[11px] text-[#69736D] mt-0.5 leading-snug">
                    {node.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 9. FINAL CTA */}
      {/* ---------------------------------------------------- */}
      <section className="py-20 border-t border-[#E3E1D9] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-5xl text-[#202924] leading-tight">
            Someone out there knows what you're trying to learn.
          </h2>
          <p className="text-base sm:text-lg text-[#69736D] max-w-xl mx-auto font-sans">
            And someone else might need what you already know.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onGetStarted}
              className="px-6 py-3 rounded-xl bg-[#496456] hover:bg-[#3d5347] text-white text-sm font-semibold transition-colors cursor-pointer shadow-sm flex items-center gap-2"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onGetStarted}
              className="px-6 py-3 rounded-xl bg-[#F6F4EE] hover:bg-[#E3E1D9] border border-[#E3E1D9] text-[#202924] text-sm font-semibold transition-colors cursor-pointer"
            >
              Become a Mentor
            </button>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 10. LANDING PAGE FOOTER */}
      {/* ---------------------------------------------------- */}
      <footer className="border-t border-[#E3E1D9] bg-[#F6F4EE] py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#496456] text-white flex items-center justify-center font-bold text-xs">
                  P
                </div>
                <span className="text-lg font-bold text-[#202924]">PeerLoop</span>
              </div>
              <p className="text-xs text-[#69736D] max-w-xs leading-relaxed">
                Learn from peers. Grow together.
              </p>
            </div>

            {/* Product */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#202924]">
                Product
              </h5>
              <ul className="space-y-1.5 text-xs text-[#69736D]">
                <li><button onClick={onGetStarted} className="hover:text-[#202924]">Learn</button></li>
                <li><button onClick={onGetStarted} className="hover:text-[#202924]">Teach</button></li>
                <li><button onClick={onGetStarted} className="hover:text-[#202924]">Quick Help</button></li>
                <li><button onClick={onGetStarted} className="hover:text-[#202924]">Sessions</button></li>
              </ul>
            </div>

            {/* Community */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#202924]">
                Community
              </h5>
              <ul className="space-y-1.5 text-xs text-[#69736D]">
                <li><button onClick={onGetStarted} className="hover:text-[#202924]">Community</button></li>
                <li><button onClick={onGetStarted} className="hover:text-[#202924]">Mentors</button></li>
                <li><button onClick={onGetStarted} className="hover:text-[#202924]">Resources</button></li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#202924]">
                Company
              </h5>
              <ul className="space-y-1.5 text-xs text-[#69736D]">
                <li><span className="hover:text-[#202924] cursor-pointer">About</span></li>
                <li><span className="hover:text-[#202924] cursor-pointer">Contact</span></li>
                <li><span className="hover:text-[#202924] cursor-pointer">Privacy</span></li>
                <li><span className="hover:text-[#202924] cursor-pointer">Terms</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-[#E3E1D9] flex flex-col sm:flex-row items-center justify-between text-xs text-[#69736D] gap-2">
            <span>© 2026 PeerLoop. All rights reserved.</span>
            <span>Designed for student peer learning &amp; growth.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
