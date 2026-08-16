import { User, Opportunity, ApplicationItem, DeadlineReminder, ChatMessage, StudentProfile } from '../types';
import { DEMO_STUDENT, DEMO_ADMIN, INITIAL_OPPORTUNITIES } from '../data/mockData';

const KEYS = {
  CURRENT_USER: 'opp_finder_current_user',
  ALL_USERS: 'opp_finder_users',
  OPPORTUNITIES: 'opp_finder_opportunities',
  APPLICATIONS: 'opp_finder_applications',
  REMINDERS: 'opp_finder_reminders',
  CHAT_MESSAGES: 'opp_finder_chat_messages_',
};

export const getStoredCurrentUser = (): User | null => {
  try {
    const raw = localStorage.getItem(KEYS.CURRENT_USER);
    if (!raw) return DEMO_STUDENT; // Default initial session is Vasu
    return JSON.parse(raw);
  } catch {
    return DEMO_STUDENT;
  }
};

export const setStoredCurrentUser = (user: User | null) => {
  try {
    if (!user) {
      localStorage.removeItem(KEYS.CURRENT_USER);
    } else {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    }
  } catch (e) {
    console.error('Failed to store current user', e);
  }
};

export const getStoredOpportunities = (): Opportunity[] => {
  try {
    const raw = localStorage.getItem(KEYS.OPPORTUNITIES);
    if (!raw) {
      localStorage.setItem(KEYS.OPPORTUNITIES, JSON.stringify(INITIAL_OPPORTUNITIES));
      return INITIAL_OPPORTUNITIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_OPPORTUNITIES;
  }
};

export const setStoredOpportunities = (opps: Opportunity[]) => {
  try {
    localStorage.setItem(KEYS.OPPORTUNITIES, JSON.stringify(opps));
  } catch (e) {
    console.error('Failed to save opportunities', e);
  }
};

export const getStoredApplications = (userId: string): ApplicationItem[] => {
  try {
    const raw = localStorage.getItem(KEYS.APPLICATIONS);
    const allApps: ApplicationItem[] = raw ? JSON.parse(raw) : [
      {
        id: 'app-demo-1',
        opportunityId: 'opp-2',
        userId: 'student-demo-1',
        status: 'applied',
        appliedDate: '2026-08-10',
        updatedDate: '2026-08-12',
        notes: 'Submitted proposal for Python Open Source tooling. Mentor review in progress.',
      },
      {
        id: 'app-demo-2',
        opportunityId: 'opp-1',
        userId: 'student-demo-1',
        status: 'saved',
        appliedDate: '2026-08-08',
        updatedDate: '2026-08-08',
        notes: 'Need to finalize team members and register before Sept 10.',
      },
      {
        id: 'app-demo-3',
        opportunityId: 'opp-4',
        userId: 'student-demo-1',
        status: 'shortlisted',
        appliedDate: '2026-08-05',
        updatedDate: '2026-08-14',
        notes: 'Passed initial coding assessment! Technical round scheduled.',
        interviewDate: '2026-08-20T14:30:00',
      }
    ];
    return allApps.filter(app => app.userId === userId);
  } catch {
    return [];
  }
};

export const setStoredApplications = (userId: string, userApps: ApplicationItem[]) => {
  try {
    const raw = localStorage.getItem(KEYS.APPLICATIONS);
    const allApps: ApplicationItem[] = raw ? JSON.parse(raw) : [];
    const otherApps = allApps.filter(app => app.userId !== userId);
    const updated = [...otherApps, ...userApps];
    localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save applications', e);
  }
};

export const getStoredReminders = (userId: string): DeadlineReminder[] => {
  try {
    const raw = localStorage.getItem(KEYS.REMINDERS);
    const all: DeadlineReminder[] = raw ? JSON.parse(raw) : [
      {
        id: 'rem-1',
        opportunityId: 'opp-1',
        opportunityTitle: 'Smart India Hackathon (SIH) 2026',
        deadline: '2026-09-10',
        remindDate: '2026-09-03',
        note: 'Review problem statement PPT and team composition.',
      },
      {
        id: 'rem-2',
        opportunityId: 'opp-6',
        opportunityTitle: 'Uber Global Hackathon: Mobility 2026',
        deadline: '2026-08-22',
        remindDate: '2026-08-20',
        note: 'Push GitHub repo and record demo video.',
      }
    ];
    return all;
  } catch {
    return [];
  }
};

export const setStoredReminders = (reminders: DeadlineReminder[]) => {
  try {
    localStorage.setItem(KEYS.REMINDERS, JSON.stringify(reminders));
  } catch (e) {
    console.error('Failed to save reminders', e);
  }
};

export const getStoredChatMessages = (userId: string): ChatMessage[] => {
  try {
    const raw = localStorage.getItem(`${KEYS.CHAT_MESSAGES}${userId}`);
    if (raw) return JSON.parse(raw);
    return [
      {
        id: 'msg-init-1',
        sender: 'bot',
        text: `👋 Hello! I am **OppBot**, your Opportunity & Career Intelligence Counselor. \n\nI have real-time access to all listings in our database. I can analyze hackathons, stipend internships, scholarships, eligibility rules, and calculate your specific skill matches. How can I guide you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionChips: [
          { label: '🏆 Active Hackathons', query: 'Tell me about all open hackathons and their deadlines' },
          { label: '💰 Paid Internships', query: 'Which internships pay stipends and what skills do they need?' },
          { label: '📊 Analyze My Skill Gaps', query: 'Analyze my skill gaps across all active listings' },
          { label: '🎓 Scholarships Available', query: 'What scholarships or grants are currently open?' },
        ]
      }
    ];
  } catch {
    return [];
  }
};

export const setStoredChatMessages = (userId: string, messages: ChatMessage[]) => {
  try {
    localStorage.setItem(`${KEYS.CHAT_MESSAGES}${userId}`, JSON.stringify(messages));
  } catch (e) {
    console.error('Failed to save chat', e);
  }
};
