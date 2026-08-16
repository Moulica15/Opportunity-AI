import React, { useState } from 'react';
import { X, Calendar, Bell, Download, Check, Clock, AlertCircle } from 'lucide-react';
import { Opportunity, DeadlineReminder } from '../types';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity | null;
  onAddReminder: (reminder: DeadlineReminder) => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  opportunity,
  onAddReminder,
}) => {
  if (!isOpen || !opportunity) return null;

  // Calculate default reminder date (3 days before deadline)
  const defaultRemindDate = () => {
    try {
      const d = new Date(opportunity.deadline);
      d.setDate(d.getDate() - 3);
      return d.toISOString().split('T')[0];
    } catch {
      return opportunity.deadline;
    }
  };

  const [remindDate, setRemindDate] = useState(defaultRemindDate());
  const [note, setNote] = useState(`Review eligibility, polish proposal PPT and submit application for ${opportunity.title}`);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newRem: DeadlineReminder = {
      id: `rem-${Date.now()}`,
      opportunityId: opportunity.id,
      opportunityTitle: opportunity.title,
      deadline: opportunity.deadline,
      remindDate,
      note,
      isCompleted: false,
    };
    onAddReminder(newRem);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 500);
  };

  const handleDownloadIcs = () => {
    // Generate an RFC-compliant .ics iCalendar file for standard calendar import (Google Calendar, Outlook, Apple Calendar)
    const startDateFormatted = opportunity.deadline.replace(/-/g, '') + 'T090000Z';
    const endDateFormatted = opportunity.deadline.replace(/-/g, '') + 'T180000Z';

    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Opportunity Finder//Deadline Reminder//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:DEADLINE: ${opportunity.title}`,
      `DESCRIPTION:${opportunity.description.replace(/\n/g, ' ')}\\n\\nHost: ${opportunity.host}\\nAward: ${opportunity.stipendOrPrize}\\nApplication Link: ${opportunity.applicationUrl}`,
      `URL:${opportunity.applicationUrl}`,
      `DTSTART:${startDateFormatted}`,
      `DTEND:${endDateFormatted}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-P3D',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: 3 Days remaining to submit ${opportunity.title}`,
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${opportunity.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_deadline.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Add Deadline Reminder
              </h2>
              <p className="text-xs text-slate-400">
                Track closing dates in your app feed and export to Google Calendar.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800">
            <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
              Target Listing
            </div>
            <div className="text-sm font-bold text-white mb-1">
              {opportunity.title}
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span>Host: {opportunity.host}</span>
              <span>•</span>
              <span className="text-amber-400 font-semibold flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Deadline: {opportunity.deadline}</span>
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Alert Trigger Date
            </label>
            <input
              type="date"
              required
              value={remindDate}
              onChange={(e) => setRemindDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Reminder Note / Action Checklist
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Quick iCal Export Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleDownloadIcs}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Export as .ICS Calendar Event (Google/Outlook)</span>
            </button>
          </div>

          <div className="pt-3 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-indigo-600/25 flex items-center space-x-2"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Reminder Saved!</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>Save In-App Reminder</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
