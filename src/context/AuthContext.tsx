import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { UserProfile, UserRole, OnboardingData } from '../types';
import { store } from '../services/storeService';
import { DEMO_USERS } from '../services/seedData';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  currentUser: UserProfile | null;
  isLoading: boolean;
  activeMode: 'learner' | 'mentor';
  logoutMessage: string | null;
  clearLogoutMessage: () => void;
  switchActiveMode: (mode: 'learner' | 'mentor') => void;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, fullName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  switchDemoUser: (userId: string) => void;
  completeOnboarding: (data: OnboardingData | Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    // Only restore if user explicitly has an active session
    const savedId = localStorage.getItem('peerloop_active_user_id');
    if (!savedId) return null;
    return DEMO_USERS.find((u) => u.id === savedId) || null;
  });
  const [activeMode, setActiveMode] = useState<'learner' | 'mentor'>(() => {
    return (localStorage.getItem('peerloop_active_mode') as 'learner' | 'mentor') || 'learner';
  });
  const [logoutMessage, setLogoutMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const clearLogoutMessage = () => setLogoutMessage(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        localStorage.setItem('peerloop_active_user_id', user.uid);
        // Load private user account from users/{uid}
        const userAccount = await store.getUserAccount(user.uid);
        if (!userAccount) {
          await store.saveUserAccount({
            id: user.uid,
            email: user.email || '',
            name: user.displayName || '',
            fullName: user.displayName || '',
            profileCompleted: false,
            emailVerified: user.emailVerified,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }

        // Load user profile from store
        const profile = await store.getProfile(user.uid);
        const isProfileCompleted = userAccount?.profileCompleted === true || profile?.profileCompleted === true;

        if (profile) {
          const merged: UserProfile = {
            ...profile,
            fullName: userAccount?.name || profile.fullName,
            name: userAccount?.name || profile.name || profile.fullName,
            college: userAccount?.college || profile.college,
            course: userAccount?.course || profile.course,
            year: userAccount?.year || profile.year,
            location: userAccount?.location || profile.location,
            careerGoals: userAccount?.careerGoals || profile.careerGoals,
            preferredLanguage: userAccount?.preferredLanguage || profile.preferredLanguage,
            profileCompleted: isProfileCompleted,
            isOnboarded: isProfileCompleted,
          };
          setCurrentUser(merged);
          setActiveMode(profile.activeMode || 'learner');
        } else {
          // New auth user, construct base profile with profileCompleted: false
          const newProfile: UserProfile = {
            id: user.uid,
            email: user.email || '',
            fullName: userAccount?.name || user.displayName || user.email?.split('@')[0] || 'Peer Learner',
            name: userAccount?.name || user.displayName || user.email?.split('@')[0] || 'Peer Learner',
            avatarUrl:
              user.photoURL ||
              `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`,
            college: userAccount?.college || '',
            course: userAccount?.course || '',
            year: userAccount?.year || '1st Year (Freshman)',
            location: userAccount?.location || '',
            bio: '',
            mode: 'both',
            activeMode: 'learner',
            isOnboarded: isProfileCompleted,
            profileCompleted: isProfileCompleted,
            preferredLanguage: userAccount?.preferredLanguage || 'English',
            learningFormat: 'Visual & Hands-on',
            skillsToLearn: [],
            skillsToTeach: [],
            learningGoals: [],
            availability: {
              status: 'available',
              days: ['Mon', 'Wed', 'Fri'],
              timeSlots: ['4:00 PM - 7:00 PM'],
              preferredDurationMinutes: 20,
            },
            reputation: {
              score: 75,
              learnersHelped: 0,
              sessionsCount: 0,
              averageRating: 5.0,
              clarityScore: 85,
              accuracyScore: 85,
              consistencyScore: 80,
              badges: [],
            },
            createdAt: new Date().toISOString(),
          };
          await store.saveProfile(newProfile);
          setCurrentUser(newProfile);
        }
      } else {
        const savedId = localStorage.getItem('peerloop_active_user_id');
        if (savedId) {
          const found = DEMO_USERS.find((u) => u.id === savedId);
          if (found) {
            setCurrentUser({
              ...found,
              profileCompleted: true,
              isOnboarded: true,
            });
          } else {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const switchActiveMode = (mode: 'learner' | 'mentor') => {
    setActiveMode(mode);
    localStorage.setItem('peerloop_active_mode', mode);
    if (currentUser) {
      const updated = { ...currentUser, activeMode: mode };
      setCurrentUser(updated);
      store.saveProfile(updated);
    }
  };

  const switchDemoUser = (userId: string) => {
    const found = DEMO_USERS.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      setActiveMode(found.activeMode || 'learner');
      localStorage.setItem('peerloop_active_user_id', found.id);
      localStorage.setItem('peerloop_active_mode', found.activeMode || 'learner');
      setLogoutMessage(null);
    }
  };

  const signIn = async (email: string, pass: string) => {
    setIsLoading(true);
    setLogoutMessage(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      localStorage.setItem('peerloop_active_user_id', cred.user.uid);
      const profile = await store.getProfile(cred.user.uid);
      if (profile) setCurrentUser(profile);
    } catch (err: unknown) {
      // If user does not exist in Firebase yet, match with existing demo users
      const demo = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (demo) {
        setCurrentUser(demo);
        localStorage.setItem('peerloop_active_user_id', demo.id);
        return;
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, pass: string, fullName: string) => {
    setIsLoading(true);
    setLogoutMessage(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      localStorage.setItem('peerloop_active_user_id', cred.user.uid);
      const newProfile: UserProfile = {
        id: cred.user.uid,
        email,
        fullName,
        avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80`,
        college: '',
        course: '',
        year: '1st Year',
        location: '',
        bio: '',
        mode: 'both',
        activeMode: 'learner',
        isOnboarded: false,
        profileCompleted: false,
        preferredLanguage: 'English',
        learningFormat: 'Visual & Hands-on',
        skillsToLearn: [],
        skillsToTeach: [],
        learningGoals: [],
        availability: {
          status: 'available',
          days: ['Mon', 'Wed', 'Fri'],
          timeSlots: ['5:00 PM - 8:00 PM'],
          preferredDurationMinutes: 20,
        },
        reputation: {
          score: 75,
          learnersHelped: 0,
          sessionsCount: 0,
          averageRating: 5.0,
          clarityScore: 80,
          accuracyScore: 80,
          consistencyScore: 80,
          badges: [],
        },
        createdAt: new Date().toISOString(),
      };
      // Save initial private user record to users/{uid} with profileCompleted: false
      await store.saveUserAccount({
        id: cred.user.uid,
        email,
        name: fullName,
        fullName,
        profileCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      await store.saveProfile(newProfile);
      setCurrentUser(newProfile);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    setLogoutMessage(null);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const user = cred.user;
      localStorage.setItem('peerloop_active_user_id', user.uid);

      // Check existing user account
      const userAccount = await store.getUserAccount(user.uid);
      const profile = await store.getProfile(user.uid);
      const isCompleted = userAccount?.profileCompleted === true || profile?.profileCompleted === true;

      // Save or update private account record
      await store.saveUserAccount({
        id: user.uid,
        email: user.email || '',
        name: userAccount?.name || user.displayName || '',
        fullName: userAccount?.fullName || user.displayName || '',
        profileCompleted: isCompleted,
        emailVerified: user.emailVerified,
        createdAt: userAccount?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      if (profile) {
        const merged: UserProfile = {
          ...profile,
          profileCompleted: isCompleted,
          isOnboarded: isCompleted,
        };
        setCurrentUser(merged);
        setActiveMode(profile.activeMode || 'learner');
      } else {
        const newProfile: UserProfile = {
          id: user.uid,
          email: user.email || '',
          fullName: user.displayName || user.email?.split('@')[0] || 'University Peer',
          name: user.displayName || user.email?.split('@')[0] || 'University Peer',
          avatarUrl:
            user.photoURL ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          college: '',
          course: '',
          year: '1st Year (Freshman)',
          location: '',
          bio: 'Learning new skills and collaborating with peers on PeerLoop.',
          mode: 'both',
          activeMode: 'learner',
          isOnboarded: false,
          profileCompleted: false,
          preferredLanguage: 'English',
          learningFormat: 'Visual & Hands-on',
          skillsToLearn: [],
          skillsToTeach: [],
          learningGoals: [],
          availability: {
            status: 'available',
            days: ['Mon', 'Wed', 'Fri'],
            timeSlots: ['4:00 PM - 7:00 PM'],
            preferredDurationMinutes: 20,
          },
          reputation: {
            score: 75,
            learnersHelped: 0,
            sessionsCount: 0,
            averageRating: 5.0,
            clarityScore: 85,
            accuracyScore: 85,
            consistencyScore: 80,
            badges: [],
          },
          createdAt: new Date().toISOString(),
        };
        await store.saveProfile(newProfile);
        setCurrentUser(newProfile);
        setActiveMode('learner');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn('Signout note:', e);
    }
    setFirebaseUser(null);
    setCurrentUser(null);
    localStorage.removeItem('peerloop_active_user_id');
    localStorage.removeItem('peerloop_active_mode');
    sessionStorage.clear();
    setLogoutMessage('You’ve been logged out successfully.');
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateProfile = async (updated: Partial<UserProfile>) => {
    if (!currentUser) return;
    const merged = { ...currentUser, ...updated };
    setCurrentUser(merged);
    await store.saveProfile(merged);
  };

  const completeOnboarding = async (data: OnboardingData | Partial<UserProfile>) => {
    if (!currentUser) return;

    if ('learningMode' in data && 'skillsToLearn' in data) {
      const onboardingPayload = data as OnboardingData;
      // 1. Save all onboarding information to users/{uid} and set profileCompleted: true
      await store.saveOnboardingData(currentUser.id, onboardingPayload);

      const roleMode =
        onboardingPayload.learningMode === 'Learn'
          ? 'learner'
          : onboardingPayload.learningMode === 'Teach'
          ? 'mentor'
          : 'both';

      const merged: UserProfile = {
        ...currentUser,
        fullName: onboardingPayload.name,
        name: onboardingPayload.name,
        college: onboardingPayload.college,
        course: onboardingPayload.course,
        year: onboardingPayload.year,
        location: onboardingPayload.location,
        mode: roleMode,
        learningMode: onboardingPayload.learningMode,
        activeMode: roleMode === 'mentor' ? 'mentor' : 'learner',
        careerGoals: onboardingPayload.careerGoals,
        preferredLanguage: onboardingPayload.preferredLanguage,
        profileCompleted: true,
        isOnboarded: true,
      };

      setCurrentUser(merged);
      setActiveMode(merged.activeMode);
      localStorage.setItem('peerloop_active_mode', merged.activeMode);
    } else {
      const merged: UserProfile = {
        ...currentUser,
        ...data,
        isOnboarded: true,
        profileCompleted: true,
        activeMode: data.mode === 'mentor' ? 'mentor' : 'learner',
      };
      setCurrentUser(merged);
      setActiveMode(merged.activeMode);
      await store.saveProfile(merged);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        currentUser,
        isLoading,
        activeMode,
        logoutMessage,
        clearLogoutMessage,
        switchActiveMode,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        resetPassword,
        updateProfile,
        switchDemoUser,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
