/* AURA ERP - Main Application Controller (with Auth + Role-Based Access) */

import { ERP_STATE } from './data/mockData.js';
import { showToast } from './components/toasts.js';
import { openModal } from './components/modals.js';

// Module Renderers
import { renderDashboardModule, bindDashboardEvents } from './modules/dashboard.js';
import { renderAICopilotModule, bindAICopilotEvents } from './modules/aiCopilot.js';
import { renderSISModule, bindSISEvents } from './modules/sis.js';
import { renderFacultyModule, bindFacultyEvents } from './modules/faculty.js';
import { renderAcademicsModule, bindAcademicsEvents } from './modules/academics.js';
import { renderFinanceModule, bindFinanceEvents } from './modules/finance.js';
import { renderHostelModule, bindHostelEvents } from './modules/hostel.js';
import { renderLibraryModule, bindLibraryEvents } from './modules/library.js';
import { renderPlacementsModule, bindPlacementsEvents } from './modules/placements.js';
import { renderAIChatbotModule, bindAIChatbotEvents } from './modules/aiChatbot.js';

// ── ROLE PERMISSIONS ──────────────────────────────────────────────────────────
const ROLE_ACCESS = {
  admin:     ['dashboard', 'attendance', 'aiCopilot', 'sis', 'faculty', 'academics', 'finance', 'hostel', 'library', 'placements', 'aiChatbot'],
  professor: ['attendance', 'sis', 'academics', 'aiChatbot']
};

// Modules hidden from the sidebar per role
const SIDEBAR_HIDDEN = {
  admin:     ['attendance'],
  professor: ['dashboard', 'aiCopilot', 'faculty', 'finance', 'hostel', 'library', 'placements']
};

// ── SESSION GUARD ─────────────────────────────────────────────────────────────
function getSession() {
  try {
    const raw = sessionStorage.getItem('aura_session');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function requireLogin() {
  const session = getSession();
  if (!session || !session.loggedIn) {
    window.location.href = 'login.html';
    return null;
  }
  return session;
}

function logout() {
  sessionStorage.removeItem('aura_session');
  window.location.href = 'login.html';
}

// ── MAIN INIT ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const session = requireLogin();
  if (!session) return;

  ERP_STATE.activeRole = session.role; // 'admin' or 'professor'

  applySessionToUI(session);
  applySidebarVisibility(session.role);
  initRouter(session.role);
  initGlobalSearch();
  initNotifications();
  initThemeToggle();
  initQuickAIAction();
  initSidebarControls();
  initLogoutButton();
});

// ── Apply Session Info to Header ─────────────────────────────────────────────
function applySessionToUI(session) {
  const nameEl   = document.getElementById('current-user-name');
  const titleEl  = document.getElementById('current-user-role');
  const avatarEl = document.getElementById('current-user-avatar');

  if (nameEl)   nameEl.innerText  = session.name;
  if (titleEl)  titleEl.innerText = session.title;
  if (avatarEl) avatarEl.src      = session.avatar;

  // Update role selector to match session role
  const roleSelector = document.getElementById('role-selector');
  if (roleSelector) {
    roleSelector.value = session.role === 'professor' ? 'faculty' : 'admin';
    roleSelector.disabled = true; // Lock role selector to current login
  }

  const roleDesc = document.getElementById('role-desc');
  if (roleDesc) {
    roleDesc.innerText = session.role === 'admin'
      ? 'Full system access & AI control center'
      : 'Classroom, student records & AI assistant';
  }
}

// ── Hide sidebar links the current role can't access ─────────────────────────
function applySidebarVisibility(role) {
  const hidden = SIDEBAR_HIDDEN[role] || [];
  document.querySelectorAll('.nav-link[data-module]').forEach(link => {
    const mod = link.getAttribute('data-module');
    if (hidden.includes(mod)) {
      link.style.display = 'none';
    } else {
      link.style.display = 'flex';
    }
  });
}

// ── Router ────────────────────────────────────────────────────────────────────
function initRouter(role) {
  const container = document.getElementById('module-container');
  const navLinks  = document.querySelectorAll('.nav-link');
  const allowed   = ROLE_ACCESS[role] || ROLE_ACCESS['admin'];

  const renderActiveModule = () => {
    let hash = window.location.hash.replace('#', '') || (role === 'professor' ? 'attendance' : 'dashboard');

    // Block unauthorized modules
    if (!allowed.includes(hash)) {
      hash = role === 'professor' ? 'attendance' : 'dashboard';
      window.location.hash = '#' + hash;
    }

    ERP_STATE.activeModule = hash;

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-module') === hash);
    });

    switch (hash) {
      case 'dashboard':
        container.innerHTML = renderDashboardModule();
        bindDashboardEvents();
        break;
      case 'aiCopilot':
        container.innerHTML = renderAICopilotModule();
        bindAICopilotEvents();
        break;
      case 'sis':
        container.innerHTML = renderSISModule();
        bindSISEvents();
        break;
      case 'attendance':
        container.innerHTML = renderFacultyModule('attendance');
        bindFacultyEvents();
        break;
      case 'faculty':
        container.innerHTML = renderFacultyModule('faculty');
        bindFacultyEvents();
        break;
      case 'academics':
        container.innerHTML = renderAcademicsModule();
        bindAcademicsEvents();
        break;
      case 'finance':
        container.innerHTML = renderFinanceModule();
        bindFinanceEvents();
        break;
      case 'hostel':
        container.innerHTML = renderHostelModule();
        bindHostelEvents();
        break;
      case 'library':
        container.innerHTML = renderLibraryModule();
        bindLibraryEvents();
        break;
      case 'placements':
        container.innerHTML = renderPlacementsModule();
        bindPlacementsEvents();
        break;
      case 'aiChatbot':
        container.innerHTML = renderAIChatbotModule();
        bindAIChatbotEvents();
        break;
      default:
        container.innerHTML = renderDashboardModule();
        bindDashboardEvents();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  window.addEventListener('hashchange', renderActiveModule);
  renderActiveModule();
}

// ── Logout Button ─────────────────────────────────────────────────────────────
function initLogoutButton() {
  const pill = document.getElementById('user-profile-pill');
  if (pill) {
    pill.title = 'Click to logout';
    pill.style.cursor = 'pointer';
    pill.addEventListener('click', () => {
      openModal({
        title: 'Confirm Logout',
        icon: 'fa-right-from-bracket',
        contentHtml: `<p style="color: var(--text-muted); font-size: 0.95rem;">Are you sure you want to sign out of AURA ERP?</p>`,
        buttonsHtml: `
          <button class="btn btn-secondary" id="close-modal-btn">Cancel</button>
          <button class="btn btn-primary" id="confirm-logout-btn" style="background: linear-gradient(135deg, var(--danger), #b91c1c);">
            <i class="fa-solid fa-right-from-bracket"></i> Sign Out
          </button>
        `
      });
      setTimeout(() => {
        document.getElementById('confirm-logout-btn')?.addEventListener('click', logout);
      }, 50);
    });
  }
}

// ── Global Search ─────────────────────────────────────────────────────────────
function initGlobalSearch() {
  const searchInput = document.getElementById('global-search-input');
  const dropdown    = document.getElementById('search-results-dropdown');
  const session     = getSession();
  const allowed     = ROLE_ACCESS[session?.role] || ROLE_ACCESS['admin'];

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (searchInput) searchInput.focus();
    }
  });

  if (searchInput && dropdown) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (q.length < 2) { dropdown.classList.add('hidden'); return; }

      const matches = [];

      ERP_STATE.students.forEach(s => {
        if ((s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)) && allowed.includes('sis')) {
          matches.push({ title: s.name, sub: `Student • ${s.id} • ${s.department}`, link: '#sis', icon: 'fa-user-graduate' });
        }
      });

      ERP_STATE.courses.forEach(c => {
        if ((c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)) && allowed.includes('academics')) {
          matches.push({ title: `${c.code}: ${c.title}`, sub: `Course • ${c.dept}`, link: '#academics', icon: 'fa-book-open' });
        }
      });

      if ('ai risk copilot predictor'.includes(q) && allowed.includes('aiCopilot')) {
        matches.push({ title: 'AI Neural Co-Pilot', sub: 'At-risk student warning matrix', link: '#aiCopilot', icon: 'fa-brain' });
      }
      if ('attendance qr scanner present absent barcode'.includes(q) && allowed.includes('attendance')) {
        matches.push({ title: 'Live Classroom QR Attendance', sub: 'Take student attendance & scan QR', link: '#attendance', icon: 'fa-qrcode' });
      }
      if ('fee tuition finance payment'.includes(q) && allowed.includes('finance')) {
        matches.push({ title: 'Finance & Fee Ledger', sub: 'Collect fees and view ledger', link: '#finance', icon: 'fa-wallet' });
      }

      dropdown.classList.toggle('hidden', matches.length === 0);
      if (matches.length === 0) {
        dropdown.innerHTML = `<div style="padding: 1rem; text-align: center; color: var(--text-subtle); font-size: 0.82rem;">No matching campus entities found.</div>`;
        dropdown.classList.remove('hidden');
        return;
      }

      dropdown.innerHTML = matches.map(m => `
        <a href="${m.link}" class="search-result-item" style="display:flex; align-items:center; gap:0.75rem; padding:0.75rem 1rem; color:var(--text-main); text-decoration:none; border-bottom:1px solid var(--border-color);">
          <i class="fa-solid ${m.icon} text-cyan"></i>
          <div>
            <div style="font-weight:600; font-size:0.85rem;">${m.title}</div>
            <div style="font-size:0.72rem; color:var(--text-subtle);">${m.sub}</div>
          </div>
        </a>
      `).join('');

      dropdown.querySelectorAll('.search-result-item').forEach(item => {
        item.onclick = () => { dropdown.classList.add('hidden'); searchInput.value = ''; };
      });
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  }
}

// ── Notifications ─────────────────────────────────────────────────────────────
function initNotifications() {
  const bellBtn    = document.getElementById('notif-bell-btn');
  const dropdown   = document.getElementById('notif-dropdown');
  const notifList  = document.getElementById('notif-list');
  const markReadBtn= document.getElementById('mark-read-btn');
  const countBadge = document.getElementById('notif-count');

  const renderNotifs = () => {
    if (!notifList) return;
    const unreadCount = ERP_STATE.notifications.filter(n => n.unread).length;
    if (countBadge) {
      countBadge.innerText = unreadCount;
      countBadge.style.display = unreadCount === 0 ? 'none' : 'flex';
    }

    notifList.innerHTML = ERP_STATE.notifications.map(n => `
      <div class="notif-item">
        <i class="fa-solid ${n.icon} notif-item-icon"></i>
        <div class="notif-item-content">
          <h4>${n.title}</h4>
          <p>${n.message}</p>
          <div class="notif-time">${n.time}</div>
        </div>
      </div>
    `).join('');
  };

  if (bellBtn && dropdown) {
    bellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
      renderNotifs();
    });
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && !bellBtn.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  }

  if (markReadBtn) {
    markReadBtn.addEventListener('click', () => {
      ERP_STATE.notifications.forEach(n => n.unread = false);
      renderNotifs();
      showToast('All notifications marked as read.', 'info');
    });
  }

  renderNotifs();
}

// ── Theme Toggle ──────────────────────────────────────────────────────────────
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('theme-light');
      document.body.classList.toggle('theme-dark');
      const isDark = document.body.classList.contains('theme-dark');
      themeBtn.innerHTML = isDark ? `<i class="fa-solid fa-moon"></i>` : `<i class="fa-solid fa-sun text-amber"></i>`;
      showToast(`Switched to ${isDark ? 'Midnight Dark' : 'Academic Light'} theme.`, 'info');
    });
  }
}

// ── Quick AI Action ───────────────────────────────────────────────────────────
function initQuickAIAction() {
  const quickAiBtn = document.getElementById('quick-ai-btn');
  if (quickAiBtn) {
    quickAiBtn.addEventListener('click', () => {
      openModal({
        title: 'GMIT AI Quick Action Dispatcher',
        icon: 'fa-wand-magic-sparkles',
        contentHtml: `
          <div style="display:flex; flex-direction:column; gap:0.85rem;">
            <button class="btn btn-ai-sparkle" id="action-ai-risk-scan" style="justify-content:flex-start; padding:0.9rem;">
              <i class="fa-solid fa-brain"></i>
              <div>
                <strong>Run University-Wide At-Risk Scan</strong>
                <div style="font-size:0.72rem; color:var(--text-muted);">Predict student performance anomalies for Sem 6</div>
              </div>
            </button>
            <button class="btn btn-secondary" id="action-ai-solve-schedule" style="justify-content:flex-start; padding:0.9rem;">
              <i class="fa-solid fa-route text-cyan"></i>
              <div>
                <strong>Auto-Solve Lab Room Overlaps</strong>
                <div style="font-size:0.72rem; color:var(--text-muted);">Re-assign PySpark lab Annex C to prevent room collision</div>
              </div>
            </button>
            <button class="btn btn-secondary" id="action-ai-counsel-batch" style="justify-content:flex-start; padding:0.9rem;">
              <i class="fa-solid fa-paper-plane text-indigo"></i>
              <div>
                <strong>Batch Send AI Mentorship Notices</strong>
                <div style="font-size:0.72rem; color:var(--text-muted);">Dispatch personalized emails to students below 70% attendance</div>
              </div>
            </button>
          </div>
        `
      });

      setTimeout(() => {
        document.getElementById('action-ai-risk-scan')?.addEventListener('click', () => {
          showToast('University-Wide Neural Scan completed! At-risk students flagged.', 'ai');
          document.getElementById('modal-backdrop').classList.add('hidden');
          window.location.hash = '#aiCopilot';
        });
        document.getElementById('action-ai-solve-schedule')?.addEventListener('click', () => {
          showToast('Schedule overlaps resolved! Lab rescheduled to Thursday 11:00 AM.', 'success');
          document.getElementById('modal-backdrop').classList.add('hidden');
        });
        document.getElementById('action-ai-counsel-batch')?.addEventListener('click', () => {
          showToast('Batch counseling emails queued for dispatch!', 'success');
          document.getElementById('modal-backdrop').classList.add('hidden');
        });
      }, 50);
    });
  }
}

// ── Sidebar Toggle ────────────────────────────────────────────────────────────
function initSidebarControls() {
  const sidebar          = document.getElementById('main-sidebar');
  const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
  const mobileMenuBtn    = document.getElementById('mobile-menu-btn');

  if (sidebarToggleBtn && sidebar) {
    sidebarToggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      sidebarToggleBtn.querySelector('i').classList.toggle('fa-angle-left');
      sidebarToggleBtn.querySelector('i').classList.toggle('fa-angle-right');
    });
  }

  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}

