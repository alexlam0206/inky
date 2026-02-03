const express = require('canvas');


function renderDashboard(data) {
    const canvas = new Canvas(800, 600);
    const ctx = canvas.getContext('2d');
    
    // bg
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 800, 600);

    //date
    ctx.font = 'bold 30px sans-serif';
    const today = new Date().toLocaleDateString();
    ctx.fillText(today, 20, 50);

    //task
    ctx.font = '24px sans-serif';
    ctx.fillText('Upcoming Tasks:', 50, 100);
    ctx.font = '20px sans-serif';
    (data.tasks || []).slice(0, 5).forEach((task, i) => {
         ctx.fillText(`- ${task.title} (Due: ${task.dueDate})`, 50, 140 + i * 30);
    });

    // habit graph (7days)
    ctx.font = '24px sans-serif';
    ctx.fillText('Study Habit (Last 7 days):', 50, 350);

    const squareSize = 40;
    const gap = 10;
    const studyDates = data.habits?.study || [];

    for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const isDone = studyDates.includes(dateStr);

    const x = 50 + (6 - i) * (squareSize + gap);
    const y = 380;

    ctx.strokeStyle = '#000000';
    ctx.strokeRect(x, y, squareSize, squareSize);
    
    if (isDone) {
      ctx.fillRect(x, y, squareSize, squareSize);
    }
    
    // day label
    ctx.font = '12px sans-serif';
    ctx.fillText(d.getDate().toString(), x + 10, y + squareSize + 15);
  }

  return canvas.toBuffer('image/png');
}
