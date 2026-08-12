# DevOps Week 5 — Weekly Task: Jenkins CI Pipeline (Checkout → Build → Test)

A Node.js/Express sample app with a real Jest test suite, built to be run through
a Jenkins Declarative Pipeline connected to GitHub.

## Project Structure

```
.
├── Jenkinsfile        # Declarative pipeline: Checkout -> Build -> Test
├── app.js              # Express app (routes: /, /health, /add)
├── jest.config.js      # Configures JUnit XML output for Jenkins test reporting
├── package.json
└── tests/
    └── app.test.js      # 4 real Jest tests
```

## Running Locally (without Jenkins)

```bash
npm install
npm start          # runs the app at http://localhost:3000
npm test           # runs the test suite; also writes reports/junit.xml
```

## Setting Up the Jenkins Pipeline

### 1. Install Jenkins
Follow the official install guide for your OS at jenkins.io, or run it via Docker:
```bash
docker run -p 8080:8080 -p 50000:50000 jenkins/jenkins:lts
```
Get the initial admin password from the container logs, then finish setup at
`http://localhost:8080`. Install the suggested plugins (includes Git and GitHub
integration).

### 2. Verify Installation
Screenshot the Jenkins Dashboard after logging in — this satisfies the
"Screenshot of Jenkins Dashboard" requirement.

### 3. Connect Jenkins to GitHub
- Push this project to a new GitHub repository.
- In Jenkins: **New Item → Pipeline**.
- Under **Pipeline**, choose **Pipeline script from SCM**, SCM = **Git**, and
  paste your repository URL.
- If the repo is private, add credentials under **Manage Jenkins → Credentials**
  (a GitHub Personal Access Token works well) and select them here.

### 4. Configure a Build Trigger
Under the job's configuration, enable **GitHub hook trigger for GITScm polling**
(requires the GitHub webhook set up below), or use **Poll SCM** with a schedule
like `H/5 * * * *` as a simpler alternative that doesn't need a public endpoint.

### 5. Set Up the GitHub Webhook
In your GitHub repo: **Settings → Webhooks → Add webhook**
- Payload URL: `http://<your-jenkins-url>/github-webhook/`
- Content type: `application/json`
- Event: **Just the push event**

(If Jenkins is running locally and not publicly reachable, tools like `ngrok`
can expose it temporarily for webhook testing.)

### 6. Run the Pipeline
Click **Build Now**, or push a commit if the webhook is configured. Screenshot:
- The pipeline stage view (Pipeline Execution)
- The Console Output of a build
- The Test Result page (populated from `reports/junit.xml`)

## What Each Stage Does

| Stage    | Command         | Purpose                                   |
|----------|------------------|---------------------------------------------|
| Checkout | `checkout scm`  | Pulls the latest code from GitHub            |
| Build    | `npm install`   | Installs dependencies                        |
| Test     | `npm test`      | Runs the Jest suite; publishes JUnit results |
