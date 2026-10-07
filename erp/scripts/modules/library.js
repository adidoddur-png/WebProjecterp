/* AURA ERP - Smart Library & AI Recommendation Module */

import { showToast } from '../components/toasts.js';

export function renderLibraryModule() {
  const books = [
    { title: "Deep Learning with PyTorch & Transformers", author: "Ian Goodfellow et al.", ISBN: "978-0262035613", status: "Available", category: "AI & ML" },
    { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", ISBN: "978-1449373320", status: "Issued", category: "Systems" },
    { title: "Practical Cryptography & Zero-Knowledge Proofs", author: "Bruce Schneier", ISBN: "978-1118026472", status: "Available", category: "Security" },
    { title: "Quantum Computing: A Gentle Introduction", author: "Eleanor Rieffel", ISBN: "978-0262015066", status: "Available", category: "Quantum" }
  ];

  return `
    <div class="panel-header">
      <div>
        <h2 class="panel-title" style="font-size: 1.6rem;"><i class="fa-solid fa-book-bookmark text-indigo"></i> Smart Library System</h2>
        <p style="color: var(--text-muted); font-size: 0.88rem; margin-top: 4px;">Digital repository catalog, automated RFID book issues, and AI recommendations based on syllabus topics.</p>
      </div>
    </div>

    <!-- AI Book Recommender Banner -->
    <div class="ai-banner">
      <div class="ai-banner-content">
        <h3><i class="fa-solid fa-wand-magic-sparkles text-cyan"></i> Neural Library Recommender</h3>
        <p>Based on Sophia Chen's current course CS-401 (Deep Learning), GMIT AI recommends reserving <strong>"Deep Learning with PyTorch & Transformers"</strong>.</p>
      </div>
      <button class="btn btn-ai-sparkle" id="btn-reserve-book">
        <i class="fa-solid fa-bookmark"></i> Instant Reserve Book
      </button>
    </div>

    <div class="glass-panel">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Book Title & Author</th>
              <th>Category</th>
              <th>ISBN Number</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${books.map(b => `
              <tr>
                <td>
                  <strong style="color: var(--text-main); font-size: 0.95rem;">${b.title}</strong><br>
                  <span style="font-size: 0.75rem; color: var(--text-subtle);">By ${b.author}</span>
                </td>
                <td><span class="status-pill info">${b.category}</span></td>
                <td><code>${b.ISBN}</code></td>
                <td><span class="status-pill ${b.status === 'Available' ? 'success' : 'warning'}">${b.status}</span></td>
                <td>
                  <button class="btn btn-secondary btn-issue-book" style="padding: 4px 10px; font-size: 0.78rem;">
                    <i class="fa-solid fa-book-open text-cyan"></i> Issue Book
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

export function bindLibraryEvents() {
  const reserveBtn = document.getElementById('btn-reserve-book');
  if (reserveBtn) {
    reserveBtn.onclick = () => {
      showToast('Reserved "Deep Learning with PyTorch" via Smart Library RFID portal.', 'success');
    };
  }

  document.querySelectorAll('.btn-issue-book').forEach(btn => {
    btn.onclick = () => {
      showToast('Book issue processed via RFID Scanner.', 'info');
    };
  });
}

