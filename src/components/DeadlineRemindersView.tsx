import React from 'react';
import { 
  CalendarDays, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  Download, 
  ExternalLink, 
  Bell, 
  Plus, 
  AlertCircle 
} from 'lucide-react';
import { DeadlineReminder, Opportunity } from '../types';

interface DeadlineRemindersViewProps {
  reminders: DeadlineReminder[];
  opportunities: Opportunity[];
  onToggleComplete: (reminderId: string) => void;
  onDeleteReminder: (reminderId: string) => void;
  onSelectOpportunity: (opp: Opportunity) => void;
  onNavigateToDiscover: () => void;
}

export const DeadlineRemindersView: React.FC<DeadlineRemindersViewProps> = ({
  reminders,
  opportunities,
  onToggleComplete,
  onDeleteReminder,
  onSelectOpportunity,
  onNavigateToDiscover,
}) => {
  const getOpp = (oppId: string) => opportunities.find(o => o.id === oppId);

  const handleDownloadSingleIcs = (reminder: DeadlineReminder) => {
    const opp = getOpp(reminder.opportunityId);
    const startDateFormatted = reminder.deadline.replace(/-/g, '') + 'T090000Z';
    const endDateFormatted = reminder.deadline.replace(/-/g, '') + 'T180000Z';

    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Opportunity Finder//Reminder//EN',
      'BEGIN:VEVENT',
      `SUMMARY:DEADLINE: ${reminder.opportunityTitle}`,
      `DESCRIPTION:${reminder.note || 'Submission Deadline'}\\nLink: ${opp?.applicationUrl || ''}`,
      `DTSTART:${startDateFormatted}`,
      `DTEND:${endDateFormatted}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${reminder.opportunityTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <CalendarDays className="w-6 h-6" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Deadline Reminders & Calendar Sync
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Keep track of registration cutoffs and export deadlines to Google Calendar or Outlook.
            </p>
          </div>

          <button
            onClick={onNavigateToDiscover}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Set New Reminder</span>
          </button>
        </div>
      </div>

      {/* Reminders List */}
      {reminders.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
          <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200 mb-1">
            No active deadline reminders set
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Click the bell icon on any opportunity card in the Discover Feed to set custom alerts and generate calendar files.
          </p>
          <button
            onClick={onNavigateToDiscover}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
          >
            Browse Active Deadlines
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reminders.map((rem) => {
            const opp = getOpp(rem.opportunityId);

            return (
              <div
                key={rem.id}
                className={`bg-slate-900 border rounded-3xl p-5 flex flex-col justify-between transition-all ${
                  rem.isCompleted
                    ? 'border-slate-800/60 opacity-60'
                    : 'border-slate-800 hover:border-slate-700 shadow-lg'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <button
                      onClick={() => onToggleComplete(rem.id)}
                      className={`flex items-center space-x-2 text-xs font-bold transition-colors ${
                        rem.isCompleted ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 ${rem.isCompleted ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span>{rem.isCompleted ? 'Completed' : 'Pending Action'}</span>
                    </button>

                    <button
                      onClick={() => onDeleteReminder(rem.id)}
                      className="text-slate-500 hover:text-red-400 p-1"
                      title="Delete reminder"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3
                    onClick={() => opp && onSelectOpportunity(opp)}
                    className={`text-sm font-bold text-white mb-2 ${opp ? 'cursor-pointer hover:text-indigo-400' : ''}`}
                  >
                    {rem.opportunityTitle}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs mb-3">
                    <div>
                      <div className="text-[10px] text-slate-500">Alert Trigger Date</div>
                      <div className="font-semibold text-indigo-300">{rem.remindDate}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">Official Deadline</div>
                      <div className="font-semibold text-amber-300">{rem.deadline}</div>
                    </div>
                  </div>

                  {rem.note && (
                    <p className="text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80 mb-3">
                      📝 {rem.note}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => handleDownloadSingleIcs(rem)}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .ICS Event</span>
                  </button>

                  {opp && (
                    <button
                      onClick={() => onSelectOpportunity(opp)}
                      className="text-xs font-semibold text-slate-300 hover:text-white flex items-center space-x-1"
                    >
                      <span>View Listing</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
