# Enterprise React Boilerplate - Implementation Plan

Build a production-ready React 19 enterprise front-end boilerplate with Vite, TanStack Router, TanStack Query, MUI v7, Zustand, i18n (with RTL support), and a comprehensive RBAC system.

## Proposed Changes

### 1. Project Scaffolding & Configuration

#### [NEW] Package setup with Vite

```bash
# Initialize with Vite React + TypeScript template
pnpm create vite@latest ./ --template react-ts

# Core dependencies
pnpm add @mui/material @emotion/react @emotion/styled @tanstack/react-router @tanstack/react-query zustand react-i18next i18next i18next-browser-languagedetector axios

# Dev dependencies
pnpm add -D @vitejs/plugin-react eslint @eslint/js typescript-eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y eslint-plugin-import eslint-config-prettier prettier babel-plugin-react-compiler
```

#### [NEW] [vite.config.ts](../vite.config.ts)

Configure Vite with React Compiler plugin for React 19 optimizations.

#### [NEW] [eslint.config.js](../eslint.config.js)

ESLint 9 flat config with:

- TypeScript support via `typescript-eslint`
- React + JSX rules
- Import ordering rules
- Accessibility rules (jsx-a11y)
- Prettier integration

#### [MODIFY] [tsconfig.json](../tsconfig.json)

Enable strict mode and configure path aliases for clean imports.

---

### 2. Folder Structure

```
src/
├── app/                     # App shell & providers
│   ├── App.tsx              # Main app component
│   ├── providers/           # Context providers
│   │   ├── QueryProvider.tsx
│   │   ├── ThemeProvider.tsx  # With RTL support
│   │   └── I18nProvider.tsx
│   └── router/              # Router configuration
│       ├── index.ts         # Main router entry
│       ├── layouts.ts       # Layout route definitions
│       ├── appRoutes.ts     # Feature routes aggregation
│       ├── routeGuard.ts    # RBAC protection logic
│       └── utils.ts         # Navigation utilities
├── features/                # Domain features
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── pages/
│   ├── dashboard/
│   │   ├── components/
│   │   └── pages/
│   ├── users/               # [NEW] Users feature
│   │   ├── pages/
│   │   │   ├── UsersListPage.tsx
│   │   │   └── UserProfilePage.tsx
│   │   └── usersRoutes.ts
│   └── admin/
│       ├── components/
│       └── pages/
├── shared/                  # Shared components & hooks
│   ├── components/
│   │   ├── layouts/
│   │   └── ui/
│   │       └── LocaleSwitcher.tsx
│   │       └── AppLink.tsx         # [NEW] Smart Link component
│   └── hooks/
│       └── useAppNavigate.ts       # [NEW] Navigation hook
├── stores/                  # Zustand stores
│   ├── authStore.ts
│   └── preferencesStore.ts
├── lib/                     # Cross-cutting infrastructure
│   ├── rbac/                # RBAC utilities
│   │   ├── types.ts
│   │   ├── guards.ts
│   │   └── components.tsx
│   ├── i18n/                # i18n configuration
│   │   ├── config.ts
│   │   └── locales/
│   │       ├── en.json
│   │       └── ar.json
│   └── api/                 # Centralized API layer
│       ├── client.ts        # Axios instance with interceptors
│       ├── query-client.ts  # TanStack Query client config
│       └── query-keys.ts    # Query key factory
└── config/                  # Global configuration
    └── constants.ts
```

---

### 2b. Centralized API & Query Pattern

#### [NEW] [src/lib/api/client.ts](../src/lib/api/client.ts)

Axios instance with:

- Base URL from environment
- Request/response interceptors for auth token
- Error handling (401 → logout)

#### [NEW] [src/lib/api/query-keys.ts](../src/lib/api/query-keys.ts)

Type-safe query key factory:

```typescript
export const queryKeys = {
  users: {
    all: ["users"] as const,
    list: (filters?: UserFilters) =>
      [...queryKeys.users.all, "list", filters] as const,
    detail: (id: string) => [...queryKeys.users.all, "detail", id] as const,
  },
  dashboard: {
    stats: ["dashboard", "stats"] as const,
  },
} as const;
```

#### Centralized Queries & Mutations

All queries and mutations live in `src/lib/api/` for cross-feature reusability:

```
src/lib/api/
├── client.ts         # Axios instance
├── query-client.ts   # TanStack Query config
├── query-keys.ts     # Query key factory
├── queries/          # All query hooks
│   ├── useUsers.ts
│   ├── useDashboardStats.ts
│   └── index.ts      # Re-exports
└── mutations/        # All mutation hooks
    ├── useLogin.ts
    ├── useCreateUser.ts
    └── index.ts
```

Example:

```typescript
// src/lib/api/queries/useUsers.ts
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../client";
import { queryKeys } from "../query-keys";

export const useUsers = (filters?: UserFilters) =>
  useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: () => apiClient.get<User[]>("/users", { params: filters }),
  });

// Usage in any feature
import { useUsers } from "@/lib/api/queries";
```

> [!TIP]
> This approach maximizes reusability - the same query can be used in admin, reports, or any other feature.

---

### 3. RBAC System Implementation

#### [NEW] [src/lib/rbac/types.ts](../src/lib/rbac/types.ts)

Core RBAC type definitions:

```typescript
type UserRole = "GUEST" | "USER" | "MANAGER" | "ADMIN";

type Permission =
  | "view:dashboard"
  | "view:admin"
  | "manage:users"
  | "manage:settings";

interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
}

interface RBACMeta {
  requiresAuth?: boolean;
  allowedRoles?: UserRole[];
  requiredPermissions?: Permission[];
}
```

#### [NEW] [src/lib/rbac/guards.ts](../src/lib/rbac/guards.ts)

Central RBAC evaluation logic:

- `canAccess(user, meta)` - Single source of truth for access checks
- `checkRoles(user, allowedRoles)` - Role-based check
- `checkPermissions(user, requiredPermissions)` - Permission-based check

#### [NEW] [src/lib/rbac/components.tsx](../src/lib/rbac/components.tsx)

Component-level RBAC wrappers:

- `<RequireAuth>` - Wraps content requiring authentication
- `<IfAllowed roles={} permissions={}>` - Conditionally renders based on RBAC

---

### 4. TanStack Router Setup

#### [NEW] [src/app/router/router.tsx](../src/app/router/router.tsx)

Router configuration with:

- Route tree definition
- Global `beforeLoad` hook for auth checks
- Route meta with RBAC configuration

#### Route Structure

```
/                         → Redirect to /{lang}/login
/$lang/login              → Public (PublicLayout)
/$lang/app                → Protected (AppLayout, requiresAuth: true)
  /$lang/app/dashboard    → USER+ roles
  /$lang/app/users        → Filter list with params (e.g. ?role=ADMIN)
  /$lang/app/users/$id    → Dynamic User Profile
  /$lang/app/admin        → ADMIN only
/$lang/forbidden          → 403 page
```

#### [NEW] [src/shared/components/layouts/PublicLayout.tsx](../src/shared/components/layouts/PublicLayout.tsx)

Clean layout for public pages (login, etc.)

#### [NEW] [src/shared/components/layouts/AppLayout.tsx](../src/shared/components/layouts/AppLayout.tsx)

Authentic layout with header, sidebar, and main content area.
Uses `AppLink` for navigation to preserve language state.
Uses `useAppNavigate` for imperative navigation.

#### [NEW] [src/shared/components/ui/AppLink.tsx](../src/shared/components/ui/AppLink.tsx)

Smart link component that automatically injects the current language into the `to` params.

#### [NEW] [src/shared/hooks/useAppNavigate.ts](../src/shared/hooks/useAppNavigate.ts)

Hook for imperative navigation that handles language params automatically.

#### [NEW] [src/app/router/utils.ts](../src/app/router/utils.ts)

`appRedirect` utility for use in `beforeLoad` route guards.

---

### 5. Zustand State Management

#### [NEW] [src/stores/authStore.ts](../src/stores/authStore.ts)

Auth state with Zustand:

```typescript
interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}
```

#### [NEW] [src/stores/preferencesStore.ts](../src/stores/preferencesStore.ts)

User preferences (persisted to localStorage):

```typescript
interface PreferencesState {
  locale: "en" | "ar";
  direction: "ltr" | "rtl";
  themeMode: "light" | "dark";
  setLocale: (locale: "en" | "ar") => void;
  toggleTheme: () => void;
}
```

---

### 6. i18n & RTL Support

#### [NEW] [src/lib/i18n/config.ts](../src/lib/i18n/config.ts)

react-i18next configuration:

- Namespace support for feature-based translations
- Language detection from browser/localStorage
- Fallback to English

#### [NEW] [src/lib/i18n/locales/en.json](../src/lib/i18n/locales/en.json) / [ar.json](../src/lib/i18n/locales/ar.json)

Translation files with namespaced keys.

#### [NEW] [src/app/providers/ThemeProvider.tsx](../src/app/providers/ThemeProvider.tsx)

MUI theme with RTL support:

- Sets theme `direction` property based on current locale
- MUI v7 handles RTL transformations natively
- Syncs with preferences store
- Updates document direction attribute

#### [NEW] [src/shared/components/ui/LocaleSwitcher.tsx](../src/shared/components/ui/LocaleSwitcher.tsx)

Dropdown to switch locale, updates:

- i18next language
- Document direction (`dir` attribute)
- Preferences store

---

### 7. Auth Feature

#### [NEW] [src/features/auth/pages/LoginPage.tsx](../src/features/auth/pages/LoginPage.tsx)

- Mock login form with email/password
- Uses TanStack Query mutation for mock auth call
- Redirects to `/app/dashboard` on success

---

### 8. Example Pages

#### [NEW] [src/features/dashboard/pages/DashboardPage.tsx](../src/features/dashboard/pages/DashboardPage.tsx)

Basic dashboard visible to `USER`+ roles.

#### [NEW] [src/features/admin/pages/AdminPage.tsx](../src/features/admin/pages/AdminPage.tsx)

Admin page with:

- Only visible to `ADMIN` role
- Contains button visible only if user has `manage:users` permission

#### [NEW] [src/features/forbidden/ForbiddenPage.tsx](../src/features/forbidden/ForbiddenPage.tsx)

403 Forbidden page for unauthorized access.

---

### 9. App Entry & Providers

#### [NEW] [src/app/App.tsx](../src/app/App.tsx)

Main app wiring:

- I18nProvider (react-i18next)
- TanStack QueryClientProvider
- ThemeProvider (MUI + RTL emotion cache)
- TanStack RouterProvider

#### [NEW] [src/lib/api/query-client.ts](../src/lib/api/query-client.ts)

TanStack Query client configuration.

---

## Verification Plan

### Automated Verification

```bash
# 1. Dev server starts successfully
pnpm dev
# Expected: Server starts on localhost:5173

# 2. Production build completes
pnpm build
# Expected: Build succeeds with no errors

# 3. Type checking passes
pnpm tsc --noEmit
# Expected: No TypeScript errors

# 4. Linting passes
pnpm lint
# Expected: No ESLint errors
```

### Manual Verification (Browser Testing)

1. **Auth Flow**
   - Navigate to `http://localhost:5173`
   - Should redirect to `/en/login` (or default lang)
   - Enter mock credentials and submit
   - Should redirect to `/en/app/dashboard`

2. **RBAC Route Protection**
   - Login as a `USER` role user
   - Navigate to `/app/admin`
   - Should redirect to `/forbidden` (403)
   - Login as `ADMIN` role user
   - Navigate to `/app/admin`
   - Should display admin page

3. **RBAC Component Protection**
   - Login as `ADMIN` without `manage:users` permission
   - "Manage Users" button should be hidden
   - Login as `ADMIN` with `manage:users` permission
   - "Manage Users" button should be visible

4. **i18n & RTL**
   - Switch locale to Arabic using LocaleSwitcher
   - URL should update to `/ar/...`
   - Layout should flip to RTL
   - All text should display in Arabic
   - Switch back to English, URL updates to `/en/...`, layout returns to LTR

---

## Extension Guide

### Adding a New Feature Route with RBAC

1. Create feature folder: `src/features/[feature-name]/`
2. Add page component: `src/features/[feature-name]/pages/FeaturePage.tsx`
3. Add route in `src/app/router/routes/`:

```typescript
import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage } from "@/features/feature-name/pages/FeaturePage";

export const Route = createFileRoute("/app/feature-name")({
  meta: {
    requiresAuth: true,
    allowedRoles: ["USER", "ADMIN"],
    requiredPermissions: ["view:feature"],
  },
  component: FeaturePage,
});
```

### Adding a New Permission

1. Add to `Permission` type in `src/lib/rbac/types.ts`:

```typescript
type Permission = "view:dashboard" | "view:new-feature"; // Add new permission
// ...
```

2. Use in route meta or component:

```tsx
<IfAllowed permissions={["view:new-feature"]}>
  <ProtectedContent />
</IfAllowed>
```
