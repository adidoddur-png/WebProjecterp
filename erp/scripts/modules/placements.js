/* AURA ERP - Placements & Career Cell Module */

import { ERP_STATE } from '../data/mockData.js';
import { showToast } from '../components/toasts.js';

export function renderPlacementsModule() {
  const p = ERP_STATE.placementDrive;

  return `
    <div class="panel-header">
      <div>
        <h2 class="panel-title" style="font-size: 1.6rem;"><i class="fa-solid fa-briefcase text-emerald"></i> Placements & Career Cell</h2>
        <p style="color: var(--text-muted); font-size: 0.88rem; margin-top: 4px;">Corporate recruitment drives, AI skill matching, eligibility verification, and salary packages.</p>
      </div>
      <button class="btn btn-ai-sparkle" id="btn-run-placement-filter">
        <i class="fa-solid fa-filter-circle-dollar"></i> AI Student Eligibility Filter
      </button>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-title">Placement Rate</span>
          <div class="kpi-icon emerald"><i class="fa-solid fa-chart-line"></i></div>
        </div>
        <div class="kpi-value">${p.placementRate}%</div>
        <div class="kpi-footer">
          <span class="trend-badge up"><i class="fa-solid fa-check"></i> ${p.placedCount} / ${p.eligibleCount} Placed</span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-title">Highest Annual Offer</span>
          <div class="kpi-icon cyan"><i class="fa-solid fa-crown"></i></div>
        </div>
        <div class="kpi-value">${p.highestPackage}</div>
        <div class="kpi-footer">
          <span class="trend-badge up"><i class="fa-solid fa-building"></i> Google DeepMind</span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-title">Average Salary CTC</span>
          <div class="kpi-icon indigo"><i class="fa-solid fa-sack-dollar"></i></div>
        </div>
        <div class="kpi-value">${p.avgPackage}</div>
        <div class="kpi-footer">
          <span class="trend-badge up"><i class="fa-solid fa-arrow-up"></i> +14% vs 2025</span>
        </div>
      </div>
    </div>

    <!-- Active Drives Table -->
    <div class="glass-panel">
      <div class="panel-header">
        <h3 class="panel-title"><i class="fa-solid fa-building-columns text-cyan"></i> Top Recruiter Recruitment Drives</h3>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Target Role</th>
              <th>Annual Package</th>
              <th>Total Offers Released</th>
              <th>Eligibility Criteria</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${p.topRecruiters.map(r => `
              <tr>
                <td><strong style="color: var(--text-main); font-size: 1rem;">${r.name}</strong></td>
                <td><span class="status-pill info">${r.role}</span></td>
                <td><strong style="color: var(--success); font-size: 1.05rem;">${r.package}</strong></td>
                <td><strong>${r.offers} Offers</strong></td>
                <td><span style="font-size: 0.78rem; color: var(--text-subtle);">CGPA ≥ 3.50 • 0 Backlogs</span></td>
                <td>
                  <button class="btn btn-secondary btn-shortlist-students" data-company="${r.name}" style="padding: 4px 10px; font-size: 0.78rem;">
                    <i class="fa-solid fa-user-check text-cyan"></i> Shortlist Candidates
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export function bindPlacementsEvents() {
  const filterBtn = document.getElementById('btn-run-placement-filter');
  if (filterBtn) {
    filterBtn.onclick = () => {
      const eligible = ERP_STATE.students.filter(s => s.cgpa >= 3.5 && s.attendance >= 80);
      showToast(`AI Eligibility Engine shortlisted ${eligible.length} students matching top tech recruiter criteria!`, 'ai');
    };
  }

  document.querySelectorAll('.btn-shortlist-students').forEach(btn => {
    btn.onclick = (e) => {
      const comp = e.currentTarget.getAttribute('data-company');
      showToast(`Shortlisted eligible candidates for ${comp} campus drive.`, 'success');
    };
  });
}
