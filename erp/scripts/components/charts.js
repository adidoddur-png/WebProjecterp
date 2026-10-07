/* AURA ERP - Dynamic Chart.js Visualization Engine */

let activeCharts = {};

export function renderDashboardCharts() {
  // Destroy existing charts to prevent memory leaks / canvas re-render glitches
  Object.keys(activeCharts).forEach(key => {
    if (activeCharts[key]) activeCharts[key].destroy();
  });
  activeCharts = {};

  const themeDark = document.body.classList.contains('theme-dark');
  const textColor = themeDark ? '#94a3b8' : '#475569';
  const gridColor = themeDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  // 1. Attendance & Performance Trend (Line Chart)
  const attendanceCanvas = document.getElementById('chart-attendance-trend');
  if (attendanceCanvas) {
    const ctx = attendanceCanvas.getContext('2d');
    activeCharts.attendance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
        datasets: [
          {
            label: 'CS & AI Dept (%)',
            data: [92, 94, 91, 95, 96, 94, 97, 96],
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Data Science (%)',
            data: [84, 82, 79, 75, 78, 80, 81, 83],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Cyber Security (%)',
            data: [88, 89, 90, 92, 91, 93, 92, 94],
            borderColor: '#10b981',
            backgroundColor: 'transparent',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: textColor, font: { family: 'Inter' } } }
        },
        scales: {
          x: { ticks: { color: textColor }, grid: { color: gridColor } },
          y: { ticks: { color: textColor }, grid: { color: gridColor }, min: 60, max: 100 }
        }
      }
    });
  }

  // 2. Department CGPA Distribution (Bar Chart)
  const deptCanvas = document.getElementById('chart-dept-cgpa');
  if (deptCanvas) {
    const ctx = deptCanvas.getContext('2d');
    activeCharts.dept = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Computer Science', 'Cyber Security', 'Data Science', 'Electronics', 'Biomedical'],
        datasets: [{
          label: 'Average CGPA',
          data: [3.82, 3.65, 3.45, 3.30, 3.75],
          backgroundColor: [
            'rgba(6, 182, 212, 0.7)',
            'rgba(99, 102, 241, 0.7)',
            'rgba(139, 92, 246, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(16, 185, 129, 0.7)'
          ],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { ticks: { color: textColor }, grid: { display: false } },
          y: { ticks: { color: textColor }, grid: { color: gridColor }, min: 2.0, max: 4.0 }
        }
      }
    });
  }

  // 3. Fee Collection Breakdown (Doughnut Chart)
  const feeCanvas = document.getElementById('chart-fee-breakdown');
  if (feeCanvas) {
    const ctx = feeCanvas.getContext('2d');
    activeCharts.fee = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Tuition Paid', 'Pending Dues', 'Scholarships', 'Hostel & Mess'],
        datasets: [{
          data: [12420000, 2430000, 1150000, 3100000],
          backgroundColor: ['#10b981', '#ef4444', '#6366f1', '#f59e0b'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: textColor, font: { family: 'Inter' } } }
        },
        cutout: '70%'
      }
    });
  }
}
