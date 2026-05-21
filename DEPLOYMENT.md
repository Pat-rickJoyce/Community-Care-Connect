# Deployment Guide

## Render Static Site Deployment

This application is deployed as a static site on Render.

### Current Deployment
- **URL**: https://community-care-connect.onrender.com
- **Platform**: Render Static Site
- **Repository**: GitHub - Lantana Consulting Group

### Deploying Updates

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add Scenario 1 FHIR integration"
   git push origin main
   ```

2. **Automatic Deployment**:
   - Render will automatically detect the push to the main branch
   - The site will rebuild and redeploy automatically
   - Check the Render dashboard for build logs

3. **Manual Deployment** (if needed):
   - Log in to Render dashboard
   - Navigate to the Community Care Connect service
   - Click "Manual Deploy" → "Deploy latest commit"

### Configuration

The site uses:
- **Build Command**: None (static HTML)
- **Publish Directory**: `.` (root directory)
- **Static Site**: Serves [index.html](index.html) directly

### Environment Variables
No environment variables needed - FHIR configuration is managed client-side via:
- Default config in JavaScript
- Browser localStorage for user preferences
- Runtime configuration panel in the UI

### CORS Configuration

The Coordination Platform Server must be configured to allow requests from:
- `https://community-care-connect.onrender.com`
- `http://localhost:*` (for local development)

If CORS issues occur, work with the CP Server administrator to add the appropriate CORS headers.

### Testing Deployment

After deployment:
1. Visit https://community-care-connect.onrender.com
2. Open browser DevTools Console
3. Click "Request referral" on any service
4. Fill and submit the form
5. Check console for FHIR submission logs
6. Verify Task and QuestionnaireResponse creation

### Rollback

If needed, rollback to a previous version:
1. Go to Render dashboard
2. Select the service
3. Navigate to "Events" tab
4. Find the previous successful deployment
5. Click "Rollback to this version"

### Local Development

Test locally before deploying:

```bash
# Option 1: Python HTTP server
cd Community-Care-Connect
python -m http.server 8000
# Visit http://localhost:8000

# Option 2: Node.js http-server
npm install -g http-server
http-server
# Visit http://localhost:8080
```

### Cache Busting

If users see old version after deployment, add cache-busting parameter:
```
https://community-care-connect.onrender.com/?v=1779381617983
```

Or clear the browser cache manually.
