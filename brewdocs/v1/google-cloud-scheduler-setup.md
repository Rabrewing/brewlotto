# Google Cloud Setup for Scheduled Ingestion

**Purpose:** Run lottery data ingestion on a reliable schedule outside of Vercel  
**Reference:** See also `brewdocs/v1/launch-infrastructure-plan.md`

---

## Prerequisites

### 1. Install Docker
Download from: https://www.docker.com/products/desktop/

Verify:
```bash
docker --version
```

---

## Google Cloud Setup

### 2. Create Google Cloud Project
Go to: https://console.cloud.google.com/

- Create new project (e.g., "brewlotto-ingestion")
- Note your **PROJECT_ID**

### 3. Enable Required APIs
In Cloud Console, enable:
- **Cloud Run API**
- **Cloud Scheduler API**
- **Container Registry API** (or Artifact Registry)

Via CLI:
```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudscheduler.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

---

## Build & Deploy Container

### 4. Build the Docker Image
From project root (where `Dockerfile.ingestion` lives):
```bash
docker build -f Dockerfile.ingestion -t gcr.io/YOUR_PROJECT_ID/brewlotto-ingestion:latest .
```

### 5. Push to Google Container Registry
```bash
docker push gcr.io/YOUR_PROJECT_ID/brewlotto-ingestion:latest
```

### 6. Deploy to Cloud Run
```bash
gcloud run deploy brewlotto-ingestion \
  --image gcr.io/YOUR_PROJECT_ID/brewlotto-ingestion:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="SUPABASE_URL=https://your-project.supabase.co,SUPABASE_SERVICE_ROLE_KEY=your-key"
```

**Note:** Copy all env vars from your Vercel project settings.

After deployment, note the **Cloud Run URL** (e.g., `https://brewlotto-ingestion-xyz-uc.a.run.app`)

---

## Create Scheduler Jobs

### 7. Schedule Per-Game Ingestion

Each lottery game has specific draw times. Schedule ingestion to run shortly after each draw.

#### Game Draw Times (ET)

| Game | Draw Times (ET) | Frequency |
|------|-----------------|-----------|
| NC Pick 3 | 3:00 PM, 11:00 PM | Twice daily |
| NC Pick 4 | 3:00 PM, 11:00 PM | Twice daily |
| NC Cash 5 | 11:00 PM | Daily |
| CA Daily 3 | ~4:00 PM, ~10:00 PM (1pm, 7pm PT) | Twice daily |
| CA Daily 4 | ~4:00 PM, ~10:00 PM (1pm, 7pm PT) | Twice daily |
| CA Fantasy 5 | ~11:00 PM (8pm PT) | Daily |
| Powerball | ~10:00 PM | Mon/Wed/Sat |
| Mega Millions | ~11:00 PM | Tue/Fri |

#### Scheduler Commands

Replace `YOUR_CLOUD_RUN_URL` with your actual Cloud Run URL.

```bash
# NC Pick 3 - Afternoon draw (3pm ET)
gcloud scheduler jobs create http nc-pick3-afternoon \
  --schedule="0 15 * * 1-7" \
  --uri="https://YOUR_CLOUD_RUN_URL" \
  --location us-central1 \
  --http-method GET

# NC Pick 3 - Evening draw (11pm ET)
gcloud scheduler jobs create http nc-pick3-evening \
  --schedule="0 23 * * 1-7" \
  --uri="https://YOUR_CLOUD_RUN_URL" \
  --location us-central1 \
  --http-method GET

# NC Pick 4 - Afternoon draw (3pm ET)
gcloud scheduler jobs create http nc-pick4-afternoon \
  --schedule="0 15 * * 1-7" \
  --uri="https://YOUR_CLOUD_RUN_URL" \
  --location us-central1 \
  --http-method GET

# NC Pick 4 - Evening draw (11pm ET)
gcloud scheduler jobs create http nc-pick4-evening \
  --schedule="0 23 * * 1-7" \
  --uri="https://YOUR_CLOUD_RUN_URL" \
  --location us-central1 \
  --http-method GET

# NC Cash 5 - Evening draw (11pm ET)
gcloud scheduler jobs create http nc-cash5 \
  --schedule="0 23 * * 1-7" \
  --uri="https://YOUR_CLOUD_RUN_URL" \
  --location us-central1 \
  --http-method GET

# CA Daily 3 - Afternoon draw (4pm ET = 1pm PT)
gcloud scheduler jobs create http ca-daily3-afternoon \
  --schedule="0 16 * * 1-7" \
  --uri="https://YOUR_CLOUD_RUN_URL" \
  --location us-central1 \
  --http-method GET

# CA Daily 3 - Evening draw (10pm ET = 7pm PT)
gcloud scheduler jobs create http ca-daily3-evening \
  --schedule="0 22 * * 1-7" \
  --uri="https://YOUR_CLOUD_RUN_URL" \
  --location us-central1 \
  --http-method GET

# CA Daily 4 - Afternoon draw (4pm ET = 1pm PT)
gcloud scheduler jobs create http ca-daily4-afternoon \
  --schedule="0 16 * * 1-7" \
  --uri="https://YOUR_CLOUD_RUN_URL" \
  --location us-central1 \
  --http-method GET

# CA Daily 4 - Evening draw (10pm ET = 7pm PT)
gcloud scheduler jobs create http ca-daily4-evening \
  --schedule="0 22 * * 1-7" \
  --uri="https://YOUR_CLOUD_RUN_URL" \
  --location us-central1 \
  --http-method GET

# CA Fantasy 5 - Evening draw (11pm ET = 8pm PT)
gcloud scheduler jobs create http ca-fantasy5 \
  --schedule="0 23 * * 1-7" \
  --uri="https://YOUR_CLOUD_RUN_URL" \
  --location us-central1 \
  --http-method GET

# Powerball - Mon/Wed/Sat (10pm ET)
gcloud scheduler jobs create http powerball \
  --schedule="0 22 * * 1,3,6" \
  --uri="https://YOUR_CLOUD_RUN_URL" \
  --location us-central1 \
  --http-method GET

# Mega Millions - Tue/Fri (11pm ET)
gcloud scheduler jobs create http mega-millions \
  --schedule="0 23 * * 2,5" \
  --uri="https://YOUR_CLOUD_RUN_URL" \
  --location us-central1 \
  --http-method GET
```

---

## Verify Setup

### 8. Test Cloud Run Manually
```bash
curl https://YOUR_CLOUD_RUN_URL
```

### 9. Check Scheduler Jobs
```bash
gcloud scheduler jobs list --location us-central1
```

### 10. View Logs
- Cloud Run: https://console.cloud.google.com/run
- Scheduler: https://console.cloud.google.com/cloudscheduler

---

## Cost Notes

- **Cloud Run**: Pay per request (~$0.40 per million requests, ~$0.05 per vCPU-hour)
- **Cloud Scheduler**: First 3 jobs free, then $0.10 per job per month
- **Estimated monthly cost**: <$5 for current workload

---

## Troubleshooting

**Ingestion not running?**
- Check Cloud Scheduler logs for failed attempts
- Verify Cloud Run URL is correct and accessible
- Ensure environment variables are set in Cloud Run

**Stale data?**
- Check `draw_freshness_status` table in Supabase
- Verify ingestion script completed successfully in Cloud Run logs
