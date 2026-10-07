/* AURA ERP - AI Neural Engine & Rules Processor (Connected to Flask API) */

import { ERP_STATE } from './mockData.js';
import { API } from './api.js';

// Calculate AI At-Risk score for any student dynamically
export function calculateStudentRisk(student) {
  let riskPoints = 0;
  
  // Attendance factor (Weight: 40%)
  if (student.attendance < 70) riskPoints += 45;
  else if (student.attendance < 80) riskPoints += 25;
  else if (student.attendance < 85) riskPoints += 10;

  // CGPA factor (Weight: 35%)
  if (student.cgpa < 2.5) riskPoints += 35;
  else if (student.cgpa < 3.0) riskPoints += 20;
  else if (student.cgpa < 3.4) riskPoints += 5;

  // Pending Fee & Financial Stress factor (Weight: 15%)
  if (student.feePending > 3000) riskPoints += 15;
  else if (student.feePending > 0) riskPoints += 8;

  // Assignment Submissions (Weight: 10%)
  const missingAssignments = (student.totalAssignments || 18) - (student.assignmentsCompleted || 10);
  riskPoints += missingAssignments * 4;

  const finalScore = Math.min(Math.max(riskPoints, 2), 98);
  
  let riskLevel = 'Low';
  if (finalScore >= 65) riskLevel = 'High';
  else if (finalScore >= 35) riskLevel = 'Medium';

  return { score: finalScore, level: riskLevel };
}

// AI Timetable Conflict Solver Simulator (Flask API backed)
export async function runScheduleOptimizer() {
  const flaskRes = await API.optimizeTimetable();
  if (flaskRes) return flaskRes;

  return {
    conflictsFound: 2,
    resolved: 2,
    optimizations: [
      {
        course: "CS-401 (Deep Learning)",
        original: "Hall A • Mon 09:00 AM",
        suggested: "Auditorium 2 • Mon 10:30 AM",
        reason: "Capacity bottleneck (120 enrolled vs 90 seat limit in Hall A)."
      },
      {
        course: "DS-302 (Big Data)",
        original: "Lab Annex C • Wed 02:00 PM",
        suggested: "Lab Annex C • Thu 11:00 AM",
        reason: "Instructor overlap with Research Committee Meeting."
      }
    ],
    efficiencyGain: "+18% Lab Utilization"
  };
}

// AI Assignment Evaluator & Plagiarism Simulator (Flask API backed)
export async function evaluateAssignmentSubmission(submissionText) {
  const flaskRes = await API.gradeAssignment(submissionText);
  if (flaskRes) return flaskRes;

  const wordCount = submissionText.split(/\s+/).length;
  const plagiarismScore = Math.floor(Math.random() * 8);
  const aiGeneratedPercent = Math.floor(Math.random() * 12);
  
  let predictedGrade = "A";
  let feedback = "Excellent architectural clarity, clean mathematical derivations, and thorough references.";

  if (wordCount < 100) {
    predictedGrade = "C+";
    feedback = "Submission lacks sufficient detail in section 3 (Neural Backpropagation proofs).";
  } else if (wordCount < 250) {
    predictedGrade = "B+";
    feedback = "Good structural breakdown, but consider expanding on distributed PySpark cluster setup.";
  }

  return {
    wordCount,
    plagiarismScore: `${plagiarismScore}% (Original)`,
    aiGeneratedPercent: `${aiGeneratedPercent}% Detected`,
    predictedGrade,
    feedback
  };
}

// Natural Language AI Chatbot Query Engine (Flask API backed)
export async function queryAuraAIChat(userPrompt) {
  const flaskRes = await API.queryAIChat(userPrompt);
  if (flaskRes) return flaskRes;

  const text = userPrompt.toLowerCase();
  
  if (text.includes('risk') || text.includes('at-risk') || text.includes('warning')) {
    const highRiskStudents = ERP_STATE.students.filter(s => calculateStudentRisk(s).score >= 50);
    const names = highRiskStudents.map(s => `${s.name} (${s.department}, Attendance: ${s.attendance}%, CGPA: ${s.cgpa})`).join('\n• ');
    return {
      text: `🤖 **GMIT AI Predictive Insight**:\nFound **${highRiskStudents.length} students** currently flagged at medium to high academic risk:\n\n• ${names}\n\n*Action Recommended*: Automated counseling invitations have been drafted. Would you like me to send them?`
    };
  }

  if (text.includes('fee') || text.includes('tuition') || text.includes('finance') || text.includes('revenue')) {
    return {
      text: `💳 **Finance Intelligence Summary**:\n• Total Semester Revenue Collected: **${ERP_STATE.financeStats.collectedThisSemester}**\n• Pending Dues Across University: **${ERP_STATE.financeStats.pendingDues}**\n• Target Achievement: **${ERP_STATE.financeStats.collectionTargetPercent}%**\n\nTop pending department: *Electronics & IoT* ($142,000 pending).`
    };
  }

  return {
    text: `🤖 **GMIT AI Campus Copilot**:\nI have processed your query: *"_${userPrompt}_"*\n\nHow else can I assist your department today?`
  };
}

