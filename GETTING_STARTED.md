# Getting Started Guide

Welcome to the Enterprise React 19 Boilerplate! This guide will help you get up and running quickly.

## Prerequisites

- **Node.js** 18+
- **pnpm** 8+ (Install: `npm install -g pnpm`)
- **Git**

## Installation

```bash
# Clone or download the project
cd tan-react-stack

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will open at `http://localhost:5173`

## First Steps

### 1. Test the Application

**Login with test credentials:**

- User: `user@example.com` (password: anything)
- Admin: `admin@example.com` (password: anything)

**Try these features:**

- ✅ Navigate between Dashboard and Admin (if admin)
- ✅ Switch language to Arabic - watch RTL layout flip
- ✅ Toggle dark/light mode
- ✅ Open DevTools (floating buttons)

### 2. Explore the Code

**Key files to understand:**

```
src/
├── app/
      ├── index.ts               # App entry with providers
      └── router/
          ├── index.ts           # Main router & Public routes
          └── appRoutes.ts # ⭐ App routes collection
├── features/
│   ├── dashboard/             # Example feature
│   └── admin/                 # Example feature
├── stores/
│   ├── authStore.ts           # Auth state
│   └── preferencesStore.ts    # Theme/locale state
└── lib/
    ├── rbac/                  # Access control
    ├── i18n/                  # Translations
    └── api/                   # API layer
```

### 3. Create Your First Feature

```bash
pnpm generate:feature
```

Follow the prompts:

1. Feature name: "My Feature"
2. Route path: "/my-feature"
3. Component name: "MyFeaturePage"
4. Select roles: USER, ADMIN
5. Select permissions: (optional)

**Generated files:**

```
src/features/my-feature/
├── pages/
│   ├── MyFeaturePage.tsx  ✅ Created
│   └── index.ts           ✅ Created
├── components/            ✅ Empty folder
└── hooks/                 ✅ Empty folder

src/app/router/appRoutes.ts  ✅ Updated
```

**Access your feature:**

- Navigate to `/app/my-feature`
- Edit `src/features/my-feature/pages/MyFeaturePage.tsx`

## Common Tasks

### Add a New Route

**Option 1: Use CLI (Recommended)**

```bash
pnpm generate:feature
```

**Option 2: Manual**

1. Create feature folder
1. Create feature folder and routes file: `src/features/my-feature/myFeatureRoutes.ts`
1. Define the route using `lazyRouteComponent`:

```typescript
import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { appRoute } from "@/app/router/layouts";
import { RouteGuard } from "@/app/router/routeGuard";

const myRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "my-feature",
  component: lazyRouteComponent(() =>
    import("./pages/MyFeaturePage").then((m) => ({ default: m.MyFeaturePage })),
  ),
  beforeLoad: () => RouteGuard({ roles: ["USER", "ADMIN"] }),
});

export const myFeatureRoutes = [myRoute] as const;
```

3. Add to `src/app/router/appRoutes.ts`:

```typescript
import { myFeatureRoutes } from "@/features/my-feature/myFeatureRoutes";

export const appRoutes = [
  ...dashboardRoutes,
  ...adminRoutes,
  ...myFeatureRoutes,
] as const;
```

### Add a Translation

1. Edit `src/lib/i18n/locales/en.json`:

```json
{
  "myFeature": {
    "title": "My Feature",
    "description": "Welcome!"
  }
}
```

2. Edit `src/lib/i18n/locales/ar.json`:

```json
{
  "myFeature": {
    "title": "ميزتي",
    "description": "مرحباً!"
  }
}
```

3. Use in component:

```typescript
const { t } = useTranslation();
<Typography>{t('myFeature.title')}</Typography>
```

### Add a New Permission

1. Edit `src/lib/rbac/types.ts`:

```typescript
export type Permission = "view:dashboard" | "my:new:permission"; // Add here
```

2. Use in routes:

```typescript
{
  path: '/protected',
  component: ProtectedPage,
  permissions: ['my:new:permission'],
}
```

3. Use in components:

```tsx
<IfAllowed permissions={["my:new:permission"]}>
  <ProtectedButton />
</IfAllowed>
```

### Add an API Query

1. Create query hook in `src/lib/api/queries/`:

```typescript
// useMyData.ts
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../client";
import { queryKeys } from "../query-keys";

export const useMyData = () => {
  return useQuery({
    queryKey: queryKeys.myData.all,
    queryFn: () => apiClient.get("/my-endpoint"),
  });
};
```

2. Add query key:

```typescript
// query-keys.ts
export const queryKeys = {
  myData: {
    all: ["myData"] as const,
  },
};
```

3. Export from index:

```typescript
// queries/index.ts
export { useMyData } from "./useMyData";
```

4. Use in component:

```typescript
import { useMyData } from "@/lib/api/queries";

const { data, isLoading } = useMyData();
```

### Customize Theme

Edit `src/app/providers/ThemeProvider.tsx`:

```typescript
createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Change primary color
    },
    secondary: {
      main: "#9c27b0", // Change secondary color
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});
```

### Configure API Base URL

Create `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
```

Or edit `src/config/constants.ts`:

```typescript
export const APP_CONFIG = {
  apiBaseUrl: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
};
```

## Development Workflow

### 1. Start Dev Server

```bash
pnpm dev
```

### 2. Make Changes

- Edit files in `src/`
- Hot reload automatically updates

### 3. Check Types

```bash
pnpm tsc --noEmit
```

### 4. Lint Code

```bash
pnpm lint
```

### 5. Build for Production

```bash
pnpm build
```

### 6. Preview Build

```bash
pnpm preview
```

## Project Scripts

```bash
# Development
pnpm dev              # Start dev server with HMR
pnpm dev --host       # Expose on network

# Build
pnpm build            # Production build
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run ESLint
pnpm tsc --noEmit     # Type check

# Generators
pnpm generate:feature # Create new feature
```

## DevTools

### React Query Devtools

- Click floating button (bottom-left)
- View all queries and mutations
- Inspect cache
- Trigger refetch

### TanStack Router Devtools

- Click floating button (bottom-right)
- View route tree
- Inspect params
- Debug navigation

## Tips & Best Practices

### ✅ Do's

- **Use the feature generator** for new features
- **Keep features isolated** in their own folders
- **Use path aliases** (`@/`) for imports
- **Lazy load routes** for better performance
- **Use RBAC guards** for access control
- **Add translations** for all user-facing text
- **Use centralized API** for data fetching
- **Follow TypeScript strict mode**

### ❌ Don'ts

- Don't put business logic in components
- Don't bypass RBAC checks
- Don't hardcode API URLs
- Don't skip translations
- Don't import from deep paths
- Don't duplicate API calls
- Don't ignore TypeScript errors

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
pnpm dev --port 3000
```

### Type Errors

```bash
# Restart TypeScript server in VS Code
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

# Check for errors
pnpm tsc --noEmit
```

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules dist
pnpm install
pnpm build
```

### Import Errors

- Check path aliases in `tsconfig.app.json`
- Ensure imports use `@/` prefix
- Verify file exists

## Next Steps

1. **Read the docs:**
   - [Route Factory Guide](./docs/route-factory-guide.md)
   - [Feature Generator](./docs/feature-generator.md)
   - [Code Splitting](./docs/code-splitting.md)

2. **Customize the app:**
   - Update branding in `constants.ts`
   - Change theme colors
   - Add your logo

3. **Connect to backend:**
   - Set `VITE_API_URL` in `.env`
   - Update API client in `lib/api/client.ts`
   - Replace mock auth with real endpoints

4. **Deploy:**
   - Build: `pnpm build`
   - Deploy `dist/` folder
   - Set environment variables

## Getting Help

- **Documentation:** Check `docs/` folder
- **Examples:** Look at existing features
- **DevTools:** Use React Query & Router devtools
- **TypeScript:** Hover over types for info

## What's Next?

- 🎨 Customize the theme
- 🔐 Connect to your backend API
- 🌍 Add more languages
- 📱 Add more features
- 🚀 Deploy to production

**Happy coding!** 🎉
