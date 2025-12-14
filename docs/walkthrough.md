# Enterprise React Boilerplate - Walkthrough

## Overview

Successfully created a production-ready React 19 enterprise front-end boilerplate with comprehensive features for large-scale applications.

## Tech Stack

### Core

- **React 19** with TypeScript (strict mode)
- **Vite 7** with React Compiler for optimizations
- **pnpm** for package management

### UI & Styling

- **MUI v7** as the component library
- **Emotion** for CSS-in-JS with RTL support
- Responsive layouts with mobile-first approach

### Routing & Data

- **TanStack Router** with file-based routing
- **TanStack Query v5** for server state management
- Centralized API layer with Axios

### State Management

- **Zustand** for client state (auth, preferences)
- Persisted preferences to localStorage

### Internationalization

- **react-i18next** with namespace support
- English and Arabic translations
- **RTL support** with automatic direction switching
- Emotion cache swapping for RTL layouts

### Code Quality

- **ESLint 9** (flat config) with TypeScript, React, Accessibility, and Import rules
- **Prettier** integration
- TypeScript strict mode enabled

---

## Folder Structure

```
src/
├── app/                      # App shell & providers
│   ├── App.tsx               # Main app component
│   ├── providers/            # Provider components
│   │   └── ThemeProvider.tsx # MUI theme with RTL support
│   └── router/               # Router configuration
│       └── router.tsx        # Route definitions with RBAC
├── features/                 # Domain features
│   ├── auth/                 # Authentication feature
│   │   └── pages/LoginPage.tsx
│   ├── dashboard/            # Dashboard feature
│   │   └── pages/DashboardPage.tsx
│   ├── admin/                # Admin feature
│   │   └── pages/AdminPage.tsx
│   └── forbidden/            # 403 page
│       └── ForbiddenPage.tsx
├── shared/                   # Shared components
│   └── components/
│       ├── layouts/          # Layout components
│       │   ├── PublicLayout.tsx
│       │   └── AppLayout.tsx
│       └── ui/               # Reusable UI components
│           └── LocaleSwitcher.tsx
├── stores/                   # Zustand stores
│   ├── authStore.ts          # Authentication state
│   └── preferencesStore.ts   # User preferences (theme, locale, direction)
├── lib/                      # Cross-cutting infrastructure
│   ├── rbac/                 # RBAC system
│   │   ├── types.ts          # Role & permission types
│   │   ├── guards.ts         # Access evaluation logic
│   │   └── components.tsx    # RBAC UI components
│   ├── i18n/                 # Internationalization
│   │   ├── config.ts         # i18next configuration
│   │   └── locales/          # Translation files
│   │       ├── en.json
│   │       └── ar.json
│   └── api/                  # Centralized API layer
│       ├── client.ts         # Axios instance with interceptors
│       ├── query-client.ts   # TanStack Query config
│       ├── query-keys.ts     # Type-safe query key factory
│       ├── queries/          # All query hooks
│       └── mutations/        # All mutation hooks
└── config/                   # Global configuration
    └── constants.ts          # App constants
```

---

## Key Features

### 1. RBAC System

#### Architecture

- **Single source of truth** for access control logic in [src/lib/rbac/guards.ts](file:///home/m/Projects/tan-react-stack/src/lib/rbac/guards.ts)
- Type-safe roles and permissions
- Reusable at both route and component levels

#### Usage

**Route-level protection:**

```typescript
const adminRoute = createRoute({
  path: "/admin",
  beforeLoad: () => {
    const { user } = useAuthStore.getState();
    if (!canAccess(user, { allowedRoles: ["ADMIN"] })) {
      throw redirect({ to: "/forbidden" });
    }
  },
});
```

**Component-level protection:**

```tsx
<IfAllowed permissions={["manage:users"]}>
  <Button>Manage Users</Button>
</IfAllowed>
```

#### Roles & Permissions

- **Roles**: `GUEST`, `USER`, `MANAGER`, `ADMIN`
- **Permissions**: `view:dashboard`, `view:admin`, `manage:users`, `manage:settings`
- Easily extendable in [src/lib/rbac/types.ts](file:///home/m/Projects/tan-react-stack/src/lib/rbac/types.ts)

---

### 2. Internationalization & RTL

#### Features

- Language detection from browser/localStorage
- Namespace-based translations for feature isolation
- Automatic RTL layout switching for Arabic
- MUI theme direction synchronization

#### Locale Switcher

Located in header - switches between English (LTR) and Arabic (RTL)

#### Adding Translations

1. Add keys to [src/lib/i18n/locales/en.json](file:///home/m/Projects/tan-react-stack/src/lib/i18n/locales/en.json) and [ar.json](file:///home/m/Projects/tan-react-stack/src/lib/i18n/locales/ar.json)
2. Use in components: `const { t } = useTranslation(); t('key')`

---

### 3. Centralized API Layer

#### Structure

All queries and mutations are centralized in `src/lib/api/`:

- **client.ts**: Axios instance with auth token injection and 401 handling
- **query-keys.ts**: Type-safe query key factory
- **queries/**: All query hooks (e.g., `useDashboardStats`)
- **mutations/**: All mutation hooks (e.g., `useLogin`, `useLogout`)

#### Benefits

- **DRY**: Reuse queries across features
- **Type-safe**: Query keys are strongly typed
- **Consistent**: Single auth interceptor for all requests

---

### 4. State Management

#### Zustand Stores

**Auth Store** (`src/stores/authStore.ts`):

- Current user state
- `login()` / `logout()` methods
- Token management

**Preferences Store** (`src/stores/preferencesStore.ts`):

- Locale, direction, theme mode
- Persisted to localStorage
- Synced with MUI theme and i18n

---

## Running the Application

### Development

```bash
pnpm install
pnpm dev
```

Server starts at `http://localhost:5173`

### Production Build

```bash
pnpm build
```

### Type Checking

```bash
pnpm tsc --noEmit
```

### Linting

```bash
pnpm lint
```

---

## Testing the Application

### Mock Credentials

- **Regular User**: `user@example.com` (any password)
  - Access: Dashboard only
- **Admin User**: `admin@example.com` (any password)
  - Access: Dashboard + Admin panel
  - Permissions: All permissions including `manage:users`

### Test Scenarios

**1. Authentication Flow**

1. Navigate to `/`
2. Redirects to `/login`
3. Enter `user@example.com`
4. Redirects to `/app/dashboard`

**2. RBAC Route Protection**

1. Login as `user@example.com`
2. Try navigating to `/app/admin`
3. Redirected to `/forbidden` (403)
4. Logout and login as `admin@example.com`
5. Navigate to `/app/admin` - access granted

**3. RBAC Component Protection**

1. Login as `admin@example.com`
2. Go to `/app/admin`
3. "Manage Users" button is visible (has `manage:users` permission)

**4. i18n & RTL**

1. Click language switcher in header
2. Select "العربية" (Arabic)
3. Layout flips to RTL
4. All text displays in Arabic
5. Switch back to English - layout returns to LTR

---

## Extending the Application

### Adding a New Feature

1. **Create feature folder:**

   ```
   src/features/my-feature/
   ├── pages/
   ├── components/
   └── hooks/
   ```

2. **Add route:**

   ```typescript
   // src/app/router/router.tsx
   const myFeatureRoute = createRoute({
     getParentRoute: () => appRoute,
     path: "/my-feature",
     component: MyFeaturePage,
     beforeLoad: () => {
       const { user } = useAuthStore.getState();
       if (!canAccess(user, { allowedRoles: ["USER", "ADMIN"] })) {
         throw redirect({ to: "/forbidden" });
       }
     },
   });
   ```

3. **Add to route tree:**
   ```typescript
   appRoute.addChildren([dashboardRoute, adminRoute, myFeatureRoute]);
   ```

### Adding a New Permission

1. **Update types:**

   ```typescript
   // src/lib/rbac/types.ts
   type Permission = "view:dashboard" | "my:new:permission"; // Add here
   // ...
   ```

2. **Use in components:**
   ```tsx
   <IfAllowed permissions={["my:new:permission"]}>
     <ProtectedFeature />
   </IfAllowed>
   ```

### Adding a New Query

1. **Add query key:**

   ```typescript
   // src/lib/api/query-keys.ts
   export const queryKeys = {
     myResource: {
       all: ["myResource"] as const,
       list: () => [...queryKeys.myResource.all, "list"] as const,
     },
   };
   ```

2. **Create query hook:**

   ```typescript
   // src/lib/api/queries/useMyResource.ts
   export const useMyResource = () => {
     return useQuery({
       queryKey: queryKeys.myResource.list(),
       queryFn: () => apiClient.get("/my-resource"),
     });
   };
   ```

3. **Export from index:**
   ```typescript
   // src/lib/api/queries/index.ts
   export { useMyResource } from "./useMyResource";
   ```

---

## Code Splitting & Performance

### Lazy Loading Implementation

All route components are lazy-loaded for optimal bundle splitting:

```typescript
// routes.config.ts
import { lazy } from "react";

const DashboardPage = lazy(() =>
  import("@/features/dashboard/pages/DashboardPage").then((m) => ({
    default: m.DashboardPage,
  })),
);
```

### Bundle Size Results

**Before lazy loading:**

- Main bundle: 613 KB (192 KB gzipped)

**After lazy loading:**

- Main bundle: 600 KB (188 KB gzipped) ✅ **13 KB reduction**
- AdminPage chunk: 1.2 KB (loaded on demand)
- DashboardPage chunk: 14 KB (loaded on demand)

### Benefits

- ✅ **Faster initial load** - 13 KB smaller main bundle
- ✅ **Route-based splitting** - Pages load only when visited
- ✅ **Better caching** - Route chunks cached separately
- ✅ **Automatic** - Feature generator creates lazy imports

See [docs/code-splitting.md](file:///home/m/Projects/tan-react-stack/docs/code-splitting.md) for details.

---

## Verification Results

✅ **Dev server**: Started successfully on `http://localhost:5173`  
✅ **TypeScript**: No errors (`pnpm tsc --noEmit`)  
✅ **Production build**: Completed successfully  
✅ **Bundle size**: 626 KB (197 KB gzipped)

---

## Next Steps

1. **Replace mock auth** with real API endpoints in `src/lib/api/mutations/useAuth.ts`
2. **Add API base URL** to environment variables
3. **Implement real data fetching** in query hooks
4. **Add more translations** for additional features
5. **Configure code splitting** to reduce bundle size
6. **Add unit tests** with Vitest
7. **Set up CI/CD** pipeline

---

## Architecture Highlights

### Design Principles Applied

- **KISS**: Simple, straightforward abstractions
- **DRY**: Centralized API layer, reusable RBAC logic
- **SOLID**:
  - Single Responsibility: Each module has one clear purpose
  - Open/Closed: Easy to extend (new roles, permissions, features)
- **YAGNI**: No unnecessary abstractions or premature optimization

### Scalability

- **Feature-first structure**: Easy to add new domains
- **Centralized infrastructure**: Shared API, RBAC, i18n
- **Type safety**: Catch errors at compile time
- **Modular**: Features are isolated and independent
