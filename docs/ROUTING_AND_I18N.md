# Routing & Internationalization Guide

This project uses **TanStack Router** paired with **react-i18next** to provide a fully type-safe, internationalized routing experience.

## 🌍 URL Structure

All application routes are prefixed with the language code to ensure that the language state is persisted in the URL and shareable.

- **Structure:** `/:lang/...`
- **Example:** `/en/dashboard`, `/ar/users`

If a user visits the root `/`, they are automatically redirected to `/{defaultLang}/login` (e.g., `/en/login`).

## 🛠️ Navigation Utilities

Because of the dynamic `$lang` path segment, using standard navigation tools directly can be cumbersome (requiring you to manually pass `params: { lang: ... }` everywhere). We provide custom wrappers to handle this automatically.

### 1. `useAppNavigate` Hook

Use this hook instead of `useNavigate` for imperative navigation. It automatically injects the current language into the destination params.

```typescript
import { useAppNavigate } from "@/shared/hooks/useAppNavigate";

const MyComponent = () => {
  const navigate = useAppNavigate();

  const handleGoHome = () => {
    // Navigates to /en/dashboard (or current lang) automatically
    navigate({ to: "/$lang/app/dashboard" });
  };

  return <button onClick={handleGoHome}>Go Home</button>;
};
```

### 2. `AppLink` Component

Use this component instead of `Link` for declarative navigation. It wraps TanStack Router's `Link` and injects the current language.

```tsx
import { AppLink } from "@/shared/components/ui/AppLink";

<AppLink to="/$lang/app/users">Go to Users</AppLink>;
```

It is also forward-ref compatible, making it easy to use with MUI components:

```tsx
<ListItemButton component={AppLink} to="/$lang/app/dashboard">
  <ListItemText primary="Dashboard" />
</ListItemButton>
```

### 3. `appRedirect` Utility

Use this utility inside route guards (`beforeLoad`) where hooks are not available. It correctly handles redirects by preserving the current language or falling back to the default.

```typescript
// src/app/router/routeGuard.ts
import { appRedirect } from "./utils";

beforeLoad: ({ params }) => {
  if (!isAuthenticated) {
    // Redirects to /en/login (or current lang)
    throw appRedirect({ to: "/$lang/login" }, params);
  }
};
```

## 🔍 Dynamic Routes & Search Parameters

We support type-safe dynamic paths and query parameters validation using **Zod**.

### Dynamic Path Parameters

Example: User Profile Page (`/users/$userId`)

```typescript
// usersRoutes.ts
const userProfileRoute = createRoute({
  path: "users/$userId",
  component: UserProfilePage,
});

// UserProfilePage.tsx
const { userId } = useParams({ from: "/$lang/app/users/$userId" });
```

### Search Parameters (Query Strings)

Example: Filtering Users (`/users?role=ADMIN`)

1. **Define Schema:**

```typescript
const usersSearchSchema = z.object({
  role: z.string().optional(),
});
```

2. **Register in Route:**

```typescript
const usersListRoute = createRoute({
  path: "users",
  validateSearch: usersSearchSchema,
  component: UsersListPage,
});
```

3. **Use in Component:**

```typescript
const UsersListPage = () => {
  // Type-safe access to search params
  const search = useSearch({ from: "/$lang/app/users" });

  // Updating search params
  const navigate = useAppNavigate();
  const setFilter = (role) => {
    navigate({
      search: (prev) => ({ ...prev, role }),
    });
  };
};
```
