#!/usr/bin/env node
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-console */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import prompts from "prompts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Available roles and permissions
const AVAILABLE_ROLES = ["GUEST", "USER", "MANAGER", "ADMIN"];
const AVAILABLE_PERMISSIONS = [
  "view:dashboard",
  "view:admin",
  "manage:users",
  "manage:settings",
];

// Templates
const pageTemplate = (
  featureName: string,
  componentName: string,
) => `import { Container, Paper, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const ${componentName}: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        ${featureName}
      </Typography>
      
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography paragraph>
          Welcome to the ${featureName} feature!
        </Typography>
      </Paper>
    </Container>
  );
};
`;

const indexTemplate = (
  componentName: string,
) => `export { ${componentName} } from './${componentName}';
`;

const routesTemplate = (
  featureSlug: string,
  componentName: string,
  routePath: string,
  roles: string[],
  permissions: string[],
) => {
  const guardConfig = [];
  if (roles.length > 0)
    guardConfig.push(`roles: [${roles.map((r) => `'${r}'`).join(", ")}]`);
  if (permissions.length > 0)
    guardConfig.push(
      `permissions: [${permissions.map((p) => `'${p}'`).join(", ")}]`,
    );

  const guardConfigString =
    guardConfig.length > 0 ? `{ ${guardConfig.join(", ")} }` : "{}";

  // Use camelCase for route and array names
  const featureRoutesName = `${featureSlug}Routes`;
  const featureRouteName = `${featureSlug}Route`;

  return `import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { appRoute } from "@/app/router/layouts";
import { RouteGuard } from "@/app/router/routeGuard";

export const ${featureRouteName} = createRoute({
  getParentRoute: () => appRoute,
  path: "${routePath}",
  component: lazyRouteComponent(() =>
    import("./pages/${componentName}").then((m) => ({ default: m.${componentName} })),
  ),
  beforeLoad: ({ params }) => RouteGuard(${guardConfigString}, params),
});

export const ${featureRoutesName} = [${featureRouteName}] as const;
`;
};

interface FeatureConfig {
  featureName: string;
  routePath: string;
  componentName: string;
  roles: string[];
  permissions: string[];
  addPermission: boolean;
  newPermission?: string;
}

async function main() {
  console.log("\n🚀 Feature Generator\n");

  const response = await prompts([
    {
      type: "text",
      name: "featureName",
      message: 'Feature name (e.g., "User Management"):',
      validate: (value) => value.length > 0 || "Feature name is required",
    },
    {
      type: "text",
      name: "routePath",
      message: 'Route path (e.g., "user-management" or "/user-management"):',
      initial: (prev: string) => `${prev.toLowerCase().replace(/\s+/g, "-")}`,
    },
    {
      type: "text",
      name: "componentName",
      message: 'Component name (e.g., "UserManagementPage"):',
      initial: (_: string, values: FeatureConfig) => {
        const name = values.featureName
          .split(" ")
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join("");
        return `${name}Page`;
      },
    },
    {
      type: "multiselect",
      name: "roles",
      message: "Select allowed roles (space to select, enter to confirm):",
      choices: AVAILABLE_ROLES.map((role) => ({ title: role, value: role })),
      min: 1,
    },
    {
      type: "multiselect",
      name: "permissions",
      message: "Select required permissions (optional):",
      choices: AVAILABLE_PERMISSIONS.map((perm) => ({
        title: perm,
        value: perm,
      })),
    },
    {
      type: "confirm",
      name: "addPermission",
      message: "Add a new custom permission?",
      initial: false,
    },
    {
      type: (prev) => (prev ? "text" : null),
      name: "newPermission",
      message: 'New permission (e.g., "manage:feature"):',
      validate: (value) =>
        !value ||
        value.includes(":") ||
        'Permission should be in format "action:resource"',
    },
  ]);

  if (!response.featureName) {
    console.log("\n❌ Cancelled");
    return;
  }

  const config: FeatureConfig = response as FeatureConfig;

  // Add new permission if specified
  if (config.newPermission) {
    config.permissions.push(config.newPermission);
  }

  await generateFeature(config);
}

async function generateFeature(config: FeatureConfig) {
  const {
    featureName,
    routePath,
    componentName,
    roles,
    permissions,
    newPermission,
  } = config;

  // Clean route path (remove leading slash)
  const cleanRoutePath = routePath.startsWith("/")
    ? routePath.slice(1)
    : routePath;

  const featureSlug = featureName.toLowerCase().replace(/\s+/g, "-");
  // Convert slug to camelCase for filenames if needed, but dashes are fine for files usually.
  // However, for variable names we need camelCase.
  const featureVarName = featureSlug.replace(/-([a-z])/g, (g) =>
    g[1].toUpperCase(),
  );

  const projectRoot = path.resolve(__dirname, "..");
  const featureDir = path.join(projectRoot, "src", "features", featureSlug);
  const pagesDir = path.join(featureDir, "pages");

  console.log("\n📁 Creating feature structure...");

  // Create directories
  fs.mkdirSync(pagesDir, { recursive: true });
  fs.mkdirSync(path.join(featureDir, "components"), { recursive: true });
  fs.mkdirSync(path.join(featureDir, "hooks"), { recursive: true });

  // Create page component
  const pagePath = path.join(pagesDir, `${componentName}.tsx`);
  fs.writeFileSync(pagePath, pageTemplate(featureName, componentName));
  console.log(`✅ Created ${componentName}.tsx`);

  // Create index file
  const indexPath = path.join(pagesDir, "index.ts");
  fs.writeFileSync(indexPath, indexTemplate(componentName));
  console.log(`✅ Created index.ts`);

  // Create Routes file
  const routesPath = path.join(featureDir, `${featureVarName}Routes.ts`);
  fs.writeFileSync(
    routesPath,
    routesTemplate(
      featureVarName,
      componentName,
      cleanRoutePath,
      roles,
      permissions,
    ),
  );
  console.log(`✅ Created ${featureVarName}Routes.ts`);

  // Update appRoutes.ts
  console.log("\n📝 Updating app routes configuration...");
  const appRoutesPath = path.join(
    projectRoot,
    "src",
    "app",
    "router",
    "appRoutes.ts",
  );

  if (fs.existsSync(appRoutesPath)) {
    let appRoutesContent = fs.readFileSync(appRoutesPath, "utf-8");

    // Add import
    const importStatement = `import { ${featureVarName}Routes } from "@/features/${featureSlug}/${featureVarName}Routes";`;
    // Find last import
    const lastImportMatch = appRoutesContent.match(/import .* from .*/g);
    if (lastImportMatch) {
      const lastImport = lastImportMatch[lastImportMatch.length - 1];
      const lastImportIndex =
        appRoutesContent.lastIndexOf(lastImport) + lastImport.length;
      appRoutesContent =
        appRoutesContent.slice(0, lastImportIndex) +
        "\n" +
        importStatement +
        appRoutesContent.slice(lastImportIndex);
    } else {
      appRoutesContent = importStatement + "\n" + appRoutesContent;
    }

    // Add to array
    const spreadStatement = `  ...${featureVarName}Routes,`;
    const arrayEndIndex = appRoutesContent.lastIndexOf("] as const;");
    if (arrayEndIndex !== -1) {
      appRoutesContent =
        appRoutesContent.slice(0, arrayEndIndex) +
        spreadStatement +
        "\n" +
        appRoutesContent.slice(arrayEndIndex);
    }

    fs.writeFileSync(appRoutesPath, appRoutesContent);
    console.log("✅ Updated appRoutes.ts");
  } else {
    console.error("❌ Could not find appRoutes.ts");
  }

  // Update RBAC types if new permission was added
  if (newPermission) {
    console.log("\n🔐 Updating RBAC types...");
    const typesPath = path.join(projectRoot, "src", "lib", "rbac", "types.ts");
    let typesContent = fs.readFileSync(typesPath, "utf-8");

    // Add new permission to the Permission type
    const permissionTypeMatch = typesContent.match(
      /type Permission =\s*\n([\s\S]*?);/,
    );
    if (permissionTypeMatch) {
      const existingPermissions = permissionTypeMatch[1];
      const newPermissionLine = `  | '${newPermission}'`;
      const updatedPermissions =
        existingPermissions.trimEnd() + "\n" + newPermissionLine;
      typesContent = typesContent.replace(
        /type Permission =\s*\n[\s\S]*?;/,
        `type Permission =\n${updatedPermissions};`,
      );
      fs.writeFileSync(typesPath, typesContent);
      console.log(`✅ Added '${newPermission}' to Permission type`);
    }
  }

  console.log("\n✨ Feature generated successfully!\n");
  console.log("📍 Feature location:", featureDir);
  console.log("🔗 Route path:", `/app/${cleanRoutePath}`);
  console.log("👥 Allowed roles:", roles.join(", "));
  if (permissions.length > 0) {
    console.log("🔐 Required permissions:", permissions.join(", "));
  }
}

main().catch(console.error);
