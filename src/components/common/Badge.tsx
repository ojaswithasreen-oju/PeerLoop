import React from 'react';
import { Sparkles, Award, ShieldCheck, Zap, BookOpen, CheckCircle2 } from 'lucide-react';
import { MentorBadge } from '../../types';

export const BadgeIcon: React.FC<{ name: string; className?: string }> = ({ name, className = 'w-4 h-4' }) => {
  switch (name) {
    case 'Sparkles':
    case 'Rising Mentor':
      return <Sparkles className={className} />;
    case 'Award':
    case 'Top Student Mentor':
      return <Award className={className} />;
    case 'ShieldCheck':
    case 'Community Educator':
      return <ShieldCheck className={className} />;
    case 'Zap':
    case 'Flame':
    case 'Clarity Champion':
      return <Zap className={className} />;
    case 'BookOpen':
    case 'Community Guide':
      return <BookOpen className={className} />;
    default:
      return <Award className={className} />;
  }
};

export const MentorBadgePill: React.FC<{ badge: MentorBadge; size?: 'sm' | 'md' }> = ({
  badge,
  size = 'md',
}) => {
  const isSmall = size === 'sm';

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium bg-[#F7F8F5] border-[#E5EAE7] text-[#1F2933] ${
        isSmall ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
      title={badge.description}
    >
      <BadgeIcon name={badge.icon || badge.name} className={`${isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-[#3F6B5B]`} />
      <span>{badge.name}</span>
    </div>
  );
};

export const VerifiedSkillPill: React.FC<{
  method?: string;
  skillName: string;
  level?: string;
}> = ({ method = 'Skill Assessment Passed', skillName, level }) => {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F7F8F5] border border-[#E5EAE7] text-xs text-[#1F2933]">
      <span className="font-semibold">{skillName}</span>
      {level && <span className="text-[#6B7280]">({level})</span>}
      <span className="inline-flex items-center gap-1 text-[11px] text-[#387B62] bg-[#DCE9E2] px-1.5 py-0.2 rounded font-medium">
        <CheckCircle2 className="w-3 h-3 text-[#387B62]" />
        {method}
      </span>
    </div>
  );
};
