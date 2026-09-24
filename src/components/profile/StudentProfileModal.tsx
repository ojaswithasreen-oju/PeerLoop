import React from 'react';
import {
  MapPin,
  GraduationCap,
  Calendar,
  Clock,
  Star,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
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
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          <img
            src={profile.avatarUrl}
            alt={profile.fullName}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-xl"
          />

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">{profile.fullName}</h3>
                <p className="text-xs text-indigo-400 font-medium">
                  {profile.course} • {profile.college}
                </p>
              </div>

              <div className="flex items-center justify-center sm:justify-end gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                <span className="text-xs font-mono font-bold">Reputation:</span>
                <span className="text-sm font-extrabold text-white">{profile.reputation.score}/100</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">{profile.bio}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {profile.location || 'University Campus'}
              </span>
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                {profile.year}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                {profile.preferredLanguage}
              </span>
            </div>
          </div>
        </div>

        {/* Evidence-Based Badges Showcase */}
        {profile.reputation.badges && profile.reputation.badges.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Average Rating</span>
            <div className="flex items-center justify-center gap-1 mt-1 text-amber-400 font-bold text-sm">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{profile.reputation.averageRating} / 5.0</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Learners Helped</span>
            <p className="mt-1 text-sm font-bold text-white">{profile.reputation.learnersHelped}</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Clarity Rating</span>
            <p className="mt-1 text-sm font-bold text-cyan-400">{profile.reputation.clarityScore}%</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Consistency</span>
            <p className="mt-1 text-sm font-bold text-emerald-400">{profile.reputation.consistencyScore}%</p>
          </div>
        </div>

        {/* Skills Taught with Evidence Badges */}
        {profile.skillsToTeach && profile.skillsToTeach.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Verified Skills Taught</span>
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
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Skills Currently Learning</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.skillsToLearn.map((s) => (
                <div
                  key={s.id}
                  className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-xs text-slate-300"
                >
                  <span className="font-semibold text-white">{s.name}</span>
                  <span className="text-slate-500 ml-1.5">({s.level})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Availability & Preferred Format */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Availability:</span>
            </span>
            <p className="text-slate-400 mt-0.5">
              {profile.availability.days.join(', ')} • {profile.availability.timeSlots.join(', ')}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-slate-500">Format:</span>
            <span className="text-slate-300 font-medium ml-1">{profile.learningFormat}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
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
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20"
            >
              Request 1-on-1 Session
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
