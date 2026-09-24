import React, { useState } from 'react';
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
import { store } from './services/storeService';
import { LearningSession, UserProfile } from './types';
import { DEMO_USERS } from './services/seedData';

const MainAppContent: React.FC = () => {
  const { currentUser, switchDemoUser } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [activeSession, setActiveSession] = useState<LearningSession | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Modals state
  const [isQuickDoubtOpen, setIsQuickDoubtOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleViewProfile = async (userId: string) => {
    const profile = await store.getProfile(userId);
    if (profile) {
      setSelectedProfile(profile);
      setIsProfileModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F8FAFC] flex flex-col md:flex-row pb-16 md:pb-0 overflow-x-hidden font-sans">
      {/* ---------------------------------------------------- */}
      {/* 1. LEFT PERSISTENT SIDEBAR (Desktop) */}
      {/* ---------------------------------------------------- */}
      <AppSidebar
        currentTab={currentTab}
        onNavigate={(tab) => setCurrentTab(tab)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        unreadCount={2}
      />

      {/* ---------------------------------------------------- */}
      {/* 2. MAIN APPLICATION CONTENT AREA */}
      {/* ---------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top App Bar */}
        <AppTopBar
          currentTab={currentTab}
          onNavigate={(tab) => setCurrentTab(tab)}
          onOpenQuickHelp={() => setCurrentTab('quick-help')}
          onSearch={(query) => {
            setCurrentTab('learn');
          }}
        />

        {/* View Switcher Container */}
        <main className="flex-1 bg-[#0B1020] overflow-y-auto">
          {currentTab === 'dashboard' && (
            <HomeDashboard
              onNavigate={setCurrentTab}
              onOpenQuickDoubt={() => setCurrentTab('quick-help')}
              onStartSession={(sess) => setActiveSession(sess)}
              onViewProfile={handleViewProfile}
            />
          )}

          {currentTab === 'learn' && (
            <LearnDiscovery
              onOpenQuickDoubt={() => setCurrentTab('quick-help')}
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
              onOpenQuickDoubt={() => setCurrentTab('quick-help')}
            />
          )}

          {currentTab === 'teach' && (
            <MentorPortal
              onStartSession={(sess) => setActiveSession(sess)}
              onOpenQuickDoubt={() => setCurrentTab('quick-help')}
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

      {/* ---------------------------------------------------- */}
      {/* 3. MOBILE BOTTOM NAVIGATION */}
      {/* ---------------------------------------------------- */}
      <MobileNav currentTab={currentTab} onNavigate={setCurrentTab} />

      {/* ---------------------------------------------------- */}
      {/* 4. FULLSCREEN 1-ON-1 SESSION WORKSPACE */}
      {/* ---------------------------------------------------- */}
      {activeSession && (
        <SessionRoom
          session={activeSession}
          onLeaveSession={() => {
            setActiveSession(null);
            setCurrentTab('sessions');
          }}
        />
      )}

      {/* ---------------------------------------------------- */}
      {/* 5. MODALS */}
      {/* ---------------------------------------------------- */}
      {/* Quick Doubt Modal for ad-hoc prompts */}
      <QuickDoubtModal
        isOpen={isQuickDoubtOpen}
        onClose={() => setIsQuickDoubtOpen(false)}
        onRequestCreated={() => {
          setCurrentTab('learn');
        }}
      />

      {/* Student Profile Inspection Modal */}
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
      <MainAppContent />
    </AuthProvider>
  );
}
