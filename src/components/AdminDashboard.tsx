import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  ListFilter, 
  GraduationCap, 
  Building2, 
  Users, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Trash2, 
  Plus, 
  X, 
  ExternalLink, 
  Sparkles, 
  Search, 
  DollarSign,
  Briefcase,
  Layers,
  Save,
  Check,
  CheckCheck
} from 'lucide-react';
import { AdminProfile, Opportunity, OpportunityCategory, StudentProfile } from '../types';
import { INITIAL_PEERS, DEMO_STUDENT } from '../data/mockData';

interface AdminDashboardProps {
  admin: AdminProfile;
  opportunities: Opportunity[];
  activeTab: 'dashboard' | 'post-opportunity' | 'manage-postings' | 'student-directory';
  onSetActiveTab: (tab: any) => void;
  onAddOpportunity: (newOpp: Opportunity) => void;
  onUpdateOpportunity: (updatedOpp: Opportunity) => void;
  onDeleteOpportunity: (oppId: string) => void;
  onOpenEditProfile: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  admin,
  opportunities,
  activeTab,
  onSetActiveTab,
  onAddOpportunity,
  onUpdateOpportunity,
  onDeleteOpportunity,
  onOpenEditProfile,
}) => {
  // New Opportunity Form State
  const [title, setTitle] = useState('');
  const [host, setHost] = useState(admin.institutionName);
  const [category, setCategory] = useState<OpportunityCategory>('Hackathon');
  const [type, setType] = useState<'Remote' | 'On-site' | 'Hybrid'>('Hybrid');
  const [location, setLocation] = useState('Campus Innovation Center');
  const [stipendOrPrize, setStipendOrPrize] = useState('₹75,000 Total Prizes');
  const [deadline, setDeadline] = useState('2026-09-15');
  const [description, setDescription] = useState('');
  const [eligibilityText, setEligibilityText] = useState('Open to all B.Tech / MCA students of 1st to 4th year\nMinimum CGPA 7.0 with no backlogs\nValid Student ID required');
  const [skills, setSkills] = useState<string[]>(['React', 'Python', 'Node.js']);
  const [skillInput, setSkillInput] = useState('');
  const [applicationUrl, setApplicationUrl] = useState('https://portal.apex.edu/apply');
  const [postSuccess, setPostSuccess] = useState(false);

  // Edit Opportunity Modal State
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);

  // Student Directory Search
  const [studentSearch, setStudentSearch] = useState('');

  const activePostings = opportunities.filter(o => o.isActive);

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (s: string) => {
    setSkills(skills.filter(skill => skill !== s));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !host.trim()) return;

    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      title: title.trim(),
      host: host.trim(),
      category,
      type,
      location: location.trim(),
      stipendOrPrize: stipendOrPrize.trim(),
      deadline,
      postedDate: new Date().toISOString().split('T')[0],
      description: description.trim() || `Official ${category} hosted by ${host}. Excellent platform for students to gain verified experience.`,
      eligibility: eligibilityText.split('\n').filter(line => line.trim().length > 0),
      requiredSkills: skills.length > 0 ? skills : ['Problem Solving', 'Engineering'],
      applicationUrl: applicationUrl.trim() || 'https://google.com',
      isActive: true,
      featured: true,
      createdBy: admin.name,
      applicantsCount: 0,
    };

    onAddOpportunity(newOpp);
    setPostSuccess(true);
    setTimeout(() => {
      setPostSuccess(false);
      // Reset form
      setTitle('');
      setDescription('');
      onSetActiveTab('manage-postings');
    }, 800);
  };

  const handleSaveEditedOpp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOpp) return;
    onUpdateOpportunity(editingOpp);
    setEditingOpp(null);
  };

  // Mock student list for admin directory (combines demo student and peers)
  const studentsList = [
    {
      id: DEMO_STUDENT.id,
      name: DEMO_STUDENT.name,
      email: DEMO_STUDENT.email,
      branch: DEMO_STUDENT.branch,
      year: DEMO_STUDENT.year,
      cgpa: DEMO_STUDENT.cgpa,
      skills: DEMO_STUDENT.skills,
      targetDomain: DEMO_STUDENT.targetDomain,
      savedCount: DEMO_STUDENT.savedOpportunities.length,
      appliedCount: DEMO_STUDENT.appliedOpportunities.length,
    },
    ...INITIAL_PEERS.map(p => ({
      id: p.id,
      name: p.name,
      email: `${p.name.toLowerCase().replace(' ', '.')}@apex.edu`,
      branch: p.branch,
      year: p.year,
      cgpa: p.cgpa,
      skills: p.skills,
      targetDomain: p.targetDomain,
      savedCount: 2,
      appliedCount: 1,
    }))
  ];

  const filteredStudents = studentsList.filter(s => {
    if (!studentSearch.trim()) return true;
    const q = studentSearch.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.branch.toLowerCase().includes(q) ||
      s.skills.some(sk => sk.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8">
      {/* Top Admin Welcome & Institution Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-purple-500/25 shrink-0">
              {admin.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {admin.institutionName} • Admin Portal
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  {admin.designation}
                </span>
              </div>
              <div className="text-xs sm:text-sm text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>👤 Officer: <strong className="text-slate-200">{admin.name}</strong></span>
                <span>•</span>
                <span>🏢 Dept: {admin.department}</span>
                <span>•</span>
                <span>✉️ {admin.email}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="admin-btn-edit-admin-profile"
              onClick={onOpenEditProfile}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 shadow-sm"
            >
              <Edit3 className="w-4 h-4 text-purple-400" />
              <span>Edit Admin Profile</span>
            </button>
            <button
              onClick={() => onSetActiveTab('post-opportunity')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 shadow-md shadow-indigo-600/25"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Listing</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Summary Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Listings</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{activePostings.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1">Live in student feeds & OppBot</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered Students</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{studentsList.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Across CSE, IT & Data Science</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tracked Applications</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">48+</div>
          <div className="text-[11px] text-emerald-400 mt-1">Shortlisted in top tech rounds</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Deadlines This Month</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-300">6 Events</div>
          <div className="text-[11px] text-slate-400 mt-1">Upcoming registration cutoffs</div>
        </div>
      </div>

      {/* Admin Tab View Switcher */}
      <div className="flex p-1 bg-slate-900 rounded-2xl border border-slate-800 w-full sm:w-fit">
        <button
          id="admin-tab-overview"
          onClick={() => onSetActiveTab('dashboard')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'dashboard'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Overview & Quick Stats
        </button>
        <button
          id="admin-tab-post"
          onClick={() => onSetActiveTab('post-opportunity')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'post-opportunity'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ➕ Post Opportunity
        </button>
        <button
          id="admin-tab-manage"
          onClick={() => onSetActiveTab('manage-postings')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'manage-postings'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📋 Manage Postings ({opportunities.length})
        </button>
        <button
          id="admin-tab-students"
          onClick={() => onSetActiveTab('student-directory')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'student-directory'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🎓 Student Directory
        </button>
      </div>

      {/* VIEW 1: DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h2 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Placement & Opportunity Highlights</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-indigo-300">Top In-Demand Student Skills</div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['React', 'Python', 'TypeScript', 'Node.js', 'PyTorch', 'Docker', 'PostgreSQL'].map(skill => (
                    <span key={skill} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 pt-2">
                  92% of student profiles currently list at least 3 matching technologies for open hackathons.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-emerald-300">OppBot Live Grounding Status</div>
                <p className="text-xs text-slate-300">
                  OppBot assistant is synchronized with all <strong className="text-white">{opportunities.length} database entries</strong>. When students ask questions or click &quot;Ask OppBot About This&quot;, answers are generated with real-time stipend and eligibility context.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => onSetActiveTab('post-opportunity')}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                  >
                    <span>Publish a new placement or hackathon notice →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: POST OPPORTUNITY FORM */}
      {activeTab === 'post-opportunity' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl max-w-4xl">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Post New Opportunity Listing
            </h2>
            <p className="text-xs text-slate-400">
              Instantly publishes to student feeds and connects with OppBot AI Counselor memory.
            </p>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Opportunity Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex TechSprint Hackathon 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Host Organization / Company</label>
                <input
                  type="text"
                  required
                  placeholder="Apex Corporate Relations / Microsoft"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as OpportunityCategory)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Hackathon">Hackathon</option>
                  <option value="Internship">Internship</option>
                  <option value="Scholarship">Scholarship</option>
                  <option value="Fellowship">Fellowship</option>
                  <option value="Training">Training / Cohort</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Format</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Registration Deadline</label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Award, Stipend or Grant Amount</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ₹1,00,000 Cash Prize or ₹50,000/mo Stipend"
                  value={stipendOrPrize}
                  onChange={(e) => setStipendOrPrize(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Application Portal URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://company.com/apply"
                  value={applicationUrl}
                  onChange={(e) => setApplicationUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Detailed Overview & Scope</label>
              <textarea
                rows={3}
                required
                placeholder="Describe problem statements, project deliverables, and team guidelines..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Eligibility */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Eligibility Criteria (1 rule per line)
              </label>
              <textarea
                rows={3}
                required
                value={eligibilityText}
                onChange={(e) => setEligibilityText(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            {/* Skills Tags */}
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
              <label className="block text-xs font-semibold text-slate-200 mb-2">
                Required Skill Tags (For calculating Student Match %)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Add skill tag (e.g. Next.js, PyTorch, Go)..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                  className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                >
                  Add Tag
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map(s => (
                  <span key={s} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    {s}
                    <button type="button" onClick={() => handleRemoveSkill(s)} className="ml-1.5 text-indigo-400 hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                id="btn-submit-new-opportunity"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/25 flex items-center space-x-2"
              >
                {postSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Listing Published Successfully!</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Publish to Opportunity Feed</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW 3: MANAGE POSTINGS */}
      {activeTab === 'manage-postings' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Manage All Database Postings
              </h2>
              <p className="text-xs text-slate-400">
                Toggling or editing immediately updates student discover feeds and OppBot intelligence.
              </p>
            </div>
            <button
              onClick={() => onSetActiveTab('post-opportunity')}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post New</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Opportunity</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4">Award / Stipend</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {opportunities.map((opp) => (
                  <tr key={opp.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white max-w-xs truncate">
                      <div>{opp.title}</div>
                      <div className="text-[11px] font-normal text-slate-400 flex items-center space-x-1">
                        <span>{opp.host}</span>
                        <span>•</span>
                        <span>{opp.type}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {opp.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-amber-300">
                      {opp.deadline}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-emerald-300 truncate max-w-[140px]">
                      {opp.stipendOrPrize}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onUpdateOpportunity({ ...opp, isActive: !opp.isActive })}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors flex items-center space-x-1 ${
                          opp.isActive
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${opp.isActive ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        <span>{opp.isActive ? 'Active' : 'Paused / Expired'}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setEditingOpp(opp)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit Posting Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteOpportunity(opp.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: STUDENT DIRECTORY */}
      {activeTab === 'student-directory' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Enrolled Student Profiles
              </h2>
              <p className="text-xs text-slate-400">
                Inspect registered students, their CGPA, and verified technology skills.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search students or skills..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Branch & Year</th>
                  <th className="py-3 px-4">CGPA</th>
                  <th className="py-3 px-4">Target Domain</th>
                  <th className="py-3 px-4">Key Skills</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div>{st.name}</div>
                      <div className="text-[11px] font-normal text-slate-500">{st.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {st.branch} • <span className="text-slate-400">{st.year}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-indigo-300">
                      {st.cgpa}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {st.targetDomain}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {st.skills.slice(0, 4).map(sk => (
                          <span key={sk} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                            {sk}
                          </span>
                        ))}
                        {st.skills.length > 4 && (
                          <span className="text-[10px] text-slate-500 font-semibold">
                            +{st.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Opportunity Modal */}
      {editingOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
            <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <h3 className="text-base font-bold text-white">
                Edit Opportunity: {editingOpp.title}
              </h3>
              <button
                onClick={() => setEditingOpp(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedOpp} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingOpp.title}
                  onChange={(e) => setEditingOpp({ ...editingOpp, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Host</label>
                  <input
                    type="text"
                    required
                    value={editingOpp.host}
                    onChange={(e) => setEditingOpp({ ...editingOpp, host: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Deadline</label>
                  <input
                    type="date"
                    required
                    value={editingOpp.deadline}
                    onChange={(e) => setEditingOpp({ ...editingOpp, deadline: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Award / Stipend</label>
                <input
                  type="text"
                  required
                  value={editingOpp.stipendOrPrize}
                  onChange={(e) => setEditingOpp({ ...editingOpp, stipendOrPrize: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingOpp.description}
                  onChange={(e) => setEditingOpp({ ...editingOpp, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingOpp(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
