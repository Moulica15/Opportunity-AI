import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Github, 
  Linkedin, 
  Send, 
  X, 
  UserPlus, 
  Code, 
  GraduationCap, 
  Award, 
  Check 
} from 'lucide-react';
import { Peer } from '../types';
import { INITIAL_PEERS } from '../data/mockData';

export const PeerDirectory: React.FC = () => {
  const [peers, setPeers] = useState<Peer[]>(INITIAL_PEERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('All');
  const [hackathonOnly, setHackathonOnly] = useState(false);

  // Invite modal state
  const [selectedPeerForInvite, setSelectedPeerForInvite] = useState<Peer | null>(null);
  const [inviteMessage, setInviteMessage] = useState('Hey! I saw your profile on Opportunity Finder. I am forming a team for the upcoming Smart India Hackathon and would love to collaborate!');
  const [targetHackathon, setTargetHackathon] = useState('Smart India Hackathon (SIH) 2026');
  const [inviteSentSuccess, setInviteSentSuccess] = useState(false);

  // Collect all unique peer skills
  const allSkills = useMemo(() => {
    const set = new Set<string>();
    peers.forEach(p => p.skills.forEach(s => set.add(s)));
    return ['All', ...Array.from(set)];
  }, [peers]);

  const filteredPeers = useMemo(() => {
    return peers.filter((peer) => {
      if (hackathonOnly && !peer.isAvailableForHackathons) {
        return false;
      }
      if (selectedSkillFilter !== 'All' && !peer.skills.includes(selectedSkillFilter)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = peer.name.toLowerCase().includes(q);
        const matchBranch = peer.branch.toLowerCase().includes(q);
        const matchDomain = peer.targetDomain.toLowerCase().includes(q);
        const matchSkills = peer.skills.some(s => s.toLowerCase().includes(q));
        if (!matchName && !matchBranch && !matchDomain && !matchSkills) {
          return false;
        }
      }
      return true;
    });
  }, [peers, searchQuery, selectedSkillFilter, hackathonOnly]);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteSentSuccess(true);
    setTimeout(() => {
      setInviteSentSuccess(false);
      setSelectedPeerForInvite(null);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Users className="w-6 h-6" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Peer & Team Directory
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Find teammates with complementary skills for hackathons, research papers, and open-source projects.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              ⚡ {peers.filter(p => p.isAvailableForHackathons).length} Hackers Available Now
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search peers by name, major, or tech stack (e.g. PyTorch, Next.js, IoT)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={selectedSkillFilter}
              onChange={(e) => setSelectedSkillFilter(e.target.value)}
              className="px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Skill Tags</option>
              {allSkills.filter(s => s !== 'All').map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>

            <button
              onClick={() => setHackathonOnly(!hackathonOnly)}
              className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                hackathonOnly
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Available for Hackathons</span>
            </button>
          </div>
        </div>
      </div>

      {/* Peer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPeers.map((peer) => (
          <div
            key={peer.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-6 flex flex-col justify-between shadow-lg hover:shadow-indigo-500/5 transition-all group"
          >
            <div>
              {/* Top Avatar & Hackathon Badge */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={peer.avatar}
                    alt={peer.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shadow-md"
                  />
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {peer.name}
                      </h3>
                      {peer.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" title="Verified Campus Student" />
                      )}
                    </div>
                    <div className="text-xs text-slate-400">
                      {peer.branch} • {peer.year}
                    </div>
                  </div>
                </div>

                {peer.isAvailableForHackathons ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    Open for Teams
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-500">
                    Busy
                  </span>
                )}
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3 bg-slate-950/40 p-3 rounded-2xl border border-slate-800/60">
                {peer.bio}
              </p>

              {/* Domain & CGPA */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
                <span>🎯 {peer.targetDomain}</span>
                <span className="font-semibold text-slate-200">⭐ {peer.cgpa} CGPA</span>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {peer.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-slate-950 text-indigo-300 border border-slate-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {peer.github && (
                  <a
                    href={peer.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {peer.linkedin && (
                  <a
                    href={peer.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>

              <button
                onClick={() => setSelectedPeerForInvite(peer)}
                className="px-3.5 py-1.5 bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Invite to Team</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Modal */}
      {selectedPeerForInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedPeerForInvite.avatar}
                  alt={selectedPeerForInvite.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <h3 className="text-base font-bold text-white">
                    Invite {selectedPeerForInvite.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Propose collaboration for a hackathon or project.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPeerForInvite(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Target Hackathon / Project
                </label>
                <select
                  value={targetHackathon}
                  onChange={(e) => setTargetHackathon(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Smart India Hackathon (SIH) 2026">Smart India Hackathon (SIH) 2026</option>
                  <option value="Uber Global Hackathon: Mobility 2026">Uber Global Hackathon: Mobility 2026</option>
                  <option value="Google Summer of Code (GSoC) Mentee">Google Summer of Code (GSoC)</option>
                  <option value="Independent AI Research Project">Independent AI / Open Source Project</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Invitation Note
                </label>
                <textarea
                  rows={3}
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedPeerForInvite(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-indigo-600/25 flex items-center space-x-2"
                >
                  {inviteSentSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Invitation Sent!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Team Invitation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
