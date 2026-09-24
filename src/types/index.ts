export type UserRole = 'learner' | 'mentor' | 'both';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface UserSkill {
  id: string;
  name: string;
  level: SkillLevel;
  category: 'Programming' | 'Design' | 'Data & AI' | 'Math & Logic' | 'DevOps' | 'General';
  verified: boolean;
  verifiedMethod?: 'Skill Assessment Passed' | 'Project Verified' | 'Teaching History';
  endorsementsCount?: number;
  yearsOrMonthsExperience?: string;
}

export interface LearningGoal {
  id: string;
  skill: string;
  targetTopic: string;
  deadline?: string;
  progressPercent: number;
  status: 'in_progress' | 'completed' | 'paused';
}

export interface MentorBadge {
  id: string;
  name: 'Rising Mentor' | 'Community Guide' | 'Top Student Mentor' | 'Community Educator' | 'Clarity Champion' | 'Code Reviewer';
  description: string;
  icon: string;
  earnedDate: string;
  rarity: 'common' | 'rare' | 'elite';
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  name?: string;
  avatarUrl: string;
  college: string;
  course: string;
  year: string;
  location: string;
  bio: string;
  mode: UserRole; // 'learner' | 'mentor' | 'both'
  learningMode?: 'Learn' | 'Teach' | 'Learn + Teach';
  activeMode: 'learner' | 'mentor';
  isOnboarded: boolean;
  profileCompleted?: boolean;
  careerGoals?: string;
  preferredLanguage: string;
  learningFormat: 'Visual & Hands-on' | 'Code Walkthrough' | 'Conceptual' | 'Problem Solving';
  skillsToLearn: UserSkill[];
  skillsToTeach: UserSkill[];
  learningGoals: LearningGoal[];
  availability: {
    status: 'available' | 'busy' | 'offline';
    days: string[];
    timeSlots: string[];
    preferredDurationMinutes: number;
  };
  reputation: {
    score: number; // 0 - 100
    learnersHelped: number;
    sessionsCount: number;
    averageRating: number; // e.g. 4.9
    clarityScore: number;
    accuracyScore: number;
    consistencyScore: number;
    badges: MentorBadge[];
  };
  createdAt: string;
}

export interface OnboardingData {
  name: string;
  college: string;
  course: string;
  year: string;
  location: string;
  learningMode: 'Learn' | 'Teach' | 'Learn + Teach';
  skillsToLearn: { name: string; level: SkillLevel }[];
  skillsToTeach: { name: string; level: SkillLevel }[];
  careerGoals: string;
  preferredLanguage: string;
}

export interface UserAccount {
  id: string;
  email: string;
  name?: string;
  fullName?: string;
  college?: string;
  course?: string;
  year?: string;
  location?: string;
  learningMode?: 'Learn' | 'Teach' | 'Learn + Teach';
  skillsToLearn?: { name: string; level: SkillLevel }[];
  skillsToTeach?: { name: string; level: SkillLevel }[];
  careerGoals?: string;
  preferredLanguage?: string;
  profileCompleted?: boolean;
  emailVerified?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface LearningRequest {
  id: string;
  learnerId: string;
  learnerName: string;
  learnerCollege: string;
  learnerAvatar: string;
  skill: string;
  topic: string;
  currentLevel: SkillLevel;
  description: string;
  preferredLanguage: string;
  durationMinutes: 5 | 10 | 20 | 30;
  availabilityNote: string;
  status: 'open' | 'matched' | 'in_session' | 'completed' | 'cancelled';
  matchedMentorId?: string;
  matchedMentorName?: string;
  createdAt: string;
  aiSuggestedKeywords?: string[];
  tags: string[];
}

export interface AIInterruptionItem {
  id: string;
  type: 'clarification' | 'suggestion' | 'practice_question' | 'resource_hint';
  level: 'silent' | 'suggestion' | 'important_clarification';
  confidenceText: 'Quick clarification' | 'Potential correction' | 'This may need verification' | 'Suggested practice';
  title: string;
  content: string;
  actionableText?: string;
  targetAudience: 'mentor' | 'learner' | 'both';
  status: 'active' | 'accepted' | 'dismissed';
  timestamp: string;
}

export interface SessionChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'learner' | 'mentor';
  text: string;
  timestamp: string;
}

export interface SessionSummary {
  learnedTopics: string[];
  conceptsCovered: string[];
  difficultTopics: string[];
  keyExplanations: Array<{
    concept: string;
    explanation: string;
  }>;
  practiceQuestions: Array<{
    question: string;
    hint: string;
  }>;
  recommendedResources: Array<{
    title: string;
    url: string;
    type: string;
    reason: string;
  }>;
  nextStep: string;
  timestamps: Array<{
    time: string;
    topic: string;
  }>;
}

export interface SessionFeedback {
  id: string;
  sessionId: string;
  learnerId: string;
  mentorId: string;
  ratings: {
    overallHelpfulness: number;
    explanationClarity: number;
    knowledge: number;
    accuracy: number;
    communication: number;
  };
  qExplainedClearly: boolean;
  qUnderstoodBetter: boolean;
  qNoticedConfusion: boolean;
  qLearnAgain: boolean;
  writtenFeedback: string;
  createdAt: string;
}

export interface LearningSession {
  id: string;
  requestId?: string;
  learnerId: string;
  learnerName: string;
  learnerAvatar: string;
  learnerCollege: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  mentorCollege: string;
  skill: string;
  topic: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  startedAt?: string;
  endedAt?: string;
  durationMinutes: number;
  // Recording controls
  isRecording: boolean;
  recordingRequestedBy?: 'learner' | 'mentor';
  recordingConsentLearner: boolean;
  recordingConsentMentor: boolean;
  recordingSeconds: number;
  // Collaboration
  sharedNotes: string;
  scratchpadCode?: string;
  chatMessages: SessionChatMessage[];
  copilotItems: AIInterruptionItem[];
  // Post-session
  summary?: SessionSummary;
  feedback?: SessionFeedback;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorCollege: string;
  badge?: string;
  type?: 'achievement' | 'project' | 'study_tip' | 'question' | 'resource';
  title: string;
  content: string;
  skillTag?: string;
  tags?: string[];
  likes?: number;
  likesCount?: number;
  commentsCount?: number;
  likedBy?: string[];
  repliesCount?: number;
  createdAt: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  skill: string;
  topic: string;
  level: SkillLevel;
  type: 'Article' | 'GitHub' | 'Video' | 'Practice Problems' | 'Cheatsheet';
  url: string;
  sharedBy: string;
  likes: number;
  aiTags: string[];
}

export type LearningResource = ResourceItem;

export interface NotificationItem {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  type: 'request_match' | 'request_accepted' | 'session_invite' | 'feedback_received' | 'badge_earned' | 'system';
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}
