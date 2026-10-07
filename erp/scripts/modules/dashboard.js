/* AURA ERP - Executive Dashboard Module */

import { ERP_STATE } from '../data/mockData.js';
import { calculateStudentRisk } from '../data/aiData.js';
import { renderDashboardCharts } from '../components/charts.js';

export function renderDashboardModule() {
  const atRiskCount = ERP_STATE.students.filter(s => calculateStudentRisk(s).score >= 50).length;
  const avgCgpa = (ERP_STATE.students.reduce((acc, s) => acc + s.cgpa, 0) / ERP_STATE.students.length).toFixed(2);
  const avgAttendance = Math.round(ERP_STATE.students.reduce((acc, s) => acc + s.attendance, 0) / ERP_STATE.students.length);

  return `
    <!-- Top AI Alert Banner -->
    <div class="ai-banner">
      <div class="ai-banner-content">
        <h3><i class="fa-solid fa-brain text-cyan"></i> Neural Campus Insights Active</h3>
        <p>GMIT AI detected <strong>${atRiskCount} at-risk students</strong> needing immediate academic intervention. 2 timetable overlaps resolved automatically.</p>
      </div>
      <button class="btn btn-ai-sparkle" id="dash-view-risk-btn">
        <i class="fa-solid fa-sparkles"></i> Open AI Diagnostics
      </button>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-title">Total Enrolled</span>
          <div class="kpi-icon cyan"><i class="fa-solid fa-user-graduate"></i></div>
        </div>
        <div class="kpi-value">4,850</div>
        <div class="kpi-footer">
          <span class="trend-badge up"><i class="fa-solid fa-arrow-up"></i> +5.4%</span>
          <span>vs last academic year</span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-title">Average CGPA</span>
          <div class="kpi-icon indigo"><i class="fa-solid fa-award"></i></div>
        </div>
        <div class="kpi-value">${avgCgpa} / 4.0</div>
        <div class="kpi-footer">
          <span class="trend-badge up"><i class="fa-solid fa-arrow-up"></i> +0.12</span>
          <span>University target: 3.50</span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-title">Overall Attendance</span>
          <div class="kpi-icon emerald"><i class="fa-solid fa-calendar-check"></i></div>
        </div>
        <div class="kpi-value">${avgAttendance}%</div>
        <div class="kpi-footer">
          <span class="trend-badge up"><i class="fa-solid fa-arrow-up"></i> +2.1%</span>
          <span>Biometric verified</span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-title">Fee Collection</span>
          <div class="kpi-icon amber"><i class="fa-solid fa-sack-dollar"></i></div>
        </div>
        <div class="kpi-value">$12.42M</div>
        <div class="kpi-footer">
          <span class="trend-badge up"><i class="fa-solid fa-arrow-up"></i> 88%</span>
          <span>Target: $14.85M</span>
        </div>
      </div>
    </div>

    <!-- Main Grid: Charts & Activity Feed -->
    <div class="dashboard-grid">
      
      <!-- Left Column Charts -->
      <div class="left-col">
        <div class="glass-panel">
          <div class="panel-header">
            <h3 class="panel-title"><i class="fa-solid fa-chart-line text-cyan"></i> Attendance & Academic Health Trends</h3>
            <span class="status-pill info">Real-time Biometric Stream</span>
          </div>
          <div class="chart-container">
            <canvas id="chart-attendance-trend"></canvas>
          </div>
        </div>

        <div class="glass-panel">
          <div class="panel-header">
            <h3 class="panel-title"><i class="fa-solid fa-chart-bar text-indigo"></i> Departmental Academic Performance (CGPA)</h3>
          </div>
          <div class="chart-container">
            <canvas id="chart-dept-cgpa"></canvas>
          </div>
        </div>
      </div>

      <!-- Right Column: AI Live Activity Feed & Quick Actions -->
      <div class="right-col">
        <div class="glass-panel">
          <div class="panel-header">
            <h3 class="panel-title"><i class="fa-solid fa-bolt text-amber"></i> Campus AI Activity Feed</h3>
          </div>
          <div class="activity-feed">
            <div class="activity-item">
              <div class="activity-icon"><i class="fa-solid fa-brain"></i></div>
              <div class="activity-details">
                <h5>AI Warning Triggered</h5>
                <p>Marcus Vance (Data Science) flagged for attendance drop (64%).</p>
                <span class="activity-time">12 mins ago</span>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-icon"><i class="fa-solid fa-credit-card"></i></div>
              <div class="activity-details">
                <h5>Fee Payment Received</h5>
                <p>Sophia Chen paid $4,200 via Online UPI.</p>
                <span class="activity-time">45 mins ago</span>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-icon"><i class="fa-solid fa-calendar-days"></i></div>
              <div class="activity-details">
                <h5>Hall Ticket Released</h5>
                <p>Sem 6 Deep Learning finals hall tickets signed digitally.</p>
                <span class="activity-time">2 hrs ago</span>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-icon"><i class="fa-solid fa-building-user"></i></div>
              <div class="activity-details">
                <h5>Hostel Ticket Solved</h5>
                <p>Room 302 Block A AC maintenance resolved.</p>
                <span class="activity-time">3 hrs ago</span>
              </div>
            </div>
          </div>
        </div>

        <div class="glass-panel">
          <div class="panel-header">
            <h3 class="panel-title"><i class="fa-solid fa-wand-magic text-cyan"></i> Executive Quick Actions</h3>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <button class="btn btn-primary" id="btn-quick-add-student" style="justify-content: flex-start;">
              <i class="fa-solid fa-user-plus"></i> Enroll New Student
            </button>
            <button class="btn btn-secondary" id="btn-quick-timetable-opt" style="justify-content: flex-start;">
              <i class="fa-solid fa-route"></i> Run Timetable Optimizer
            </button>
            <button class="btn btn-secondary" id="btn-quick-hallticket" style="justify-content: flex-start;">
              <i class="fa-solid fa-id-card"></i> Generate Hall Ticket PDF
            </button>
          </div>
        </div>

      </div>

    </div>
  `;
}

export function bindDashboardEvents() {
  setTimeout(() => renderDashboardCharts(), 50);

  const riskBtn = document.getElementById('dash-view-risk-btn');
  if (riskBtn) {
    riskBtn.addEventListener('click', () => {
      window.location.hash = '#aiCopilot';
    });
  }

  document.getElementById('btn-quick-add-student')?.addEventListener('click', () => {
    window.location.hash = '#sis';
  });

  document.getElementById('btn-quick-timetable-opt')?.addEventListener('click', () => {
    window.location.hash = '#aiCopilot';
  });

  document.getElementById('btn-quick-hallticket')?.addEventListener('click', () => {
    window.location.hash = '#academics';
  });
}


