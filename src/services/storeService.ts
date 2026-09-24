import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';
import {
  UserProfile,
  LearningRequest,
  LearningSession,
  SessionFeedback,
  CommunityPost,
  ResourceItem,
  NotificationItem,
} from '../types';
import {
  DEMO_USERS,
  DEMO_REQUESTS,
  DEMO_SESSIONS,
  DEMO_COMMUNITY_POSTS,
  DEMO_RESOURCES,
} from './seedData';

const LOCAL_STORAGE_KEY_PREFIX = 'peerloop_';

function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + key, JSON.stringify(data));
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }
}

export class StoreService {
  private static instance: StoreService;

  private constructor() {
    this.initializeLocalDefaults();
  }

  public static getInstance(): StoreService {
    if (!StoreService.instance) {
      StoreService.instance = new StoreService();
    }
    return StoreService.instance;
  }

  private initializeLocalDefaults() {
    if (!localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'users')) {
      setLocal('users', DEMO_USERS);
    }
    if (!localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'requests')) {
      setLocal('requests', DEMO_REQUESTS);
    }
    if (!localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'sessions')) {
      setLocal('sessions', DEMO_SESSIONS);
    }
    if (!localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'posts')) {
      setLocal('posts', DEMO_COMMUNITY_POSTS);
    }
    if (!localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'resources')) {
      setLocal('resources', DEMO_RESOURCES);
    }
    if (!localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'notifications')) {
      const initialNotifs: NotificationItem[] = [
        {
          id: 'n-1',
          recipientId: 'user-ojaswitha',
          title: 'AI Mentor Match Ready',
          message: 'Rahul Sharma matches 94% with your Python Nested Loops goal.',
          type: 'request_match',
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'n-2',
          recipientId: 'user-ojaswitha',
          title: 'Badge Unlocked: Rising Mentor',
          message: 'Congratulations! You received the Rising Mentor badge.',
          type: 'badge_earned',
          isRead: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
      setLocal('notifications', initialNotifs);
    }
  }

  // --- USERS & PROFILES ---
  public async getProfile(userId: string): Promise<UserProfile | null> {
    const path = `profiles/${userId}`;
    try {
      const docRef = doc(db, 'profiles', userId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const profile = snapshot.data() as UserProfile;
        const allUsers = getLocal<UserProfile[]>('users', DEMO_USERS);
        const index = allUsers.findIndex((u) => u.id === userId);
        if (index >= 0) {
          allUsers[index] = profile;
        } else {
          allUsers.push(profile);
        }
        setLocal('users', allUsers);
        return profile;
      }
    } catch (e: unknown) {
      if (auth.currentUser && (e as { code?: string })?.code === 'permission-denied') {
        handleFirestoreError(e, OperationType.GET, path);
      }
      console.warn('Firestore getProfile offline or fallback:', e);
    }
    const allUsers = getLocal<UserProfile[]>('users', DEMO_USERS);
    return allUsers.find((u) => u.id === userId) || null;
  }

  public async saveProfile(profile: UserProfile): Promise<void> {
    const allUsers = getLocal<UserProfile[]>('users', DEMO_USERS);
    const index = allUsers.findIndex((u) => u.id === profile.id);
    if (index >= 0) {
      allUsers[index] = profile;
    } else {
      allUsers.push(profile);
    }
    setLocal('users', allUsers);

    if (auth.currentUser && auth.currentUser.uid === profile.id) {
      const path = `profiles/${profile.id}`;
      try {
        await setDoc(doc(db, 'profiles', profile.id), profile, { merge: true });
      } catch (e: unknown) {
        handleFirestoreError(e, OperationType.WRITE, path);
      }
    }
  }

  public async saveUserAccount(user: { id: string; email: string; emailVerified?: boolean; createdAt: string; updatedAt?: string }): Promise<void> {
    if (auth.currentUser && auth.currentUser.uid === user.id) {
      const path = `users/${user.id}`;
      try {
        await setDoc(doc(db, 'users', user.id), user, { merge: true });
      } catch (e: unknown) {
        handleFirestoreError(e, OperationType.WRITE, path);
      }
    }
  }

  public async getAllMentors(): Promise<UserProfile[]> {
    try {
      const colRef = collection(db, 'profiles');
      const snapshot = await getDocs(colRef);
      if (!snapshot.empty) {
        const firestoreList = snapshot.docs.map((d) => d.data() as UserProfile);
        const mentors = firestoreList.filter(
          (u) => (u.mode === 'mentor' || u.mode === 'both') && u.skillsToTeach?.length > 0
        );
        if (mentors.length > 0) return mentors;
      }
    } catch (e) {
      console.warn('Firestore getAllMentors fallback:', e);
    }
    const all = getLocal<UserProfile[]>('users', DEMO_USERS);
    return all.filter((u) => u.mode === 'mentor' || u.mode === 'both');
  }

  // --- LEARNING / QUICK DOUBT REQUESTS ---
  public getRequests(): LearningRequest[] {
    return getLocal<LearningRequest[]>('requests', DEMO_REQUESTS);
  }

  public async createRequest(req: LearningRequest): Promise<void> {
    const requests = this.getRequests();
    requests.unshift(req);
    setLocal('requests', requests);

    // Notify suitable mentors in notification system
    const mentors = await this.getAllMentors();
    const notifications = this.getNotifications();
    mentors.forEach((m) => {
      if (m.skillsToTeach.some((s) => s.name.toLowerCase().includes(req.skill.toLowerCase()))) {
        notifications.unshift({
          id: `notif-${Date.now()}-${m.id}`,
          recipientId: m.id,
          title: `New Quick Help Request: ${req.skill}`,
          message: `${req.learnerName} needs a ${req.durationMinutes}m quick doubt solve on "${req.topic}".`,
          type: 'request_match',
          isRead: false,
          createdAt: new Date().toISOString(),
        });
      }
    });
    setLocal('notifications', notifications);

    try {
      await setDoc(doc(db, 'learningRequests', req.id), req);
    } catch (e) {
      console.warn('Firestore createRequest sync error:', e);
    }
  }

  public async updateRequestStatus(
    requestId: string,
    status: LearningRequest['status'],
    mentorId?: string,
    mentorName?: string
  ): Promise<void> {
    const requests = this.getRequests();
    const req = requests.find((r) => r.id === requestId);
    if (req) {
      req.status = status;
      if (mentorId) req.matchedMentorId = mentorId;
      if (mentorName) req.matchedMentorName = mentorName;
      setLocal('requests', requests);

      try {
        await updateDoc(doc(db, 'learningRequests', requestId), {
          status,
          ...(mentorId ? { matchedMentorId: mentorId } : {}),
          ...(mentorName ? { matchedMentorName: mentorName } : {}),
        });
      } catch (e) {
        console.warn('Firestore updateRequest sync error:', e);
      }
    }
  }

  // --- SESSIONS ---
  public getSessions(): LearningSession[] {
    return getLocal<LearningSession[]>('sessions', DEMO_SESSIONS);
  }

  public getSessionById(sessionId: string): LearningSession | null {
    const sessions = this.getSessions();
    return sessions.find((s) => s.id === sessionId) || null;
  }

  public async saveSession(session: LearningSession): Promise<void> {
    const sessions = this.getSessions();
    const idx = sessions.findIndex((s) => s.id === session.id);
    if (idx >= 0) {
      sessions[idx] = session;
    } else {
      sessions.unshift(session);
    }
    setLocal('sessions', sessions);

    try {
      await setDoc(doc(db, 'sessions', session.id), session, { merge: true });
    } catch (e) {
      console.warn('Firestore saveSession sync error:', e);
    }
  }

  // --- FEEDBACK & REPUTATION ---
  public async submitFeedback(feedback: SessionFeedback): Promise<void> {
    const localFeedbacks = getLocal<SessionFeedback[]>('feedbacks', []);
    localFeedbacks.unshift(feedback);
    setLocal('feedbacks', localFeedbacks);

    // Update the session's feedback record
    const session = this.getSessionById(feedback.sessionId);
    if (session) {
      session.feedback = feedback;
      await this.saveSession(session);
    }

    try {
      await setDoc(doc(db, 'feedback', feedback.id), feedback);
    } catch (e) {
      console.warn('Firestore submitFeedback sync error:', e);
    }
  }

  // --- COMMUNITY POSTS ---
  public getPosts(): CommunityPost[] {
    return getLocal<CommunityPost[]>('posts', DEMO_COMMUNITY_POSTS);
  }

  public async createPost(post: CommunityPost): Promise<void> {
    const posts = this.getPosts();
    posts.unshift(post);
    setLocal('posts', posts);

    try {
      await setDoc(doc(db, 'communityPosts', post.id), post);
    } catch (e) {
      console.warn('Firestore createPost sync error:', e);
    }
  }

  public likePost(postId: string): void {
    const posts = this.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (post) {
      post.likes = (post.likes || 0) + 1;
      post.likesCount = (post.likesCount || 0) + 1;
      setLocal('posts', posts);
    }
  }

  public toggleLikePost(postId: string, userId: string): void {
    const posts = this.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (post) {
      post.likedBy = post.likedBy || [];
      post.likes = post.likes || 0;
      if (post.likedBy.includes(userId)) {
        post.likedBy = post.likedBy.filter((id) => id !== userId);
        post.likes = Math.max(0, post.likes - 1);
      } else {
        post.likedBy.push(userId);
        post.likes += 1;
      }
      post.likesCount = post.likes;
      setLocal('posts', posts);
    }
  }

  // --- RESOURCES ---
  public getResources(): ResourceItem[] {
    return getLocal<ResourceItem[]>('resources', DEMO_RESOURCES);
  }

  public addResource(res: ResourceItem): void {
    const resources = this.getResources();
    resources.unshift(res);
    setLocal('resources', resources);
  }

  // --- NOTIFICATIONS ---
  public getNotifications(userId?: string): NotificationItem[] {
    const all = getLocal<NotificationItem[]>('notifications', []);
    if (!userId) return all;
    return all.filter((n) => n.recipientId === userId);
  }

  public markNotificationAsRead(notifId: string): void {
    const all = this.getNotifications();
    const notif = all.find((n) => n.id === notifId);
    if (notif) {
      notif.isRead = true;
      setLocal('notifications', all);
    }
  }

  public markAllNotificationsAsRead(userId: string): void {
    const all = this.getNotifications();
    all.forEach((n) => {
      if (n.recipientId === userId) n.isRead = true;
    });
    setLocal('notifications', all);
  }
}

export const store = StoreService.getInstance();
