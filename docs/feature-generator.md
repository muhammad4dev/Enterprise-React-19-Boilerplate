# Feature Generator CLI

## Overview

The Feature Generator is an interactive CLI tool that scaffolds new features with proper folder structure, components, routes, and RBAC configuration.

## Usage

```bash
pnpm generate:feature
```

## Interactive Prompts

The CLI will ask you for:

1. **Feature name** - Human-readable name (e.g., "User Management")
2. **Route path** - URL path (e.g., "/user-management")
3. **Component name** - React component name (e.g., "UserManagementPage")
4. **Allowed roles** - Select from: GUEST, USER, MANAGER, ADMIN
5. **Required permissions** - Select from existing permissions or add custom
6. **Custom permission** - Optional new permission (e.g., "manage:users")

## What It Generates

### Folder Structure

```
src/features/your-feature/
├── pages/
│   ├── YourFeaturePage.tsx
│   └── index.ts
├── components/
└── hooks/
```

### Files Created

1. **Page Component** - Basic page with MUI layout and i18n
2. **Index file** - Re-exports the page component
3. **Route configuration** - Automatically added to `routes.config.ts`
4. **RBAC types** - New permissions added to `types.ts` if needed

## Example

```bash
$ pnpm generate:feature

🚀 Feature Generator

✔ Feature name (e.g., "User Management"): › Reports
✔ Route path (e.g., "/user-management"): › /reports
✔ Component name (e.g., "UserManagementPage"): › ReportsPage
✔ Select allowed roles: › MANAGER, ADMIN
✔ Select required permissions: › view:dashboard
✔ Add a new custom permission? … yes
✔ New permission (e.g., "manage:feature"): › view:reports

📁 Creating feature structure...
✅ Created ReportsPage.tsx
✅ Created index.ts

📝 Updating routes configuration...
✅ Updated routes.config.ts

🔐 Updating RBAC types...
✅ Added 'view:reports' to Permission type

✨ Feature generated successfully!

📍 Feature location: /src/features/reports
🔗 Route path: /app/reports
👥 Allowed roles: MANAGER, ADMIN
🔐 Required permissions: view:dashboard, view:reports

💡 Next steps:
   1. Customize the page component
   2. Add components to the components/ folder
   3. Add custom hooks to the hooks/ folder
   4. Update translations in src/lib/i18n/locales/
```

## Generated Page Template

```tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Container, Typography, Paper, Box } from "@mui/material";

export const ReportsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography paragraph>Welcome to the Reports feature!</Typography>
      </Paper>
    </Container>
  );
};
```

## Automatic Updates

### routes.config.ts

```typescript
// Import automatically added
import { ReportsPage } from "@/features/reports/pages";

export const protectedRoutesConfig: RouteConfig[] = [
  // ... existing routes
  // New route automatically added
  {
    path: "/reports",
    component: ReportsPage,
    roles: ["MANAGER", "ADMIN"],
    permissions: ["view:dashboard", "view:reports"],
  },
];
```

### types.ts (if new permission)

```typescript
export type Permission =
  | "view:dashboard"
  | "view:admin"
  | "manage:users"
  | "manage:settings"
  | "view:reports"; // Automatically added
```

## Benefits

✅ **Consistent structure** - All features follow the same pattern  
✅ **Time-saving** - No manual file creation or boilerplate  
✅ **Type-safe** - Automatically updates TypeScript types  
✅ **RBAC integrated** - Routes are protected from the start  
✅ **Zero errors** - Proper imports and exports generated

## Customization

After generation, customize your feature:

1. **Page component** - Add your UI and logic
2. **Components** - Create reusable components in `components/`
3. **Hooks** - Add custom hooks in `hooks/`
4. **Translations** - Add i18n keys to `src/lib/i18n/locales/`
5. **API calls** - Add queries/mutations to `src/lib/api/`

## Tips

- Use kebab-case for route paths (e.g., `/user-management`)
- Use PascalCase for component names (e.g., `UserManagementPage`)
- Follow the pattern: `{FeatureName}Page` for page components
- Add custom permissions in format `action:resource` (e.g., `manage:reports`)
