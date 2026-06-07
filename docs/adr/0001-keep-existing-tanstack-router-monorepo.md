# ADR 0001: Keep existing TanStack Router and pnpm monorepo

- Status: Accepted
- Date: 2026-06-07
- Context: Frontend-only project management dashboard prototype

## Context

`PROJECT.md` recommends React Router, Vite, React, TypeScript, and a single-app Vite project. The repository is already a Better-T-Stack pnpm monorepo with a `web` app that uses TanStack Router, Tailwind v4, and a shared `packages/ui` package.

The existing setup already supports everything the prototype needs: file-based routing, TypeScript, shared UI primitives, and Tailwind v4. Replacing the router and unwrapping the monorepo would add substantial churn without improving the stakeholder demo.

## Decision

Preserve the existing pnpm monorepo and use TanStack Router for the prototype instead of switching to React Router.

- Keep `apps/web` as the React/Vite/TanStack Router app.
- Keep `packages/ui` for shared UI primitives.
- Add Recharts to the web app for dashboard and budget charts.
- Use the corporate light palette from `PROJECT.md` over the existing neutral tokens.

## Consequences

- Routes are written as files under `apps/web/src/routes`. `routeTree.gen.ts` is generated and must not be edited manually.
- Navigation guards, role-based access denial, and redirects rely on TanStack Router's `beforeLoad` and route context.
- Future contributors should look at existing route files in `apps/web/src/routes` for the pattern.
- We are not introducing React Router data APIs; route data is loaded through local React state and selectors.
