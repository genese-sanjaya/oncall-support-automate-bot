import { evaluateSystemHealth } from './report/health.js';
import { getRdsMetrics } from './aws/cloudwatch.js';
import { getBackupStatus } from './aws/backup.js';
import { generateReport } from './report/generator.js';
import { publishToConfluence } from './confluence/api.js';
import { rdsInstances, confluenceConfig } from './config/config.js';

(async () => {
  const health = await evaluateSystemHealth();

  const rdsMetrics = [];
  for (const [label, db] of Object.entries(rdsInstances)) {
    const m = await getRdsMetrics(db);
    rdsMetrics.push({ db, ...m });
  }

  const backups = await getBackupStatus();

  const report = generateReport(health, rdsMetrics, backups);
  console.log(report);

  if (confluenceConfig.enabled) {
    await publishToConfluence(report);
  }
})();
