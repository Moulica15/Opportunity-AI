import React, { useState } from 'react';
import { 
  Kanban, 
  Plus, 
  MoreVertical, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  ArrowRight,
  ArrowLeft,
  FileText,
  BookmarkCheck,
  Send,
  Award,
  Archive,
  Edit3
} from 'lucide-react';
import { ApplicationItem, Opportunity, ApplicationStatus } from '../types';

interface ApplicationTrackerProps {
  applications: ApplicationItem[];
  opportunities: Opportunity[];
  onUpdateStatus: (appId: string, newStatus: ApplicationStatus) => void;
  onUpdateNotes: (appId: string, notes: string) => void;
  onRemoveApplication: (appId: string) => void;
  onSelectOpportunity: (opp: Opportunity) => void;
  onNavigateToDiscover: () => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applications,
  opportunities,
  onUpdateStatus,
  onUpdateNotes,
  onRemoveApplication,
  onSelectOpportunity,
  onNavigateToDiscover,
}) => {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [currentNoteText, setCurrentNoteText] = useState('');

  const columns: { id: ApplicationStatus; title: string; icon: any; color: string; badgeBg: string }[] = [
    { id: 'saved', title: 'Bookmarked / Saved', icon: BookmarkCheck, color: 'text-amber-400', badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
    { id: 'applied', title: 'Applications Submitted', icon: Send, color: 'text-blue-400', badgeBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30' },
    { id: 'shortlisted', title: 'Shortlisted / Interviews', icon: Award, color: 'text-emerald-400', badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
    { id: 'archived', title: 'Completed / Archived', icon: Archive, color: 'text-slate-400', badgeBg: 'bg-slate-800 text-slate-400 border-slate-700' },
  ];

  const getOpp = (oppId: string) => opportunities.find((o) => o.id === oppId);

  const startEditNote = (app: ApplicationItem) => {
    setEditingNoteId(app.id);
    setCurrentNoteText(app.notes || '');
  };

  const saveNote = (appId: string) => {
    onUpdateNotes(appId, currentNoteText);
    setEditingNoteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Kanban className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Application Tracker (Kanban)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Monitor your hackathon submissions, internship rounds, and scholarship statuses in one place.
          </p>
        </div>

        <button
          onClick={onNavigateToDiscover}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 self-start sm:self-center shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Discover More Opportunities</span>
        </button>
      </div>

      {/* Kanban Board Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {columns.map((col) => {
          const colApps = applications.filter((a) => a.status === col.id);
          const ColIcon = col.icon;

          return (
            <div
              key={col.id}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 flex flex-col min-h-[520px] shadow-lg"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <ColIcon className={`w-4 h-4 ${col.color}`} />
                  <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    {col.title}
                  </h2>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${col.badgeBg}`}>
                  {colApps.length}
                </span>
              </div>

              {/* Cards List in Column */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[600px] pr-1">
                {colApps.length === 0 ? (
                  <div className="h-40 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-4 text-center">
                    <p className="text-xs text-slate-500 font-medium">No items in {col.title.toLowerCase()}</p>
                    {col.id === 'saved' && (
                      <button
                        onClick={onNavigateToDiscover}
                        className="mt-2 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
                      >
                        Browse listings →
                      </button>
                    )}
                  </div>
                ) : (
                  colApps.map((app) => {
                    const opp = getOpp(app.opportunityId);
                    if (!opp) return null;

                    return (
                      <div
                        key={app.id}
                        className="bg-slate-950/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 transition-all duration-150 shadow-md group"
                      >
                        {/* Top Category Badge & Remove */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            opp.category === 'Hackathon'
                              ? 'bg-amber-500/15 text-amber-300'
                              : opp.category === 'Internship'
                              ? 'bg-blue-500/15 text-blue-300'
                              : 'bg-emerald-500/15 text-emerald-300'
                          }`}>
                            {opp.category}
                          </span>

                          <button
                            onClick={() => onRemoveApplication(app.id)}
                            title="Remove tracking card"
                            className="text-slate-500 hover:text-red-400 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Title */}
                        <h3
                          onClick={() => onSelectOpportunity(opp)}
                          className="text-sm font-bold text-white hover:text-indigo-400 transition-colors cursor-pointer line-clamp-2 mb-1"
                        >
                          {opp.title}
                        </h3>

                        <div className="text-xs text-slate-400 flex items-center space-x-1 mb-2.5">
                          <Building2 className="w-3 h-3 text-slate-500" />
                          <span className="truncate">{opp.host}</span>
                        </div>

                        {/* Stipend / Deadline quick info */}
                        <div className="text-[11px] text-slate-400 space-y-1 py-2 px-2.5 bg-slate-900/80 rounded-xl mb-3 border border-slate-800/80">
                          <div className="flex justify-between">
                            <span>Deadline:</span>
                            <span className="text-amber-300 font-medium">{opp.deadline}</span>
                          </div>
                          {opp.stipendOrPrize && (
                            <div className="flex justify-between">
                              <span>Grant/Stipend:</span>
                              <span className="text-emerald-300 font-medium truncate max-w-[120px]">{opp.stipendOrPrize}</span>
                            </div>
                          )}
                          {app.interviewDate && (
                            <div className="flex justify-between text-indigo-300 font-semibold pt-1 border-t border-slate-800">
                              <span>Interview:</span>
                              <span>{new Date(app.interviewDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>

                        {/* Notes Section */}
                        <div className="mb-3">
                          {editingNoteId === app.id ? (
                            <div className="space-y-1.5">
                              <textarea
                                rows={2}
                                value={currentNoteText}
                                onChange={(e) => setCurrentNoteText(e.target.value)}
                                placeholder="Add submission note, interview round info, team member tasks..."
                                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                              />
                              <div className="flex justify-end space-x-1.5">
                                <button
                                  onClick={() => setEditingNoteId(null)}
                                  className="px-2 py-0.5 text-[10px] text-slate-400 hover:text-white"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => saveNote(app.id)}
                                  className="px-2.5 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-semibold"
                                >
                                  Save Note
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() => startEditNote(app)}
                              className="p-2 rounded-xl bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/60 cursor-pointer text-xs text-slate-400 hover:text-slate-300 flex items-start justify-between"
                            >
                              <p className="line-clamp-2 text-[11px]">
                                {app.notes ? `📝 ${app.notes}` : 'Click to add personal notes...'}
                              </p>
                              <Edit3 className="w-3 h-3 ml-1 shrink-0 opacity-40 group-hover:opacity-100" />
                            </div>
                          )}
                        </div>

                        {/* Move Status Buttons */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                          {/* Previous status action */}
                          {col.id === 'applied' && (
                            <button
                              onClick={() => onUpdateStatus(app.id, 'saved')}
                              className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-1"
                            >
                              <ArrowLeft className="w-3 h-3" />
                              <span>Back to Saved</span>
                            </button>
                          )}
                          {col.id === 'shortlisted' && (
                            <button
                              onClick={() => onUpdateStatus(app.id, 'applied')}
                              className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-1"
                            >
                              <ArrowLeft className="w-3 h-3" />
                              <span>Applied</span>
                            </button>
                          )}
                          {col.id === 'archived' && (
                            <button
                              onClick={() => onUpdateStatus(app.id, 'shortlisted')}
                              className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-1"
                            >
                              <ArrowLeft className="w-3 h-3" />
                              <span>Reopen</span>
                            </button>
                          )}

                          {/* Next status action */}
                          {col.id === 'saved' && (
                            <button
                              onClick={() => onUpdateStatus(app.id, 'applied')}
                              className="ml-auto text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
                            >
                              <span>Mark Applied</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                          {col.id === 'applied' && (
                            <button
                              onClick={() => onUpdateStatus(app.id, 'shortlisted')}
                              className="ml-auto text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
                            >
                              <span>Shortlisted</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                          {col.id === 'shortlisted' && (
                            <button
                              onClick={() => onUpdateStatus(app.id, 'archived')}
                              className="ml-auto text-[11px] text-slate-400 hover:text-white flex items-center space-x-1"
                            >
                              <span>Archive</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
