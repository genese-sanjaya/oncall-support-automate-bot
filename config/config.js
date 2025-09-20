import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

export const region = process.env.AWS_REGION || 'ap-south-1';

export const instances = {
  tenantApp: process.env.TENANT_APP_INSTANCE,
  jobDagster: process.env.JOB_DAGSTER_INSTANCE,
  analyticsDagster: process.env.ANALYTICS_DAGSTER_INSTANCE,
};

export const rdsInstances = {
  analyticsWriter: process.env.RDS_ANALYTICS_WRITER,
  analyticsReader: process.env.RDS_ANALYTICS_READER,
  tenantReader: process.env.RDS_TENANT_READER,
  tenantWriter: process.env.RDS_TENANT_WRITER,
  jobs: process.env.RDS_JOBS,
};

export const dagsterLogGroups = {
  job: process.env.DAGSTER_JOB_LOG_GROUP,
  analytics: process.env.DAGSTER_ANALYTICS_LOG_GROUP,
};

export const backupVaultName = process.env.BACKUP_VAULT_NAME;

export const confluenceConfig = {
  enabled: process.env.CONFLUENCE_ENABLED === 'true',
  baseUrl: process.env.CONFLUENCE_BASE_URL,
  spaceKey: process.env.CONFLUENCE_SPACE_KEY,
  parentPageId: process.env.CONFLUENCE_PARENT_PAGE_ID,
  authEmail: process.env.CONFLUENCE_AUTH_EMAIL,
  authToken: process.env.CONFLUENCE_AUTH_TOKEN,
};
