# project-management-mockup

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines React, TanStack Router, and more.

## Pratama Company PMO Prototype

A frontend-only project management and budget monitoring dashboard for a company. The prototype uses mock data persisted in `localStorage` so stakeholders can click through the full flow and see scoped role-based behaviour.

### Demo personas

The login page lists named demo users that cover every role: Company Admin, Company Executive, Finance Controller, Department Admin, Project Owner, Approver, and Viewer. Pick any card to sign in.

### Deepest flows

- **Project Templates**: Company Admin can create, edit, duplicate, and archive global templates. Each template has dynamic milestones, steps, attachment requirements, completion criteria, default approver role, and risk checklist.
- **Project Wizard**: Five-step wizard (department and template, project details, budget and team, review generated milestones, save or submit) that snapshots the template into a project.
- **Project Detail**: Tabs for Overview, Budget, Milestones, Approvals, Attachments, and Activity Log. Step completion rolls up into milestone and project progress.
- **Approvals**: Project and milestone approval requests are interactive for the assigned approver. Rejection and revision flows change milestone/project state.

### Supporting modules

- Dashboard with company-wide and per-department metrics and Recharts visualisations.
- Department list and detail pages with portfolio rollups.
- Budget Monitoring page with real Recharts, utilization, variance, and over-budget tracking.
- Reports, Users, and Settings are presentational but cover the spec.

## Features

- **TypeScript** - For type safety and improved developer experience
- **TanStack Router** - File-based routing with full type safety
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **Shared UI package** - shadcn/ui primitives live in `packages/ui`
- **Turborepo** - Optimized monorepo build system
- **Recharts** - Dashboard and budget-monitoring charts
- **Mock auth + localStorage** - Frontend-only state, persists across reloads

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.

## Project Structure

```
project-management-mockup/
├── apps/
│   ├── web/         # Frontend application (React + TanStack Router)
├── packages/
│   ├── ui/          # Shared shadcn/ui components and styles
├── CONTEXT.md       # Domain glossary
├── docs/adr/        # Architecture decision records
└── PROJECT.md       # Original spec
```

## Documentation

- `CONTEXT.md` - Glossary of holding, subholding, project, template, approval, and related terms.
- `docs/adr/0001-keep-existing-tanstack-router-monorepo.md` - Why the prototype preserves the existing stack instead of switching to React Router.

## Available Scripts

- `pnpm run dev`: Start all applications in development mode
- `pnpm run build`: Build all applications
- `pnpm run dev:web`: Start only the web application
- `pnpm run check-types`: Check TypeScript types across all apps

## UI Customization

React web apps in this stack share shadcn/ui primitives through `packages/ui`.

- Change design tokens and global styles in `packages/ui/src/styles/globals.css`
- Update shared primitives in `packages/ui/src/components/*`
- Adjust shadcn aliases or style config in `packages/ui/components.json` and `apps/web/components.json`
