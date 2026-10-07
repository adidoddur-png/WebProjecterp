/* AURA ERP - Python Flask Backend API Client Connector */

const API_BASE_URL = (window.location.port === '5000' || window.location.port === '')
  ? '/api'
  : 'http://127.0.0.1:5000/api';

export const API = {
  // Health Check
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.warn('Flask API Offline, using local state:', e);
      return null;
    }
  },

  // Dashboard Stats
  async getDashboardStats() {
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/stats`);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Students REST API
  async getStudents(search = '', dept = 'ALL', risk = 'ALL') {
    try {
      const url = `${API_BASE_URL}/students?q=${encodeURIComponent(search)}&dept=${encodeURIComponent(dept)}&risk=${encodeURIComponent(risk)}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      return (Array.isArray(data) && data.length > 0) ? data : null;
    } catch (e) {
      console.warn('Flask API fetch error:', e);
      return null;
    }
  },

  async enrollStudent(studentData) {
    try {
      const res = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // AI Assignment Grader API
  async gradeAssignment(text) {
    try {
      const res = await fetch(`${API_BASE_URL}/academics/grade-assignment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Finance Fee Pay API
  async payFee(studentId, amount) {
    try {
      const res = await fetch(`${API_BASE_URL}/finance/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, amount })
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // AI Chatbot API
  async queryAIChat(prompt) {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // AI Timetable Solver API
  async optimizeTimetable() {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/optimize-schedule`, {
        method: 'POST'
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }
};
