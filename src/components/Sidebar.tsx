import React from 'react';
import { 
  Compass, 
  Bot, 
  Kanban, 
  Users, 
  LayoutDashboard, 
  PlusCircle, 
  ListFilter, 
  GraduationCap, 
  LogOut, 
  UserCircle2, 
  Sparkles,
  ShieldCheck,
  CalendarDays
} from 'lucide-react';
import { User } from '../types';

export type StudentNavView = 'discover' | 'oppbot' | 'tracker' | 'peers' | 'reminders';
export type AdminNavView = 'dashboard' | 'post-opportunity' | 'manage-postings' | 'student-directory';

interface SidebarProps {
  user: User;
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenEditProfile: () => void;
  onLogout: () => void;
  savedCount: number;
  remindersCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  activeView,
  onNavigate,
  onOpenEditProfile,
  onLogout,
  savedCount,
  remindersCount,
}) => {
  const isStudent = user.role === 'student';

  const studentNavItems = [
    { id: 'discover', label: 'Discover Feed', icon: Compass, badge: null },
    { id: 'oppbot', label: 'OppBot Counselor', icon: Bot, badge: 'AI' },
    { id: 'tracker', label: 'Application Tracker', icon: Kanban, badge: savedCount > 0 ? `${savedCount}` : null },
    { id: 'peers', label: 'Peer & Team Hub', icon: Users, badge: null },
    { id: 'reminders', label: 'Deadline Reminders', icon: CalendarDays, badge: remindersCount > 0 ? `${remindersCount}` : null },
  ];

  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, badge: null },
    { id: 'post-opportunity', label: 'Post Opportunity', icon: PlusCircle, badge: 'New' },
    { id: 'manage-postings', label: 'Manage Postings', icon: ListFilter, badge: null },
    { id: 'student-directory', label: 'Student Directory', icon: GraduationCap, badge: null },
  ];

  const navItems = isStudent ? studentNavItems : adminNavItems;

  return (
    <aside className="w-64 fixed inset-y-0 left-0 bg-slate-900 border-r border-slate-800 flex flex-col justify-between z-30 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate(isStudent ? 'discover' : 'dashboard')}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <Compass className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-lg text-white tracking-tight">Opportunity</span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-indigo-400 font-medium">
              <span>Finder Hub</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          {isStudent ? 'Student Workspace' : 'Institution Portal'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 ring-1 ring-indigo-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  item.badge === 'AI' 
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
                    : item.badge === 'New'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick Help / OppBot Prompt Banner for Students */}
        {isStudent && (
          <div className="pt-6">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/70 to-slate-900/90 border border-indigo-500/20 text-xs">
              <div className="flex items-center space-x-2 text-indigo-300 font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>OppBot Ready</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed mb-2.5">
                Ask about hackathons, internships, or calculate your match scores.
              </p>
              <button
                id="sidebar-ask-oppbot-btn"
                onClick={() => onNavigate('oppbot')}
                className="w-full py-1.5 px-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-center space-x-1.5"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Open OppBot Chat</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer User Profile & Session Controls */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center space-x-3 mb-3 px-1">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-bold text-sm shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate flex items-center space-x-1.5">
              <span className="truncate">{user.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                isStudent ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'
              }`}>
                {isStudent ? 'Student' : 'Admin'}
              </span>
              <span className="text-slate-400 text-[11px] truncate">
                {isStudent ? (user as any).branch?.split(' ')[0] || 'Enrolled' : (user as any).designation || 'Placement'}
              </span>
            </div>
          </div>
        </div>

        {/* Role-Specific Profile Edit Trigger Button */}
        <button
          id={isStudent ? 'btn-edit-student-profile' : 'btn-edit-admin-profile'}
          onClick={onOpenEditProfile}
          className="w-full mb-2 py-2 px-3 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center space-x-2"
        >
          <UserCircle2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>{isStudent ? 'Edit Student Profile' : 'Edit Admin Profile'}</span>
        </button>

        {/* Log Out Button */}
        <button
          id="btn-sidebar-logout"
          onClick={onLogout}
          className="w-full py-2 px-3 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-xl text-xs font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
