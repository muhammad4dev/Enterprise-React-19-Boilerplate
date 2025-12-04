import { Button, Menu, MenuItem } from "@mui/material";
import { useNavigate, useParams } from "@tanstack/react-router";
import React from "react";
import { useTranslation } from "react-i18next";

import type { SupportedLanguage } from "@/lib/i18n/config";
import { usePreferencesStore } from "@/stores/preferencesStore";

export const LocaleSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const { setLocale, setDirection } = usePreferencesStore();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // We use strict: false because this component might be rendered outside of a route
  // that explicitly has 'lang' (though in your app structure it's almost always there).
  const currentLang = (params as { lang?: string }).lang || i18n.language;

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lang: SupportedLanguage) => {
    // 1. Update Persistent Store (optional, but good for next visit)
    setLocale(lang);

    // 2. Update Direction
    const newDir = lang === "ar" ? "rtl" : "ltr";
    setDirection(newDir);
    document.dir = newDir;

    // 3. Navigate to new URL (The Router will see the param change and sync i18n via langRoute)
    navigate({
      to: ".", // Stay on current route
      params: { ...params, lang }, // Verify this merges correctly with your router setup
      replace: true,
    });

    handleClose();
  };

  return (
    <>
      <Button color="inherit" onClick={handleOpen} sx={{ minWidth: 64 }}>
        {currentLang.toUpperCase()}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => changeLanguage("en")}>English</MenuItem>
        <MenuItem onClick={() => changeLanguage("ar")}>العربية</MenuItem>
      </Menu>
    </>
  );
};
