# Deployment

## GitHub Pages

Target URL:

```text
https://guillelpnz.github.io/backend-interview-os/
```

The app is configured for a GitHub Pages project site with:

```ts
base: '/backend-interview-os/',
```

The Coding Dojo is still a static frontend feature. Python execution runs in the browser through Pyodide. The app dynamically loads the matching Pyodide runtime assets from jsDelivr at run time, so GitHub Pages only serves the React build and no backend is required.

The local Pyodide loader chunk is emitted as `assets/pyodide.js` with a stable filename. This avoids stale-browser-cache failures where an older app bundle tries to import a hashed Pyodide chunk that was removed by a later GitHub Pages deploy. A few known historical Pyodide chunk names are kept as tiny static shims that re-export `pyodide.js`.

If the browser reports `Failed to fetch dynamically imported module` for an old `assets/pyodide-*.js` file, hard-refresh the page once. Future deploys should continue using `assets/pyodide.js` for that loader chunk.

Create the repository with GitHub CLI:

```bash
gh repo create guillelpnz/backend-interview-os --public --source=. --remote=origin
git branch -M main
git push -u origin main
```

Manual repository setup:

1. Create a public GitHub repository named `backend-interview-os`.
2. Add the remote:

   ```bash
   git remote add origin git@github.com:guillelpnz/backend-interview-os.git
   ```

3. Push:

   ```bash
   git branch -M main
   git push -u origin main
   ```

Enable Pages:

1. Open repository Settings.
2. Go to Pages.
3. Set Build and deployment Source to GitHub Actions.
4. Push to `main` or run the deploy workflow manually.

## Vercel

1. Import the GitHub repository in Vercel.
2. Framework preset: Vite.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. For a root-domain Vercel deployment, set Vite `base` to `/` or use an environment-specific build configuration.
6. The Pyodide runtime loads from jsDelivr unless you change `src/utils/pyodideRunner.ts` to self-host the assets.

## Cloudflare Pages

1. Create a Cloudflare Pages project from the GitHub repository.
2. Build command: `npm run build`.
3. Build output directory: `dist`.
4. For a root-domain Cloudflare deployment, set Vite `base` to `/` or use an environment-specific build configuration.
5. The Pyodide runtime loads from jsDelivr unless you change `src/utils/pyodideRunner.ts` to self-host the assets.

## Rollback and redeploy

Redeploy the latest successful build:

1. Open the GitHub repository.
2. Go to Actions.
3. Select the `Deploy to GitHub Pages` workflow.
4. Run workflow on `main`.

Rollback to an older version:

```bash
git log --oneline
git revert <commit-sha>
git push origin main
```

GitHub Actions will deploy the reverted state.

For an emergency manual rollback, use GitHub Actions history to identify the previous commit, revert the newer commit locally, then push to `main`.

## Custom domain notes

For GitHub Pages custom domains:

1. Add the domain under Settings -> Pages -> Custom domain.
2. Configure DNS with your domain provider.
3. Add a `public/CNAME` file containing the custom domain if you want it version-controlled.
4. If the site is served from the custom domain root, change Vite `base` to `/`.

For Vercel or Cloudflare Pages custom domains, configure the domain in that provider and use `base: '/'` for root-domain hosting.
