/* AURA ERP - AI Neural Co-Pilot Module */

import { ERP_STATE } from '../data/mockData.js';
import { calculateStudentRisk, runScheduleOptimizer } from '../data/aiData.js';
import { showToast } from '../components/toasts.js';
import { avatarHTML } from '../utils/helpers.js';
import { openModal } from '../components/modals.js';

export function renderAICopilotModule() {
  const studentRiskList = ERP_STATE.students.map(s => {
    const risk = calculateStudentRisk(s);
    return { ...s, calculatedRisk: risk };
  }).sort((a, b) => b.calculatedRisk.score - a.calculatedRisk.score);

  const highRiskCount = studentRiskList.filter(s => s.calculatedRisk.score >= 50).length;

  return `
    <div class="panel-header">
      <div>
        <h2 class="panel-title" style="font-size: 1.6rem;"><i class="fa-solid fa-brain text-cyan"></i> AI Neural Co-Pilot & Predictive Analytics</h2>
        <p style="color: var(--text-muted); font-size: 0.88rem; margin-top: 4px;">Real-time machine learning predictions, early student dropout warnings, and automated campus optimization engines.</p>
      </div>
    </div>

    <!-- AI Feature Tabs Grid -->
    <div class="stats-grid">
      <div class="kpi-card" style="border-left: 4px solid var(--danger);">
        <div class="kpi-header">
          <span class="kpi-title">At-Risk Students Flagged</span>
          <div class="kpi-icon rose"><i class="fa-solid fa-triangle-exclamation"></i></div>
        </div>
        <div class="kpi-value">${highRiskCount} Students</div>
        <div class="kpi-footer">
          <span class="trend-badge down"><i class="fa-solid fa-bell"></i> Action Required</span>
          <span>Attendance & GPA drops</span>
        </div>
      </div>

      <div class="kpi-card" style="border-left: 4px solid var(--ai-cyan);">
        <div class="kpi-header">
          <span class="kpi-title">Timetable Conflicts</span>
          <div class="kpi-icon cyan"><i class="fa-solid fa-route"></i></div>
        </div>
        <div class="kpi-value">2 Resolved</div>
        <div class="kpi-footer">
          <span class="trend-badge up"><i class="fa-solid fa-check"></i> +18% Efficiency</span>
          <span>Automated room routing</span>
        </div>
      </div>

      <div class="kpi-card" style="border-left: 4px solid var(--success);">
        <div class="kpi-header">
          <span class="kpi-title">Biometric Fraud Anomaly</span>
          <div class="kpi-icon emerald"><i class="fa-solid fa-fingerprint"></i></div>
        </div>
        <div class="kpi-value">99.4% Valid</div>
        <div class="kpi-footer">
          <span class="trend-badge up"><i class="fa-solid fa-shield"></i> Clean Stream</span>
          <span>0 Proxy attempts today</span>
        </div>
      </div>
    </div>

    <!-- Section 1: At-Risk Student Early Warning System -->
    <div class="glass-panel">
      <div class="panel-header">
        <h3 class="panel-title"><i class="fa-solid fa-user-ninja text-rose"></i> At-Risk Student Early Warning Matrix</h3>
        <button class="btn btn-ai-sparkle" id="run-ai-scan-btn">
          <i class="fa-solid fa-arrows-rotate"></i> Re-Run Neural Scan
        </button>
      </div>
      
      <div class="copilot-grid">
        ${studentRiskList.map(s => `
          <div class="risk-card ${s.calculatedRisk.score >= 50 ? 'high-risk' : 'med-risk'}">
            <div class="risk-header">
              <div class="student-mini-profile">
                ${avatarHTML(s.name, 'student-mini-avatar', 'width:40px;height:40px;border-radius:50%;')}
                <div>
                  <div class="student-mini-name">${s.name}</div>
                  <div class="student-mini-meta">${s.department} • ${s.year}</div>
                </div>
              </div>
              <div class="risk-score-badge ${s.calculatedRisk.score >= 50 ? 'danger' : 'warning'}">
                ${s.calculatedRisk.score}% Risk
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem; text-align: center; background: rgba(0,0,0,0.2); padding: 0.5rem; border-radius: var(--radius-sm); font-size: 0.75rem;">
              <div>
                <span style="color: var(--text-subtle);">Attendance</span><br>
                <strong style="color: ${s.attendance < 75 ? 'var(--danger)' : 'var(--success)'}">${s.attendance}%</strong>
              </div>
              <div>
                <span style="color: var(--text-subtle);">CGPA</span><br>
                <strong style="color: ${s.cgpa < 3.0 ? 'var(--warning)' : 'var(--success)'}">${s.cgpa}</strong>
              </div>
              <div>
                <span style="color: var(--text-subtle);">Fee Dues</span><br>
                <strong>$${s.feePending}</strong>
              </div>
            </div>

            <div class="ai-recommendation-box">
              <strong><i class="fa-solid fa-wand-magic-sparkles"></i> AI Mitigation Action Plan:</strong>
              ${s.calculatedRisk.score >= 50 ? 
                'Schedule 1-on-1 counseling with Academic Advisor. Issue tuition payment plan & remedial lab support.' : 
                'Monitor midterm attendance in Applied Mathematics. Performance remains stable.'}
            </div>

            <button class="btn btn-secondary btn-trigger-counsel" data-id="${s.id}" style="width: 100%; font-size: 0.8rem; justify-content: center;">
              <i class="fa-solid fa-envelope-open-text text-cyan"></i> Generate AI Counseling Letter
            </button>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Section 2: Automated Timetable Optimizer -->
    <div class="glass-panel">
      <div class="panel-header">
        <h3 class="panel-title"><i class="fa-solid fa-calendar-week text-cyan"></i> Neural Timetable & Room Allocation Optimizer</h3>
        <button class="btn btn-primary" id="btn-run-timetable-opt">
          <i class="fa-solid fa-bolt"></i> Run Optimization Solver
        </button>
      </div>
      
      <div id="timetable-solver-results" class="ai-recommendation-box" style="font-size: 0.9rem; padding: 1.25rem;">
        <p><i class="fa-solid fa-info-circle text-cyan"></i> Click <strong>Run Optimization Solver</strong> to simulate real-time room capacity, faculty availability, and lab resource collision resolution.</p>
      </div>
    </div>
  `;
}

export function bindAICopilotEvents() {
  const scanBtn = document.getElementById('run-ai-scan-btn');
  if (scanBtn) {
    scanBtn.addEventListener('click', () => {
      showToast('AI Neural Scan completed! Student risk scores synchronized.', 'ai');
    });
  }

  const timetableBtn = document.getElementById('btn-run-timetable-opt');
  if (timetableBtn) {
    timetableBtn.addEventListener('click', () => {
      const result = runScheduleOptimizer();
      const resultsContainer = document.getElementById('timetable-solver-results');
      if (resultsContainer) {
        resultsContainer.innerHTML = `
          <h4 style="color: var(--ai-cyan); font-family: var(--font-heading); margin-bottom: 0.5rem;"><i class="fa-solid fa-check-circle"></i> Optimization Complete (${result.efficiencyGain})</h4>
          <p style="margin-bottom: 0.75rem;">Neural Engine analyzed 42 course schedules and resolved <strong>${result.resolved} critical bottlenecks</strong>:</p>
          <ul style="padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.4rem; color: var(--text-main);">
            ${result.optimizations.map(opt => `
              <li><strong>${opt.course}</strong>: Shifted from <code>${opt.original}</code> → <code style="color: var(--success);">${opt.suggested}</code> (Reason: ${opt.reason})</li>
            `).join('')}
          </ul>
        `;
      }
      showToast('Timetable optimized successfully with 0 collisions.', 'success');
    });
  }

  // Counsel letter triggers
  document.querySelectorAll('.btn-trigger-counsel').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const stuId = e.currentTarget.getAttribute('data-id');
      const student = ERP_STATE.students.find(s => s.id === stuId);
      if (!student) return;

      openModal({
        title: `AI Drafted Counseling Notice for ${student.name}`,
        icon: 'fa-envelope-open-text',
        contentHtml: `
          <div style="background: var(--bg-input); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); font-family: monospace; font-size: 0.85rem; line-height: 1.6;">
            <strong>TO:</strong> ${student.email}<br>
            <strong>SUBJECT:</strong> Academic Performance Review & Personal Mentorship Invitation<br>
            <strong>DATE:</strong> ${new Date().toLocaleDateString()}<br><br>
            Dear ${student.name},<br><br>
            Our GMIT AI Academic System has conducted a routine check of current semester metrics for the ${student.department} department.<br><br>
            Current Standing Summary:<br>
            • Attendance: ${student.attendance}% (Threshold: 75%)<br>
            • Cumulative GPA: ${student.cgpa}<br>
            • Outstanding Fees: $${student.feePending}<br><br>
            We strongly encourage you to meet with your Academic Advisor, Dr. Alexander Wright, on Friday at 2:00 PM to construct a tailored study and financial support roadmap.<br><br>
            Sincerely,<br>
            Office of Academic Affairs • GM Institute of Technology, Davangere
          </div>
        `,
        buttonsHtml: `
          <button class="btn btn-secondary" id="close-modal-btn">Cancel</button>
          <button class="btn btn-primary" id="send-counsel-email-btn"><i class="fa-solid fa-paper-plane"></i> Send Official Email</button>
        `
      });

      setTimeout(() => {
        const sendBtn = document.getElementById('send-counsel-email-btn');
        if (sendBtn) {
          sendBtn.addEventListener('click', () => {
            showToast(`Official counseling notice sent to ${student.name} (${student.email})`, 'success');
            document.getElementById('modal-backdrop').classList.add('hidden');
          });
        }
      }, 50);
    });
  });
}
