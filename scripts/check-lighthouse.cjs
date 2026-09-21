const fs = require('fs');

try {
  const report = JSON.parse(fs.readFileSync('./lighthouse-report.json', 'utf8'));
  console.log('=== LIGHTHOUSE METRICS ===');
  for (const category of Object.values(report.categories)) {
    console.log(`${category.title}: ${Math.round(category.score * 100)}`);
  }

  console.log('\n=== CORE WEB VITALS (LAB) ===');
  const audits = report.audits;
  console.log(`FCP: ${audits['first-contentful-paint']?.displayValue}`);
  console.log(`LCP: ${audits['largest-contentful-paint']?.displayValue}`);
  console.log(`TBT: ${audits['total-blocking-time']?.displayValue}`);
  console.log(`CLS: ${audits['cumulative-layout-shift']?.displayValue}`);
  console.log(`Speed Index: ${audits['speed-index']?.displayValue}`);
} catch (err) {
  console.error('Error reading lighthouse report:', err);
}
