/* AURA ERP - Hostel & Facility Management Module */

import { ERP_STATE } from '../data/mockData.js';
import { showToast } from '../components/toasts.js';

export function renderHostelModule() {
  return `
    <div class="panel-header">
      <div>
        <h2 class="panel-title" style="font-size: 1.6rem;"><i class="fa-solid fa-building-user text-cyan"></i> Hostel & Facility Management</h2>
        <p style="color: var(--text-muted); font-size: 0.88rem; margin-top: 4px;">Hostel room allocation matrix, maintenance ticket resolution, and dining hall logs.</p>
      </div>
    </div>

    <!-- Hostel Blocks Summary -->
    <div class="stats-grid">
      ${ERP_STATE.hostelBlocks.map(b => `
        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">${b.block}</span>
            <div class="kpi-icon indigo"><i class="fa-solid fa-bed"></i></div>
          </div>
          <div class="kpi-value">${b.occupied} / ${b.totalRooms} Rooms</div>
          <div class="kpi-footer">
            <span class="trend-badge up"><i class="fa-solid fa-user-shield"></i> Warden: ${b.warden}</span>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Interactive Room Matrix -->
    <div class="glass-panel">
      <div class="panel-header">
        <h3 class="panel-title"><i class="fa-solid fa-grip text-cyan"></i> Block A Room Occupancy Grid (Floor 3)</h3>
        <div style="display: flex; gap: 0.75rem; font-size: 0.8rem;">
          <span style="color: var(--success);"><i class="fa-solid fa-square"></i> Vacant (Available)</span>
          <span style="color: var(--warning);"><i class="fa-solid fa-square"></i> Occupied (1 Bed)</span>
          <span style="color: var(--danger);"><i class="fa-solid fa-square"></i> Full</span>
        </div>
      </div>

      <div class="hostel-grid">
        <div class="room-cell occupied"><div class="room-number">301</div><div class="room-beds">Sophia C.</div></div>
        <div class="room-cell occupied"><div class="room-number">302</div><div class="room-beds">Devon O.</div></div>
        <div class="room-cell vacant"><div class="room-number">303</div><div class="room-beds">Available</div></div>
        <div class="room-cell full"><div class="room-number">304</div><div class="room-beds">2 / 2 Beds</div></div>
        <div class="room-cell occupied"><div class="room-number">305</div><div class="room-beds">Marcus V.</div></div>
        <div class="room-cell vacant"><div class="room-number">306</div><div class="room-beds">Available</div></div>
        <div class="room-cell full"><div class="room-number">307</div><div class="room-beds">2 / 2 Beds</div></div>
        <div class="room-cell occupied"><div class="room-number">308</div><div class="room-beds">Liam G.</div></div>
      </div>
    </div>
  `;
}

export function bindHostelEvents() {
  document.querySelectorAll('.room-cell').forEach(cell => {
    cell.onclick = (e) => {
      const roomNum = e.currentTarget.querySelector('.room-number').innerText;
      showToast(`Selected Hostel Room #${roomNum} for inspection or allocation.`, 'info');
    };
  });
}
