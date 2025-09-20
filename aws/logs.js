import {
  CloudWatchLogsClient,
  StartQueryCommand,
  GetQueryResultsCommand,
} from '@aws-sdk/client-cloudwatch-logs';
import { region } from '../config/config.js';

const logs = new CloudWatchLogsClient({ region });

function getTodayRange() {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  return { startTime: startOfDay, endTime: now };
}

export async function getDagsterFailedJobs(logGroupName) {
  const { startTime, endTime } = getTodayRange();

  const startQuery = new StartQueryCommand({
    logGroupName,
    startTime: Math.floor(startTime.getTime() / 1000),
    endTime: Math.floor(endTime.getTime() / 1000),
    queryString:
      'fields @timestamp, @message | filter @message like /ERROR/ | stats count() as failed',
  });

  const { queryId } = await logs.send(startQuery);
  await new Promise((r) => setTimeout(r, 5000));

  const results = await logs.send(new GetQueryResultsCommand({ queryId }));
  return parseInt(results.results?.[0]?.[0]?.value || '0', 10);
}
