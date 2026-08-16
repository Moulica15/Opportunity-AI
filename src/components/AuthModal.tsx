import React, { useState } from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Plus, 
  X, 
  CheckCircle2, 
  Compass, 
  BookOpen, 
  Building2,
  Lock,
  Mail,
  UserCheck
} from 'lucide-react';
import { User, StudentProfile, AdminProfile, Role } from '../types';
import { DEMO_STUDENT, DEMO_ADMIN } from '../data/mockData';

interface AuthModalProps {
  onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLogin }) => {
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<Role>('student');

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Student Sign up inputs
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentCollege, setStudentCollege] = useState('Apex Institute of Technology');
  const [studentBranch, setStudentBranch] = useState('Computer Science & Engineering');
  const [studentYear, setStudentYear] = useState('3rd Year');
  const [studentSemester, setStudentSemester] = useState('6th Semester');
  const [studentCgpa, setStudentCgpa] = useState('8.5');
  const [studentDomain, setStudentDomain] = useState('Full-Stack Development');
  const [studentSkills, setStudentSkills] = useState<string[]>(['React', 'TypeScript', 'Node.js']);
  const [currentSkillInput, setCurrentSkillInput] = useState('');

  // Admin Sign up inputs
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminDesignation, setAdminDesignation] = useState('Head of Training & Placement');
  const [adminDepartment, setAdminDepartment] = useState('Corporate Relations');
  const [adminInstitution, setAdminInstitution] = useState('Apex Institute of Technology');
  const [adminPhone, setAdminPhone] = useState('');

  const handleAddSkill = () => {
    if (!currentSkillInput.trim()) return;
    if (!studentSkills.includes(currentSkillInput.trim())) {
      setStudentSkills([...studentSkills, currentSkillInput.trim()]);
    }
    setCurrentSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    setStudentSkills(studentSkills.filter(s => s !== skill));
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim()) {
      setLoginError('Please enter your email address.');
      return;
    }

    if (selectedRole === 'student') {
      const user: StudentProfile = {
        ...DEMO_STUDENT,
        email: loginEmail,
        name: loginEmail.split('@')[0] || 'Student',
      };
      onLogin(user);
    } else {
      const user: AdminProfile = {
        ...DEMO_ADMIN,
        email: loginEmail,
        name: loginEmail.split('@')[0] || 'Admin',
      };
      onLogin(user);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (selectedRole === 'student') {
      if (!studentName.trim() || !studentEmail.trim()) {
        setLoginError('Please provide your name and college email.');
        return;
      }

      // Fresh state isolation for newly registered student
      const newStudent: StudentProfile = {
        id: `student-${Date.now()}`,
        name: studentName.trim(),
        email: studentEmail.trim(),
        role: 'student',
        college: studentCollege.trim() || 'Apex Institute of Technology',
        branch: studentBranch.trim() || 'Computer Science',
        year: studentYear,
        semester: studentSemester,
        cgpa: studentCgpa.trim() || '8.0',
        targetDomain: studentDomain.trim() || 'Full-Stack Development',
        skills: studentSkills.length > 0 ? studentSkills : ['Python', 'JavaScript'],
        isAvailableForHackathons: true,
        savedOpportunities: [],
        appliedOpportunities: [],
        bio: `Enthusiastic ${studentBranch} student eager to participate in hackathons and competitive internships.`,
      };

      onLogin(newStudent);
    } else {
      if (!adminName.trim() || !adminEmail.trim() || !adminInstitution.trim()) {
        setLoginError('Please provide Admin Name, Official Email, and Institution Name.');
        return;
      }

      // Fresh state for newly registered admin
      const newAdmin: AdminProfile = {
        id: `admin-${Date.now()}`,
        name: adminName.trim(),
        email: adminEmail.trim(),
        role: 'admin',
        designation: adminDesignation.trim() || 'Placement Officer',
        department: adminDepartment.trim() || 'Training & Placement Cell',
        institutionName: adminInstitution.trim(),
        phone: adminPhone.trim() || '+1 (555) 019-2834',
      };

      onLogin(newAdmin);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100">
      {/* Background Decorative Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-xl">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 shadow-xl shadow-indigo-500/20 mb-4 ring-1 ring-white/20">
            <Compass className="w-8 h-8 text-white animate-spin-slow" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Opportunity Finder
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
            Discover hackathons, stipend internships, and grants with AI-powered skill matching and Kanban tracking.
          </p>
        </div>

        {/* Main Auth Container */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Main Auth Tabs */}
          <div className="flex p-1 bg-slate-950/80 rounded-2xl border border-slate-800/80 mb-6">
            <button
              id="tab-login-btn"
              onClick={() => { setAuthTab('login'); setLoginError(''); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                authTab === 'login'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In to Account
            </button>
            <button
              id="tab-signup-btn"
              onClick={() => { setAuthTab('signup'); setLoginError(''); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                authTab === 'signup'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              New Registration
            </button>
          </div>

          {/* Role Switcher */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select Your Access Portal
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="role-select-student"
                onClick={() => setSelectedRole('student')}
                className={`p-3.5 rounded-2xl border flex items-center space-x-3 transition-all ${
                  selectedRole === 'student'
                    ? 'border-indigo-500 bg-indigo-500/10 text-white ring-2 ring-indigo-500/20'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                }`}
              >
                <div className={`p-2 rounded-xl ${selectedRole === 'student' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold">Student Hub</div>
                  <div className="text-[11px] text-slate-400">Discover & Apply</div>
                </div>
              </button>

              <button
                type="button"
                id="role-select-admin"
                onClick={() => setSelectedRole('admin')}
                className={`p-3.5 rounded-2xl border flex items-center space-x-3 transition-all ${
                  selectedRole === 'admin'
                    ? 'border-indigo-500 bg-indigo-500/10 text-white ring-2 ring-indigo-500/20'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                }`}
              >
                <div className={`p-2 rounded-xl ${selectedRole === 'admin' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold">Institution / Admin</div>
                  <div className="text-[11px] text-slate-400">Post & Manage</div>
                </div>
              </button>
            </div>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center space-x-2">
              <X className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* TAB 1: LOG IN */}
          {authTab === 'login' && (
            <div>
              {/* Quick 1-Click Demo Buttons */}
              <div className="mb-6 p-4 rounded-2xl bg-slate-950/70 border border-indigo-500/20">
                <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 mb-2.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Instant 1-Click Demo Access</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    id="btn-demo-student"
                    onClick={() => onLogin(DEMO_STUDENT)}
                    className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-slate-200 group-hover:text-white flex items-center justify-between">
                      <span>⚡ Vasu (Student)</span>
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-[11px] text-slate-400">3rd Year CSE • 8.85 CGPA</div>
                  </button>

                  <button
                    type="button"
                    id="btn-demo-admin"
                    onClick={() => onLogin(DEMO_ADMIN)}
                    className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-slate-200 group-hover:text-white flex items-center justify-between">
                      <span>⚡ Placement Cell (Admin)</span>
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-[11px] text-slate-400">Apex Institute of Tech</div>
                  </button>
                </div>
              </div>

              {/* Standard Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    {selectedRole === 'student' ? 'College / Student Email' : 'Official Institutional Email'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-login-email"
                      type="email"
                      required
                      placeholder={selectedRole === 'student' ? 'vasu.cse@apex.edu' : 'director.tpo@apex.edu'}
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-login-password"
                      type="password"
                      placeholder="••••••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="btn-submit-login"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Enter {selectedRole === 'student' ? 'Student Workspace' : 'Institution Portal'}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: REGISTRATION (SIGN UP) */}
          {authTab === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              {selectedRole === 'student' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Full Student Name</label>
                      <input
                        id="signup-student-name"
                        type="text"
                        required
                        placeholder="e.g. Priya Sharma"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">College Email</label>
                      <input
                        id="signup-student-email"
                        type="email"
                        required
                        placeholder="priya.cse@college.edu"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">College / University</label>
                      <input
                        type="text"
                        placeholder="Apex Institute of Technology"
                        value={studentCollege}
                        onChange={(e) => setStudentCollege(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Branch / Major</label>
                      <input
                        type="text"
                        placeholder="Computer Science & Eng"
                        value={studentBranch}
                        onChange={(e) => setStudentBranch(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Year</label>
                      <select
                        value={studentYear}
                        onChange={(e) => setStudentYear(e.target.value)}
                        className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Semester</label>
                      <select
                        value={studentSemester}
                        onChange={(e) => setStudentSemester(e.target.value)}
                        className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="1st Semester">Sem 1</option>
                        <option value="2nd Semester">Sem 2</option>
                        <option value="3rd Semester">Sem 3</option>
                        <option value="4th Semester">Sem 4</option>
                        <option value="5th Semester">Sem 5</option>
                        <option value="6th Semester">Sem 6</option>
                        <option value="7th Semester">Sem 7</option>
                        <option value="8th Semester">Sem 8</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">CGPA / %</label>
                      <input
                        type="text"
                        placeholder="8.8"
                        value={studentCgpa}
                        onChange={(e) => setStudentCgpa(e.target.value)}
                        className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Skills Tags Input */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Your Tech Skills & Domains (Used for Match Scores)
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="e.g. Python, Docker, PyTorch"
                        value={currentSkillInput}
                        onChange={(e) => setCurrentSkillInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                        className="flex-1 px-3.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl border border-slate-700"
                      >
                        Add Tag
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                      {studentSkills.map((s) => (
                        <span key={s} className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {s}
                          <button type="button" onClick={() => handleRemoveSkill(s)} className="ml-1 text-indigo-400 hover:text-white">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Admin / Coordinator Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. Rajesh Gupta"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Official Institutional Email</label>
                      <input
                        type="email"
                        required
                        placeholder="placement@university.edu"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Official Designation</label>
                      <input
                        type="text"
                        placeholder="Head of Corporate Relations"
                        value={adminDesignation}
                        onChange={(e) => setAdminDesignation(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                      <input
                        type="text"
                        placeholder="Training & Placement Cell"
                        value={adminDepartment}
                        onChange={(e) => setAdminDepartment(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Institution / Organization Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Apex Institute of Technology"
                      value={adminInstitution}
                      onChange={(e) => setAdminInstitution(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                id="btn-submit-signup"
                className="w-full mt-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Registration & Open Portal</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
