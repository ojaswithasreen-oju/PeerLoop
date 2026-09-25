import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppSidebar } from './components/layout/AppSidebar';
import { AppTopBar } from './components/layout/AppTopBar';
import { MobileNav } from './components/layout/MobileNav';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { LearnDiscovery } from './components/learn/LearnDiscovery';
import { QuickHelpView } from './components/quickhelp/QuickHelpView';
import { MentorPortal } from './components/teach/MentorPortal';
import { SessionsList } from './components/session/SessionsList';
import { CommunityFeed } from './components/community/CommunityFeed';
import { ProgressView } from './components/profile/ProgressView';
import { StudentProfileView } from './components/profile/StudentProfileView';
import { SavedResourcesView } from './components/resources/SavedResourcesView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { SettingsView } from './components/settings/SettingsView';
import { SessionRoom } from './components/session/SessionRoom';
import { QuickDoubtModal } from './components/learn/QuickDoubtModal';
import { StudentProfileModal } from './components/profile/StudentProfileModal';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { store } from './services/storeService';
import { LearningSession, UserProfile } from './types';
import { CheckCircle2, X } from 'lucide-react';

const TAB_TO_PATH: Record<string, string> = {
  dashboard: '/home',
  home: '/home',
  learn: '/learn',
  'quick-help': '/quick-help',
  sessions: '/sessions',
  teach: '/teach',
  community: '/community',
  profile: '/profile',
  progress: '/progress',
  settings: '/settings',
  saved: '/saved',
  notifications: '/notifications',
  onboarding: '/onboarding',
};

const PATH_TO_TAB: Record<string, string> = {
  '/home': 'dashboard',
  '/dashboard': 'dashboard',
  '/learn': 'learn',
  '/quick-help': 'quick-help',
  '/sessions': 'sessions',
  '/teach': 'teach',
  '/community': 'community',
  '/profile': 'profile',
  '/progress': 'progress',
  '/settings': 'settings',
  '/saved': 'saved',
  '/notifications': 'notifications',
  '/onboarding': 'onboarding',
};

const normalizePath = (path: string): string => {
  const p = path.toLowerCase().replace(/\/+$/, '') || '/';
  return p;
};

const isProtectedPath = (path: string): boolean => {
  const norm = normalizePath(path);
  return Boolean(PATH_TO_TAB[norm]);
};

const AppContent: React.FC = () => {
  const {
    currentUser,
    isLoading,
    logoutMessage,
    clearLogoutMessage,
    switchDemoUser,
  } = useAuth();

  const [currentPath, setCurrentPath] = useState<string>(() =>
    normalizePath(window.location.pathname)
  );
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => {
    const initialPath = normalizePath(window.location.pathname);
    return initialPath === '/login' || initialPath === '/signup';
  });

  // Authenticated workspace states
  const [activeSession, setActiveSession] = useState<LearningSession | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isQuickDoubtOpen, setIsQuickDoubtOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Auto-dismiss logout message after 5 seconds
  useEffect(() => {
    if (logoutMessage) {
      const timer = setTimeout(() => {
        clearLogoutMessage();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [logoutMessage, clearLogoutMessage]);

  // Handle browser Back/Forward (popstate event)
  useEffect(() => {
    const handlePopState = () => {
      const norm = normalizePath(window.location.pathname);

      if (!currentUser) {
        // Enforce Requirement 6 & 7: User cannot access protected routes via Back button after logout
        if (isProtectedPath(norm) || (norm !== '/' && norm !== '/login' && norm !== '/signup')) {
          window.history.replaceState(null, '', '/');
          setCurrentPath('/');
          setIsAuthModalOpen(false);
        } else if (norm === '/login') {
          setCurrentPath('/login');
          setAuthModalMode('login');
          setIsAuthModalOpen(true);
        } else if (norm === '/signup') {
          setCurrentPath('/signup');
          setAuthModalMode('signup');
          setIsAuthModalOpen(true);
        } else {
          setCurrentPath('/');
          setIsAuthModalOpen(false);
        }
      } else {
        // Authenticated user
        if (currentUser.profileCompleted === false) {
          // If onboarding is incomplete, prevent access to dashboard and enforce /onboarding
          if (norm !== '/onboarding') {
            window.history.replaceState(null, '', '/onboarding');
            setCurrentPath('/onboarding');
          } else {
            setCurrentPath('/onboarding');
          }
        } else {
          // User profile is completed
          if (norm === '/' || norm === '/login' || norm === '/signup') {
            window.history.replaceState(null, '', '/home');
            setCurrentPath('/home');
          } else if (isProtectedPath(norm)) {
            setCurrentPath(norm);
          } else {
            window.history.replaceState(null, '', '/home');
            setCurrentPath('/home');
          }
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentUser]);

  // Enforce route protection and redirects when auth status or path changes
  useEffect(() => {
    if (isLoading) return;

    const norm = normalizePath(window.location.pathname);

    if (!currentUser) {
      // User is logged out / unauthenticated
      if (isProtectedPath(norm) || (norm !== '/' && norm !== '/login' && norm !== '/signup')) {
        // Immediately redirect to landing page '/'
        window.history.replaceState(null, '', '/');
        setCurrentPath('/');
        setIsAuthModalOpen(false);
      } else if (norm === '/login') {
        setCurrentPath('/login');
        setAuthModalMode('login');
        setIsAuthModalOpen(true);
      } else if (norm === '/signup') {
        setCurrentPath('/signup');
        setAuthModalMode('signup');
        setIsAuthModalOpen(true);
      } else {
        setCurrentPath('/');
      }
    } else {
      // User is authenticated
      setIsAuthModalOpen(false);

      if (currentUser.profileCompleted === false) {
        // Prevent access to main dashboard and redirect to /onboarding
        if (norm !== '/onboarding') {
          window.history.replaceState(null, '', '/onboarding');
          setCurrentPath('/onboarding');
        } else {
          setCurrentPath('/onboarding');
        }
      } else {
        // profileCompleted === true
        if (norm === '/' || norm === '/login' || norm === '/signup') {
          window.history.replaceState(null, '', '/home');
          setCurrentPath('/home');
        } else if (isProtectedPath(norm) || norm === '/onboarding') {
          setCurrentPath(norm);
        } else {
          window.history.replaceState(null, '', '/home');
          setCurrentPath('/home');
        }
      }
    }
  }, [currentUser, isLoading]);

  // View student profile modal trigger
  const handleViewProfile = async (userId: string) => {
    const profile = await store.getProfile(userId);
    if (profile) {
      setSelectedProfile(profile);
      setIsProfileModalOpen(true);
    }
  };

  // Authenticated tab navigation
  const handleNavigateTab = (tab: string) => {
    const targetPath = TAB_TO_PATH[tab] || '/home';
    window.history.pushState(null, '', targetPath);
    setCurrentPath(targetPath);
  };

  // Public landing actions
  const handleOpenLogin = () => {
    window.history.pushState(null, '', '/login');
    setCurrentPath('/login');
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const handleOpenSignup = () => {
    window.history.pushState(null, '', '/signup');
    setCurrentPath('/signup');
    setAuthModalMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
    if (!currentUser) {
      window.history.replaceState(null, '', '/');
      setCurrentPath('/');
    }
  };

  const handleTestDrive = (userId: string) => {
    switchDemoUser(userId);
    window.history.replaceState(null, '', '/home');
    setCurrentPath('/home');
  };

  // Minimal loading view during initial session check
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F8F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#3F6B5B]/30 border-t-[#3F6B5B] rounded-full animate-spin" />
          <span className="text-xs text-[#6B7280] font-medium tracking-wide">
            Loading PeerLoop...
          </span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // PUBLIC FLOW: Unauthenticated User -> Landing Page ('/', '/login', '/signup')
  // -------------------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] relative font-sans">
        {/* Logout Confirmation Toast */}
        {logoutMessage && (
          <div
            role="status"
            aria-live="polite"
            className="fixed top-5 right-5 sm:right-8 z-50 flex items-center gap-3 px-4 py-3 bg-[#111827] text-white border border-emerald-500/40 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-medium text-slate-100">{logoutMessage}</span>
            <button
              onClick={clearLogoutMessage}
              className="ml-2 text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
              aria-label="Dismiss message"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Existing Public-Facing PeerLoop Landing Page */}
        <LandingPage
          onGetStarted={handleOpenSignup}
          onSignIn={handleOpenLogin}
          onTestDrive={handleTestDrive}
          onNavigateToTab={() => handleOpenSignup()}
        />

        {/* Auth Modal for Login and Signup */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={handleCloseAuthModal}
          defaultMode={authModalMode}
        />
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // ONBOARDING GATE: If profileCompleted === false, enforce onboarding wizard
  // -------------------------------------------------------------------------
  if (currentUser && (currentUser.profileCompleted === false || currentPath === '/onboarding')) {
    return (
      <OnboardingFlow
        onComplete={() => {
          window.history.replaceState(null, '', '/home');
          setCurrentPath('/home');
        }}
      />
    );
  }

  // -------------------------------------------------------------------------
  // PROTECTED FLOW: Authenticated User -> Workspaces (/home, /learn, etc.)
  // -------------------------------------------------------------------------
  const currentTab = PATH_TO_TAB[currentPath] || 'dashboard';

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#1F2933] flex flex-col md:flex-row pb-16 md:pb-0 overflow-x-hidden font-sans">
      {/* Optional Top Toast if message still active */}
      {logoutMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 right-5 sm:right-8 z-50 flex items-center gap-3 px-4 py-3 bg-[#1F2933] text-white border border-[#3F6B5B]/40 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <CheckCircle2 className="w-5 h-5 text-[#387B62] shrink-0" />
          <span className="text-sm font-medium text-slate-100">{logoutMessage}</span>
          <button
            onClick={clearLogoutMessage}
            className="ml-2 text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            aria-label="Dismiss message"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. LEFT PERSISTENT SIDEBAR */}
      <AppSidebar
        currentTab={currentTab}
        onNavigate={handleNavigateTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        unreadCount={2}
      />

      {/* 2. MAIN APPLICATION CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#F7F8F5]">
        {/* Top App Bar */}
        <AppTopBar
          currentTab={currentTab}
          onNavigate={handleNavigateTab}
          onOpenQuickHelp={() => handleNavigateTab('quick-help')}
          onSearch={() => {
            handleNavigateTab('learn');
          }}
        />

        {/* View Switcher Container */}
        <main className="flex-1 bg-[#F7F8F5] overflow-y-auto">
          {currentTab === 'dashboard' && (
            <HomeDashboard
              onNavigate={handleNavigateTab}
              onOpenQuickDoubt={() => handleNavigateTab('quick-help')}
              onStartSession={(sess) => setActiveSession(sess)}
              onViewProfile={handleViewProfile}
            />
          )}

          {currentTab === 'learn' && (
            <LearnDiscovery
              onOpenQuickDoubt={() => handleNavigateTab('quick-help')}
              onStartSession={(sess) => setActiveSession(sess)}
              onViewProfile={handleViewProfile}
            />
          )}

          {currentTab === 'quick-help' && (
            <QuickHelpView
              onStartSession={(sess) => setActiveSession(sess)}
              onViewProfile={handleViewProfile}
            />
          )}

          {currentTab === 'sessions' && (
            <SessionsList
              onJoinSession={(sess) => setActiveSession(sess)}
              onOpenQuickDoubt={() => handleNavigateTab('quick-help')}
            />
          )}

          {currentTab === 'teach' && (
            <MentorPortal
              onStartSession={(sess) => setActiveSession(sess)}
              onOpenQuickDoubt={() => handleNavigateTab('quick-help')}
            />
          )}

          {currentTab === 'community' && (
            <CommunityFeed
              onStartSession={(sess) => setActiveSession(sess)}
            />
          )}

          {currentTab === 'progress' && <ProgressView />}

          {currentTab === 'saved' && <SavedResourcesView />}

          {currentTab === 'notifications' && <NotificationsView />}

          {currentTab === 'profile' && <StudentProfileView />}

          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* 3. MOBILE BOTTOM NAVIGATION */}
      <MobileNav currentTab={currentTab} onNavigate={handleNavigateTab} />

      {/* 4. FULLSCREEN 1-ON-1 SESSION WORKSPACE */}
      {activeSession && (
        <SessionRoom
          session={activeSession}
          onLeaveSession={() => {
            setActiveSession(null);
            handleNavigateTab('sessions');
          }}
        />
      )}

      {/* 5. MODALS */}
      <QuickDoubtModal
        isOpen={isQuickDoubtOpen}
        onClose={() => setIsQuickDoubtOpen(false)}
        onRequestCreated={() => {
          handleNavigateTab('learn');
        }}
      />

      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={selectedProfile}
        onConnect={() => {
          if (selectedProfile && currentUser) {
            const newSession: LearningSession = {
              id: `session-conn-${Date.now()}`,
              learnerId: currentUser.id,
              learnerName: currentUser.fullName,
              learnerAvatar: currentUser.avatarUrl,
              learnerCollege: currentUser.college,
              mentorId: selectedProfile.id,
              mentorName: selectedProfile.fullName,
              mentorAvatar: selectedProfile.avatarUrl,
              mentorCollege: selectedProfile.college,
              skill: selectedProfile.skillsToTeach[0]?.name || 'Programming',
              topic: `1-on-1 Mentoring: ${
                selectedProfile.skillsToTeach[0]?.name || 'Concept Review'
              }`,
              status: 'active',
              durationMinutes: 20,
              isRecording: false,
              recordingConsentLearner: false,
              recordingConsentMentor: false,
              recordingSeconds: 0,
              sharedNotes: '',
              chatMessages: [],
              copilotItems: [],
            };
            setActiveSession(newSession);
          }
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
