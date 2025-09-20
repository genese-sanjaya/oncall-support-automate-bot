import {
  CloudWatchClient,
  GetMetricDataCommand,
} from '@aws-sdk/client-cloudwatch';
import { region } from '../config/config.js';

const cw = new CloudWatchClient({ region });

function getTodayRange() {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  return { startTime: startOfDay, endTime: now };
}

export async function getCpuUtilization(instanceId) {
  const { startTime, endTime } = getTodayRange();
  const cmd = new GetMetricDataCommand({
    StartTime: startTime,
    EndTime: endTime,
    MetricDataQueries: [
      {
        Id: 'avgCPU',
        MetricStat: {
          Metric: {
            Namespace: 'AWS/EC2',
            MetricName: 'CPUUtilization',
            Dimensions: [{ Name: 'InstanceId', Value: instanceId }],
          },
          Period: 300,
          Stat: 'Average',
        },
      },
      {
        Id: 'maxCPU',
        MetricStat: {
          Metric: {
            Namespace: 'AWS/EC2',
            MetricName: 'CPUUtilization',
            Dimensions: [{ Name: 'InstanceId', Value: instanceId }],
          },
          Period: 300,
          Stat: 'Maximum',
        },
      },
    ],
  });
  const result = await cw.send(cmd);
  return {
    avg: result.MetricDataResults[0]?.Values?.[0] ?? 0,
    max: result.MetricDataResults[1]?.Values?.[0] ?? 0,
  };
}

export async function getRdsMetrics(dbId) {
  const { startTime, endTime } = getTodayRange();
  const cmd = new GetMetricDataCommand({
    StartTime: startTime,
    EndTime: endTime,
    MetricDataQueries: [
      {
        Id: 'cpu',
        MetricStat: {
          Metric: {
            Namespace: 'AWS/RDS',
            MetricName: 'CPUUtilization',
            Dimensions: [{ Name: 'DBInstanceIdentifier', Value: dbId }],
          },
          Period: 300,
          Stat: 'Average',
        },
      },
      {
        Id: 'storage',
        MetricStat: {
          Metric: {
            Namespace: 'AWS/RDS',
            MetricName: 'FreeStorageSpace',
            Dimensions: [{ Name: 'DBInstanceIdentifier', Value: dbId }],
          },
          Period: 300,
          Stat: 'Minimum',
        },
      },
    ],
  });
  const result = await cw.send(cmd);
  return {
    cpu: result.MetricDataResults[0]?.Values?.[0] ?? 0,
    freeStorage: result.MetricDataResults[1]?.Values?.[0] ?? 0,
  };
}
