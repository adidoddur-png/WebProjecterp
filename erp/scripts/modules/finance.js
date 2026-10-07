/* AURA ERP - Finance & Fee Ledger Module */

import { ERP_STATE } from '../data/mockData.js';
import { showToast } from '../components/toasts.js';
import { openModal } from '../components/modals.js';

export function renderFinanceModule() {
  return `
    <div class="panel-header">
      <div>
        <h2 class="panel-title" style="font-size: 1.6rem;"><i class="fa-solid fa-wallet text-amber"></i> Finance & Fee Ledger System</h2>
        <p style="color: var(--text-muted); font-size: 0.88rem; margin-top: 4px;">University revenue collection, tuition fees, scholarship distribution, and payment gateway simulator.</p>
      </div>
      <button class="btn btn-primary" id="btn-collect-fee">
        <i class="fa-solid fa-credit-card"></i> Pay Tuition Fee (Gateway)
      </button>
    </div>

    <!-- Financial Stats -->
    <div class="stats-grid">
      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-title">Collected Semester Fee</span>
          <div class="kpi-icon emerald"><i class="fa-solid fa-circle-dollar-to-slot"></i></div>
        </div>
        <div class="kpi-value">${ERP_STATE.financeStats.collectedThisSemester}</div>
        <div class="kpi-footer">
          <span class="trend-badge up"><i class="fa-solid fa-arrow-up"></i> 88%</span>
          <span>Target: ${ERP_STATE.financeStats.totalRevenue}</span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-title">Outstanding Fee Dues</span>
          <div class="kpi-icon rose"><i class="fa-solid fa-hand-holding-dollar"></i></div>
        </div>
        <div class="kpi-value">${ERP_STATE.financeStats.pendingDues}</div>
        <div class="kpi-footer">
          <span class="trend-badge down"><i class="fa-solid fa-triangle-exclamation"></i> 12%</span>
          <span>Students with unpaid dues</span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-title">Scholarships Awarded</span>
          <div class="kpi-icon indigo"><i class="fa-solid fa-graduation-cap"></i></div>
        </div>
        <div class="kpi-value">${ERP_STATE.financeStats.scholarshipsAwarded}</div>
        <div class="kpi-footer">
          <span class="trend-badge up"><i class="fa-solid fa-users"></i> 142 Students</span>
          <span>Merit & need-based aid</span>
        </div>
      </div>
    </div>

    <!-- Chart & Transactions Table -->
    <div class="dashboard-grid">
      <div class="left-col">
        <div class="glass-panel">
          <div class="panel-header">
            <h3 class="panel-title"><i class="fa-solid fa-chart-pie text-amber"></i> Revenue & Ledger Breakdown</h3>
          </div>
          <div class="chart-container">
            <canvas id="chart-fee-breakdown"></canvas>
          </div>
        </div>
      </div>

      <div class="right-col">
        <div class="glass-panel">
          <div class="panel-header">
            <h3 class="panel-title"><i class="fa-solid fa-receipt text-cyan"></i> Recent Fee Transactions</h3>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Tx ID</th>
                  <th>Student</th>
                  <th>Amount</th>
                  <th>Mode</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${ERP_STATE.financeStats.recentTransactions.map(tx => `
                  <tr>
                    <td><code>${tx.id}</code></td>
                    <td><strong>${tx.student}</strong></td>
                    <td><strong style="color: var(--success);">${tx.amount}</strong></td>
                    <td>${tx.mode}</td>
                    <td><span class="status-pill ${tx.status === 'Success' ? 'success' : 'warning'}">${tx.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindFinanceEvents() {
  const payBtn = document.getElementById('btn-collect-fee');
  if (payBtn) {
    payBtn.onclick = () => {
      openModal({
        title: 'GMIT Secure Fee Payment Gateway (GM Institute of Technology)',
        icon: 'fa-credit-card',
        contentHtml: `
          <div class="form-group">
            <label class="form-label">Select Student</label>
            <select class="form-control" id="pay-student-select">
              ${ERP_STATE.students.map(s => `
                <option value="${s.id}">${s.name} (${s.id}) - Pending Dues: $${s.feePending}</option>
              `).join('')}
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Payment Amount ($)</label>
              <input type="number" class="form-control" id="pay-amount-input" value="1850">
            </div>
            <div class="form-group">
              <label class="form-label">Payment Method</label>
              <select class="form-control" id="pay-method-select">
                <option>Online UPI / Instant QR</option>
                <option>Credit / Debit Card</option>
                <option>NetBanking Wire</option>
              </select>
            </div>
          </div>
        `,
        buttonsHtml: `
          <button class="btn btn-secondary" id="close-modal-btn">Cancel</button>
          <button class="btn btn-primary" id="btn-submit-fee-pay"><i class="fa-solid fa-lock"></i> Process Payment ($1,850)</button>
        `
      });

      setTimeout(() => {
        const submitBtn = document.getElementById('btn-submit-fee-pay');
        if (submitBtn) {
          submitBtn.onclick = () => {
            const stuId = document.getElementById('pay-student-select')?.value;
            const student = ERP_STATE.students.find(s => s.id === stuId);
            if (!student) return;

            student.feePending = 0;
            student.feeStatus = "Paid";
            
            ERP_STATE.financeStats.recentTransactions.unshift({
              id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
              student: student.name,
              amount: "$1,850",
              mode: "Online Gateway",
              date: "Just Now",
              status: "Success"
            });

            showToast(`Payment of $1,850 received from ${student.name}. Receipt generated!`, 'success');
            document.getElementById('modal-backdrop').classList.add('hidden');
          };
        }
      }, 50);
    };
  }
}
