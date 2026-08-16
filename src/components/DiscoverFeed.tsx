import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock, 
  Bookmark, 
  BookmarkCheck, 
  Bot, 
  Bell, 
  ExternalLink, 
  UserCircle2, 
  CheckCircle2, 
  AlertCircle,
  SlidersHorizontal,
  Flame,
  Layers
} from 'lucide-react';
import { Opportunity, StudentProfile, OpportunityCategory } from '../types';
import { calculateMatchScore } from '../utils/aiCounselor';

interface DiscoverFeedProps {
  student: StudentProfile;
  opportunities: Opportunity[];
  savedOpportunityIds: string[];
  onToggleSave: (oppId: string) => void;
  onOpenEditProfile: () => void;
  onAskOppBot: (opp: Opportunity) => void;
  onSetReminder: (opp: Opportunity) => void;
  onSelectOpportunity: (opp: Opportunity) => void;
  onApply: (opp: Opportunity) => void;
}

export const DiscoverFeed: React.FC<DiscoverFeedProps> = ({
  student,
  opportunities,
  savedOpportunityIds,
  onToggleSave,
  onOpenEditProfile,
  onAskOppBot,
  onSetReminder,
  onSelectOpportunity,
  onApply,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'match' | 'deadline' | 'newest'>('match');

  const categories: string[] = ['All', 'Hackathon', 'Internship', 'Scholarship', 'Fellowship', 'Training'];

  // Reference date context (2026-08-15)
  const calculateDaysLeft = (deadlineStr: string) => {
    try {
      const today = new Date('2026-08-15');
      const target = new Date(deadlineStr);
      const diffTime = target.getTime() - today.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch {
      return 0;
    }
  };

  const filteredOpportunities = useMemo(() => {
    return opportunities
      .filter((opp) => {
        if (!opp.isActive) return false;

        // Category filter
        if (selectedCategory !== 'All' && opp.category !== selectedCategory) {
          return false;
        }

        // Type filter (Remote, On-site, Hybrid)
        if (selectedType !== 'All' && opp.type !== selectedType) {
          return false;
        }

        // Urgency filter (< 7 days left)
        if (urgentOnly) {
          const days = calculateDaysLeft(opp.deadline);
          if (days > 7 || days < 0) return false;
        }

        // Search text
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = opp.title.toLowerCase().includes(q);
          const matchHost = opp.host.toLowerCase().includes(q);
          const matchSkill = opp.requiredSkills.some((s) => s.toLowerCase().includes(q));
          const matchDesc = opp.description.toLowerCase().includes(q);
          if (!matchTitle && !matchHost && !matchSkill && !matchDesc) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'match') {
          const scoreA = calculateMatchScore(student.skills, a.requiredSkills);
          const scoreB = calculateMatchScore(student.skills, b.requiredSkills);
          return scoreB - scoreA;
        } else if (sortBy === 'deadline') {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        } else {
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
        }
      });
  }, [opportunities, selectedCategory, selectedType, urgentOnly, searchQuery, sortBy, student.skills]);

  return (
    <div className="space-y-8">
      {/* 1. Student Profile Snapshot Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-500/25 shrink-0">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Welcome back, {student.name}!
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  {student.year} • {student.semester}
                </span>
                {student.isAvailableForHackathons && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Available for Hackathons</span>
                  </span>
                )}
              </div>
              <div className="text-xs sm:text-sm text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>🏫 {student.college}</span>
                <span>•</span>
                <span>🎓 {student.branch}</span>
                <span>•</span>
                <span className="text-indigo-400 font-semibold">⭐ CGPA: {student.cgpa}</span>
              </div>
            </div>
          </div>

          {/* Edit Student Profile Button */}
          <div className="flex items-center gap-3 self-start lg:self-center">
            <button
              id="feed-btn-edit-student-profile"
              onClick={onOpenEditProfile}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 shadow-sm"
            >
              <UserCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Edit Student Profile</span>
            </button>
          </div>
        </div>

        {/* Verified Skills Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 font-semibold mr-1 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Matching Skills:</span>
            </span>
            {student.skills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/90 text-slate-300 border border-slate-700/80"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="text-xs text-slate-400">
            🎯 Target: <span className="text-slate-200 font-medium">{student.targetDomain}</span>
          </div>
        </div>
      </div>

      {/* 2. Multi-Facet Search & Filter Controls */}
      <div className="space-y-4">
        {/* Search Input Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              id="input-discover-search"
              type="text"
              placeholder="Search by title, host, skill tags (e.g. React, PyTorch), or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2">
            <select
              id="select-sort-opportunities"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="match">🎯 Sort by Match % (Highest)</option>
              <option value="deadline">⏳ Sort by Deadline (Soonest)</option>
              <option value="newest">✨ Sort by Recently Added</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Modality Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Category Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`filter-cat-${cat.toLowerCase()}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Modality & Urgency Toggles */}
          <div className="flex items-center space-x-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Formats</option>
              <option value="Remote">Remote Only</option>
              <option value="On-site">On-site Only</option>
              <option value="Hybrid">Hybrid</option>
            </select>

            <button
              onClick={() => setUrgentOnly(!urgentOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center space-x-1.5 ${
                urgentOnly
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${urgentOnly ? 'text-rose-400' : 'text-slate-400'}`} />
              <span>Closing &lt; 7 Days</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. 2-Column Spacious Opportunity Cards Grid */}
      {filteredOpportunities.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
          <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200 mb-1">
            No matching opportunities found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Try adjusting your search keywords, clear category filters, or ask OppBot to search for specific themes.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedType('All');
              setUrgentOnly(false);
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOpportunities.map((opp) => {
            const matchScore = calculateMatchScore(student.skills, opp.requiredSkills);
            const isSaved = savedOpportunityIds.includes(opp.id);
            const daysLeft = calculateDaysLeft(opp.deadline);
            const userSkillSet = new Set(student.skills.map(s => s.toLowerCase()));

            return (
              <div
                key={opp.id}
                id={`opp-card-${opp.id}`}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/90 rounded-3xl p-6 transition-all duration-200 flex flex-col justify-between shadow-lg hover:shadow-indigo-500/5 group"
              >
                <div>
                  {/* Top Badges & Match Pill */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        opp.category === 'Hackathon'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : opp.category === 'Internship'
                          ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                          : opp.category === 'Scholarship'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                      }`}>
                        {opp.category}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {opp.type}
                      </span>
                      {daysLeft <= 7 && daysLeft >= 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-1">
                          <Flame className="w-3 h-3 text-rose-400" />
                          <span>{daysLeft}d left</span>
                        </span>
                      )}
                    </div>

                    {/* Real-time Match Score Badge */}
                    <div className={`px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center space-x-1.5 ${
                      matchScore >= 75
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : matchScore >= 40
                        ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{matchScore}% Match</span>
                    </div>
                  </div>

                  {/* Title & Host */}
                  <h3
                    onClick={() => onSelectOpportunity(opp)}
                    className="text-lg font-bold text-white tracking-tight cursor-pointer group-hover:text-indigo-400 transition-colors line-clamp-2"
                  >
                    {opp.title}
                  </h3>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-1 mb-3">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{opp.host}</span>
                  </div>

                  {/* Award / Stipend & Deadline Bar */}
                  <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 mb-4 text-xs">
                    <div>
                      <div className="text-[11px] text-slate-400">Award / Stipend</div>
                      <div className="font-semibold text-emerald-300 truncate">
                        {opp.stipendOrPrize}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400">Deadline</div>
                      <div className="font-semibold text-amber-300 truncate">
                        {opp.deadline}
                      </div>
                    </div>
                  </div>

                  {/* Required Skill Tags */}
                  <div className="mb-4">
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5">
                      Required Skills
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-16 overflow-hidden">
                      {opp.requiredSkills.map((skill) => {
                        const isMatch = userSkillSet.has(skill.toLowerCase());
                        return (
                          <span
                            key={skill}
                            className={`px-2 py-0.5 rounded-lg text-[11px] font-medium ${
                              isMatch
                                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700/80'
                            }`}
                          >
                            {isMatch ? '✓ ' : ''}{skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5">
                    {/* Bookmark Toggle */}
                    <button
                      type="button"
                      onClick={() => onToggleSave(opp.id)}
                      title={isSaved ? 'Remove from saved' : 'Save to Kanban Tracker'}
                      className={`p-2 rounded-xl border transition-colors ${
                        isSaved
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>

                    {/* Set Reminder Button */}
                    <button
                      type="button"
                      onClick={() => onSetReminder(opp)}
                      title="Add Deadline Reminder"
                      className="p-2 bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-700 rounded-xl transition-colors"
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Ask OppBot About This */}
                    <button
                      type="button"
                      onClick={() => onAskOppBot(opp)}
                      className="px-3 py-1.5 bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5"
                    >
                      <Bot className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Ask OppBot</span>
                    </button>

                    {/* View Details / Apply Direct */}
                    <button
                      type="button"
                      onClick={() => onSelectOpportunity(opp)}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center space-x-1 shadow-sm"
                    >
                      <span>Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
