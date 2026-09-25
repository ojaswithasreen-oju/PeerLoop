import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
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
  UserAccount,
  OnboardingData,
  UserSkill,
  Lecture,
  LectureStudent,
  LectureSummary,
  LectureStatus,
} from '../types';
import {
  DEMO_USERS,
  DEMO_REQUESTS,
  DEMO_SESSIONS,
  DEMO_COMMUNITY_POSTS,
  DEMO_RESOURCES,
  DEMO_LECTURES,
  DEMO_LECTURE_STUDENTS,
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
    if (!localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'lectures')) {
      setLocal('lectures', DEMO_LECTURES);
    }
    if (!localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'lecture_students')) {
      setLocal('lecture_students', DEMO_LECTURE_STUDENTS);
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

  public async getUserAccount(userId: string): Promise<UserAccount | null> {
    const path = `users/${userId}`;
    try {
      const docRef = doc(db, 'users', userId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const account = snapshot.data() as UserAccount;
        const localAccounts = getLocal<Record<string, UserAccount>>('user_accounts', {});
        localAccounts[userId] = account;
        setLocal('user_accounts', localAccounts);
        return account;
      }
    } catch (e: unknown) {
      if (auth.currentUser && (e as { code?: string })?.code === 'permission-denied') {
        handleFirestoreError(e, OperationType.GET, path);
      }
      console.warn('Firestore getUserAccount offline or fallback:', e);
    }
    const localAccounts = getLocal<Record<string, UserAccount>>('user_accounts', {});
    return localAccounts[userId] || null;
  }

  public async saveUserAccount(user: Partial<UserAccount> & { id: string }): Promise<void> {
    const localAccounts = getLocal<Record<string, UserAccount>>('user_accounts', {});
    localAccounts[user.id] = { ...localAccounts[user.id], ...user } as UserAccount;
    setLocal('user_accounts', localAccounts);

    if (auth.currentUser && auth.currentUser.uid === user.id) {
      const path = `users/${user.id}`;
      try {
        await setDoc(doc(db, 'users', user.id), user, { merge: true });
      } catch (e: unknown) {
        handleFirestoreError(e, OperationType.WRITE, path);
      }
    }
  }

  public async saveOnboardingData(userId: string, data: OnboardingData): Promise<void> {
    const roleMode = data.learningMode === 'Learn' ? 'learner' : data.learningMode === 'Teach' ? 'mentor' : 'both';

    // 1. Save all onboarding information directly to users/{uid} with profileCompleted: true
    const userAccountUpdate: Partial<UserAccount> & { id: string } = {
      id: userId,
      email: auth.currentUser?.email || '',
      name: data.name,
      fullName: data.name,
      college: data.college,
      course: data.course,
      year: data.year,
      location: data.location,
      learningMode: data.learningMode,
      skillsToLearn: data.skillsToLearn,
      skillsToTeach: data.skillsToTeach,
      careerGoals: data.careerGoals,
      preferredLanguage: data.preferredLanguage,
      profileCompleted: true,
      updatedAt: new Date().toISOString(),
    };

    await this.saveUserAccount(userAccountUpdate);

    // 2. Also sync to profiles/{userId} for peer learning directory
    const existingProfile = await this.getProfile(userId);
    const formattedLearnSkills: UserSkill[] = data.skillsToLearn.map((s, idx) => ({
      id: `learn-${idx}-${Date.now()}`,
      name: s.name,
      level: s.level,
      category: 'Programming',
      verified: false,
    }));
    const formattedTeachSkills: UserSkill[] = data.skillsToTeach.map((s, idx) => ({
      id: `teach-${idx}-${Date.now()}`,
      name: s.name,
      level: s.level,
      category: 'Programming',
      verified: true,
      verifiedMethod: 'Skill Assessment Passed',
    }));

    const updatedProfile: UserProfile = {
      id: userId,
      email: existingProfile?.email || auth.currentUser?.email || '',
      fullName: data.name,
      name: data.name,
      avatarUrl:
        existingProfile?.avatarUrl ||
        auth.currentUser?.photoURL ||
        `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`,
      college: data.college,
      course: data.course,
      year: data.year,
      location: data.location,
      bio:
        existingProfile?.bio ||
        `${data.learningMode} focused student at ${data.college}. Career goal: ${data.careerGoals}`,
      mode: roleMode,
      learningMode: data.learningMode,
      activeMode: roleMode === 'mentor' ? 'mentor' : 'learner',
      isOnboarded: true,
      profileCompleted: true,
      preferredLanguage: data.preferredLanguage,
      learningFormat: existingProfile?.learningFormat || 'Visual & Hands-on',
      skillsToLearn: formattedLearnSkills,
      skillsToTeach: formattedTeachSkills,
      learningGoals: existingProfile?.learningGoals || [
        {
          id: `goal-${Date.now()}`,
          skill: data.skillsToLearn[0]?.name || 'Computer Science',
          targetTopic: data.careerGoals || 'Core Concepts & Problem Solving',
          progressPercent: 20,
          status: 'in_progress',
        },
      ],
      availability: existingProfile?.availability || {
        status: 'available',
        days: ['Mon', 'Wed', 'Fri', 'Sat'],
        timeSlots: ['4:00 PM - 7:00 PM', '8:00 PM - 10:00 PM'],
        preferredDurationMinutes: 20,
      },
      reputation: existingProfile?.reputation || {
        score: 75,
        learnersHelped: 0,
        sessionsCount: 0,
        averageRating: 5.0,
        clarityScore: 85,
        accuracyScore: 85,
        consistencyScore: 80,
        badges: [],
      },
      createdAt: existingProfile?.createdAt || new Date().toISOString(),
    };

    await this.saveProfile(updatedProfile);
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

  // --- LECTURES & TEACHING MODE ---
  public async getLectures(teacherId?: string): Promise<Lecture[]> {
    try {
      const colRef = collection(db, 'lectures');
      const snapshot = await getDocs(colRef);
      if (!snapshot.empty) {
        const firestoreLectures = snapshot.docs.map((d) => d.data() as Lecture);
        // Merge with local lectures
        const local = getLocal<Lecture[]>('lectures', DEMO_LECTURES);
        const map = new Map<string, Lecture>();
        local.forEach((l) => map.set(l.id, l));
        firestoreLectures.forEach((l) => map.set(l.id, l));
        const combined = Array.from(map.values());
        setLocal('lectures', combined);
        if (teacherId) {
          return combined.filter((l) => l.teacherId === teacherId);
        }
        return combined;
      }
    } catch (e: unknown) {
      console.warn('Firestore getLectures fallback:', e);
    }
    const all = getLocal<Lecture[]>('lectures', DEMO_LECTURES);
    if (teacherId) {
      return all.filter((l) => l.teacherId === teacherId);
    }
    return all;
  }

  public async getLectureById(id: string): Promise<Lecture | null> {
    try {
      const docRef = doc(db, 'lectures', id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return snapshot.data() as Lecture;
      }
    } catch (e: unknown) {
      console.warn('Firestore getLectureById fallback:', e);
    }
    const all = getLocal<Lecture[]>('lectures', DEMO_LECTURES);
    return all.find((l) => l.id === id) || null;
  }

  public async saveLecture(lecture: Lecture): Promise<void> {
    const all = getLocal<Lecture[]>('lectures', DEMO_LECTURES);
    const idx = all.findIndex((l) => l.id === lecture.id);
    if (idx >= 0) {
      all[idx] = lecture;
    } else {
      all.unshift(lecture);
    }
    setLocal('lectures', all);

    if (auth.currentUser && auth.currentUser.uid === lecture.teacherId) {
      const path = `lectures/${lecture.id}`;
      try {
        await setDoc(doc(db, 'lectures', lecture.id), lecture, { merge: true });
      } catch (e: unknown) {
        handleFirestoreError(e, OperationType.WRITE, path);
      }
    }
  }

  public async deleteLecture(id: string, teacherId: string): Promise<void> {
    const all = getLocal<Lecture[]>('lectures', DEMO_LECTURES);
    const filtered = all.filter((l) => l.id !== id);
    setLocal('lectures', filtered);

    if (auth.currentUser && auth.currentUser.uid === teacherId) {
      const path = `lectures/${id}`;
      try {
        await deleteDoc(doc(db, 'lectures', id));
      } catch (e: unknown) {
        handleFirestoreError(e, OperationType.DELETE, path);
      }
    }
  }

  public async updateLectureStatus(id: string, status: LectureStatus): Promise<void> {
    const all = getLocal<Lecture[]>('lectures', DEMO_LECTURES);
    const lecture = all.find((l) => l.id === id);
    if (lecture) {
      lecture.status = status;
      lecture.updatedAt = new Date().toISOString();
      await this.saveLecture(lecture);
    }
  }

  public async updateLectureSummary(id: string, summary: LectureSummary): Promise<void> {
    const all = getLocal<Lecture[]>('lectures', DEMO_LECTURES);
    const lecture = all.find((l) => l.id === id);
    if (lecture) {
      lecture.summary = summary;
      lecture.status = 'Completed';
      lecture.updatedAt = new Date().toISOString();
      await this.saveLecture(lecture);
    }
  }

  public async getStudentsForLecture(lectureId: string): Promise<LectureStudent[]> {
    try {
      const colRef = collection(db, 'lectures', lectureId, 'students');
      const snapshot = await getDocs(colRef);
      if (!snapshot.empty) {
        const firestoreStudents = snapshot.docs.map((d) => d.data() as LectureStudent);
        return firestoreStudents;
      }
    } catch (e: unknown) {
      console.warn('Firestore getStudentsForLecture fallback:', e);
    }
    const allStudentsMap = getLocal<Record<string, LectureStudent[]>>('lecture_students', DEMO_LECTURE_STUDENTS);
    return allStudentsMap[lectureId] || [];
  }

  public async saveStudentToLecture(student: LectureStudent): Promise<void> {
    const allStudentsMap = getLocal<Record<string, LectureStudent[]>>('lecture_students', DEMO_LECTURE_STUDENTS);
    const list = allStudentsMap[student.lectureId] || [];
    const idx = list.findIndex((s) => s.id === student.id || s.studentId === student.studentId);
    if (idx >= 0) {
      list[idx] = student;
    } else {
      list.push(student);
    }
    allStudentsMap[student.lectureId] = list;
    setLocal('lecture_students', allStudentsMap);

    if (auth.currentUser) {
      const path = `lectures/${student.lectureId}/students/${student.id}`;
      try {
        await setDoc(doc(db, 'lectures', student.lectureId, 'students', student.id), student, { merge: true });
      } catch (e: unknown) {
        handleFirestoreError(e, OperationType.WRITE, path);
      }
    }
  }

  public async getAllMyStudents(teacherId: string): Promise<LectureStudent[]> {
    const lectures = await this.getLectures(teacherId);
    const studentMap = new Map<string, LectureStudent>();

    for (const lec of lectures) {
      const students = await this.getStudentsForLecture(lec.id);
      students.forEach((s) => {
        if (!studentMap.has(s.studentId)) {
          studentMap.set(s.studentId, s);
        } else {
          // Merge / update lecture attended count
          const existing = studentMap.get(s.studentId)!;
          existing.lecturesAttendedCount = Math.max(
            existing.lecturesAttendedCount || 1,
            (existing.lecturesAttendedCount || 1) + 1
          );
        }
      });
    }

    if (studentMap.size === 0) {
      // Return default sample students for teacher preview
      return DEMO_LECTURE_STUDENTS['lec-python-1'] || [];
    }

    return Array.from(studentMap.values());
  }

  public async enableTeachingMode(
    userId: string,
    data: {
      skillsToTeach: UserSkill[];
      availability?: UserProfile['availability'];
      bio?: string;
      teachingFormats?: string[];
    }
  ): Promise<void> {
    // 1. Update user account
    const userAccount = await this.getUserAccount(userId);
    if (userAccount) {
      userAccount.learningMode = 'Learn + Teach';
      userAccount.skillsToTeach = data.skillsToTeach.map((s) => ({
        name: s.name,
        level: s.level,
      }));
      await this.saveUserAccount(userAccount);
    }

    // 2. Update user profile
    const profile = await this.getProfile(userId);
    if (profile) {
      profile.mode = 'both';
      profile.learningMode = 'Learn + Teach';
      profile.activeMode = 'mentor';
      profile.skillsToTeach = data.skillsToTeach;
      if (data.bio) profile.bio = data.bio;
      if (data.availability) profile.availability = data.availability;
      await this.saveProfile(profile);
    }
  }
}

export const store = StoreService.getInstance();
