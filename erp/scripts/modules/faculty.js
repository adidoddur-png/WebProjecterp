/* GMIT ERP - Faculty & Classroom Attendance Portal with Live QR Scanner */

import { ERP_STATE } from '../data/mockData.js';
import { showToast } from '../components/toasts.js';
import { openModal } from '../components/modals.js';
import QRCode from '../utils/qrcode.js';
import { avatarHTML, getLoggedInFaculty, getStudentSubjectPerformance } from '../utils/helpers.js';

// Module internal state for active attendance session
let attendanceState = {
  activeTab: 'attendance', // 'attendance' or 'faculty'
  selectedCourse: '24CS101',
  selectedBranch: 'Computer Science & Engineering',
  selectedSection: 'Section A',
  lectureDate: new Date().toISOString().split('T')[0],
  records: {}, // usn -> 'present' | 'absent' | 'late'
  scannerActive: false,
  scanLog: []
};

// Initialize attendance roster default state
function initAttendanceRoster() {
  const students = ERP_STATE.students || [];
  students.forEach(s => {
    if (!attendanceState.records[s.id]) {
      // Default to present for initial preview
      attendanceState.records[s.id] = 'present';
    }
  });
}

// Play audio feedback on scan
function playChime(success = true) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (success) {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    // Audio context fallback
  }
}

export function setAttendanceTab(tab = 'attendance') {
  attendanceState.activeTab = tab;
}

export function renderFacultyModule(tab) {
  if (tab) attendanceState.activeTab = tab;
  initAttendanceRoster();

  const isAttTab = attendanceState.activeTab === 'attendance';
  const students = ERP_STATE.students || [];

  // Compute live statistics
  const totalStudents = students.length;
  const presentCount = Object.values(attendanceState.records).filter(v => v === 'present').length;
  const absentCount = Object.values(attendanceState.records).filter(v => v === 'absent').length;
  const lateCount = Object.values(attendanceState.records).filter(v => v === 'late').length;
  const attPercentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  return `
    <div class="panel-header" style="margin-bottom: 1.25rem;">
      <div>
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <img src="assets/gmit-logo.svg" alt="GMIT" style="width: 28px; height: 28px; object-fit: contain;">
          <h2 class="panel-title" style="font-size: 1.6rem; margin: 0;">Faculty &amp; Attendance Portal</h2>
        </div>
        <p style="color: var(--text-muted); font-size: 0.88rem; margin-top: 4px;">Live classroom QR attendance scanner, digital student verification, and faculty workload management.</p>
      </div>

      <!-- Tab Buttons -->
      <div style="display: flex; gap: 0.5rem; background: rgba(15,23,42,0.6); padding: 4px; border-radius: 12px; border: 1px solid var(--border-color);">
        <button class="btn ${isAttTab ? 'btn-primary' : 'btn-secondary'}" id="tab-btn-attendance" style="padding: 0.5rem 1rem; font-size: 0.85rem; border-radius: 8px;">
          <i class="fa-solid fa-qrcode"></i> Live QR Attendance
        </button>
        <button class="btn ${!isAttTab ? 'btn-primary' : 'btn-secondary'}" id="tab-btn-faculty-dir" style="padding: 0.5rem 1rem; font-size: 0.85rem; border-radius: 8px;">
          <i class="fa-solid fa-chalkboard-user"></i> Faculty Directory
        </button>
      </div>
    </div>

    ${isAttTab ? renderAttendanceView(totalStudents, presentCount, absentCount, lateCount, attPercentage) : renderFacultyDirectoryView()}
  `;
}

function renderAttendanceView(total, present, absent, late, pct) {
  const students = ERP_STATE.students || [];
  const fac = getLoggedInFaculty();
  const isFacultyView = Boolean(fac && fac.subjectCode);

  let activeFacultyName = isFacultyView ? `${fac.name} (${fac.title || "Faculty"})` : "Admin / Department View";
  let defaultCourseCode = isFacultyView ? fac.subjectCode : "24CS101";

  const coursesToDisplay = isFacultyView
    ? ERP_STATE.courses.filter(c => c.code === fac.subjectCode || c.instructor.toLowerCase().includes(fac.name.toLowerCase()))
    : ERP_STATE.courses;

  return `
    <!-- Top Stats Row -->
    <div class="stats-grid" style="margin-bottom: 1.5rem;">
      <div class="stat-card">
        <div class="stat-icon si-indigo"><i class="fa-solid fa-users"></i></div>
        <div class="stat-info">
          <div class="val" id="stat-att-total">${total}</div>
          <div class="lbl">Total Enrolled</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon si-emerald"><i class="fa-solid fa-user-check"></i></div>
        <div class="stat-info">
          <div class="val" id="stat-att-present" style="color: var(--success);">${present}</div>
          <div class="lbl">Marked Present</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: rgba(239,68,68,0.15); color: var(--danger);"><i class="fa-solid fa-user-xmark"></i></div>
        <div class="stat-info">
          <div class="val" id="stat-att-absent" style="color: var(--danger);">${absent}</div>
          <div class="lbl">Marked Absent</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon si-cyan"><i class="fa-solid fa-chart-pie"></i></div>
        <div class="stat-info">
          <div class="val" id="stat-att-pct" style="color: ${pct >= 75 ? 'var(--success)' : 'var(--danger)'};">${pct}%</div>
          <div class="lbl">Attendance Rate</div>
        </div>
      </div>
    </div>

    <!-- Live QR Scanner & Controls Card -->
    <div style="display: grid; grid-template-columns: 1fr 1.35fr; gap: 1.25rem; margin-bottom: 1.5rem;">
      
      <!-- Scanner / Check-in Box -->
      <div class="glass-panel" style="padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <h3 style="font-size: 1.15rem; font-weight: 800; color: #f8fafc; display: flex; align-items: center; gap: 0.5rem;">
              <i class="fa-solid fa-camera text-cyan"></i> Live QR &amp; Barcode Scanner
            </h3>
            <span class="status-pill success" style="font-size: 0.72rem;"><i class="fa-solid fa-circle-dot pulse"></i> Ready to Scan</span>
          </div>

          <!-- Camera Viewfinder Mock / Interactive Scanner Window -->
          <div id="scanner-viewfinder" style="position: relative; height: 190px; background: #0b1329; border-radius: 12px; border: 2px dashed rgba(6,182,212,0.4); overflow: hidden; display: flex; align-items: center; justify-content: center; flex-direction: column; margin-bottom: 1rem;">
            
            <!-- Laser Scanning Line Animation -->
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, transparent, #06b6d4, #38bdf8, transparent); box-shadow: 0 0 15px #06b6d4; animation: scanLaser 2s linear infinite; z-index: 2;"></div>

            <!-- Target Reticle -->
            <div style="width: 120px; height: 120px; border: 2px solid rgba(255,255,255,0.25); border-radius: 12px; position: relative; display: flex; align-items: center; justify-content: center;">
              <div style="position: absolute; top: -2px; left: -2px; width: 16px; height: 16px; border-top: 3px solid #06b6d4; border-left: 3px solid #06b6d4;"></div>
              <div style="position: absolute; top: -2px; right: -2px; width: 16px; height: 16px; border-top: 3px solid #06b6d4; border-right: 3px solid #06b6d4;"></div>
              <div style="position: absolute; bottom: -2px; left: -2px; width: 16px; height: 16px; border-bottom: 3px solid #06b6d4; border-left: 3px solid #06b6d4;"></div>
              <div style="position: absolute; bottom: -2px; right: -2px; width: 16px; height: 16px; border-bottom: 3px solid #06b6d4; border-right: 3px solid #06b6d4;"></div>
              <i class="fa-solid fa-qrcode" style="font-size: 3rem; color: rgba(255,255,255,0.15);"></i>
            </div>

            <span style="font-size: 0.75rem; color: #94a3b8; margin-top: 8px; z-index: 3;">Hold Student ID Card QR in front of camera or scanner gun</span>
          </div>

          <!-- Quick USN / QR Input -->
          <div class="form-group" style="margin-bottom: 0.75rem;">
            <label class="form-label" style="font-size: 0.75rem;"><i class="fa-solid fa-barcode"></i> Scan Input / Enter Student USN (Auto-Mark)</label>
            <div class="input-wrap" style="position: relative;">
              <i class="fa-solid fa-id-card input-icon" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-subtle);"></i>
              <input type="text" id="manual-qr-input" class="form-input" placeholder="e.g. 4GM24CS001 or scan QR code" autocomplete="off" style="padding-left: 2.75rem; font-family: monospace; font-size: 0.95rem;">
              <button class="btn btn-primary" id="btn-submit-scan" style="position: absolute; right: 4px; top: 4px; bottom: 4px; padding: 0 1rem; border-radius: 8px;">
                Mark
              </button>
            </div>
          </div>
        </div>

        <!-- Action Tools -->
        <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
          <button class="btn btn-secondary" id="btn-projector-qr" style="flex: 1; font-size: 0.78rem; padding: 0.55rem;">
            <i class="fa-solid fa-display text-cyan"></i> Projector Kiosk QR
          </button>
          <button class="btn btn-secondary" id="btn-scan-random-test" style="font-size: 0.78rem; padding: 0.55rem;" title="Simulate Scanning a Student ID">
            <i class="fa-solid fa-wand-magic-sparkles text-amber"></i> Quick Sim
          </button>
        </div>
      </div>

      <!-- Class Session & Config Details -->
      <div class="glass-panel" style="padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <h3 style="font-size: 1.15rem; font-weight: 800; color: #f8fafc;">
              <i class="fa-solid fa-book-open text-amber"></i> Lecture Session Configuration
            </h3>
            <span style="font-size: 0.8rem; color: #d97706; font-weight: 700;">GMIT Davangere • VTU CBCS</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
            <div>
              <label class="form-label" style="font-size: 0.72rem;">Course &amp; Subject</label>
              <select id="att-course-select" class="filter-select" style="width: 100%;">
                ${coursesToDisplay.map(c => `
                  <option value="${c.code}" ${c.code === defaultCourseCode ? 'selected' : ''}>${c.code} - ${c.title}</option>
                `).join('')}
              </select>
            </div>
            <div>
              <label class="form-label" style="font-size: 0.72rem;">Department &amp; Section</label>
              <select id="att-section-select" class="filter-select" style="width: 100%;">
                <option value="CSE-A" selected>Computer Science (Section A)</option>
                <option value="CSE-B">Computer Science (Section B)</option>
                <option value="AI-A">Computer Science &amp; AI (Section A)</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
            <div>
              <label class="form-label" style="font-size: 0.72rem;">Session Date</label>
              <input type="date" id="att-date-input" class="form-input" value="${attendanceState.lectureDate}" style="padding: 0.5rem 0.75rem; font-size: 0.85rem;">
            </div>
            <div>
              <label class="form-label" style="font-size: 0.72rem;">Faculty Instructor</label>
              <input type="text" id="att-faculty-instructor-field" class="form-input" value="${activeFacultyName}" disabled style="padding: 0.5rem 0.75rem; font-size: 0.85rem; opacity: 0.9;">
            </div>
          </div>

          <!-- Quick Bulk Actions -->
          <div style="background: rgba(0,0,0,0.25); padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 0.78rem; font-weight: 700; color: #cbd5e1;">Bulk Actions:</span>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-secondary" id="btn-mark-all-present" style="font-size: 0.78rem; padding: 6px 12px; font-weight: 700; color: #6ee7b7; border-color: rgba(16,185,129,0.4); background: rgba(16,185,129,0.15);">
                <i class="fa-solid fa-check"></i> Mark All Right (✓ Present)
              </button>
              <button class="btn btn-secondary" id="btn-mark-all-absent" style="font-size: 0.78rem; padding: 6px 12px; font-weight: 700; color: #fca5a5; border-color: rgba(239,68,68,0.4); background: rgba(239,68,68,0.15);">
                <i class="fa-solid fa-xmark"></i> Mark All Wrong (✗ Absent)
              </button>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
          <button class="btn btn-primary" id="btn-save-attendance" style="flex: 1; padding: 0.75rem; font-weight: 800; background: linear-gradient(135deg, #10b981, #059669);">
            <i class="fa-solid fa-cloud-arrow-up"></i> Save &amp; Sync Attendance to ERP
          </button>
        </div>
      </div>

    </div>

    <!-- Student Attendance Ledger Table -->
    <div class="glass-panel">
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-color); flex-wrap: wrap; gap: 1rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <h3 style="font-size: 1.15rem; font-weight: 800; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fa-solid fa-clipboard-user text-indigo"></i> Student Attendance Roster (50+ Students)
          </h3>
          <span class="status-pill info" style="font-size: 0.75rem; font-weight: 700;">${students.length} Enrolled</span>
        </div>

        <div class="search-input-wrap" style="width: 340px; margin: 0;">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" id="att-roster-search" placeholder="Search student USN or Name...">
        </div>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th style="min-width: 220px;">USN &amp; Student Name</th>
              <th>Department</th>
              <th>Aggregate</th>
              <th>Current Status</th>
              <th style="min-width: 240px; text-align: center;">Mark Attendance (Right ✓ / Wrong ✗)</th>
              <th style="text-align: center;">Smart ID</th>
            </tr>
          </thead>
          <tbody id="att-table-body">
            ${renderAttendanceTableRows(students)}
          </tbody>
        </table>
      </div>
    </div>

    <style>
      @keyframes scanLaser {
        0% { top: 0; }
        50% { top: 100%; }
        100% { top: 0; }
      }
      .att-btn-right {
        padding: 7px 14px;
        font-size: 0.82rem;
        font-weight: 800;
        border-radius: 8px;
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        user-select: none;
      }
      .att-btn-right.active {
        background: linear-gradient(135deg, #10b981, #059669) !important;
        color: #ffffff !important;
        border: 1px solid #10b981 !important;
        box-shadow: 0 0 15px rgba(16,185,129,0.5) !important;
        transform: scale(1.04);
      }
      .att-btn-right.inactive {
        background: rgba(16,185,129,0.08) !important;
        color: #6ee7b7 !important;
        border: 1px solid rgba(16,185,129,0.25) !important;
        opacity: 0.75;
      }
      .att-btn-right:hover {
        opacity: 1;
        background: rgba(16,185,129,0.2) !important;
      }
      .att-btn-wrong {
        padding: 7px 14px;
        font-size: 0.82rem;
        font-weight: 800;
        border-radius: 8px;
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        user-select: none;
      }
      .att-btn-wrong.active {
        background: linear-gradient(135deg, #ef4444, #dc2626) !important;
        color: #ffffff !important;
        border: 1px solid #ef4444 !important;
        box-shadow: 0 0 15px rgba(239,68,68,0.5) !important;
        transform: scale(1.04);
      }
      .att-btn-wrong.inactive {
        background: rgba(239,68,68,0.08) !important;
        color: #fca5a5 !important;
        border: 1px solid rgba(239,68,68,0.25) !important;
        opacity: 0.75;
      }
      .att-btn-wrong:hover {
        opacity: 1;
        background: rgba(239,68,68,0.2) !important;
      }
    </style>
  `;
}

function renderAttendanceTableRows(studentsList) {
  if (!studentsList || studentsList.length === 0) {
    return `<tr><td colspan="6" style="text-align: center; color: var(--text-subtle); padding: 2rem;">No student records found.</td></tr>`;
  }

  return studentsList.map(s => {
    const status = attendanceState.records[s.id] || 'present';
    const isPresent = status === 'present';
    const isAbsent = status === 'absent';

    return `
      <tr id="att-row-${s.id}">
        <td>
          <div class="student-mini-profile">
            ${avatarHTML(s.name, 'student-mini-avatar', 'width:40px;height:40px;border-radius:50%;')}
            <div>
              <div class="student-mini-name" style="font-size: 0.92rem; font-weight: 700;">${s.name}</div>
              <div class="student-mini-meta"><strong style="color: var(--ai-cyan); font-family: monospace; font-size: 0.85rem;">${s.id}</strong></div>
            </div>
          </div>
        </td>
        <td>
          <span style="font-size: 0.82rem; color: var(--text-main); font-weight: 600;">${s.department}</span>
        </td>
        <td>
          <strong style="color: ${s.attendance >= 75 ? 'var(--success)' : 'var(--danger)'}; font-size: 0.95rem;">${s.attendance}%</strong>
        </td>
        <td>
          <span class="status-pill ${isPresent ? 'success' : 'danger'}" id="status-pill-${s.id}" style="font-size: 0.82rem; font-weight: 700; padding: 4px 10px;">
            <i class="fa-solid ${isPresent ? 'fa-circle-check' : 'fa-circle-xmark'}"></i> ${isPresent ? 'Right (✓ Present)' : 'Wrong (✗ Absent)'}
          </span>
        </td>
        <td style="text-align: center;">
          <div style="display: inline-flex; gap: 0.6rem; align-items: center; justify-content: center;">
            <button class="att-btn-right btn-mark-right ${isPresent ? 'active' : 'inactive'}" data-id="${s.id}" data-status="present" title="Mark Right (✓ Present)">
              <i class="fa-solid fa-check" style="font-size: 0.95rem;"></i> Right (✓)
            </button>
            <button class="att-btn-wrong btn-mark-wrong ${isAbsent ? 'active' : 'inactive'}" data-id="${s.id}" data-status="absent" title="Mark Wrong (✗ Absent)">
              <i class="fa-solid fa-xmark" style="font-size: 0.95rem;"></i> Wrong (✗)
            </button>
          </div>
        </td>
        <td style="text-align: center;">
          <button class="icon-btn btn-att-idcard" data-id="${s.id}" title="View Student Smart Card &amp; QR" style="color: #f59e0b; background: rgba(245,158,11,0.12); border-color: rgba(245,158,11,0.3);">
            <i class="fa-solid fa-qrcode"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderFacultyDirectoryView() {
  return `
    <div class="copilot-grid">
      ${ERP_STATE.faculty.map(f => `
        <div class="risk-card" style="border: 1px solid var(--border-color);">
          <div class="risk-header">
            <div class="student-mini-profile">
              ${avatarHTML(f.name, 'student-mini-avatar', 'width:40px;height:40px;border-radius:50%;')}
              <div>
                <div class="student-mini-name">${f.name}</div>
                <div class="student-mini-meta">${f.title}</div>
                <div style="font-size: 0.75rem; color: #818cf8; font-weight: 700; margin-top: 2px;">
                  <i class="fa-solid fa-book-open"></i> ${f.subjectCode ? `${f.subjectCode} - ${f.subjectName}` : f.department}
                </div>
              </div>
            </div>
            <span class="status-pill ${f.status === 'Active' ? 'success' : 'warning'}">${f.status}</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem; text-align: center; background: rgba(0,0,0,0.2); padding: 0.5rem; border-radius: var(--radius-sm); font-size: 0.75rem;">
            <div>
              <span style="color: var(--text-subtle);">Workload</span><br>
              <strong>${f.workloadHours} hrs / wk</strong>
            </div>
            <div>
              <span style="color: var(--text-subtle);">Publications</span><br>
              <strong style="color: var(--ai-cyan);">${f.publications} Papers</strong>
            </div>
            <div>
              <span style="color: var(--text-subtle);">Student Rating</span><br>
              <strong style="color: var(--warning);"><i class="fa-solid fa-star"></i> ${f.rating}</strong>
            </div>
          </div>

          <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; justify-content: space-between; align-items: center;">
            <span><i class="fa-solid fa-envelope"></i> ${f.email}</span>
            <span style="font-size: 0.72rem; font-family: monospace; background: rgba(99,102,241,0.15); color: #a5b4fc; padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(99,102,241,0.3);">user: ${f.username || f.id}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

export function bindFacultyEvents() {
  // Tab Switching
  const attTabBtn = document.getElementById('tab-btn-attendance');
  const facTabBtn = document.getElementById('tab-btn-faculty-dir');

  if (attTabBtn && facTabBtn) {
    attTabBtn.onclick = () => {
      attendanceState.activeTab = 'attendance';
      document.getElementById('module-container').innerHTML = renderFacultyModule();
      bindFacultyEvents();
    };
    facTabBtn.onclick = () => {
      attendanceState.activeTab = 'faculty';
      document.getElementById('module-container').innerHTML = renderFacultyModule();
      bindFacultyEvents();
    };
  }

  // Workload manage buttons in faculty dir
  document.querySelectorAll('.btn-assign-workload').forEach(btn => {
    btn.onclick = (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const fac = ERP_STATE.faculty.find(f => f.id === id);
      showToast(`Adjusted workload parameters for ${fac.name}`, 'info');
    };
  });

  if (attendanceState.activeTab !== 'attendance') return;

  // Process a Scanned QR/USN payload
  const processScan = (rawInput) => {
    if (!rawInput || !rawInput.trim()) return;

    let targetUSN = rawInput.trim();

    // Check if JSON QR payload was scanned
    if (targetUSN.startsWith('{') && targetUSN.endsWith('}')) {
      try {
        const parsed = JSON.parse(targetUSN);
        if (parsed.usn) targetUSN = parsed.usn;
      } catch (err) {
        // Use raw string
      }
    }

    // Clean USN format (e.g. 4GM24CS001)
    targetUSN = targetUSN.toUpperCase();

    const student = ERP_STATE.students.find(s => s.id.toUpperCase() === targetUSN || s.name.toUpperCase().includes(targetUSN));

    if (student) {
      attendanceState.records[student.id] = 'present';
      playChime(true);
      showToast(`✅ Verified & Checked In: ${student.name} (${student.id})`, 'success');
      
      // Update row in DOM
      const pill = document.getElementById(`status-pill-${student.id}`);
      if (pill) {
        pill.className = 'status-pill success';
        pill.innerHTML = '<i class="fa-solid fa-check"></i> Present';
      }

      // Highlight row briefly
      const row = document.getElementById(`att-row-${student.id}`);
      if (row) {
        row.style.background = 'rgba(16, 185, 129, 0.15)';
        row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => { row.style.background = ''; }, 1500);
      }

      updateLiveStats();
    } else {
      playChime(false);
      showToast(`⚠️ Student USN "${targetUSN}" not found in current roster.`, 'error');
    }

    const input = document.getElementById('manual-qr-input');
    if (input) {
      input.value = '';
      input.focus();
    }
  };

  // Manual Scan Input Form
  const scanInput = document.getElementById('manual-qr-input');
  const scanSubmitBtn = document.getElementById('btn-submit-scan');

  if (scanInput && scanSubmitBtn) {
    scanSubmitBtn.onclick = () => processScan(scanInput.value);
    scanInput.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        processScan(scanInput.value);
      }
    };
  }

  // Quick Sim Scan Button
  const simBtn = document.getElementById('btn-scan-random-test');
  if (simBtn) {
    simBtn.onclick = () => {
      const students = ERP_STATE.students || [];
      if (students.length === 0) return;
      const randomStudent = students[Math.floor(Math.random() * students.length)];
      processScan(randomStudent.id);
    };
  }

  // Projector Kiosk QR Modal (Classroom Display)
  const projBtn = document.getElementById('btn-projector-qr');
  if (projBtn) {
    projBtn.onclick = () => {
      const sessionToken = `GMIT-ATT-${attendanceState.selectedCourse}-${Date.now()}`;
      const qrSvg = QRCode.generateSVG(sessionToken, { size: 220, margin: 2, colorDark: "#0f172a" });

      openModal({
        title: `Classroom Live Attendance Kiosk - ${attendanceState.selectedCourse}`,
        icon: 'fa-qrcode',
        contentHtml: `
          <div style="text-align: center; padding: 1.5rem 1rem; color: var(--text-main);">
            <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <img src="assets/gmit-logo.svg" style="width: 32px; height: 32px; object-fit: contain;">
              <h3 style="margin: 0; font-size: 1.3rem; font-weight: 800; color: #f59e0b;">GM INSTITUTE OF TECHNOLOGY</h3>
            </div>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.25rem;">
              Project this QR on classroom smart board. Students scan using GMIT Student Portal to check-in.
            </p>

            <div style="width: 240px; height: 240px; margin: 0 auto 1.25rem; background: #ffffff; padding: 10px; border-radius: 16px; border: 3px solid #d97706; display: flex; align-items: center; justify-content: center; box-shadow: 0 15px 35px rgba(217,119,6,0.3);">
              ${qrSvg}
            </div>

            <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(6,182,212,0.12); border: 1px solid rgba(6,182,212,0.3); padding: 0.4rem 0.85rem; border-radius: 20px; font-size: 0.8rem; color: var(--ai-cyan);">
              <i class="fa-solid fa-arrows-rotate fa-spin"></i> Rotating Token • Active for 60s
            </div>
          </div>
        `,
        buttonsHtml: `
          <button class="btn btn-secondary" id="close-modal-btn">Close Kiosk</button>
        `
      });
    };
  }

  // Bulk Present / Absent (Right / Wrong)
  const markAllPres = document.getElementById('btn-mark-all-present');
  const markAllAbs = document.getElementById('btn-mark-all-absent');

  if (markAllPres) {
    markAllPres.onclick = () => {
      ERP_STATE.students.forEach(s => { attendanceState.records[s.id] = 'present'; });
      updateAllRows();
      showToast('Marked all 50+ students as Right (✓ Present).', 'success');
    };
  }
  if (markAllAbs) {
    markAllAbs.onclick = () => {
      ERP_STATE.students.forEach(s => { attendanceState.records[s.id] = 'absent'; });
      updateAllRows();
      showToast('Marked all 50+ students as Wrong (✗ Absent).', 'warning');
    };
  }

  // Save Attendance Button
  const saveBtn = document.getElementById('btn-save-attendance');
  if (saveBtn) {
    saveBtn.onclick = () => {
      const presCount = Object.values(attendanceState.records).filter(v => v === 'present').length;
      const absCount = Object.values(attendanceState.records).filter(v => v === 'absent').length;
      showToast(`💾 Attendance saved! ${presCount} Present (✓), ${absCount} Absent (✗) for ${attendanceState.selectedCourse} on ${attendanceState.lectureDate}.`, 'success');
    };
  }

  // Individual Student Status Toggle (Right ✓ vs Wrong ✗)
  const bindToggleButtons = () => {
    document.querySelectorAll('.btn-mark-right').forEach(btn => {
      btn.onclick = (e) => {
        const usn = e.currentTarget.getAttribute('data-id');
        setStudentStatus(usn, 'present');
      };
    });

    document.querySelectorAll('.btn-mark-wrong').forEach(btn => {
      btn.onclick = (e) => {
        const usn = e.currentTarget.getAttribute('data-id');
        setStudentStatus(usn, 'absent');
      };
    });
  };

  function setStudentStatus(usn, newStatus) {
    attendanceState.records[usn] = newStatus;
    const isPresent = newStatus === 'present';

    const pill = document.getElementById(`status-pill-${usn}`);
    if (pill) {
      pill.className = `status-pill ${isPresent ? 'success' : 'danger'}`;
      pill.innerHTML = `<i class="fa-solid ${isPresent ? 'fa-circle-check' : 'fa-circle-xmark'}"></i> ${isPresent ? 'Right (✓ Present)' : 'Wrong (✗ Absent)'}`;
    }

    const row = document.getElementById(`att-row-${usn}`);
    if (row) {
      const btnRight = row.querySelector('.btn-mark-right');
      const btnWrong = row.querySelector('.btn-mark-wrong');
      if (btnRight) {
        btnRight.className = `att-btn-right btn-mark-right ${isPresent ? 'active' : 'inactive'}`;
      }
      if (btnWrong) {
        btnWrong.className = `att-btn-wrong btn-mark-wrong ${!isPresent ? 'active' : 'inactive'}`;
      }
    }

    updateLiveStats();
  }

  bindToggleButtons();

  // Smart ID Card Modal from Attendance Ledger
  document.querySelectorAll('.btn-att-idcard').forEach(btn => {
    btn.onclick = (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const student = ERP_STATE.students.find(s => s.id === id);
      if (!student) return;

      const qrPayload = JSON.stringify({
        institution: "GMIT DAVANGERE",
        usn: student.id,
        name: student.name,
        dept: student.department
      });
      const qrSvg = QRCode.generateSVG(qrPayload, { size: 120, margin: 1, colorDark: "#0f172a" });

      openModal({
        title: `Student Smart ID Card Verification - ${student.name}`,
        icon: 'fa-id-badge',
        contentHtml: `
          <div style="max-width: 380px; margin: 0 auto; background: #ffffff; color: #0f172a; border-radius: 14px; overflow: hidden; border: 2px solid #d97706; font-family: 'Plus Jakarta Sans', sans-serif;">
            <div style="background: #0f172a; color: #fff; padding: 0.75rem 1rem; text-align: center; border-bottom: 2px solid #d97706;">
              <div style="font-size: 0.62rem; color: #94a3b8; font-weight: 700;">SRISHYLA EDUCATIONAL TRUST (R)</div>
              <div style="font-size: 0.95rem; font-weight: 900; color: #f59e0b;">GM INSTITUTE OF TECHNOLOGY</div>
            </div>
            <div style="padding: 1rem; display: flex; gap: 0.85rem; align-items: center;">
              ${avatarHTML(student.name, '', 'width:75px;height:85px;border-radius:6px;border:2px solid #d97706;font-size:1.4rem;')}
              <div>
                <strong style="font-size: 0.95rem; display: block;">${student.name}</strong>
                <span style="display: inline-block; background: #fef3c7; color: #b45309; font-size: 0.75rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; margin: 3px 0;">${student.id}</span>
                <div style="font-size: 0.72rem; color: #475569;">${student.department}</div>
              </div>
            </div>
            <div style="text-align: center; padding: 0.75rem; background: #f8fafc; border-top: 1px dashed #cbd5e1;">
              <div style="width: 100px; height: 100px; margin: 0 auto; padding: 3px; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px;">
                ${qrSvg}
              </div>
              <div style="font-size: 0.62rem; color: #64748b; margin-top: 4px;">OFFICIAL SCANNABLE BARCODE</div>
            </div>
          </div>
        `,
        buttonsHtml: `<button class="btn btn-secondary" id="close-modal-btn">Done</button>`
      });
    };
  });

  // Roster Filter Search
  const rosterSearch = document.getElementById('att-roster-search');
  if (rosterSearch) {
    rosterSearch.oninput = () => {
      const q = rosterSearch.value.toLowerCase().trim();
      ERP_STATE.students.forEach(s => {
        const row = document.getElementById(`att-row-${s.id}`);
        if (row) {
          const match = !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
          row.style.display = match ? '' : 'none';
        }
      });
    };
  }

  function updateAllRows() {
    ERP_STATE.students.forEach(s => {
      const st = attendanceState.records[s.id] || 'present';
      const isPresent = st === 'present';
      const pill = document.getElementById(`status-pill-${s.id}`);
      if (pill) {
        pill.className = `status-pill ${isPresent ? 'success' : 'danger'}`;
        pill.innerHTML = `<i class="fa-solid ${isPresent ? 'fa-circle-check' : 'fa-circle-xmark'}"></i> ${isPresent ? 'Right (✓ Present)' : 'Wrong (✗ Absent)'}`;
      }
      const row = document.getElementById(`att-row-${s.id}`);
      if (row) {
        const btnRight = row.querySelector('.btn-mark-right');
        const btnWrong = row.querySelector('.btn-mark-wrong');
        if (btnRight) {
          btnRight.className = `att-btn-right btn-mark-right ${isPresent ? 'active' : 'inactive'}`;
        }
        if (btnWrong) {
          btnWrong.className = `att-btn-wrong btn-mark-wrong ${!isPresent ? 'active' : 'inactive'}`;
        }
      }
    });
    updateLiveStats();
  }

  function updateLiveStats() {
    const total = ERP_STATE.students.length;
    const pres = Object.values(attendanceState.records).filter(v => v === 'present').length;
    const abs = Object.values(attendanceState.records).filter(v => v === 'absent').length;
    const pct = total > 0 ? Math.round((pres / total) * 100) : 0;

    const elTotal = document.getElementById('stat-att-total');
    const elPres = document.getElementById('stat-att-present');
    const elAbs = document.getElementById('stat-att-absent');
    const elPct = document.getElementById('stat-att-pct');

    if (elTotal) elTotal.textContent = total;
    if (elPres) elPres.textContent = pres;
    if (elAbs) elAbs.textContent = abs;
    if (elPct) {
      elPct.textContent = pct + '%';
      elPct.style.color = pct >= 75 ? 'var(--success)' : 'var(--danger)';
    }
  }
}


