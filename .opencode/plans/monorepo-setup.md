# Monorepo Setup Plan

## Phase 1 - Root Config

### 1.1 Root package.json
Replace `C:\Users\user\Documents\GitHub\lutterodt\package.json` with:
```json
{
  "name": "lutterodt",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "format": "prettier --write \"**/*.{ts,tsx,json}\"",
    "deploy:heritage": "cd apps/heritage && npm run deploy",
    "deploy:database": "cd apps/database && npm run deploy"
  },
  "devDependencies": {
    "turbo": "^2"
  },
  "packageManager": "pnpm@10.32.1",
  "engines": {
    "node": ">=20"
  }
}
```

### 1.2 pnpm-workspace.yaml
Create `C:\Users\user\Documents\GitHub\lutterodt\pnpm-workspace.yaml`:
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### 1.3 turbo.json
Create `C:\Users\user\Documents\GitHub\lutterodt\turbo.json`:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", ".open-next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"]
    }
  }
}
```

### 1.4 Update .gitignore
Add to `C:\Users\user\Documents\GitHub\lutterodt\.gitignore`:
```
# pnpm
pnpm-lock.yaml
```

## Phase 2 - Move Heritage App

### 2.1 Create apps/ directory
```
mkdir apps\heritage
```

### 2.2 Move all current app files (EXCEPT .git, .github, node_modules, .next, .wrangler) into apps/heritage/
Move these into apps/heritage/:
- src/
- public/
- __tests__/
- cypress/
- all config files (next.config.ts, tsconfig.json, wrangler.jsonc, etc.)
- package.json
- All remaining root files that belong to the app

### 2.3 Update apps/heritage/package.json
Change name from "lutterodt-renaissance" to "@lutterodt/heritage"

### 2.4 Update apps/heritage/tsconfig.json
Update paths to:
```json
"paths": {
  "@/*": ["./src/*"]
}
```
(already correct)

### 2.5 Update apps/heritage/next.config.ts
No change needed - paths stay relative to the app dir.

### 2.6 Update apps/heritage/wrangler.jsonc
No change needed - worker name stays "lutterodt"

## Phase 3 - Create Database App

### 3.1 Scaffold new app
```
cd apps
pnpm create next-app@latest database --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```
Choose: No Turbopack (for Cloudflare compat), no `src/` directory (wait, it should use src-dir), yes to Tailwind.

### 3.2 Set up database app for Cloudflare Workers
- Copy opennext configs from heritage app
- Add wrangler.jsonc with worker name "lutterodt-database"
- Add @opennextjs/cloudflare dependency
- Update next.config.ts for Cloudflare

### 3.3 Update apps/database/package.json
Change name to "@lutterodt/database"
Remove PocketBase/Supabase dependencies (static site)
Add the same UI deps as heritage app for consistency

## Phase 4 - Create Shared Data Package

### 4.1 Create packages/lutterodt-data/
Create directory: packages/lutterodt-data/src/
Create packages/lutterodt-data/package.json:
```json
{
  "name": "@lutterodt/data",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5"
  }
}
```

### 4.2 Create packages/lutterodt-data/tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

### 4.3 Create packages/lutterodt-data/src/index.ts
Re-export all types and data from profiles.ts and stats.ts

### 4.4 Create packages/lutterodt-data/src/profiles.ts
Copy from the file already created at src/data/profiles.ts (the one in heritage app that needs to be reverted)

### 4.5 Create packages/lutterodt-data/src/stats.ts
Copy from the file already created at src/data/stats.ts

### 4.6 Update root tsconfig for shared path
No - each app manages its own tsconfig. The data package is consumed via package name.

## Phase 5 - Revert Directory from Heritage App

### 5.1 Remove directory files
- Delete src/data/profiles.ts
- Delete src/data/stats.ts
- Delete src/app/(main)/directory/ (entire directory)

### 5.2 Restore Header.tsx
Change navLinks back to original (remove "Directory")

### 5.3 Restore Footer.tsx
Change Explore links back to original (remove Directory link, restore Family Tree)

## Phase 6 - Build Database App Complete

### 6.1 Add @lutterodt/data dependency to apps/database/package.json

### 6.2 Create landing page (apps/database/src/app/page.tsx)
Port from desktop C:\Users\user\Desktop\lutt letters\index.html:
- Dark mode (#0a0806 background, #c6a15b gold)
- Hero with animated badge, stats counters
- 4 sponsorship tiers (Free Trial / Patron $3 / Scholar $7 / Guardian $15)
- Features grid, FAQ accordion, trial signup modal

### 6.3 Create directory browser (apps/database/src/app/directory/page.tsx)
Port from the directory page built in heritage app:
- Search bar
- Category filter chips
- Country dropdown
- Grid of profile cards
- Each card shows: category badge, name, country, achievement snippet

### 6.4 Create profile detail page (apps/database/src/app/directory/[id]/page.tsx)
Port from the profile detail page built in heritage app

### 6.5 Create layout that matches the dark brand
Copy the layout approach from the landing page's dark theme

## Phase 7 - Update CI/CD

### 7.1 Update .github/workflows/ci-cd.yml
Change from:
```yaml
- run: npm ci
- run: npm run build
- run: npm run deploy
```
To:
```yaml
- uses: pnpm/action-setup@v4
  with:
    version: 10
- run: pnpm install
- run: pnpm build
- run: pnpm deploy:heritage
- run: pnpm deploy:database
```

## Phase 8 - Verify

### 8.1 Install dependencies
```
pnpm install
```

### 8.2 Build everything
```
pnpm build
```

### 8.3 Test heritage app
```
cd apps/heritage && pnpm dev
```
Check: localhost:3000

### 8.4 Test database app
```
cd apps/database && pnpm dev
```
Check: localhost:3001
