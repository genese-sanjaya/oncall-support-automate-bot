import { BackupClient, ListBackupJobsCommand } from '@aws-sdk/client-backup';
import { region, backupVaultName } from '../config/config.js';

const backup = new BackupClient({ region });

export async function getBackupStatus() {
  const cmd = new ListBackupJobsCommand({
    ByBackupVaultName: backupVaultName,
    MaxResults: 5,
  });
  const { BackupJobs } = await backup.send(cmd);
  return BackupJobs.map((job) => ({
    resource: job.ResourceArn,
    status: job.State,
    completion: job.CompletionDate,
  }));
}
