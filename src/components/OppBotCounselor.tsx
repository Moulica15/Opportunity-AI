import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  HelpCircle, 
  Flame, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Layers,
  ArrowRight,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { ChatMessage, Opportunity, User, StudentProfile } from '../types';
import { generateOppBotResponse } from '../utils/aiCounselor';

interface OppBotCounselorProps {
  user: User;
  opportunities: Opportunity[];
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onClearChat: () => void;
  onSelectOpportunityById: (oppId: string) => void;
  onOpenEditProfile: () => void;
}

export const OppBotCounselor: React.FC<OppBotCounselorProps> = ({
  user,
  opportunities,
  messages,
  onSendMessage,
  onClearChat,
  onSelectOpportunityById,
  onOpenEditProfile,
}) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isStudent = user.role === 'student';
  const student = isStudent ? (user as StudentProfile) : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    onSendMessage(text);
    if (!textToSend) setInputText('');
  };

  const quickChips = [
    { label: '🏆 Active Hackathons & Deadlines', query: 'Tell me about all open hackathons and their deadlines' },
    { label: '💰 High-Stipend Internships', query: 'Show paid internships matching my tech stack and what they pay' },
    { label: '📊 1-Click Skill-Gap Analysis', query: 'Analyze my skill gaps across all active listings' },
    { label: '🚀 5-Day Hackathon Sprint Plan', query: 'Give me a 5-day preparation roadmap for hackathons' },
    { label: '🎓 Scholarships & Fellowships', query: 'What scholarships or research grants are currently open?' },
  ];

  // Helper to format simple markdown-style text from OppBot
  const renderFormattedBotText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-200">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-sm sm:text-base font-extrabold text-white tracking-tight pt-2 pb-1 border-b border-slate-700/60">
                {line.replace('### ', '')}
              </h3>
            );
          }
          if (line.startsWith('#### ')) {
            return (
              <h4 key={idx} className="text-xs sm:text-sm font-bold text-indigo-300 pt-1">
                {line.replace('#### ', '')}
              </h4>
            );
          }
          if (line.startsWith('- ')) {
            return (
              <div key={idx} className="flex items-start space-x-2 pl-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line.replace('- ', '')) }} />
              </div>
            );
          }
          if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') || line.startsWith('5. ')) {
            return (
              <div key={idx} className="flex items-start space-x-2 pl-2">
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
              </div>
            );
          }
          if (!line.trim()) {
            return <div key={idx} className="h-1.5" />;
          }
          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
          );
        })}
      </div>
    );
  };

  const formatInlineMarkdown = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-slate-300 italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-slate-800 text-indigo-300 font-mono text-[11px] rounded border border-slate-700">$1</code>');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Top Bot Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <Bot className="w-6 h-6 text-white animate-bounce-subtle" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                OppBot AI Counselor
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live Opportunity Grounded
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Direct access to {opportunities.filter(o => o.isActive).length} active listings, eligibility checks, and skill-gap maps.
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-2">
          {student && (
            <button
              onClick={() => handleSend('Analyze my skill gaps across all active listings')}
              className="px-3 py-1.5 bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5"
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">1-Click Skill-Gap Check</span>
              <span className="sm:hidden">Skill-Gap</span>
            </button>
          )}

          <button
            onClick={onClearChat}
            title="Reset Chat Session"
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800/80 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'bg-slate-800 border border-slate-700 text-indigo-400'
                }`}
              >
                {isUser ? user.name.charAt(0) : <Bot className="w-5 h-5" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-2xl ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 sm:p-5 rounded-3xl ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-sm shadow-md'
                      : 'bg-slate-950/80 border border-slate-800 rounded-tl-sm shadow-lg'
                  }`}
                >
                  {isUser ? (
                    <p className="text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  ) : (
                    renderFormattedBotText(msg.text)
                  )}

                  {/* Referenced Opportunities Chips */}
                  {msg.referencedOpportunityIds && msg.referencedOpportunityIds.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-800/80">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Referenced Database Listings:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {msg.referencedOpportunityIds.map((id) => {
                          const opp = opportunities.find(o => o.id === id);
                          if (!opp) return null;
                          return (
                            <button
                              key={id}
                              onClick={() => onSelectOpportunityById(id)}
                              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs text-indigo-300 font-semibold transition-all flex items-center space-x-1.5"
                            >
                              <span>{opp.title}</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Follow-up Action Chips */}
                {!isUser && msg.actionChips && msg.actionChips.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 pl-1">
                    {msg.actionChips.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(chip.query)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-xs text-slate-300 hover:text-white font-medium transition-colors flex items-center space-x-1.5"
                      >
                        <span>{chip.label}</span>
                        <ArrowRight className="w-3 h-3 text-indigo-400" />
                      </button>
                    ))}
                  </div>
                )}

                <div className={`text-[10px] text-slate-500 mt-1 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-6 py-2 bg-slate-950/40 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[11px] text-slate-500 font-semibold shrink-0 uppercase tracking-wider">
          Suggested:
        </span>
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip.query)}
            className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 text-[11px] text-slate-300 hover:text-indigo-300 whitespace-nowrap transition-colors"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Bottom Message Input Form */}
      <div className="p-4 bg-slate-950/80 border-t border-slate-800 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <div className="relative flex-1">
            <input
              id="input-oppbot-chat"
              type="text"
              placeholder="Ask OppBot: 'Explain Smart India Hackathon', 'Show paid remote internships', 'What skills am I missing?'..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={!inputText.trim()}
            id="btn-oppbot-send"
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-2xl text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-1.5 shrink-0"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
