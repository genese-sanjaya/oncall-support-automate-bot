export function generateReport(health, rdsMetrics, backups) {
  const today = new Date();
  const humanDate = today.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return `
<h2>🛠 On-Call Support Update – ${humanDate}</h2>
<p><strong>On Call Support Bot</strong></p>

<ac:structured-macro ac:name="panel">
  <ac:parameter ac:name="title">🔍 System Health Overview</ac:parameter>
  <ac:rich-text-body>
    <table>
      <tr><th>Check</th><th>Status</th></tr>
      <tr><td>Application Health</td><td>${statusMacro(health.app)}</td></tr>
      <tr><td>Infra Usage Health</td><td>${statusMacro(health.infra)}</td></tr>
      <tr><td>Application Logs</td><td>${statusMacro(health.appLogs)}</td></tr>
      <tr><td>Analytics Logs</td><td>${statusMacro(health.analyticsLogs)}</td></tr>
      <tr><td>Dagster Job Logs</td><td>${statusMacro(health.dagsterLogs)}</td></tr>
    </table>
  </ac:rich-text-body>
</ac:structured-macro>

<ac:structured-macro ac:name="panel">
  <ac:parameter ac:name="title">📊 Resource Utilization</ac:parameter>
  <ac:rich-text-body>
    <table>
      <tr><th>Component</th><th>Avg CPU</th><th>Max CPU</th><th>Failed Jobs</th></tr>
      <tr><td>Tenant Application</td><td>${health.tenantCpu.avg.toFixed(2)}%</td><td>${health.tenantCpu.max.toFixed(2)}%</td><td>-</td></tr>
      <tr><td>Analytics Dagster</td><td>${health.analyticsCpu.avg.toFixed(2)}%</td><td>${health.analyticsCpu.max.toFixed(2)}%</td><td>${health.analyticsFailed}</td></tr>
      <tr><td>Jobs Dagster</td><td>${health.jobCpu.avg.toFixed(2)}%</td><td>${health.jobCpu.max.toFixed(2)}%</td><td>${health.jobFailed}</td></tr>
    </table>
  </ac:rich-text-body>
</ac:structured-macro>

<ac:structured-macro ac:name="panel">
  <ac:parameter ac:name="title">🗄 Database Health</ac:parameter>
  <ac:rich-text-body>
    <table>
      <tr><th>DB</th><th>CPU</th><th>Free Storage (GB)</th></tr>
      ${rdsMetrics
        .map(
          (m) =>
            `<tr><td>${m.db}</td><td>${m.cpu.toFixed(2)}%</td><td>${(m.freeStorage / 1e9).toFixed(2)}</td></tr>`,
        )
        .join('')}
    </table>
  </ac:rich-text-body>
</ac:structured-macro>

<ac:structured-macro ac:name="panel">
  <ac:parameter ac:name="title">💾 Backup Checks</ac:parameter>
  <ac:rich-text-body>
    <table>
      <tr><th>Resource</th><th>Status</th><th>Completed At</th></tr>
      ${
        backups.length
          ? backups
              .map(
                (b) =>
                  `<tr><td>${b.resource}</td><td>${statusMacro((b.status || '').toUpperCase() === 'COMPLETED')}</td><td>${b.completion || '-'}</td></tr>`,
              )
              .join('')
          : '<tr><td colspan="3">No backup records found</td></tr>'
      }
    </table>
  </ac:rich-text-body>
</ac:structured-macro>

<h3>📬 Support Queries & Cases</h3>
<p>[Generated automatically. Add manual entries if any queries arise]</p>
`;
}

function statusMacro(ok) {
  return ok
    ? `<ac:structured-macro ac:name="status"><ac:parameter ac:name="title">Normal</ac:parameter><ac:parameter ac:name="colour">Green</ac:parameter></ac:structured-macro>`
    : `<ac:structured-macro ac:name="status"><ac:parameter ac:name="title">Warning</ac:parameter><ac:parameter ac:name="colour">Red</ac:parameter></ac:structured-macro>`;
}
