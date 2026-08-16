export type Role = 'student' | 'admin';

export type OpportunityCategory = 'Hackathon' | 'Internship' | 'Scholarship' | 'Fellowship' | 'Training';

export type ApplicationStatus = 'saved' | 'applied' | 'shortlisted' | 'archived';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  role: 'student';
  college: string;
  branch: string;
  year: string;
  semester: string;
  cgpa: string;
  targetDomain: string;
  skills: string[];
  bio?: string;
  github?: string;
  linkedin?: string;
  isAvailableForHackathons: boolean;
  savedOpportunities: string[];
  appliedOpportunities: string[];
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  designation: string;
  department: string;
  institutionName: string;
  phone?: string;
}

export type User = StudentProfile | AdminProfile;

export interface Opportunity {
  id: string;
  title: string;
  host: string;
  category: OpportunityCategory;
  type: 'Remote' | 'On-site' | 'Hybrid';
  location?: string;
  stipendOrPrize: string;
  deadline: string; // YYYY-MM-DD
  postedDate: string;
  description: string;
  eligibility: string[];
  requiredSkills: string[];
  applicationUrl: string;
  isActive: boolean;
  featured?: boolean;
  createdBy?: string;
  applicantsCount?: number;
}

export interface ApplicationItem {
  id: string;
  opportunityId: string;
  userId: string;
  status: ApplicationStatus;
  appliedDate: string;
  updatedDate: string;
  notes?: string;
  interviewDate?: string;
}

export interface Peer {
  id: string;
  name: string;
  avatar: string;
  college: string;
  branch: string;
  year: string;
  cgpa: string;
  skills: string[];
  targetDomain: string;
  isAvailableForHackathons: boolean;
  github: string;
  linkedin: string;
  bio: string;
  verified: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  referencedOpportunityIds?: string[];
  actionChips?: { label: string; query: string }[];
}

export interface DeadlineReminder {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  deadline: string;
  remindDate: string;
  note?: string;
  isCompleted?: boolean;
}
