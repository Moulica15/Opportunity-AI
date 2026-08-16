import React, { useState, useEffect } from 'react';
import { User, StudentProfile, AdminProfile, Opportunity, ApplicationItem, DeadlineReminder, ChatMessage, ApplicationStatus } from './types';
import { 
  getStoredCurrentUser, 
  setStoredCurrentUser, 
  getStoredOpportunities, 
  setStoredOpportunities, 
  getStoredApplications, 
  setStoredApplications, 
  getStoredReminders, 
  setStoredReminders, 
  getStoredChatMessages, 
  setStoredChatMessages 
} from './utils/storage';
import { generateOppBotResponse } from './utils/aiCounselor';
import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';
import { DiscoverFeed } from './components/DiscoverFeed';
import { OppBotCounselor } from './components/OppBotCounselor';
import { ApplicationTracker } from './components/ApplicationTracker';
import { PeerDirectory } from './components/PeerDirectory';
import { AdminDashboard } from './components/AdminDashboard';
import { DeadlineRemindersView } from './components/DeadlineRemindersView';
import { StudentProfileModal } from './components/StudentProfileModal';
import { AdminProfileModal } from './components/AdminProfileModal';
import { ReminderModal } from './components/ReminderModal';
import { OpportunityDetailModal } from './components/OpportunityDetailModal';

export default function App() {
  // Global State
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStoredCurrentUser());
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => getStoredOpportunities());
  const [activeView, setActiveView] = useState<string>('discover');

  // Applications & Reminders (keyed to current user)
  const [applications, setApplications] = useState<ApplicationItem[]>(() => 
    currentUser ? getStoredApplications(currentUser.id) : []
  );
  const [reminders, setReminders] = useState<DeadlineReminder[]>(() => 
    currentUser ? getStoredReminders(currentUser.id) : []
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => 
    currentUser ? getStoredChatMessages(currentUser.id) : []
  );

  // Modals state
  const [isStudentProfileModalOpen, setIsStudentProfileModalOpen] = useState(false);
  const [isAdminProfileModalOpen, setIsAdminProfileModalOpen] = useState(false);
  const [selectedOppForDetail, setSelectedOppForDetail] = useState<Opportunity | null>(null);
  const [selectedOppForReminder, setSelectedOppForReminder] = useState<Opportunity | null>(null);

  // Sync to local storage whenever critical states update
  useEffect(() => {
    setStoredCurrentUser(currentUser);
    if (currentUser) {
      setApplications(getStoredApplications(currentUser.id));
      setReminders(getStoredReminders(currentUser.id));
      setChatMessages(getStoredChatMessages(currentUser.id));
      
      // Default view based on role
      if (currentUser.role === 'admin' && (activeView === 'discover' || activeView === 'oppbot' || activeView === 'tracker' || activeView === 'peers')) {
        setActiveView('dashboard');
      } else if (currentUser.role === 'student' && (activeView === 'dashboard' || activeView === 'post-opportunity' || activeView === 'manage-postings' || activeView === 'student-directory')) {
        setActiveView('discover');
      }
    }
  }, [currentUser]);

  useEffect(() => {
    setStoredOpportunities(opportunities);
  }, [opportunities]);

  useEffect(() => {
    if (currentUser) {
      setStoredApplications(currentUser.id, applications);
    }
  }, [applications, currentUser]);

  useEffect(() => {
    if (currentUser) {
      setStoredReminders(reminders);
    }
  }, [reminders, currentUser]);

  useEffect(() => {
    if (currentUser) {
      setStoredChatMessages(currentUser.id, chatMessages);
    }
  }, [chatMessages, currentUser]);

  // Auth Handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveView('dashboard');
    } else {
      setActiveView('discover');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setStoredCurrentUser(null);
  };

  // Student Profile Update
  const handleSaveStudentProfile = (updated: StudentProfile) => {
    setCurrentUser(updated);
  };

  // Admin Profile Update
  const handleSaveAdminProfile = (updated: AdminProfile) => {
    setCurrentUser(updated);
  };

  // Opportunities Admin CRUD
  const handleAddOpportunity = (newOpp: Opportunity) => {
    const updated = [newOpp, ...opportunities];
    setOpportunities(updated);
  };

  const handleUpdateOpportunity = (updatedOpp: Opportunity) => {
    const updated = opportunities.map(o => o.id === updatedOpp.id ? updatedOpp : o);
    setOpportunities(updated);
  };

  const handleDeleteOpportunity = (oppId: string) => {
    const updated = opportunities.filter(o => o.id !== oppId);
    setOpportunities(updated);
  };

  // Bookmark / Kanban Application Actions
  const handleToggleSaveOpportunity = (oppId: string) => {
    if (!currentUser || currentUser.role !== 'student') return;

    const existingApp = applications.find(a => a.opportunityId === oppId);
    if (existingApp) {
      // Remove from applications
      setApplications(applications.filter(a => a.id !== existingApp.id));
    } else {
      // Add as saved
      const newApp: ApplicationItem = {
        id: `app-${Date.now()}`,
        opportunityId: oppId,
        userId: currentUser.id,
        status: 'saved',
        appliedDate: new Date().toISOString().split('T')[0],
        updatedDate: new Date().toISOString().split('T')[0],
        notes: 'Bookmarked from Discover Feed',
      };
      setApplications([...applications, newApp]);
    }
  };

  const handleUpdateApplicationStatus = (appId: string, newStatus: ApplicationStatus) => {
    setApplications(applications.map(a => 
      a.id === appId ? { ...a, status: newStatus, updatedDate: new Date().toISOString().split('T')[0] } : a
    ));
  };

  const handleUpdateApplicationNotes = (appId: string, notes: string) => {
    setApplications(applications.map(a => 
      a.id === appId ? { ...a, notes, updatedDate: new Date().toISOString().split('T')[0] } : a
    ));
  };

  const handleRemoveApplication = (appId: string) => {
    setApplications(applications.filter(a => a.id !== appId));
  };

  // Direct Apply Handler
  const handleApplyOpportunity = (opp: Opportunity) => {
    // Open external URL in new tab safely
    if (opp.applicationUrl) {
      window.open(opp.applicationUrl, '_blank', 'noopener,noreferrer');
    }

    // If student is logged in, automatically record application in Kanban
    if (currentUser && currentUser.role === 'student') {
      const existing = applications.find(a => a.opportunityId === opp.id);
      if (existing) {
        if (existing.status === 'saved') {
          handleUpdateApplicationStatus(existing.id, 'applied');
        }
      } else {
        const newApp: ApplicationItem = {
          id: `app-${Date.now()}`,
          opportunityId: opp.id,
          userId: currentUser.id,
          status: 'applied',
          appliedDate: new Date().toISOString().split('T')[0],
          updatedDate: new Date().toISOString().split('T')[0],
          notes: `Submitted application directly to ${opp.host}.`,
        };
        setApplications([...applications, newApp]);
      }
    }
  };

  // Reminder Actions
  const handleAddReminder = (newReminder: DeadlineReminder) => {
    setReminders([...reminders, newReminder]);
  };

  const handleToggleCompleteReminder = (reminderId: string) => {
    setReminders(reminders.map(r => 
      r.id === reminderId ? { ...r, isCompleted: !r.isCompleted } : r
    ));
  };

  const handleDeleteReminder = (reminderId: string) => {
    setReminders(reminders.filter(r => r.id !== reminderId));
  };

  // OppBot Messaging
  const handleSendMessage = (text: string) => {
    if (!currentUser) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);

    // Generate grounded OppBot answer
    setTimeout(() => {
      const response = generateOppBotResponse(text, currentUser, opportunities);
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        referencedOpportunityIds: response.referencedOpportunityIds,
        actionChips: response.actionChips,
      };
      setChatMessages([...newHistory, botMsg]);
    }, 250);
  };

  const handleClearChat = () => {
    if (!currentUser) return;
    const initialGreeting: ChatMessage[] = [
      {
        id: `msg-fresh-${Date.now()}`,
        sender: 'bot',
        text: `✨ Chat session cleared. I am **OppBot**, your Opportunity Counselor. How can I help you find hackathons, calculate skill matches, or prepare today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionChips: [
          { label: '🏆 Active Hackathons', query: 'Tell me about all open hackathons and their deadlines' },
          { label: '💰 Paid Internships', query: 'Which internships pay stipends and what skills do they need?' },
          { label: '📊 Analyze My Skill Gaps', query: 'Analyze my skill gaps across all active listings' },
        ]
      }
    ];
    setChatMessages(initialGreeting);
  };

  const handleAskOppBotAboutOpportunity = (opp: Opportunity) => {
    setActiveView('oppbot');
    handleSendMessage(`Tell me everything about ${opp.title} hosted by ${opp.host}, check my eligibility, and calculate my match score.`);
  };

  const handleSelectOpportunityById = (oppId: string) => {
    const opp = opportunities.find(o => o.id === oppId);
    if (opp) {
      setSelectedOppForDetail(opp);
    }
  };

  // If not logged in, render the Multi-Role Authentication Screen
  if (!currentUser) {
    return <AuthModal onLogin={handleLogin} />;
  }

  const isStudent = currentUser.role === 'student';
  const student = isStudent ? (currentUser as StudentProfile) : null;
  const admin = !isStudent ? (currentUser as AdminProfile) : null;
  const savedOpportunityIds = applications.filter(a => a.status === 'saved').map(a => a.opportunityId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* 1. Spacious Left Sidebar Navigation */}
      <Sidebar
        user={currentUser}
        activeView={activeView}
        onNavigate={(view) => setActiveView(view)}
        onOpenEditProfile={() => {
          if (isStudent) {
            setIsStudentProfileModalOpen(true);
          } else {
            setIsAdminProfileModalOpen(true);
          }
        }}
        onLogout={handleLogout}
        savedCount={savedOpportunityIds.length}
        remindersCount={reminders.filter(r => !r.isCompleted).length}
      />

      {/* 2. Main Dedicated Scrollable Workspace */}
      <main className="flex-1 pl-64 min-h-screen">
        <div className="p-6 sm:p-8 max-w-7xl mx-auto w-full">
          {/* STUDENT VIEWS */}
          {isStudent && student && (
            <>
              {activeView === 'discover' && (
                <DiscoverFeed
                  student={student}
                  opportunities={opportunities}
                  savedOpportunityIds={savedOpportunityIds}
                  onToggleSave={handleToggleSaveOpportunity}
                  onOpenEditProfile={() => setIsStudentProfileModalOpen(true)}
                  onAskOppBot={handleAskOppBotAboutOpportunity}
                  onSetReminder={(opp) => setSelectedOppForReminder(opp)}
                  onSelectOpportunity={(opp) => setSelectedOppForDetail(opp)}
                  onApply={handleApplyOpportunity}
                />
              )}

              {activeView === 'oppbot' && (
                <OppBotCounselor
                  user={currentUser}
                  opportunities={opportunities}
                  messages={chatMessages}
                  onSendMessage={handleSendMessage}
                  onClearChat={handleClearChat}
                  onSelectOpportunityById={handleSelectOpportunityById}
                  onOpenEditProfile={() => setIsStudentProfileModalOpen(true)}
                />
              )}

              {activeView === 'tracker' && (
                <ApplicationTracker
                  applications={applications}
                  opportunities={opportunities}
                  onUpdateStatus={handleUpdateApplicationStatus}
                  onUpdateNotes={handleUpdateApplicationNotes}
                  onRemoveApplication={handleRemoveApplication}
                  onSelectOpportunity={(opp) => setSelectedOppForDetail(opp)}
                  onNavigateToDiscover={() => setActiveView('discover')}
                />
              )}

              {activeView === 'peers' && (
                <PeerDirectory />
              )}

              {activeView === 'reminders' && (
                <DeadlineRemindersView
                  reminders={reminders}
                  opportunities={opportunities}
                  onToggleComplete={handleToggleCompleteReminder}
                  onDeleteReminder={handleDeleteReminder}
                  onSelectOpportunity={(opp) => setSelectedOppForDetail(opp)}
                  onNavigateToDiscover={() => setActiveView('discover')}
                />
              )}
            </>
          )}

          {/* ADMIN VIEWS */}
          {!isStudent && admin && (
            <AdminDashboard
              admin={admin}
              opportunities={opportunities}
              activeTab={activeView as any}
              onSetActiveTab={(tab) => setActiveView(tab)}
              onAddOpportunity={handleAddOpportunity}
              onUpdateOpportunity={handleUpdateOpportunity}
              onDeleteOpportunity={handleDeleteOpportunity}
              onOpenEditProfile={() => setIsAdminProfileModalOpen(true)}
            />
          )}
        </div>
      </main>

      {/* MODALS */}
      {/* 1. Edit Student Profile Modal */}
      {isStudent && student && (
        <StudentProfileModal
          isOpen={isStudentProfileModalOpen}
          onClose={() => setIsStudentProfileModalOpen(false)}
          student={student}
          onSave={handleSaveStudentProfile}
        />
      )}

      {/* 2. Edit Admin Profile Modal */}
      {!isStudent && admin && (
        <AdminProfileModal
          isOpen={isAdminProfileModalOpen}
          onClose={() => setIsAdminProfileModalOpen(false)}
          admin={admin}
          onSave={handleSaveAdminProfile}
        />
      )}

      {/* 3. Opportunity Detail Modal */}
      <OpportunityDetailModal
        isOpen={!!selectedOppForDetail}
        onClose={() => setSelectedOppForDetail(null)}
        opportunity={selectedOppForDetail}
        student={student}
        isSaved={selectedOppForDetail ? savedOpportunityIds.includes(selectedOppForDetail.id) : false}
        onToggleSave={handleToggleSaveOpportunity}
        onAskOppBot={handleAskOppBotAboutOpportunity}
        onSetReminder={(opp) => setSelectedOppForReminder(opp)}
        onApply={handleApplyOpportunity}
      />

      {/* 4. Add Deadline Reminder Modal */}
      <ReminderModal
        isOpen={!!selectedOppForReminder}
        onClose={() => setSelectedOppForReminder(null)}
        opportunity={selectedOppForReminder}
        onAddReminder={handleAddReminder}
      />
    </div>
  );
}
