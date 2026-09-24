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
import { UserProfile, UserRole } from '../types';
import { store } from '../services/storeService';
import { DEMO_USERS } from '../services/seedData';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  currentUser: UserProfile | null;
  isLoading: boolean;
  activeMode: 'learner' | 'mentor';
  switchActiveMode: (mode: 'learner' | 'mentor') => void;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, fullName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  switchDemoUser: (userId: string) => void;
  completeOnboarding: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    // Default to the first demo user (Ojaswitha) for initial interactive state
    const savedId = localStorage.getItem('peerloop_active_user_id') || DEMO_USERS[0].id;
    return DEMO_USERS.find((u) => u.id === savedId) || DEMO_USERS[0];
  });
  const [activeMode, setActiveMode] = useState<'learner' | 'mentor'>(() => {
    return (localStorage.getItem('peerloop_active_mode') as 'learner' | 'mentor') || 'learner';
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        // Save private account record
        await store.saveUserAccount({
          id: user.uid,
          email: user.email || '',
          emailVerified: user.emailVerified,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        // Load user profile from store
        const profile = await store.getProfile(user.uid);
        if (profile) {
          setCurrentUser(profile);
          setActiveMode(profile.activeMode || 'learner');
        } else {
          // New auth user, construct base profile
          const newProfile: UserProfile = {
            id: user.uid,
            email: user.email || '',
            fullName: user.displayName || user.email?.split('@')[0] || 'Peer Learner',
            avatarUrl:
              user.photoURL ||
              `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`,
            college: 'University Campus',
            course: 'Computer Science',
            year: '1st Year',
            location: 'Campus',
            bio: 'Learning new skills and collaborating with peers on PeerLoop.',
            mode: 'both',
            activeMode: 'learner',
            isOnboarded: false,
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
    }
  };

  const signIn = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
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
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
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
      await store.saveProfile(newProfile);
      setCurrentUser(newProfile);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const user = cred.user;

      // Save private account record
      await store.saveUserAccount({
        id: user.uid,
        email: user.email || '',
        emailVerified: user.emailVerified,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Load profile or create initial profile
      const profile = await store.getProfile(user.uid);
      if (profile) {
        setCurrentUser(profile);
        setActiveMode(profile.activeMode || 'learner');
      } else {
        const newProfile: UserProfile = {
          id: user.uid,
          email: user.email || '',
          fullName: user.displayName || user.email?.split('@')[0] || 'University Peer',
          avatarUrl:
            user.photoURL ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          college: 'University Campus',
          course: 'Computer Science',
          year: '1st Year',
          location: 'Campus',
          bio: 'Learning new skills and collaborating with peers on PeerLoop.',
          mode: 'both',
          activeMode: 'learner',
          isOnboarded: false,
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
            score: 80,
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
    // Keep a clean guest demo or reset
    setCurrentUser(null);
    localStorage.removeItem('peerloop_active_user_id');
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

  const completeOnboarding = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const merged: UserProfile = {
      ...currentUser,
      ...data,
      isOnboarded: true,
      activeMode: data.mode === 'mentor' ? 'mentor' : 'learner',
    };
    setCurrentUser(merged);
    setActiveMode(merged.activeMode);
    await store.saveProfile(merged);
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        currentUser,
        isLoading,
        activeMode,
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
