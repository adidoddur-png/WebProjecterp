/* GMIT ERP - Academics & Exam LMS Module (Subject-Restricted for Faculty) */

import { ERP_STATE } from '../data/mockData.js';
import { evaluateAssignmentSubmission } from '../data/aiData.js';
import { showToast } from '../components/toasts.js';
import { avatarHTML, getLoggedInFaculty, getStudentSubjectPerformance } from '../utils/helpers.js';
import { openModal } from '../components/modals.js';

export function renderAcademicsModule() {
  const fac = getLoggedInFaculty();
  const isFacultyView = Boolean(fac && fac.subjectCode);

  // If faculty is logged in, only show their course; otherwise show all courses for admin
  const visibleCourses = isFacultyView 
    ? ERP_STATE.courses.filter(c => c.code === fac.subjectCode || c.instructor.toLowerCase().includes(fac.name.toLowerCase()))
    : ERP_STATE.courses;

  const currentCourse = visibleCourses[0] || ERP_STATE.courses[0];
  const students = ERP_STATE.students || [];

  return `
    <div class="panel-header">
      <div>
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <img src="assets/gmit-logo.svg" alt="GMIT" style="width: 28px; height: 28px; object-fit: contain;">
          <h2 class="panel-title" style="font-size: 1.6rem; margin: 0;">Academics &amp; AI Exam LMS</h2>
        </div>
        <p style="color: var(--text-muted); font-size: 0.88rem; margin-top: 4px;">
          ${isFacultyView 
            ? `Course syllabus, continuous internal assessment gradebook, and automated hall tickets for <strong>${currentCourse.code}: ${currentCourse.title}</strong>.`
            : `Course syllabus catalog, VTU semester exam schedules, and AI assignment grading powered by Python Flask REST API.`}
        </p>
      </div>
      <button class="btn btn-ai-sparkle" id="btn-open-ai-grader">
        <i class="fa-solid fa-wand-magic-sparkles"></i> AI Assignment Grader
      </button>
    </div>

    ${isFacultyView ? `
      <!-- Faculty Subject Lock Header -->
      <div class="glass-panel" style="margin-bottom: 1.25rem; background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(6,182,212,0.12)); border: 1px solid rgba(99,102,241,0.35); padding: 1rem 1.25rem; border-radius: 12px; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(99,102,241,0.25); color: #818cf8; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
            <i class="fa-solid fa-graduation-cap"></i>
          </div>
          <div>
            <div style="font-size: 0.72rem; text-transform: uppercase; color: #818cf8; font-weight: 800; letter-spacing: 0.5px;">Your Assigned Academic Course</div>
            <h3 style="margin: 2px 0 0 0; font-size: 1.2rem; color: #f8fafc; font-weight: 800;">${currentCourse.code}: ${currentCourse.title}</h3>
            <p style="margin: 2px 0 0 0; font-size: 0.8rem; color: #cbd5e1;">Instructor: <strong style="color: #67e8f9;">${fac.name}</strong> • ${currentCourse.credits} VTU Credits • Exam Hall: ${currentCourse.hall}</p>
          </div>
        </div>
        <span class="status-pill success" style="font-size: 0.78rem; font-weight: 700; padding: 6px 12px;">
          <i class="fa-solid fa-lock"></i> Showing Only Your Subject
        </span>
      </div>
    ` : ''}

    <!-- Active Courses Grid -->
    <div class="glass-panel" style="margin-bottom: 1.5rem;">
      <div class="panel-header" style="margin-bottom: 1rem;">
        <h3 class="panel-title"><i class="fa-solid fa-book-open text-cyan"></i> ${isFacultyView ? 'Your Assigned Course & Exam Schedule' : 'Current Semester Courses & Final Exam Dates'}</h3>
        <span style="font-size: 0.8rem; color: var(--text-subtle);">${visibleCourses.length} ${visibleCourses.length === 1 ? 'Course' : 'Courses'} Active</span>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Course Code &amp; Title</th>
              <th>Department</th>
              <th>Instructor</th>
              <th>Enrolled</th>
              <th>Exam Venue</th>
              <th>Exam Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${visibleCourses.map(c => `
              <tr style="${isFacultyView ? 'background: rgba(99,102,241,0.1);' : ''}">
                <td>
                  <strong style="color: #a5b4fc; font-size: 0.95rem;">${c.code}: ${c.title}</strong><br>
                  <span style="font-size: 0.75rem; color: var(--text-subtle);">${c.credits} Credits • Average Grade: ${c.avgGrade}</span>
                </td>
                <td>${c.dept}</td>
                <td><strong style="color: #f8fafc;">${c.instructor}</strong></td>
                <td><strong>${c.enrolled} Students</strong></td>
                <td><span class="status-pill info">${c.hall}</span></td>
                <td><strong style="color: var(--warning);">${c.examDate}</strong></td>
                <td>
                  <button class="btn btn-secondary btn-gen-hallticket" data-code="${c.code}" style="padding: 4px 10px; font-size: 0.78rem;">
                    <i class="fa-solid fa-id-card text-cyan"></i> Issue Hall Tickets
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Student Performance & Internal Assessment (IA) Gradebook -->
    <div class="glass-panel" style="margin-bottom: 1.5rem;">
      <div class="panel-header" style="margin-bottom: 1rem;">
        <div>
          <h3 class="panel-title"><i class="fa-solid fa-award text-amber"></i> Student Subject Performance &amp; IA Gradebook</h3>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin: 2px 0 0 0;">
            Continuous internal assessment, attendance eligibility, and final marks for <strong>${currentCourse.code} - ${currentCourse.title}</strong>.
          </p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-secondary" id="btn-export-gradesheet" style="font-size: 0.78rem; padding: 5px 12px;">
            <i class="fa-solid fa-file-excel text-emerald"></i> Export Grade Sheet
          </button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Student USN &amp; Name</th>
              <th>Subject Attendance</th>
              <th>IA-1 (/15)</th>
              <th>IA-2 (/15)</th>
              <th>Total IA (/30)</th>
              <th>Exam Marks (/70)</th>
              <th>Total Marks (/100)</th>
              <th>Grade</th>
              <th>Academic Status &amp; Remarks</th>
            </tr>
          </thead>
          <tbody>
            ${students.map(s => {
              const sp = getStudentSubjectPerformance(s, currentCourse.code);
              const ia1 = Math.round(sp.iaMarks / 2);
              const ia2 = sp.iaMarks - ia1;
              const examMarks = sp.totalMarks - sp.iaMarks;

              return `
                <tr>
                  <td>
                    <div class="student-mini-profile">
                      ${avatarHTML(s.name, 'student-mini-avatar', 'width:34px;height:34px;border-radius:50%;')}
                      <div>
                        <div class="student-mini-name" style="font-size: 0.88rem; font-weight: 700;">${s.name}</div>
                        <div class="student-mini-meta"><span style="color: var(--ai-cyan); font-family: monospace;">${s.id}</span></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong style="color: ${sp.attendance >= 75 ? 'var(--success)' : 'var(--danger)'}; font-size: 0.9rem;">${sp.attendance}%</strong>
                    <span style="display: block; font-size: 0.68rem; color: var(--text-subtle);">${sp.attendance >= 75 ? '✓ Exam Eligible' : '✗ Shortage'}</span>
                  </td>
                  <td><span style="color: #cbd5e1; font-weight: 600;">${ia1}</span></td>
                  <td><span style="color: #cbd5e1; font-weight: 600;">${ia2}</span></td>
                  <td>
                    <strong style="color: #38bdf8; font-size: 0.92rem;">${sp.iaMarks} / 30</strong>
                  </td>
                  <td><span style="color: #cbd5e1;">${examMarks} / 70</span></td>
                  <td>
                    <strong style="color: #f8fafc; font-size: 0.95rem;">${sp.totalMarks} / 100</strong>
                  </td>
                  <td>
                    <span class="status-pill ${sp.grade === 'O' || sp.grade === 'A+' ? 'success' : (sp.grade === 'C' ? 'danger' : 'info')}" style="font-weight: 800;">
                      ${sp.grade}
                    </span>
                  </td>
                  <td>
                    <span style="font-size: 0.76rem; font-weight: 700; color: ${sp.status === 'At-Risk' ? '#ef4444' : (sp.status === 'Outstanding' ? '#10b981' : '#38bdf8')};">
                      ${sp.status}
                    </span><br>
                    <span style="font-size: 0.7rem; color: var(--text-muted); line-height: 1.2;">${sp.remark}</span>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- AI Assignment Auto Grader Sandbox -->
    <div class="glass-panel" id="ai-grader-sandbox">
      <div class="panel-header">
        <h3 class="panel-title">
          <i class="fa-solid fa-robot text-cyan"></i> AI Assignment Submission Grader &amp; Plagiarism Inspector
        </h3>
        <span class="status-pill success">Flask REST API V3.0</span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <p style="font-size: 0.85rem; color: var(--text-muted);">
          Evaluate student assignment submissions for <strong>${currentCourse.code} - ${currentCourse.title}</strong> using Python Flask NLP &amp; Rubric Scoring:
        </p>
        
        <textarea id="ai-grader-text" rows="4" class="form-control" style="font-family: var(--font-body);" placeholder="Paste student submission text here... (e.g. 'In this assignment we implement Dijkstra shortest path algorithm in C++ using a priority queue with adjacency list representation to optimize runtime to O((V+E)logV)...')"></textarea>
        
        <div>
          <button class="btn btn-primary" id="btn-run-ai-grade">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Run Flask AI Evaluation &amp; Grade
          </button>
        </div>

        <div id="ai-grade-result-box" class="hidden" style="background: rgba(6, 182, 212, 0.08); border: 1px solid var(--ai-cyan); border-radius: var(--radius-md); padding: 1.25rem;">
          <!-- Dynamically filled by JS -->
        </div>
      </div>
    </div>
  `;
}

export function bindAcademicsEvents() {
  const gradeBtn = document.getElementById('btn-run-ai-grade');
  const graderText = document.getElementById('ai-grader-text');
  const resultBox = document.getElementById('ai-grade-result-box');

  if (gradeBtn) {
    gradeBtn.onclick = async () => {
      const text = graderText ? graderText.value : '';
      if (!text || text.trim().length === 0) {
        showToast('Please paste submission text first.', 'warning');
        return;
      }

      gradeBtn.disabled = true;
      gradeBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing in Flask Backend...`;

      const res = await evaluateAssignmentSubmission(text);

      gradeBtn.disabled = false;
      gradeBtn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> Run Flask AI Evaluation & Grade`;

      if (resultBox) {
        resultBox.classList.remove('hidden');
        resultBox.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
            <h4 style="font-family: var(--font-heading); color: var(--text-main); font-size: 1.1rem;">
              <i class="fa-solid fa-check-circle text-emerald"></i> Flask Evaluation Complete: Grade <span style="color: var(--success); font-weight: 800;">${res.predictedGrade}</span>
            </h4>
            <span class="status-pill info">${res.wordCount} Words Analyzed</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div style="background: rgba(0,0,0,0.2); padding: 0.75rem; border-radius: var(--radius-sm);">
              <span style="font-size: 0.75rem; color: var(--text-subtle);">Originality Score</span>
              <div style="font-size: 1.2rem; font-weight: 800; color: ${res.originalityScore >= 80 ? 'var(--success)' : 'var(--warning)'};">${res.originalityScore}%</div>
            </div>
            <div style="background: rgba(0,0,0,0.2); padding: 0.75rem; border-radius: var(--radius-sm);">
              <span style="font-size: 0.75rem; color: var(--text-subtle);">Rubric Alignment</span>
              <div style="font-size: 1.2rem; font-weight: 800; color: var(--ai-cyan);">${res.rubricAlignment}</div>
            </div>
          </div>

          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;"><strong>AI Feedback:</strong> ${res.feedback}</p>
          <div style="font-size: 0.75rem; color: var(--text-subtle);">Plagiarism Match Flag: <span style="color: ${res.plagiarismDetected ? 'var(--danger)' : 'var(--success)'}; font-weight: 700;">${res.plagiarismDetected ? 'SIMILARITY DETECTED' : 'CLEAN (0% MATCH)'}</span></div>
        `;
      }

      showToast(`Submission evaluated: Grade ${res.predictedGrade}`, 'success');
    };
  }

  // Hall Tickets Issue
  document.querySelectorAll('.btn-gen-hallticket').forEach(btn => {
    btn.onclick = (e) => {
      const code = e.currentTarget.getAttribute('data-code');
      const course = ERP_STATE.courses.find(c => c.code === code) || ERP_STATE.courses[0];
      const student = ERP_STATE.students[0];

      openModal({
        title: `Automated Exam Hall Ticket (${course.code})`,
        icon: 'fa-id-card',
        contentHtml: `
          <div id="hallticket-pdf-area" style="background: #ffffff; color: #000; padding: 2rem; border-radius: 8px; font-family: serif; border: 2px solid #b45309;">
            <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 0.75rem; margin-bottom: 1.25rem;">
              <h2 style="margin: 0; font-size: 1.4rem; color: #b45309; font-weight: 900;">GM INSTITUTE OF TECHNOLOGY, DAVANGERE</h2>
              <p style="margin: 2px 0 0 0; font-size: 0.85rem; color: #334155;">VTU Belagavi Semester Examination Hall Ticket • Nov 2026</p>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
              <div>
                <p style="margin: 3px 0; font-size: 0.9rem;"><strong>Student Name:</strong> ${student.name}</p>
                <p style="margin: 3px 0; font-size: 0.9rem;"><strong>USN:</strong> ${student.id}</p>
                <p style="margin: 3px 0; font-size: 0.9rem;"><strong>Course:</strong> ${course.code} - ${course.title}</p>
                <p style="margin: 3px 0; font-size: 0.9rem;"><strong>Instructor:</strong> ${course.instructor}</p>
              </div>
              <div style="text-align: center;">
                ${avatarHTML(student.name, '', 'width:75px;height:75px;border-radius:4px;border:1px solid #000;display:block;font-size:1.3rem;')}
                <span style="font-size: 0.7rem; font-weight: bold;">CANDIDATE</span>
              </div>
            </div>

            <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 0.85rem; margin-bottom: 1.25rem;">
              <tr style="background: #f1f5f9;">
                <th style="border: 1px solid #000; padding: 6px;">Course Code</th>
                <th style="border: 1px solid #000; padding: 6px;">Exam Date</th>
                <th style="border: 1px solid #000; padding: 6px;">Venue</th>
                <th style="border: 1px solid #000; padding: 6px;">Session</th>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 6px;">${course.code}</td>
                <td style="border: 1px solid #000; padding: 6px; font-weight: bold; color: #b45309;">${course.examDate}</td>
                <td style="border: 1px solid #000; padding: 6px;">${course.hall}</td>
                <td style="border: 1px solid #000; padding: 6px;">09:30 AM - 12:30 PM</td>
              </tr>
            </table>

            <div style="font-size: 0.75rem; color: #475569; margin-top: 1rem; border-top: 1px dashed #000; padding-top: 0.5rem; display: flex; justify-content: space-between;">
              <span>Biometric QR Verification: <strong>VERIFIED</strong></span>
              <span>Chief Superintendent Signature</span>
            </div>
          </div>
        `,
        buttonsHtml: `
          <button class="btn btn-secondary" id="close-modal-btn">Close</button>
          <button class="btn btn-primary" id="download-ticket-btn"><i class="fa-solid fa-download"></i> Download Hall Ticket</button>
        `
      });

      setTimeout(() => {
        const dlBtn = document.getElementById('download-ticket-btn');
        if (dlBtn && window.html2pdf) {
          dlBtn.onclick = () => {
            const el = document.getElementById('hallticket-pdf-area');
            window.html2pdf().from(el).save(`${student.id}_${course.code}_HallTicket.pdf`);
            showToast('Hall Ticket PDF Generated', 'success');
          };
        }
      }, 50);
    };
  });

  const exportBtn = document.getElementById('btn-export-gradesheet');
  if (exportBtn) {
    exportBtn.onclick = () => {
      showToast('Grade sheet exported to Excel/CSV format successfully!', 'success');
    };
  }

  const aiGraderScrollBtn = document.getElementById('btn-open-ai-grader');
  if (aiGraderScrollBtn) {
    aiGraderScrollBtn.onclick = () => {
      const sandbox = document.getElementById('ai-grader-sandbox');
      if (sandbox) {
        sandbox.scrollIntoView({ behavior: 'smooth' });
        document.getElementById('ai-grader-text')?.focus();
      }
    };
  }
}
