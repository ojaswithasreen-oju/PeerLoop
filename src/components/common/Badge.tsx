import React from 'react';
import { Sparkles, Award, ShieldCheck, Zap, BookOpen, Flame, CheckCircle2 } from 'lucide-react';
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
  const rarityColors = {
    common: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    rare: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    elite: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  };

  const isSmall = size === 'sm';

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium transition-all ${
        rarityColors[badge.rarity || 'common']
      } ${isSmall ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}`}
      title={badge.description}
    >
      <BadgeIcon name={badge.icon || badge.name} className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
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
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700/80 text-xs text-slate-200">
      <span className="font-semibold text-slate-100">{skillName}</span>
      {level && <span className="text-slate-400">({level})</span>}
      <span className="inline-flex items-center gap-1 text-[11px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
        <CheckCircle2 className="w-3 h-3 text-cyan-400" />
        {method}
      </span>
    </div>
  );
};
