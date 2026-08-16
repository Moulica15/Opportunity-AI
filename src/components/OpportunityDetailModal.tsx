import React from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  Bot, 
  Bell, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck,
  Send,
  GraduationCap
} from 'lucide-react';
import { Opportunity, StudentProfile } from '../types';
import { calculateMatchScore } from '../utils/aiCounselor';

interface OpportunityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity | null;
  student: StudentProfile | null;
  isSaved: boolean;
  onToggleSave: (oppId: string) => void;
  onAskOppBot: (opp: Opportunity) => void;
  onSetReminder: (opp: Opportunity) => void;
  onApply: (opp: Opportunity) => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  isOpen,
  onClose,
  opportunity,
  student,
  isSaved,
  onToggleSave,
  onAskOppBot,
  onSetReminder,
  onApply,
}) => {
  if (!isOpen || !opportunity) return null;

  const userSkills = student?.skills || [];
  const matchScore = student ? calculateMatchScore(userSkills, opportunity.requiredSkills) : null;
  const userSkillSet = new Set(userSkills.map(s => s.toLowerCase()));

  // Calculate days remaining
  const calculateDaysLeft = (deadlineStr: string) => {
    try {
      const today = new Date('2026-08-15'); // Current reference context
      const target = new Date(deadlineStr);
      const diffTime = target.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 0;
    }
  };

  const daysLeft = calculateDaysLeft(opportunity.deadline);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex items-start justify-between">
          <div className="flex-1 pr-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                opportunity.category === 'Hackathon' 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : opportunity.category === 'Internship'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : opportunity.category === 'Scholarship'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              }`}>
                {opportunity.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                {opportunity.type} • {opportunity.location || 'Online'}
              </span>
              {daysLeft <= 7 && daysLeft >= 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                  ⚡ Closes in {daysLeft} Days
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {opportunity.title}
            </h2>
            <div className="text-sm font-semibold text-slate-400 mt-1 flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>{opportunity.host}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Key Metrics Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1 flex items-center space-x-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Prize / Grant / Stipend</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-emerald-300">
                {opportunity.stipendOrPrize}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Registration Deadline</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-amber-300">
                {opportunity.deadline}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20">
              <div className="text-xs text-indigo-300 mb-1 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Your Profile Match</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-indigo-200">
                {matchScore !== null ? `${matchScore}% Match` : 'Log in to calculate'}
              </div>
            </div>
          </div>

          {/* Description / Overview */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Opportunity Description & Scope
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
              {opportunity.description}
            </p>
          </div>

          {/* Eligibility Checklist */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Eligibility & Application Rules</span>
            </h3>
            <div className="space-y-2">
              {opportunity.eligibility.map((crit, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{crit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack & Required Skills */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              Required Stack & Skill Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {opportunity.requiredSkills.map((skill) => {
                const isMatched = userSkillSet.has(skill.toLowerCase());
                return (
                  <span
                    key={skill}
                    className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold ${
                      isMatched
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {isMatched ? '✓ ' : ''}{skill}
                  </span>
                );
              })}
            </div>
            {student && (
              <p className="text-[11px] text-slate-400 mt-2">
                Green tags indicate verified skills already present on your student profile.
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onToggleSave(opportunity.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center space-x-1.5 ${
                isSaved
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-amber-400" />
                  <span>Saved to Kanban</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Bookmark Listing</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onSetReminder(opportunity);
              }}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Set Reminder</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onAskOppBot(opportunity);
              }}
              className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>Ask OppBot About This</span>
            </button>

            <button
              type="button"
              onClick={() => onApply(opportunity)}
              className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/25 flex items-center space-x-1.5"
            >
              <span>Apply Directly</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
