# Feature Generator CLI 🚀

Quickly scaffold new features with proper structure, routes, and RBAC configuration.

## Quick Start

```bash
pnpm generate:feature
```

Follow the interactive prompts to create a new feature!

## What You'll Be Asked

1. **Feature name** - e.g., "User Management"
2. **Route path** - e.g., "/user-management"
3. **Component name** - e.g., "UserManagementPage"
4. **Allowed roles** - Select: GUEST, USER, MANAGER, ADMIN
5. **Required permissions** - Select existing or add custom
6. **Custom permission** - Optional (e.g., "manage:users")

## What Gets Generated

```
src/features/your-feature/
├── pages/
│   ├── YourFeaturePage.tsx      ✅ Page component
│   └── index.ts                 ✅ Exports
├── components/                  ✅ Empty folder for components
├── hooks/                       ✅ Empty folder for hooks
└── yourFeatureRoutes.ts         ✅ Route definition file

Automatic updates:
✅ Route added to src/app/router/appRoutes.ts
✅ New permissions added to src/lib/rbac/types.ts
```

## Example Output

```bash
✨ Feature generated successfully!

📍 Feature location: .../src/features/reports
🔗 Route path: /app/reports
👥 Allowed roles: MANAGER, ADMIN
🔐 Required permissions: view:reports
```
