import React from 'react';
import {
  MapPin,
  GraduationCap,
  Clock,
  Star,
  BookOpen,
  Award,
  Globe,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { UserProfile } from '../../types';
import { MentorBadgePill, VerifiedSkillPill } from '../common/Badge';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  onConnect?: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onConnect,
}) => {
  if (!profile) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="space-y-6">
        {/* Profile Header Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl bg-[#F7F8F5] border border-[#E5EAE7]">
          <img
            src={profile.avatarUrl}
            alt={profile.fullName}
            className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover border border-[#E5EAE7]"
          />

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#1F2933] tracking-tight">{profile.fullName}</h3>
                <p className="text-xs text-[#3F6B5B] font-medium">
                  {profile.course} • {profile.college}
                </p>
              </div>

              <div className="flex items-center justify-center sm:justify-end gap-1.5 px-2.5 py-1 rounded-lg bg-[#DCE9E2] text-[#3F6B5B]">
                <span className="text-xs font-mono font-bold">Reputation:</span>
                <span className="text-sm font-extrabold text-[#1F2933]">{profile.reputation.score}/100</span>
              </div>
            </div>

            <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">{profile.bio}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3 text-xs text-[#6B7280]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#3F6B5B]" />
                {profile.location || 'University Campus'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-[#3F6B5B]" />
                {profile.year}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-[#3F6B5B]" />
                {profile.preferredLanguage}
              </span>
            </div>
          </div>
        </div>

        {/* Evidence Badges */}
        {profile.reputation.badges && profile.reputation.badges.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-[#1F2933] uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#D99B26]" />
              <span>Earned Mentor Badges</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.reputation.badges.map((b) => (
                <MentorBadgePill key={b.id} badge={b} />
              ))}
            </div>
          </div>
        )}

        {/* Quality Metrics Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono">
          <div className="p-3 rounded-xl bg-[#F7F8F5] border border-[#E5EAE7] text-center">
            <span className="text-[10px] text-[#6B7280] uppercase font-semibold">Average Rating</span>
            <div className="flex items-center justify-center gap-1 mt-1 text-[#D99B26] font-bold text-sm">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{profile.reputation.averageRating} / 5.0</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#F7F8F5] border border-[#E5EAE7] text-center">
            <span className="text-[10px] text-[#6B7280] uppercase font-semibold">Learners Helped</span>
            <p className="mt-1 text-sm font-bold text-[#1F2933]">{profile.reputation.learnersHelped}</p>
          </div>

          <div className="p-3 rounded-xl bg-[#F7F8F5] border border-[#E5EAE7] text-center">
            <span className="text-[10px] text-[#6B7280] uppercase font-semibold">Clarity Rating</span>
            <p className="mt-1 text-sm font-bold text-[#387B62]">{profile.reputation.clarityScore}%</p>
          </div>

          <div className="p-3 rounded-xl bg-[#F7F8F5] border border-[#E5EAE7] text-center">
            <span className="text-[10px] text-[#6B7280] uppercase font-semibold">Consistency</span>
            <p className="mt-1 text-sm font-bold text-[#3F6B5B]">{profile.reputation.consistencyScore}%</p>
          </div>
        </div>

        {/* Skills Taught */}
        {profile.skillsToTeach && profile.skillsToTeach.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-[#1F2933] uppercase tracking-wide mb-2">
              Verified Skills Taught
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.skillsToTeach.map((s) => (
                <VerifiedSkillPill
                  key={s.id}
                  skillName={s.name}
                  level={s.level}
                  method={s.verifiedMethod || 'Skill Assessment Passed'}
                />
              ))}
            </div>
          </div>
        )}

        {/* Skills Learning */}
        {profile.skillsToLearn && profile.skillsToLearn.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-[#1F2933] uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#3F6B5B]" />
              <span>Skills Currently Learning</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.skillsToLearn.map((s) => (
                <div
                  key={s.id}
                  className="px-2.5 py-1 rounded-md bg-[#F7F8F5] border border-[#E5EAE7] text-xs text-[#1F2933]"
                >
                  <span className="font-semibold">{s.name}</span>
                  <span className="text-[#6B7280] ml-1.5">({s.level})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Availability & Preferred Format */}
        <div className="p-3.5 rounded-xl bg-[#F7F8F5] border border-[#E5EAE7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-semibold text-[#1F2933] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#3F6B5B]" />
              <span>Availability:</span>
            </span>
            <p className="text-[#6B7280] mt-0.5">
              {profile.availability.days.join(', ')} • {profile.availability.timeSlots.join(', ')}
            </p>
          </div>

          <div>
            <span className="text-[#6B7280]">Format:</span>
            <span className="text-[#1F2933] font-medium ml-1">{profile.learningFormat}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E5EAE7]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-[#6B7280] hover:text-[#1F2933]"
          >
            Close
          </button>
          {onConnect && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onConnect();
              }}
              className="px-5 py-2.5 rounded-lg bg-[#3F6B5B] hover:bg-[#34594B] text-white text-xs font-semibold transition-colors"
            >
              Request 1-on-1 Session
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
