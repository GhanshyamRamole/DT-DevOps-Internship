# DevOps Week 5 — Hands-on Activity: CI Pipeline with Validation Stage

Extends the Weekly Task app with a fourth pipeline stage — **Validation**
(ESLint) — and documents a real failure → troubleshooting → resolution cycle.

## Project Structure

```
.
├── Jenkinsfile          # Checkout -> Build -> Test -> Validation
├── app.js
├── eslint.config.js       # Validation stage rules
├── jest.config.js
├── package.json
└── tests/
    └── app.test.js
```

## Running Locally

```bash
npm install
npm test      # run tests
npm run lint  # run the validation stage locally
```

## Pipeline Stages

| Stage      | Command       | Purpose                                       |
|------------|----------------|--------------------------------------------------|
| Checkout   | `checkout scm`| Pulls the latest code from GitHub                 |
| Build      | `npm install` | Installs dependencies                             |
| Test       | `npm test`    | Runs the Jest suite; publishes JUnit results      |
| Validation | `npm run lint`| Runs ESLint as a code-quality gate                |

## Reproducing the Failure → Fix → Resolution Exercise

This is the exact bug used to generate the real Console Output captured in
`Activity_Troubleshooting_Summary.pdf`. To reproduce it yourself:

1. Open `app.js` and find the `/add` route.
2. Change `res.json({ result: a + b });` to `res.json({ result: a - b });`.
3. Commit and push — if your GitHub webhook is set up, Jenkins will
   automatically start a build and the **Test** stage will fail.
4. Open the failed build's **Console Output** in Jenkins and screenshot it
   (satisfies "Screenshot of Failed Pipeline" / "Screenshot of Console Output").
5. Revert the change back to `a + b`, commit, and push again.
6. Screenshot the resulting green pipeline (satisfies "Screenshot of
   Successful Pipeline") and the Validation stage passing (satisfies
   "Screenshot of Additional Validation Stage").

## Setup (GitHub Webhook + Jenkins)

Same process as the Weekly Task app — see that project's README for full
steps on installing Jenkins, connecting it to GitHub, and configuring the
webhook. Point the new Jenkins Pipeline job at this project's repository
instead.

## Notes on the Validation Stage

ESLint is configured (`eslint.config.js`) with `no-unused-vars` and `no-undef`
as errors, and `semi` as a warning. Jest's test globals (`describe`, `test`,
`expect`, etc.) are explicitly allow-listed so the test files don't fail
linting for using them — a common gotcha when adding ESLint to a Jest project
for the first time.
