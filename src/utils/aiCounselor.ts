import { Opportunity, StudentProfile, User } from '../types';

export interface OppBotResponse {
  text: string;
  referencedOpportunityIds?: string[];
  actionChips?: { label: string; query: string }[];
}

export function generateOppBotResponse(
  userQuery: string,
  user: User | null,
  opportunities: Opportunity[]
): OppBotResponse {
  const query = userQuery.toLowerCase().trim();
  const activeOpps = opportunities.filter(o => o.isActive);
  const isStudent = user?.role === 'student';
  const student = isStudent ? (user as StudentProfile) : null;
  const userSkills = student?.skills.map(s => s.toLowerCase()) || [];

  // 1. Deep Dive into Specific Opportunity (e.g. "Explain Smart India Hackathon" or targeted card request)
  const matchedOpp = activeOpps.find(o => 
    query.includes(o.title.toLowerCase()) || 
    query.includes(o.id.toLowerCase()) ||
    (o.title.toLowerCase().split(' ').some(word => word.length > 3 && query.includes(word)))
  );

  if (matchedOpp && (query.includes('explain') || query.includes('tell me about') || query.includes('breakdown') || query.includes('opportunity') || query.includes('card') || query.includes('details') || query.includes('about this'))) {
    const oppSkills = matchedOpp.requiredSkills;
    const matchingSkills = oppSkills.filter(s => userSkills.includes(s.toLowerCase()));
    const missingSkills = oppSkills.filter(s => !userSkills.includes(s.toLowerCase()));
    const matchPercent = oppSkills.length > 0 
      ? Math.round((matchingSkills.length / oppSkills.length) * 100)
      : 100;

    let response = `### 🎯 Deep Dive: **${matchedOpp.title}**\n\n`;
    response += `**🏢 Host:** ${matchedOpp.host}  \n`;
    response += `**🏷️ Category:** ${matchedOpp.category} (${matchedOpp.type})  \n`;
    response += `**💰 Award / Stipend:** ${matchedOpp.stipendOrPrize}  \n`;
    response += `**⏰ Deadline:** ${matchedOpp.deadline} *(Mark your calendar!)*  \n\n`;
    
    response += `#### 📋 Program Overview:\n${matchedOpp.description}\n\n`;
    
    response += `#### ✅ Eligibility Criteria:\n`;
    matchedOpp.eligibility.forEach(crit => {
      response += `- ${crit}\n`;
    });
    response += `\n`;

    if (student) {
      response += `#### 🔍 Profile Match Analysis for **${student.name}** (${student.branch}, CGPA: ${student.cgpa}):\n`;
      response += `- **Match Score:** **${matchPercent}%**\n`;
      response += `- **Matched Skills (${matchingSkills.length}/${oppSkills.length}):** ${matchingSkills.length > 0 ? matchingSkills.map(s => `\`${s}\``).join(', ') : 'None directly tagged'}\n`;
      if (missingSkills.length > 0) {
        response += `- **Suggested Upskill Areas:** ${missingSkills.map(s => `\`${s}\``).join(', ')}\n`;
      }
      response += `\n**💡 Recommendation:** ${matchPercent >= 50 ? 'You have a solid foundation! Review the eligibility checklist and submit your initial draft.' : 'We recommend pairing with a peer strong in the missing stack, or spending 3-5 days building a basic starter repo before applying.'}\n`;
    }

    return {
      text: response,
      referencedOpportunityIds: [matchedOpp.id],
      actionChips: [
        { label: `🌐 Visit ${matchedOpp.host}`, query: `Give me the official application link for ${matchedOpp.title}` },
        { label: '📊 Analyze My Skill Gaps', query: 'Analyze my skill gaps across all active listings' },
        { label: '🏆 View More Hackathons', query: 'Tell me about all open hackathons and their deadlines' }
      ]
    };
  }

  // 2. Skill Gap Analysis
  if (query.includes('skill gap') || query.includes('missing skills') || query.includes('gap analysis') || query.includes('what skills am i missing')) {
    if (!student) {
      return {
        text: `Please log in as a student or update your profile to run a personalized Skill-Gap Analysis against all live postings.`
      };
    }

    // Collect all required skills across active opportunities
    const skillCounts: Record<string, number> = {};
    activeOpps.forEach(opp => {
      opp.requiredSkills.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });

    const userSkillSet = new Set(userSkills);
    const missingSkillsWithCount = Object.entries(skillCounts)
      .filter(([skill]) => !userSkillSet.has(skill.toLowerCase()))
      .sort((a, b) => b[1] - a[1]);

    const topMissing = missingSkillsWithCount.slice(0, 5);

    let response = `### 📊 Real-Time Skill-Gap Assessment for **${student.name}**\n\n`;
    response += `We analyzed **${activeOpps.length} active opportunities** against your current profile tags:  \n`;
    response += `**Your Current Skills:** ${student.skills.map(s => `\`${s}\``).join(', ')}\n\n`;

    if (topMissing.length === 0) {
      response += `🎉 **Incredible coverage!** Your skillset satisfies virtually all top requirements in the current listings. You are in a prime position to apply across hackathons and internships.`;
    } else {
      response += `#### ⚡ High-Demand Skills Missing from Your Profile:\n`;
      topMissing.forEach(([skill, demandCount], index) => {
        response += `${index + 1}. **${skill}** — Required by **${demandCount}** open opportunities\n`;
      });

      response += `\n#### 🚀 2-Week Rapid Upskill Plan:\n`;
      response += `- **Week 1:** Build a 1-day MVP implementing \`${topMissing[0]?.[0] || 'Modern Architecture'}\` with clear documentation.\n`;
      if (topMissing[1]) {
        response += `- **Week 2:** Integrate \`${topMissing[1][0]}\` into a live demo project and deploy it to Cloud/Vercel.\n`;
      }
      response += `- **Bonus:** Add these verified tags to your **Student Profile** to boost your match scores instantly!`;
    }

    return {
      text: response,
      actionChips: [
        { label: '⚡ Update Student Profile', query: 'How do I edit my student profile?' },
        { label: '💰 Show Matching Internships', query: 'Show paid internships matching my tech stack' },
        { label: '🏆 Next Open Hackathon', query: 'Tell me about all open hackathons and their deadlines' }
      ]
    };
  }

  // 3. Hackathons Query
  if (query.includes('hackathon') || query.includes('hackathons')) {
    const hackathons = activeOpps.filter(o => o.category === 'Hackathon');
    if (hackathons.length === 0) {
      return {
        text: `There are currently no active hackathons listed in the portal. Please check back soon or post one as an Admin.`
      };
    }

    let response = `### 🏆 Active Hackathons in the Database (${hackathons.length} Listings)\n\n`;
    hackathons.forEach((h, i) => {
      const matchScore = student ? calculateMatchScore(student.skills, h.requiredSkills) : null;
      response += `#### ${i + 1}. **${h.title}** (${h.type})\n`;
      response += `- **Host:** ${h.host}\n`;
      response += `- **Prize / Grant:** ${h.stipendOrPrize}\n`;
      response += `- **Registration Deadline:** 📅 **${h.deadline}**\n`;
      response += `- **Key Tech Stack:** ${h.requiredSkills.map(s => `\`${s}\``).join(', ')}\n`;
      if (matchScore !== null) {
        response += `- **Your Match Score:** 🎯 **${matchScore}%**\n`;
      }
      response += `\n`;
    });

    response += `💡 *Tip: Click "Ask OppBot About This" on any listing card or type the name to view the full problem statements and eligibility checklist!*`;

    return {
      text: response,
      referencedOpportunityIds: hackathons.map(h => h.id),
      actionChips: [
        { label: '💡 Hackathon Prep Roadmap', query: 'Give me a 5-day preparation roadmap for hackathons' },
        { label: '👥 Find Teammates', query: 'Where can I find peer teammates for hackathons?' },
        { label: '💰 Paid Internships', query: 'Which internships pay stipends and what skills do they need?' }
      ]
    };
  }

  // 4. Internships & Stipends Query
  if (query.includes('internship') || query.includes('stipend') || query.includes('paid')) {
    const internships = activeOpps.filter(o => o.category === 'Internship');
    
    let response = `### 💼 Paid & High-Impact Internships (${internships.length} Available)\n\n`;
    internships.forEach((item, i) => {
      const matchScore = student ? calculateMatchScore(student.skills, item.requiredSkills) : null;
      response += `#### ${i + 1}. **${item.title}**\n`;
      response += `- **Company / Org:** ${item.host} (${item.type} - ${item.location || 'Global'})\n`;
      response += `- **Stipend:** 💵 **${item.stipendOrPrize}**\n`;
      response += `- **Application Deadline:** ⏳ **${item.deadline}**\n`;
      response += `- **Required Skills:** ${item.requiredSkills.map(s => `\`${s}\``).join(', ')}\n`;
      if (matchScore !== null) {
        response += `- **Profile Match:** **${matchScore}%**\n`;
      }
      response += `\n`;
    });

    return {
      text: response,
      referencedOpportunityIds: internships.map(item => item.id),
      actionChips: [
        { label: '📊 Analyze My Skill Gaps', query: 'Analyze my skill gaps across all active listings' },
        { label: '🎓 Scholarships Available', query: 'What scholarships or grants are currently open?' },
        { label: '🏆 Active Hackathons', query: 'Tell me about all open hackathons and their deadlines' }
      ]
    };
  }

  // 5. Scholarships & Fellowships Query
  if (query.includes('scholarship') || query.includes('fellowship') || query.includes('grant')) {
    const scholarships = activeOpps.filter(o => o.category === 'Scholarship' || o.category === 'Fellowship');
    
    let response = `### 🎓 Scholarships & Research Fellowships (${scholarships.length} Listings)\n\n`;
    scholarships.forEach((s, i) => {
      response += `#### ${i + 1}. **${s.title}** (${s.category})\n`;
      response += `- **Provider:** ${s.host}\n`;
      response += `- **Financial Value:** 💰 **${s.stipendOrPrize}**\n`;
      response += `- **Closing Date:** 📅 **${s.deadline}**\n`;
      response += `- **Key Eligibility:** ${s.eligibility[0] || 'Check full criteria in listing'}\n\n`;
    });

    return {
      text: response,
      referencedOpportunityIds: scholarships.map(s => s.id),
      actionChips: [
        { label: '💼 View Paid Internships', query: 'Which internships pay stipends and what skills do they need?' },
        { label: '🏆 View Hackathons', query: 'Tell me about all open hackathons and their deadlines' }
      ]
    };
  }

  // 6. Preparation Roadmap Query
  if (query.includes('roadmap') || query.includes('preparation') || query.includes('how to prepare') || query.includes('5-day')) {
    let response = `### 🚀 5-Day Agile Hackathon Preparation Blueprint\n\n`;
    response += `#### 🗓️ Day 1: Team Formation & Stack Alignment\n`;
    response += `- Form a balanced squad (1 UI/UX specialist, 2 Full-Stack/Backend, 1 AI/Data engineer, 1 Pitch lead).\n`;
    response += `- Standardize repository templates with Tailwind, Vite, and GitHub Actions CI.\n\n`;

    response += `#### 🗓️ Day 2: Problem Statement Deconstruction\n`;
    response += `- Pick 1 primary problem statement. Map out User Personas, Pain Points, and the "Unfair Advantage" / X-Factor feature.\n`;
    response += `- Draft system architecture diagram (APIs, Database schema, External SDKs).\n\n`;

    response += `#### 🗓️ Day 3: Rapid Core MVP Sprint\n`;
    response += `- Build the core deterministic workflow first — ensure end-to-end data flow works before visual polish.\n`;
    response += `- Implement clean sample datasets and fallbacks for live demonstrations.\n\n`;

    response += `#### 🗓️ Day 4: UI/UX & Polish Polish Polish\n`;
    response += `- Ensure responsive layout, smooth micro-interactions, dark/light contrast, and zero console errors.\n`;
    response += `- Write concise README with architecture diagram, installation steps, and live demo link.\n\n`;

    response += `#### 🗓️ Day 5: 3-Minute Video Demo & Pitch\n`;
    response += `- Structure pitch: **Problem (30s) ➡️ Live Demo (90s) ➡️ Tech Architecture (30s) ➡️ Impact & Scalability (30s)**.\n`;
    response += `- Submit at least 2 hours before the final deadline to avoid network congestion!`;

    return {
      text: response,
      actionChips: [
        { label: '👥 Find Hackathon Teammates', query: 'Where can I find peer teammates for hackathons?' },
        { label: '🏆 View Open Hackathons', query: 'Tell me about all open hackathons and their deadlines' }
      ]
    };
  }

  // 7. Peer / Team Finder Query
  if (query.includes('peer') || query.includes('teammate') || query.includes('team') || query.includes('collaborate')) {
    return {
      text: `### 👥 Finding Teammates & Hackathon Collaborators\n\nYou can head over to the **Peer & Team Directory** tab on the left sidebar!\n\n- Filter peers by branch, graduation year, or target skills (e.g., PyTorch, Next.js, IoT).\n- Check the **"Available for Hackathons"** green badge on their profiles.\n- Send a direct team invite or connect with them on GitHub and LinkedIn.`,
      actionChips: [
        { label: '🏆 View Open Hackathons', query: 'Tell me about all open hackathons and their deadlines' },
        { label: '📊 Analyze My Skill Gaps', query: 'Analyze my skill gaps across all active listings' }
      ]
    };
  }

  // 8. General / Fallback Context-Grounded Answer
  return {
    text: `I'm analyzing our live database with **${activeOpps.length} active opportunities**.\n\nHere are some things I can assist you with:\n- **Hackathons:** Deep-dive into problem statements, prize pools, and timelines.\n- **Internships:** Match stipends and requirements with your profile.\n- **Skill-Gap Analysis:** Find what top technologies you should learn next.\n- **Eligibility Checks:** Verify if your branch, CGPA, or semester qualifies.`,
    actionChips: [
      { label: '🏆 Open Hackathons', query: 'Tell me about all open hackathons and their deadlines' },
      { label: '💰 Paid Internships', query: 'Which internships pay stipends and what skills do they need?' },
      { label: '📊 Skill Gap Analysis', query: 'Analyze my skill gaps across all active listings' },
      { label: '🎓 Scholarships', query: 'What scholarships or grants are currently open?' }
    ]
  };
}

export function calculateMatchScore(userSkills: string[], requiredSkills: string[]): number {
  if (!requiredSkills || requiredSkills.length === 0) return 100;
  if (!userSkills || userSkills.length === 0) return 0;

  const normalizedUserSkills = new Set(userSkills.map(s => s.toLowerCase().trim()));
  let matchCount = 0;

  requiredSkills.forEach(req => {
    const reqNormalized = req.toLowerCase().trim();
    if (normalizedUserSkills.has(reqNormalized)) {
      matchCount++;
    } else {
      // Partial keyword match (e.g. "React" matches "React.js" or "Node.js" matches "Node")
      const hasPartial = Array.from(normalizedUserSkills).some(us => 
        us.includes(reqNormalized) || reqNormalized.includes(us)
      );
      if (hasPartial) matchCount += 0.75;
    }
  });

  return Math.min(100, Math.round((matchCount / requiredSkills.length) * 100));
}
