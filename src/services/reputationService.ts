import { MentorBadge, SessionFeedback, UserProfile } from '../types';

/**
 * Calculates evidence-based mentor reputation.
 * Prioritizes QUALITY > QUANTITY.
 */
export function calculateReputation(
  currentRep: UserProfile['reputation'],
  newFeedback?: SessionFeedback
): UserProfile['reputation'] {
  let {
    learnersHelped,
    sessionsCount,
    averageRating,
    clarityScore,
    accuracyScore,
    consistencyScore,
    badges,
  } = currentRep;

  if (newFeedback) {
    sessionsCount += 1;
    learnersHelped += 1;

    // Weight recent rating
    const fRatings = newFeedback.ratings;
    const currentWeight = Math.min(sessionsCount - 1, 10);
    averageRating = Number(
      ((averageRating * currentWeight + fRatings.overallHelpfulness) / (currentWeight + 1)).toFixed(2)
    );

    // Update Clarity & Accuracy scores (scale of 0-100)
    const newClarity = fRatings.explanationClarity * 20;
    const newAccuracy = fRatings.accuracy * 20;

    clarityScore = Math.round((clarityScore * currentWeight + newClarity) / (currentWeight + 1));
    accuracyScore = Math.round((accuracyScore * currentWeight + newAccuracy) / (currentWeight + 1));

    // Consistency score bonus for consecutive high ratings
    if (fRatings.overallHelpfulness >= 4.5) {
      consistencyScore = Math.min(100, consistencyScore + 2);
    }

    // Check for badges to unlock
    const currentBadgeNames = new Set(badges.map((b) => b.name));

    if (!currentBadgeNames.has('Rising Mentor') && sessionsCount >= 5 && averageRating >= 4.7) {
      badges.push({
        id: `badge-rising-${Date.now()}`,
        name: 'Rising Mentor',
        description: 'Completed 5+ peer sessions with high rating and positive learner feedback',
        icon: 'Sparkles',
        earnedDate: new Date().toISOString().split('T')[0],
        rarity: 'common',
      });
    }

    if (!currentBadgeNames.has('Clarity Champion') && clarityScore >= 95 && sessionsCount >= 8) {
      badges.push({
        id: `badge-clarity-${Date.now()}`,
        name: 'Clarity Champion',
        description: 'Achieved 95%+ conceptual clarity rating from peer learners',
        icon: 'Zap',
        earnedDate: new Date().toISOString().split('T')[0],
        rarity: 'rare',
      });
    }

    if (!currentBadgeNames.has('Top Student Mentor') && sessionsCount >= 20 && averageRating >= 4.85) {
      badges.push({
        id: `badge-top-${Date.now()}`,
        name: 'Top Student Mentor',
        description: 'Elite peer mentor status with over 20 verified sessions and glowing reviews',
        icon: 'Award',
        earnedDate: new Date().toISOString().split('T')[0],
        rarity: 'elite',
      });
    }

    if (!currentBadgeNames.has('Community Educator') && learnersHelped >= 35) {
      badges.push({
        id: `badge-educator-${Date.now()}`,
        name: 'Community Educator',
        description: 'Helped 35+ unique university peers overcome technical hurdles',
        icon: 'ShieldCheck',
        earnedDate: new Date().toISOString().split('T')[0],
        rarity: 'elite',
      });
    }
  }

  // Calculate composite reputation score (0 - 100)
  // 40% Rating + 25% Clarity + 20% Accuracy + 15% Consistency
  const ratingNormalized = (averageRating / 5.0) * 100;
  const compositeScore = Math.round(
    ratingNormalized * 0.4 +
      clarityScore * 0.25 +
      accuracyScore * 0.2 +
      consistencyScore * 0.15
  );

  return {
    score: Math.min(100, Math.max(0, compositeScore)),
    learnersHelped,
    sessionsCount,
    averageRating,
    clarityScore,
    accuracyScore,
    consistencyScore,
    badges,
  };
}

export const ALL_AVAILABLE_BADGES: Omit<MentorBadge, 'earnedDate'>[] = [
  {
    id: 'badge-rising',
    name: 'Rising Mentor',
    description: 'Maintained 4.8+ rating across first 10 peer teaching sessions',
    icon: 'Sparkles',
    rarity: 'common',
  },
  {
    id: 'badge-clarity',
    name: 'Clarity Champion',
    description: 'Awarded for explaining complex concepts with crystal clarity',
    icon: 'Zap',
    rarity: 'rare',
  },
  {
    id: 'badge-guide',
    name: 'Community Guide',
    description: 'Actively resolved 15+ student doubt requests in the community',
    icon: 'BookOpen',
    rarity: 'common',
  },
  {
    id: 'badge-top',
    name: 'Top Student Mentor',
    description: 'Completed 20+ verified peer sessions with 95%+ recommendation rate',
    icon: 'Award',
    rarity: 'elite',
  },
  {
    id: 'badge-educator',
    name: 'Community Educator',
    description: 'Helped over 35 individual peers build real skills',
    icon: 'ShieldCheck',
    rarity: 'elite',
  },
];
