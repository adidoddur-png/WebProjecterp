/* AURA ERP - Universal Modal Component */

export function openModal({ title, icon = 'fa-window-maximize', contentHtml, buttonsHtml }) {
  const backdrop = document.getElementById('modal-backdrop');
  const modalBox = document.getElementById('modal-content');
  if (!backdrop || !modalBox) return;

  modalBox.innerHTML = `
    <div class="modal-header">
      <div class="modal-title">
        <i class="fa-solid ${icon} text-cyan"></i>
        <span>${title}</span>
      </div>
      <button class="icon-btn" id="close-modal-x">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <div class="modal-body">
      ${contentHtml}
    </div>
    <div class="modal-footer">
      ${buttonsHtml || '<button class="btn btn-secondary" id="close-modal-btn">Close</button>'}
    </div>
  `;

  backdrop.classList.remove('hidden');

  // Close bindings
  const closeX = document.getElementById('close-modal-x');
  const closeBtn = document.getElementById('close-modal-btn');
  
  const closeModal = () => backdrop.classList.add('hidden');
  if (closeX) closeX.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  
  backdrop.onclick = (e) => {
    if (e.target === backdrop) closeModal();
  };
}

export function closeModal() {
  const backdrop = document.getElementById('modal-backdrop');
  if (backdrop) backdrop.classList.add('hidden');
}
