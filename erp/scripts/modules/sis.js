/* GMIT ERP - Student Information System (SIS) Module with Subject-Wise Performance */

import { ERP_STATE } from '../data/mockData.js';
import { calculateStudentRisk } from '../data/aiData.js';
import { showToast } from '../components/toasts.js';
import { avatarHTML, getLoggedInFaculty, getStudentSubjectPerformance } from '../utils/helpers.js';
import { openModal } from '../components/modals.js';
import { API } from '../data/api.js';
import QRCode from '../utils/qrcode.js';

let activeSubjectFilter = 'ALL';

export function renderSISModule() {
  const initialStudents = ERP_STATE.students || [];
  const fac = getLoggedInFaculty();

  if (fac && fac.subjectCode) {
    activeSubjectFilter = fac.subjectCode;
  }

  const isFacultyView = Boolean(fac && fac.subjectCode);
  const currentSubjectObj = ERP_STATE.courses.find(c => c.code === activeSubjectFilter) || {
    code: fac?.subjectCode || '24CS101',
    title: fac?.subject || 'Data Structures & Algorithms',
    instructor: fac?.name || 'Faculty Instructor'
  };

  return `
    <div class="panel-header">
      <div>
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <img src="assets/gmit-logo.svg" alt="GMIT" style="width: 28px; height: 28px; object-fit: contain;">
          <h2 class="panel-title" style="font-size: 1.6rem; margin: 0;">Student Information System (SIS)</h2>
        </div>
        <p style="color: var(--text-muted); font-size: 0.88rem; margin-top: 4px;">
          ${isFacultyView 
            ? `Subject-specific academic roster and student performance records for <strong>${currentSubjectObj.code} - ${currentSubjectObj.title}</strong>.`
            : `Comprehensive university student database, VTU CBCS marks, and digital dossiers.`}
        </p>
      </div>
      <div style="display: flex; gap: 0.6rem;">
        ${!isFacultyView ? `
          <button class="btn btn-primary" id="btn-enroll-student">
            <i class="fa-solid fa-plus-circle"></i> Enroll New Student
          </button>
        ` : `
          <div class="status-pill success" style="font-size: 0.82rem; padding: 6px 14px; font-weight: 700;">
            <i class="fa-solid fa-chalkboard-user"></i> Faculty: ${fac.name}
          </div>
        `}
      </div>
    </div>

    <!-- Faculty Subject Banner or Admin Subject Switcher -->
    ${isFacultyView ? `
      <div class="glass-panel" style="margin-bottom: 1.25rem; background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(6,182,212,0.12)); border: 1px solid rgba(99,102,241,0.35); padding: 1.1rem 1.4rem; border-radius: 12px; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(99,102,241,0.25); color: #818cf8; display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
            <i class="fa-solid fa-book-bookmark"></i>
          </div>
          <div>
            <div style="font-size: 0.72rem; text-transform: uppercase; color: #818cf8; font-weight: 800; letter-spacing: 0.5px;">Assigned Subject Performance Ledger</div>
            <h3 style="margin: 2px 0 0 0; font-size: 1.25rem; color: #f8fafc; font-weight: 800;">${currentSubjectObj.code}: ${currentSubjectObj.title}</h3>
            <p style="margin: 2px 0 0 0; font-size: 0.82rem; color: #cbd5e1;">Instructor: <strong style="color: #67e8f9;">${fac.name}</strong> • Displaying student marks, subject attendance &amp; continuous assessment.</p>
          </div>
        </div>
        <span class="status-pill success" style="font-size: 0.78rem; font-weight: 700; padding: 6px 12px;">
          <i class="fa-solid fa-lock"></i> Subject-Restricted View
        </span>
      </div>
    ` : `
      <div class="glass-panel" style="margin-bottom: 1.25rem; padding: 0.85rem 1.25rem; display: flex; align-items: center; justify-content: space-between; border-left: 4px solid var(--primary);">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <i class="fa-solid fa-sliders text-indigo"></i>
          <span style="font-size: 0.85rem; font-weight: 700; color: #f8fafc;">View Performance By Subject:</span>
          <select id="sis-admin-subject-select" class="filter-select" style="padding: 4px 10px; font-size: 0.82rem;">
            <option value="ALL" ${activeSubjectFilter === 'ALL' ? 'selected' : ''}>Overview (General GPA &amp; Overall Attendance)</option>
            ${ERP_STATE.courses.map(c => `
              <option value="${c.code}" ${activeSubjectFilter === c.code ? 'selected' : ''}>${c.code} - ${c.title} (${c.instructor})</option>
            `).join('')}
          </select>
        </div>
        <span style="font-size: 0.75rem; color: var(--text-muted);">10 Enrolled Students</span>
      </div>
    `}

    <!-- Toolbar Filters -->
    <div class="glass-panel" style="padding: 1rem 1.25rem; margin-bottom: 1.5rem;">
      <div class="toolbar-bar" style="margin-bottom: 0;">
        <div class="search-input-wrap">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" id="sis-search-input" placeholder="Search USN, student name, email, or mobile...">
        </div>

        <div style="display: flex; gap: 0.75rem;">
          <select id="sis-dept-filter" class="filter-select">
            <option value="ALL">All Departments</option>
            <option value="Computer Science & Engineering">Computer Science & Engineering</option>
            <option value="Computer Science & AI">Computer Science & AI</option>
          </select>

          <select id="sis-risk-filter" class="filter-select">
            <option value="ALL">All Risk Levels</option>
            <option value="High">High Risk / At-Risk</option>
            <option value="Low">Top Performers / Low Risk</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table Container -->
    <div class="glass-panel">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>USN &amp; Student Name</th>
              <th>Gender &amp; Contact</th>
              ${isFacultyView || activeSubjectFilter !== 'ALL' ? `
                <th>Subject Attendance</th>
                <th>Internal Assessment (30)</th>
                <th>Total Marks (100)</th>
                <th>Grade</th>
                <th>Performance Status &amp; Remarks</th>
              ` : `
                <th>Department &amp; Batch</th>
                <th>CGPA Standing</th>
                <th>Overall Attendance</th>
                <th>Academic Risk</th>
              `}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="sis-table-body">
            ${renderStudentTableRows(initialStudents)}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderStudentTableRows(studentsList) {
  if (!studentsList || studentsList.length === 0) {
    return `<tr><td colspan="8" style="text-align: center; color: var(--text-subtle); padding: 2rem;">No matching student records found.</td></tr>`;
  }

  const fac = getLoggedInFaculty();
  const isFacultyView = Boolean(fac && fac.subjectCode);
  const subjCode = isFacultyView ? fac.subjectCode : activeSubjectFilter;
  const isSubjectSpecific = isFacultyView || subjCode !== 'ALL';

  return studentsList.map(s => {
    const risk = calculateStudentRisk(s);
    const cgpaVal = typeof s.cgpa === 'number' ? s.cgpa.toFixed(2) : '3.50';
    const sp = getStudentSubjectPerformance(s, isSubjectSpecific ? subjCode : '24CS101');

    return `
      <tr>
        <td>
          <div class="student-mini-profile">
            ${avatarHTML(s.name, 'student-mini-avatar', 'width:40px;height:40px;border-radius:50%;')}
            <div>
              <div class="student-mini-name" style="font-size: 0.92rem; font-weight: 700;">${s.name}</div>
              <div class="student-mini-meta"><strong style="color: var(--ai-cyan); font-family: monospace;">${s.id}</strong></div>
            </div>
          </div>
        </td>
        <td>
          <span class="status-pill info">${s.gender === 'F' ? 'Female' : 'Male'}</span><br>
          <span style="font-size: 0.75rem; color: var(--text-muted);"><i class="fa-solid fa-phone"></i> ${s.phone || '9481100246'}</span>
        </td>

        ${isSubjectSpecific ? `
          <!-- Subject-specific Performance Columns -->
          <td>
            <strong style="color: ${sp.attendance >= 75 ? 'var(--success)' : 'var(--danger)'}; font-size: 0.95rem;">${sp.attendance}%</strong>
            <span style="display: block; font-size: 0.7rem; color: var(--text-subtle);">${sp.attendance >= 75 ? 'Eligible' : 'Attendance Shortage'}</span>
          </td>
          <td>
            <strong style="color: #38bdf8; font-size: 0.95rem;">${sp.iaMarks} / 30</strong>
            <span style="display: block; font-size: 0.7rem; color: var(--text-subtle);">Continuous Eval</span>
          </td>
          <td>
            <strong style="color: #f8fafc; font-size: 0.95rem;">${sp.totalMarks} / 100</strong>
          </td>
          <td>
            <span class="status-pill ${sp.grade === 'O' || sp.grade === 'A+' ? 'success' : (sp.grade === 'C' ? 'danger' : 'info')}" style="font-weight: 800; font-size: 0.85rem;">
              ${sp.grade}
            </span>
          </td>
          <td style="max-width: 220px;">
            <span style="font-size: 0.78rem; font-weight: 700; color: ${sp.status === 'At-Risk' ? '#ef4444' : (sp.status === 'Outstanding' ? '#10b981' : '#38bdf8')};">
              <i class="fa-solid ${sp.status === 'At-Risk' ? 'fa-triangle-exclamation' : 'fa-circle-check'}"></i> ${sp.status}
            </span><br>
            <span style="font-size: 0.72rem; color: var(--text-muted); line-height: 1.2; display: inline-block;">${sp.remark}</span>
          </td>
        ` : `
          <!-- General Overview Columns -->
          <td>
            <strong style="color: var(--text-main); font-size: 0.85rem;">${s.department}</strong><br>
            <span style="font-size: 0.75rem; color: var(--text-subtle);">${s.year}</span>
          </td>
          <td>
            <span style="font-family: var(--font-heading); font-weight: 800; font-size: 1.05rem; color: ${s.cgpa >= 3.5 ? 'var(--success)' : (s.cgpa < 2.8 ? 'var(--danger)' : 'var(--text-main)')}">
              ${cgpaVal}
            </span>
            <span style="font-size: 0.72rem; color: var(--text-subtle);">/ 4.0</span>
          </td>
          <td>
            <strong style="color: ${s.attendance < 75 ? 'var(--danger)' : 'var(--success)'}">${s.attendance}%</strong>
          </td>
          <td>
            <span class="status-pill ${risk.level === 'Low' ? 'success' : (risk.level === 'High' ? 'danger' : 'warning')}">
              ${risk.level} (${risk.score}%)
            </span>
          </td>
        `}

        <td>
          <div style="display: flex; gap: 0.4rem;">
            <button class="icon-btn btn-view-dossier" data-id="${s.id}" title="View Student Performance Dossier">
              <i class="fa-solid fa-chart-line text-cyan"></i>
            </button>
            <button class="icon-btn btn-view-idcard" data-id="${s.id}" title="Generate GMIT Smart ID Card with QR Code" style="color: #f59e0b; background: rgba(245,158,11,0.12); border-color: rgba(245,158,11,0.3);">
              <i class="fa-solid fa-qrcode"></i>
            </button>
            <button class="icon-btn btn-print-transcript" data-id="${s.id}" title="Generate Official Transcript">
              <i class="fa-solid fa-file-pdf text-indigo"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

export function bindSISEvents() {
  const searchInput = document.getElementById('sis-search-input');
  const deptFilter = document.getElementById('sis-dept-filter');
  const riskFilter = document.getElementById('sis-risk-filter');
  const adminSubjSelect = document.getElementById('sis-admin-subject-select');
  const tableBody = document.getElementById('sis-table-body');

  const filterStudents = async () => {
    const query = searchInput ? searchInput.value.trim() : '';
    const dept = deptFilter ? deptFilter.value : 'ALL';
    const riskVal = riskFilter ? riskFilter.value : 'ALL';

    const q = query.toLowerCase();
    const studentsToRender = ERP_STATE.students.filter(s => {
      const matchesQuery = !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || (s.phone && s.phone.includes(q));
      const matchesDept = dept === 'ALL' || s.department === dept;
      const risk = calculateStudentRisk(s);
      const matchesRisk = riskVal === 'ALL' || (riskVal === 'High' && risk.score >= 50) || (riskVal === 'Low' && risk.score < 35);
      return matchesQuery && matchesDept && matchesRisk;
    });

    if (tableBody) tableBody.innerHTML = renderStudentTableRows(studentsToRender);
    bindRowButtons();
  };

  if (searchInput) searchInput.addEventListener('input', filterStudents);
  if (deptFilter) deptFilter.addEventListener('change', filterStudents);
  if (riskFilter) riskFilter.addEventListener('change', filterStudents);

  if (adminSubjSelect) {
    adminSubjSelect.addEventListener('change', (e) => {
      activeSubjectFilter = e.target.value;
      const container = document.getElementById('module-container');
      if (container) {
        container.innerHTML = renderSISModule();
        bindSISEvents();
      }
    });
  }

  // Enroll Student Modal
  const enrollBtn = document.getElementById('btn-enroll-student');
  if (enrollBtn) {
    enrollBtn.addEventListener('click', () => {
      openModal({
        title: 'Enroll New Student Record',
        icon: 'fa-user-plus',
        contentHtml: `
          <form id="enroll-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">USN Number</label>
                <input type="text" class="form-control" id="new-usn" placeholder="e.g. 4GM24CS054" required>
              </div>
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-control" id="new-name" placeholder="e.g. PRAJWAL S" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-control" id="new-email" placeholder="prajwal@gmail.com" required>
              </div>
              <div class="form-group">
                <label class="form-label">Mobile Number</label>
                <input type="text" class="form-control" id="new-phone" placeholder="9876543210" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Gender</label>
                <select class="form-control" id="new-gender">
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Department</label>
                <input type="text" class="form-control" id="new-dept" value="Computer Science & Engineering">
              </div>
            </div>
          </form>
        `,
        buttonsHtml: `
          <button class="btn btn-secondary" id="close-modal-btn">Cancel</button>
          <button class="btn btn-primary" id="save-student-btn"><i class="fa-solid fa-check"></i> Save Record</button>
        `
      });

      setTimeout(() => {
        const saveBtn = document.getElementById('save-student-btn');
        if (saveBtn) {
          saveBtn.addEventListener('click', async () => {
            const usn = document.getElementById('new-usn')?.value;
            const name = document.getElementById('new-name')?.value;
            const email = document.getElementById('new-email')?.value;
            const phone = document.getElementById('new-phone')?.value;
            const gender = document.getElementById('new-gender')?.value;
            const dept = document.getElementById('new-dept')?.value;

            if (!usn || !name || !email) {
              showToast('Please fill in required USN, Name, and Email.', 'warning');
              return;
            }

            const newStu = {
              id: usn,
              name,
              gender,
              email,
              phone,
              department: dept,
              year: "1st Year (2024 Batch)",
              cgpa: 3.80,
              attendance: 100,
              feeStatus: "Paid",
              feePending: 0,
              riskScore: 2,
              riskLevel: "Low",
              hostelRoom: "Unassigned"
            };

            await API.enrollStudent(newStu);
            ERP_STATE.students.unshift(newStu);
            showToast(`Student ${name} (${usn}) enrolled successfully!`, 'success');
            document.getElementById('modal-backdrop').classList.add('hidden');
            filterStudents();
          });
        }
      }, 50);
    });
  }

  bindRowButtons();
  filterStudents();
}

function bindRowButtons() {
  const fac = getLoggedInFaculty();
  const highlightedSubj = fac?.subjectCode || '24CS101';

  // Dossier button
  document.querySelectorAll('.btn-view-dossier').forEach(btn => {
    btn.onclick = (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const student = ERP_STATE.students.find(s => s.id === id);
      if (!student) return;

      const cgpaVal = typeof student.cgpa === 'number' ? student.cgpa.toFixed(2) : '3.50';
      const spMap = student.subjectPerformance || {};

      openModal({
        title: `Student Academic Dossier & Performance: ${student.name}`,
        icon: 'fa-chart-line',
        contentHtml: `
          <div style="display: flex; gap: 1.5rem; align-items: flex-start; margin-bottom: 1.25rem;">
            ${avatarHTML(student.name, '', 'width:80px;height:80px;border-radius:50%;border:3px solid var(--primary);font-size:1.5rem;')}
            <div>
              <h3 style="font-family: var(--font-heading); font-size: 1.3rem; margin: 0;">${student.name}</h3>
              <p style="color: var(--ai-cyan); font-weight: 700; font-size: 0.95rem; margin: 2px 0;">USN: ${student.id}</p>
              <p style="color: var(--text-muted); font-size: 0.85rem; margin: 2px 0;">${student.department} • ${student.year}</p>
              <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                <span class="status-pill info">Gender: ${student.gender === 'F' ? 'Female' : 'Male'}</span>
                <span class="status-pill success">Mobile: ${student.phone || '9481100246'}</span>
                <span class="status-pill warning">CGPA: ${cgpaVal} / 4.0</span>
              </div>
            </div>
          </div>

          <!-- Subject-Wise Performance Table in Dossier -->
          <div style="margin-top: 1.25rem; background: rgba(15,23,42,0.6); border: 1px solid var(--border-color); border-radius: 10px; padding: 1rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
              <h4 style="font-size: 0.95rem; font-weight: 800; color: #f8fafc; margin: 0;">
                <i class="fa-solid fa-book-open text-indigo"></i> Subject-Wise Continuous Assessment &amp; Marks
              </h4>
              <span style="font-size: 0.72rem; color: #38bdf8; font-weight: 700;">VTU CBCS 2024 Scheme</span>
            </div>

            <div class="table-responsive">
              <table style="width: 100%; font-size: 0.8rem; border-collapse: collapse;">
                <thead>
                  <tr style="background: rgba(255,255,255,0.06); text-align: left;">
                    <th style="padding: 6px 8px;">Course</th>
                    <th style="padding: 6px 8px;">Faculty</th>
                    <th style="padding: 6px 8px;">Attendance</th>
                    <th style="padding: 6px 8px;">IA (30)</th>
                    <th style="padding: 6px 8px;">Total (100)</th>
                    <th style="padding: 6px 8px;">Grade</th>
                    <th style="padding: 6px 8px;">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  ${ERP_STATE.courses.map(c => {
                    const sp = spMap[c.code] || {
                      attendance: student.attendance,
                      iaMarks: 25,
                      totalMarks: 85,
                      grade: student.recentGrade || 'A',
                      remark: 'Good engagement.'
                    };
                    const isMySubject = c.code === highlightedSubj;

                    return `
                      <tr style="${isMySubject ? 'background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.4);' : 'border-bottom: 1px solid rgba(255,255,255,0.04);'}">
                        <td style="padding: 7px 8px;">
                          <strong style="color: ${isMySubject ? '#a5b4fc' : '#f8fafc'};">${c.code}</strong><br>
                          <span style="font-size: 0.7rem; color: var(--text-subtle);">${c.title}</span>
                          ${isMySubject ? `<span style="display:inline-block; margin-left:4px; font-size:0.65rem; background:#6366f1; color:#fff; padding:1px 4px; border-radius:3px;">Your Subject</span>` : ''}
                        </td>
                        <td style="padding: 7px 8px; color: var(--text-muted); font-size: 0.75rem;">${c.instructor}</td>
                        <td style="padding: 7px 8px;">
                          <strong style="color: ${sp.attendance >= 75 ? 'var(--success)' : 'var(--danger)'};">${sp.attendance}%</strong>
                        </td>
                        <td style="padding: 7px 8px; color: #38bdf8; font-weight: 700;">${sp.iaMarks} / 30</td>
                        <td style="padding: 7px 8px; font-weight: 700; color: #f8fafc;">${sp.totalMarks} / 100</td>
                        <td style="padding: 7px 8px;">
                          <span class="status-pill ${sp.grade === 'O' || sp.grade === 'A+' ? 'success' : (sp.grade === 'C' ? 'danger' : 'info')}" style="padding: 2px 6px; font-size: 0.75rem;">${sp.grade}</span>
                        </td>
                        <td style="padding: 7px 8px; font-size: 0.72rem; color: var(--text-muted); max-width: 140px;">${sp.remark}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `
      });
    };
  });

  // Print Transcript button
  document.querySelectorAll('.btn-print-transcript').forEach(btn => {
    btn.onclick = (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const student = ERP_STATE.students.find(s => s.id === id);
      if (!student) return;

      const cgpaVal = typeof student.cgpa === 'number' ? student.cgpa.toFixed(2) : '3.50';
      const spMap = student.subjectPerformance || {};

      openModal({
        title: `Official Academic Transcript - ${student.name}`,
        icon: 'fa-file-pdf',
        contentHtml: `
          <div id="transcript-pdf-area" style="background: #ffffff; color: #000; padding: 2rem; border-radius: 8px; font-family: serif;">
            <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 1rem; margin-bottom: 1.5rem;">
              <div style="font-size: 0.85rem; font-weight: 700; color: #475569; letter-spacing: 0.5px;">SRISHYLA EDUCATIONAL TRUST (R), BHEEMASAMUDRA</div>
              <h2 style="margin: 4px 0; font-size: 1.5rem; letter-spacing: 0.5px; color: #b45309; font-weight: 900;">GM INSTITUTE OF TECHNOLOGY, DAVANGERE</h2>
              <p style="margin: 2px 0 0 0; font-size: 0.85rem; color: #334155;">Approved by AICTE | Affiliated to V.T.U. Belagavi | Recognized by Govt. of Karnataka</p>
              <p style="margin: 4px 0 0 0; font-size: 0.85rem; font-style: italic; font-weight: 600;">Office of the Controller of Examinations • Official Grade Transcript</p>
            </div>

            <table style="width: 100%; font-size: 0.9rem; margin-bottom: 1.5rem; border-collapse: collapse;">
              <tr>
                <td><strong>Student Name:</strong> ${student.name}</td>
                <td><strong>USN:</strong> ${student.id}</td>
              </tr>
              <tr>
                <td><strong>Department:</strong> ${student.department}</td>
                <td><strong>Mobile:</strong> ${student.phone}</td>
              </tr>
              <tr>
                <td><strong>Email:</strong> ${student.email}</td>
                <td><strong>Cumulative GPA:</strong> ${cgpaVal} / 4.0</td>
              </tr>
            </table>

            <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 0.85rem;">
              <thead>
                <tr style="background: #f0f0f0;">
                  <th style="border: 1px solid #000; padding: 6px;">Course Code</th>
                  <th style="border: 1px solid #000; padding: 6px;">Title</th>
                  <th style="border: 1px solid #000; padding: 6px;">Credits</th>
                  <th style="border: 1px solid #000; padding: 6px;">IA Marks (30)</th>
                  <th style="border: 1px solid #000; padding: 6px;">Total (100)</th>
                  <th style="border: 1px solid #000; padding: 6px;">Grade</th>
                </tr>
              </thead>
              <tbody>
                ${ERP_STATE.courses.map(c => {
                  const sp = spMap[c.code] || { iaMarks: 25, totalMarks: 85, grade: 'A' };
                  return `
                    <tr>
                      <td style="border: 1px solid #000; padding: 6px;">${c.code}</td>
                      <td style="border: 1px solid #000; padding: 6px;">${c.title}</td>
                      <td style="border: 1px solid #000; padding: 6px;">${c.credits}</td>
                      <td style="border: 1px solid #000; padding: 6px;">${sp.iaMarks}</td>
                      <td style="border: 1px solid #000; padding: 6px;">${sp.totalMarks}</td>
                      <td style="border: 1px solid #000; padding: 6px; font-weight: bold;">${sp.grade}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>

            <div style="margin-top: 2rem; display: flex; justify-content: space-between; font-size: 0.8rem;">
              <div>Verified by Controller Seal: <strong>#GMIT-VTU-OFFICIAL</strong></div>
              <div>Registrar Signature: <em>Dr. Eleanor Vance</em></div>
            </div>
          </div>
        `,
        buttonsHtml: `
          <button class="btn btn-secondary" id="close-modal-btn">Close</button>
          <button class="btn btn-primary" id="download-transcript-pdf-btn"><i class="fa-solid fa-download"></i> Download PDF Document</button>
        `
      });

      setTimeout(() => {
        const downloadBtn = document.getElementById('download-transcript-pdf-btn');
        if (downloadBtn && window.html2pdf) {
          downloadBtn.onclick = () => {
            const element = document.getElementById('transcript-pdf-area');
            window.html2pdf().from(element).save(`${student.id}_Transcript.pdf`);
            showToast(`Downloaded Official Transcript for ${student.name} (${student.id})`, 'success');
          };
        }
      }, 50);
    };
  });

  // Smart ID Card with QR Code Button
  document.querySelectorAll('.btn-view-idcard').forEach(btn => {
    btn.onclick = (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const student = ERP_STATE.students.find(s => s.id === id);
      if (!student) return;

      const qrPayload = JSON.stringify({
        institution: "GMIT DAVANGERE",
        usn: student.id,
        name: student.name,
        dept: student.department,
        batch: student.year || "2024-2028",
        bloodGroup: "O+",
        phone: student.phone || "9481100246"
      });

      const qrSvg = QRCode.generateSVG(qrPayload, { size: 130, margin: 1, colorDark: "#0f172a" });

      openModal({
        title: `GMIT Smart Student ID Card - ${student.name}`,
        icon: 'fa-id-badge',
        contentHtml: `
          <div id="student-id-card-print" style="max-width: 420px; margin: 0 auto; background: #ffffff; color: #0f172a; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3); border: 2px solid #d97706; font-family: 'Plus Jakarta Sans', sans-serif;">
            
            <!-- Card Header -->
            <div style="background: linear-gradient(135deg, #1e293b, #0f172a); color: #fff; padding: 0.85rem 1rem; text-align: center; border-bottom: 3px solid #d97706;">
              <div style="font-size: 0.65rem; letter-spacing: 0.5px; color: #cbd5e1; font-weight: 700; text-transform: uppercase;">Srishyla Educational Trust (R), Bheemasamudra</div>
              <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 4px;">
                <img src="assets/gmit-logo.svg" style="width: 32px; height: 32px; object-fit: contain;" alt="GMIT Seal">
                <div style="font-family: 'Outfit', sans-serif; font-size: 1.05rem; font-weight: 900; color: #f59e0b; line-height: 1.1;">GM INSTITUTE OF TECHNOLOGY</div>
              </div>
              <div style="font-size: 0.62rem; color: #94a3b8; margin-top: 2px;">Davangere - 577006 | Affiliated to VTU Belagavi • AICTE Approved</div>
            </div>

            <!-- Card Body -->
            <div style="padding: 1.25rem 1.25rem 0.75rem;">
              <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
                <div style="position: relative;">
                  ${avatarHTML(student.name, '', 'width:88px;height:98px;border-radius:8px;border:2px solid #d97706;display:block;font-size:1.5rem;')}
                  <span style="position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); background: #10b981; color: #fff; font-size: 0.58rem; font-weight: 800; padding: 1px 6px; border-radius: 4px;">STUDENT</span>
                </div>

                <div style="flex: 1; min-width: 0;">
                  <div style="font-size: 1.05rem; font-weight: 800; color: #0f172a; line-height: 1.2;">${student.name}</div>
                  <div style="background: #fef3c7; color: #b45309; display: inline-block; font-size: 0.78rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; margin: 4px 0;">USN: ${student.id}</div>
                  <div style="font-size: 0.75rem; color: #334155; font-weight: 600;">${student.department}</div>
                  <div style="font-size: 0.7rem; color: #64748b;">Batch: ${student.year} | Sem: IV</div>
                </div>
              </div>

              <!-- Student Details Grid -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; background: #f8fafc; padding: 0.65rem 0.85rem; border-radius: 8px; font-size: 0.72rem; border: 1px solid #e2e8f0; margin-bottom: 0.85rem;">
                <div><span style="color: #64748b;">Blood Group:</span> <strong style="color: #dc2626;">O+</strong></div>
                <div><span style="color: #64748b;">Gender:</span> <strong>${student.gender === 'F' ? 'Female' : 'Male'}</strong></div>
                <div><span style="color: #64748b;">Contact:</span> <strong>${student.phone || '9481100246'}</strong></div>
                <div><span style="color: #64748b;">Validity:</span> <strong>2024 - 2028</strong></div>
              </div>

              <!-- QR Code & Barcode Verification Area -->
              <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px dashed #cbd5e1; padding-top: 0.75rem;">
                <div style="text-align: center; flex: 1;">
                  <div style="margin: 0 auto; width: 110px; height: 110px; display: flex; align-items: center; justify-content: center; padding: 4px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px;">
                    ${qrSvg}
                  </div>
                  <div style="font-size: 0.62rem; color: #64748b; font-weight: 700; margin-top: 3px;">SCAN FOR ATTENDANCE &amp; EXAM ACCESS</div>
                </div>

                <div style="text-align: right; font-size: 0.65rem; color: #475569; padding-left: 0.75rem;">
                  <div style="margin-bottom: 1.25rem;">
                    <div style="font-family: cursive; font-size: 0.9rem; color: #1e293b;">Eleanor Vance</div>
                    <div style="border-top: 1px solid #94a3b8; font-weight: 700;">Dean Academics</div>
                  </div>
                  <div>
                    <div style="font-family: cursive; font-size: 0.9rem; color: #1e293b;">Y. Vijaya Kumar</div>
                    <div style="border-top: 1px solid #94a3b8; font-weight: 700;">Principal / GMIT</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card Footer Strip -->
            <div style="background: #d97706; color: #fff; padding: 0.35rem 0.5rem; text-align: center; font-size: 0.62rem; font-weight: 800; letter-spacing: 0.5px;">
              ★ GMIT HI-TECH CAMPUS SMART CARD • OFFICIAL CARDHOLDER ★
            </div>
          </div>
        `,
        buttonsHtml: `
          <button class="btn btn-secondary" id="close-modal-btn">Close</button>
          <button class="btn btn-primary" id="download-idcard-pdf-btn" style="background: linear-gradient(135deg, #d97706, #ea580c);"><i class="fa-solid fa-download"></i> Download / Print Smart ID Card</button>
        `
      });

      setTimeout(() => {
        const downloadBtn = document.getElementById('download-idcard-pdf-btn');
        if (downloadBtn && window.html2pdf) {
          downloadBtn.onclick = () => {
            const element = document.getElementById('student-id-card-print');
            window.html2pdf().from(element).save(`${student.id}_GMIT_Smart_ID_Card.pdf`);
            showToast(`Smart ID Card for ${student.name} (${student.id}) generated as PDF.`, 'success');
          };
        }
      }, 50);
    };
  });
}
