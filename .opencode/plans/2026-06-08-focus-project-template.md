# Focus the prototype on Project and Template

## Goal

Tighten the prototype to the deepest flows (Project and Project Template) and remove friction around authentication, navigation, and broken dropdown interactions.

## Decisions

1. **Auth flow**:
   - `/` always redirects to `/login`.
   - Any protected route (`/dashboard`, `/projects`, `/templates`, `/approvals`) redirects to `/login` in `beforeLoad` when no current user is set.
   - "Not signed in" guard message in `__root.tsx` becomes unreachable; remove it.
2. **Seed users**: Keep only 2 demo users — Holding Admin (full scope) and Project Owner (scoped to a couple of projects).
3. **Seed projects**: Reduce from 20 to 8 — two per subholding, one mid-stage and one early/late to keep charts interesting.
4. **Seed templates**: Reduce from 5 to 3 — Infrastructure Development Project, IT System Implementation, Facility Renovation.
5. **Sidebar**: Hide Subholdings, Budget Monitoring, Reports, Users, Settings from the menu (route shells remain for direct URL access but show a short "Out of focus" stub).
6. **Header user menu**: Replace the Base UI `DropdownMenuTrigger render` pattern with a plain `<Button>` that toggles a Card-based menu to fix the `Something went wrong` error.
7. **Trimmed pages** (Dashboard, Budget Monitoring, Reports, Users, Settings): Reduce to short read-only summaries with one or two cards each, pointing at the deep flows.

## Critical files

- Modify: `apps/web/src/routes/__root.tsx` (auth guard + redirect).
- Modify: `apps/web/src/routes/index.tsx` (redirect to `/login`).
- Modify: `apps/web/src/data/seed.ts` (2 users, 3 templates, 8 projects, 5 subholdings).
- Modify: `apps/web/src/lib/permissions.ts` (menu key list; hide subholdings/budget/reports/users/settings).
- Modify: `apps/web/src/components/layout/sidebar.tsx` (drop hidden items).
- Modify: `apps/web/src/components/layout/topbar.tsx` (replace `DropdownMenuTrigger render` with onClick + Card menu).
- Modify: `apps/web/src/routes/dashboard.tsx` (trim to summary).
- Modify: `apps/web/src/routes/budget-monitoring.index.tsx` (replace with stub).
- Modify: `apps/web/src/routes/reports.index.tsx` (replace with stub).
- Modify: `apps/web/src/routes/users.index.tsx` (replace with stub).
- Modify: `apps/web/src/routes/settings.index.tsx` (replace with stub).
- Modify: `apps/web/src/routes/dashboard.tsx` (default redirect to /login via beforeLoad).
- Modify: `apps/web/src/routes/login.tsx` (filter chips become a no-op; show only 2 cards).

## Tasks

### 1. Auth redirect
- In `routes/__root.tsx` keep the outlet for `/login`, but otherwise check `getCurrentUser(state)`; if no user, throw `redirect({ to: "/login" })`.
- In `routes/index.tsx`, redirect to `/login`.
- In `routes/dashboard.tsx`, add `beforeLoad` that throws `redirect({ to: "/login" })` when no current user.
- Verify the same for `/projects`, `/templates`, `/approvals`, `/projects/new`, `/projects/$projectId`, `/templates/new`, `/templates/$templateId/edit`.

### 2. Seed data
- Reduce users to 2 (Holding Admin and Project Owner).
- Reduce templates to 3.
- Reduce projects to 8.
- Keep subholdings at 5.
- Re-balance approval requests so Project Owner has at least one pending approval and Holding Admin's queue is empty.
- Update `userIds` references on projects.

### 3. Permissions and sidebar
- `menuByRole` keeps both roles' visible items: `dashboard`, `projects`, `approvals`, plus `templates` and `projects/new` for Holding Admin.
- Remove `subholdings`, `budget-monitoring`, `reports`, `users`, `settings` from `menuByRole`.
- Sidebar renders only the filtered list.
- `canAccessRoute` for hidden routes: still return allowed = true so direct URLs work but the menu doesn't show them; if the user lands there, show a "This module is out of focus" stub.

### 4. Header user menu
- Replace `DropdownMenuTrigger render={...}` with `<DropdownMenuTrigger>` using a plain `<button>` child, or fall back to a custom onClick toggle.
- If Base UI keeps failing, replace the entire menu with a simple `<div>` popover built from Card primitives; both options are quick to swap.

### 5. Trimmed pages
- Dashboard: one card with "Project focus" and two CTAs to Projects and Templates.
- Budget Monitoring, Reports, Users, Settings: one "Out of focus for the prototype" card with a link back to Projects.

### 6. Login page
- With only 2 users, drop the role filter chips; show the 2 user cards directly.
- Reduce seeded users to 2, keep search field for visual consistency.

## Verification

- `pnpm check-types` and `pnpm build` succeed.
- `pnpm dev:web` then:
  - `/` lands on `/login`.
  - `/dashboard` while signed out lands on `/login`.
  - Sign in as Holding Admin, see Dashboard, Templates, Projects, Approvals in sidebar. Subholdings/Budget/Reports/Users/Settings are not in the menu.
  - Templates list shows 3 templates; Projects list shows 8 projects; project detail and approval flow still work.
  - Click the user avatar in the header — no `Something went wrong` error; menu opens and Sign out works.
  - Sign in as Project Owner, scoped data shows only assigned projects and approvals.
