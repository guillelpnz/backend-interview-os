# Backend Interview Prep Hub

Static React + TypeScript + Vite application for backend interview preparation. The app is company-extensible: each interview process is defined as a local TypeScript `CompanyProfile` under `src/content/companies/`.

The first real profile is Abacum, with preparation content for Python live coding, Django, FastAPI, SQL/PostgreSQL, system design, behavioral interviews, CV/project defense, flashcards, cheat sheets and mock interview mode.

## Coding Dojo

The Coding Dojo section adds an in-browser Python practice environment for selected live coding exercises.

- Monaco Editor provides Python syntax highlighting.
- Pyodide runs Python locally in the browser.
- Visible and hidden tests are deterministic local test cases.
- User solutions and run progress are saved in browser `localStorage`.
- Local heuristic feedback flags common mistakes such as missing return values, hardcoded sample output or risky field access.

Python execution happens in the browser. Do not paste secrets or run untrusted code in the dojo.

See [docs/CODING_DOJO.md](docs/CODING_DOJO.md) for implementation details and instructions for adding new interactive exercises.

## Setup

```bash
npm install
```

## Local development

```bash
npm run dev
```

Vite will print a local URL such as `http://localhost:5173`.

## Build

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Lint:

```bash
npm run lint
```

## Project structure

```text
src/
  components/
  content/
    companies/
      abacum.ts
      exampleCompany.ts
      index.ts
    core/
  types/
    company.ts
    content.ts
  utils/
```

## How to add a new company

1. Copy `src/content/companies/exampleCompany.ts`.
2. Rename it, for example `src/content/companies/acme.ts`.
3. Export a `CompanyProfile`.
4. Import it in `src/content/companies/index.ts`.
5. Add it to the `companies` array.

Example:

```ts
import { abacum } from './abacum'
import { acme } from './acme'

export const companies = [abacum, acme]
```

The app automatically renders the company dashboard, company page, study priorities and company-specific mock interview bias from that profile.

## Company profile schema

`CompanyProfile` lives in `src/types/company.ts`.

Important fields:

- `id`, `name`, `website`
- `roleTitle`, `location`, `workMode`
- `salaryRange`, `equity`
- `recruiterNotes`
- `companySummary`, `productSummary`, `domain`, `businessModel`
- `funding`, `teamSize`, `offices`
- `processStages`
- `requiredStack`, `preferredStack`
- `roleResponsibilities`
- `likelyTechnicalChallenges`
- `interviewFocusAreas`
- `riskAreasForCandidate`
- `candidateStrengthsForThisRole`
- `preparationPriorities`
- `likelyQuestions`
- `smartQuestionsToAsk`
- `systemDesignScenarios`
- `liveCodingThemes`
- `behavioralThemes`
- `studyPlan`
- `fitAnalysis`, `whyAttractive`, `studyFirst`, `interviewStrategy`
- `djangoPrepChecklist`, `sqlPerformanceChecklist`
- `notes`

Keep `id` stable once users have progress saved in localStorage.

## Local content and progress

All interview content is stored locally in TypeScript files. There is no backend, authentication or external database.

Progress, selected company, flashcard completion and dark mode are stored in browser `localStorage`.

Coding Dojo solutions, attempts, visible-test status, all-test status, last run date and weak tags are also stored in browser `localStorage`.

## Deployment

The preferred production target is GitHub Pages using GitHub Actions.

Expected production URL:

```text
https://guillelpnz.github.io/backend-interview-os/
```

### Create the GitHub repository

With GitHub CLI:

```bash
gh repo create guillelpnz/backend-interview-os --public --source=. --remote=origin
```

Manual alternative:

1. Go to GitHub and create a new public repository named `backend-interview-os` under `guillelpnz`.
2. Do not initialize it with a README, license or `.gitignore` if this local repo already has those files.
3. Add the remote locally:

   ```bash
   git remote add origin git@github.com:guillelpnz/backend-interview-os.git
   ```

### Push to GitHub

```bash
git branch -M main
git push -u origin main
```

### Enable GitHub Pages

In the GitHub repository:

1. Open Settings -> Pages -> Build and deployment -> Source: GitHub Actions.
2. Push to `main` or run the `Deploy to GitHub Pages` workflow manually.

The workflow lives at `.github/workflows/deploy.yml`. It installs dependencies, runs lint when a lint script exists, builds the app and deploys `dist/` using the official GitHub Pages actions.

### Blank page troubleshooting

If the deployed page is blank but the build succeeds, check the Vite `base` setting in `vite.config.ts`.

For this repository it must be:

```ts
base: '/backend-interview-os/',
```

GitHub Pages serves project sites under `/<repository-name>/`, so assets built with `base: '/'` will point to the wrong URLs.

### Vercel

1. Import the repository in Vercel.
2. Use:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
3. If deploying to a Vercel root domain, change Vite `base` back to `/` before building or use an environment-specific config.

### Cloudflare Pages

1. Create a Pages project from the repository.
2. Use:
   - Build command: `npm run build`
   - Build output directory: `dist`
3. If deploying to a Cloudflare root domain, change Vite `base` back to `/` before building or use an environment-specific config.

## Scripts

- `npm run dev` - start Vite dev server.
- `npm run build` - typecheck and build static assets.
- `npm run preview` - preview the production build locally.
- `npm run lint` - run ESLint.
