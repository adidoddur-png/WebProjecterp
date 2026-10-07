/**
 * GMIT ERP - Shared UI Helpers
 */

// Colour palette for initials avatars (one per letter bucket)
const AVATAR_COLOURS = [
  ['#6366f1','#fff'], // indigo
  ['#8b5cf6','#fff'], // violet
  ['#ec4899','#fff'], // pink
  ['#14b8a6','#fff'], // teal
  ['#f59e0b','#0f172a'], // amber
  ['#10b981','#fff'], // emerald
  ['#3b82f6','#fff'], // blue
  ['#ef4444','#fff'], // red
  ['#f97316','#fff'], // orange
  ['#06b6d4','#0f172a'], // cyan
];

/**
 * Returns an initials-badge <span> for a student/person name.
 * Replaces <img> avatars when no photo is available.
 * @param {string} name   - Full name
 * @param {string} [cls]  - Extra CSS class(es) to add (matches img class)
 * @param {string} [style]- Inline style override
 * @returns {string} HTML string
 */
export function avatarHTML(name, cls = '', style = '') {
  const parts  = (name || '?').trim().split(/\s+/);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].substring(0, 2).toUpperCase();

  // Pick a stable colour based on the first char code
  const idx = (name.charCodeAt(0) || 0) % AVATAR_COLOURS.length;
  const [bg, fg] = AVATAR_COLOURS[idx];

  const baseStyle = [
    'display:inline-flex',
    'align-items:center',
    'justify-content:center',
    'font-weight:800',
    'font-size:0.82rem',
    'letter-spacing:0.05em',
    'flex-shrink:0',
    `background:${bg}`,
    `color:${fg}`,
    style
  ].filter(Boolean).join(';');

  return `<span class="${cls}" style="${baseStyle}" aria-label="${name}">${initials}</span>`;
}

/**
 * Returns active user session from sessionStorage.
 */
export function getActiveSession() {
  try {
    const raw = sessionStorage.getItem('aura_session');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Returns currently logged-in faculty session if role is professor, else null.
 */
export function getLoggedInFaculty() {
  const sess = getActiveSession();
  if (sess && sess.role === 'professor') {
    return sess;
  }
  return null;
}

/**
 * Returns subject-specific performance for a student.
 */
export function getStudentSubjectPerformance(student, subjectCode = '24CS101') {
  if (!student) return null;
  if (student.subjectPerformance && student.subjectPerformance[subjectCode]) {
    return student.subjectPerformance[subjectCode];
  }
  return {
    code: subjectCode,
    subject: "Computer Science Subject",
    instructor: "Faculty Instructor",
    attendance: student.attendance || 85,
    iaMarks: 25,
    totalMarks: 85,
    grade: student.recentGrade || "A",
    status: student.riskLevel === 'High' ? 'At-Risk' : 'Good',
    remark: "Regular student records."
  };
}
