import { instances, dagsterLogGroups } from '../config/config.js';
import { getCpuUtilization } from '../aws/cloudwatch.js';
import { getDagsterFailedJobs } from '../aws/logs.js';

export async function evaluateSystemHealth() {
  const tenantCpu = await getCpuUtilization(instances.tenantApp);
  const analyticsCpu = await getCpuUtilization(instances.analyticsDagster);
  const jobCpu = await getCpuUtilization(instances.jobDagster);

  const analyticsFailed = await getDagsterFailedJobs(
    dagsterLogGroups.analytics,
  );
  const jobFailed = await getDagsterFailedJobs(dagsterLogGroups.job);

  return {
    app: tenantCpu.avg < 70 && tenantCpu.max < 90 && jobFailed === 0,
    infra:
      tenantCpu.avg < 70 &&
      analyticsCpu.avg < 70 &&
      jobCpu.avg < 70 &&
      tenantCpu.max < 90 &&
      analyticsCpu.max < 90 &&
      jobCpu.max < 90,
    appLogs: true,
    analyticsLogs: analyticsFailed === 0,
    dagsterLogs: jobFailed === 0,
    tenantCpu,
    analyticsCpu,
    jobCpu,
    analyticsFailed,
    jobFailed,
  };
}
