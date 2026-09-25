import React from 'react';
import { TeachingSpace } from './TeachingSpace';
import { Lecture, LearningSession } from '../../types';

interface MentorPortalProps {
  onStartSession?: (session: LearningSession) => void;
  onOpenQuickDoubt?: () => void;
  onOpenLecture?: (lecture: Lecture) => void;
  onViewStudentProfile?: (studentId: string) => void;
}

export const MentorPortal: React.FC<MentorPortalProps> = ({
  onStartSession,
  onOpenQuickDoubt,
  onOpenLecture,
  onViewStudentProfile,
}) => {
  return (
    <TeachingSpace
      onOpenLecture={(lecture) => {
        if (onOpenLecture) {
          onOpenLecture(lecture);
        } else if (onStartSession) {
          // Fallback adaptor to 1-on-1 session if onOpenLecture not directly wired
          const fallbackSession: LearningSession = {
            id: `session-lec-${lecture.id}-${Date.now()}`,
            learnerId: 'user-priya',
            learnerName: 'Priya N.',
            learnerAvatar:
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
            learnerCollege: 'Georgia Tech',
            mentorId: lecture.teacherId,
            mentorName: lecture.teacherName,
            mentorAvatar: lecture.teacherAvatar || '',
            mentorCollege: lecture.teacherCollege || 'UC Berkeley',
            skill: lecture.skill,
            topic: lecture.title,
            status: 'active',
            durationMinutes: parseInt(lecture.duration) || 45,
            isRecording: false,
            recordingConsentLearner: false,
            recordingConsentMentor: false,
            recordingSeconds: 0,
            sharedNotes: `Lecture: ${lecture.title}\nDifficulty: ${lecture.difficulty}\nEnrolled: ${lecture.enrolledCount} students\nObjectives:\n${lecture.learningObjectives.join('\n')}`,
            chatMessages: [],
            copilotItems: [],
          };
          onStartSession(fallbackSession);
        }
      }}
      onViewStudentProfile={onViewStudentProfile}
      onOpenQuickDoubt={onOpenQuickDoubt}
    />
  );
};
