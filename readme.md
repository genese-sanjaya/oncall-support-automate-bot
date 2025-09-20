# Automate On-Call Support

This project automates the generation of daily **On-Call Support Reports** by fetching metrics from AWS (EC2, RDS, CloudWatch Logs, Backups) and publishing them into Confluence under a structured hierarchy.

---

## 🚀 Features
- Collects **system health metrics** (EC2 CPU, RDS health, Dagster logs, Backup status).
- Generates **daily reports** with Confluence storage-format markup:
  - System Health Overview (status lozenges)
  - Resource Utilization tables
  - Database Health checks
  - Backup job status
  - Support Queries placeholder
- Publishes reports to **Confluence** under:
  Space → On call support → YYYY-MM → YYYY-MM-DD

yaml
Copy code
- Supports AWS Profiles, IAM roles, or direct access keys.

---

## 📦 Requirements
- Node.js **v18+** (tested on Node.js v24)
- AWS CLI configured (SSO or IAM user/role with required permissions)
- Confluence API token

---

## 🔑 AWS Permissions
The IAM user/role must have at least:

- `cloudwatch:GetMetricData`
- `logs:StartQuery`, `logs:GetQueryResults`
- `rds:DescribeDBInstances`
- `backup:ListBackupJobs`

---

## ⚙️ Setup

1. **Clone the repository**:
 ```bash
 git clone <your-repo-url>
 cd automate-on-call-support
Install dependencies:

bash
Copy code
npm install
Configure environment variables:
Copy .env.example to .env and fill in values:

ini
Copy code
AWS_REGION=ap-south-1
AWS_PROFILE=default

TENANT_APP_INSTANCE=i-xxxxxxxxxxxx
JOB_DAGSTER_INSTANCE=i-xxxxxxxxxxxx
ANALYTICS_DAGSTER_INSTANCE=i-xxxxxxxxxxxx

RDS_ANALYTICS_WRITER=gumpnow-analytics-db-instance-1
RDS_ANALYTICS_READER=gumpnow-analytics-reader
RDS_TENANT_READER=gumpnow-prod-tenant-db-instance-1
RDS_TENANT_WRITER=gumpnow-prod-tenant-db-instance-1-ap-south-1a
RDS_JOBS=gumpnow-production-jobs

DAGSTER_JOB_LOG_GROUP=/aws/codebuild/gumpnow-prod-job-dagster-project
DAGSTER_ANALYTICS_LOG_GROUP=/aws/codebuild/gumpnow-prod-analytics-dagster-project

BACKUP_VAULT_NAME=gumpnow-prod-backup

CONFLUENCE_ENABLED=true
CONFLUENCE_BASE_URL=https://genese.atlassian.net/wiki
CONFLUENCE_SPACE_KEY=GUMP
CONFLUENCE_PARENT_PAGE_ID=1026424833
CONFLUENCE_AUTH_EMAIL=your.email@genese.com
CONFLUENCE_AUTH_TOKEN=your-api-token
Run the script:

bash
Copy code
npm start
📊 Output
Console output prints the report for today.

If Confluence integration is enabled (CONFLUENCE_ENABLED=true), a page is created:

vbnet
Copy code
GUMP / On call support / YYYY-MM / YYYY-MM-DD
Example page sections:

🔍 System Health Overview

📊 Resource Utilization

Database Health

Backup Checks

📬 Support Queries & Cases

📌 Notes
Confluence API token is created at:
https://id.atlassian.com/manage-profile/security/api-tokens

If using temporary AWS credentials (ASIA keys), don’t forget AWS_SESSION_TOKEN.

📄 License
Internal use only – Genese Solutions Pvt. Ltd.

yaml
Copy code

---

Would you like me to also generate a **`.env.example` file** in code, so your teammates can just copy it to `.env` without exposing real credentials?





Ask ChatGPT
