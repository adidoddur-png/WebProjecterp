/* AURA ERP - Toast Notification Component */

export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  let icon = 'fa-info-circle text-indigo';
  if (type === 'success') icon = 'fa-circle-check text-emerald';
  if (type === 'danger') icon = 'fa-triangle-exclamation text-rose';
  if (type === 'warning') icon = 'fa-circle-exclamation text-amber';
  if (type === 'ai') icon = 'fa-wand-magic-sparkles text-cyan';

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
