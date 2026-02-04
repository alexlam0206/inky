const crypto = require('crypto');
const sharp = require('sharp');

let lastRenderHash = null;
let lastRenderBuffer = null;

function getSnapshotDate(data) {
  if (data && typeof data.snapshotDate === 'string' && data.snapshotDate.trim()) {
    return data.snapshotDate.trim();
  }

  const studyDates = data?.habits?.study || [];
  if (studyDates.length > 0) {
    const latest = studyDates.slice().sort().pop();
    return latest;
  }

  return 'Date: (set in data)';
}

function getBaseDateISO(data, snapshotDate) {
  if (snapshotDate && /^\d{4}-\d{2}-\d{2}$/.test(snapshotDate)) {
    return snapshotDate;
  }

  const studyDates = data?.habits?.study || [];
  if (studyDates.length > 0) {
    return studyDates.slice().sort().pop();
  }

  return '2000-01-01';
}

function hashData(data) {
  const payload = JSON.stringify(data ?? {});
  return crypto.createHash('sha256').update(payload).digest('hex');
}

async function renderDashboard(data) {
  // E-ink safety: only change pixels when the data snapshot changes.
  const dataHash = hashData(data);
  if (dataHash === lastRenderHash && lastRenderBuffer) {
    return lastRenderBuffer;
  }

  const width = 800;
  const height = 600;
  const left = 50;

  const titleSize = 30;
  const sectionSize = 26;
  const itemSize = 22;
  const lineGap = 38;

  const dividerHeight = 6;
  const dividerWidth = width - left * 2;

  const snapshotDate = getSnapshotDate(data);
  const baseDateISO = getBaseDateISO(data, snapshotDate);
  const tasks = (data.tasks || []).slice(0, 5);
  const tasksCount = Math.max(tasks.length, 1);
  const dividerY = 160 + tasksCount * lineGap + 10;
  const habitsTitleY = 220 + tasksCount * lineGap;

  // Generate SVG content
  let svgContent = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="100%" height="100%" fill="white"/>

      <!-- Date (date only, from data snapshot) -->
      <text x="${left}" y="55" font-family="sans-serif" font-size="${titleSize}" font-weight="700" fill="black">
        ${snapshotDate.startsWith('Date:') ? snapshotDate : `Date: ${snapshotDate}`}
      </text>

      <!-- Divider -->
      <rect x="${left}" y="75" width="${dividerWidth}" height="${dividerHeight}" fill="black"/>

      <!-- Tasks -->
      <text x="${left}" y="120" font-family="sans-serif" font-size="${sectionSize}" font-weight="700" fill="black">Upcoming Tasks</text>
      ${tasks.map((task, i) => `
        <text x="${left}" y="${160 + i * lineGap}" font-family="sans-serif" font-size="${itemSize}" font-weight="600" fill="black">
          - ${task.title} (Due: ${task.dueDate})
        </text>
      `).join('')}

      <!-- Divider -->
      <rect x="${left}" y="${dividerY}" width="${dividerWidth}" height="${dividerHeight}" fill="black"/>

      <!-- Habit Heatmap -->
      <text x="${left}" y="${habitsTitleY}" font-family="sans-serif" font-size="${sectionSize}" font-weight="700" fill="black">Study Habit (Last 7 Days)</text>
  `;

  const squareSize = 44;
  const gap = 12;
  const studyDates = data.habits?.study || [];

  const baseDate = new Date(`${baseDateISO}T00:00:00Z`);
  for (let i = 6; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setUTCDate(d.getUTCDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.getUTCDate();
    const isDone = studyDates.includes(dateStr);

    const x = left + (6 - i) * (squareSize + gap);
    const y = 280 + tasksCount * lineGap;

    // Square outline (thick enough for e-ink)
    svgContent += `<rect x="${x}" y="${y}" width="${squareSize}" height="${squareSize}" fill="${isDone ? 'black' : 'white'}" stroke="black" stroke-width="2"/>`;

    // Day label
    svgContent += `<text x="${x + 14}" y="${y + squareSize + 22}" font-family="sans-serif" font-size="14" font-weight="700" fill="black">${dayLabel}</text>`;
  }

  svgContent += `</svg>`;

  // Convert SVG to PNG using sharp
  const buffer = await sharp(Buffer.from(svgContent))
    .png()
    .toBuffer();

  lastRenderHash = dataHash;
  lastRenderBuffer = buffer;

  return buffer;
}

module.exports = { renderDashboard };
