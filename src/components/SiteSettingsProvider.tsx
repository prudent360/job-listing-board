"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  accentColor: string;
}

const defaults: SiteSettings = {
  siteName: "Reekruitr",
  tagline: "Find your next opportunity",
  logoUrl: "",
  faviconUrl: "",
  accentColor: "#e86c3a",
};

const SiteSettingsContext = createContext<{
  settings: SiteSettings;
  refresh: () => void;
}>({
  settings: defaults,
  refresh: () => {},
});

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaults);

  const loadSettings = () => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          setSettings({
            siteName: data.settings.siteName || defaults.siteName,
            tagline: data.settings.tagline || defaults.tagline,
            logoUrl: data.settings.logoUrl || defaults.logoUrl,
            faviconUrl: data.settings.faviconUrl || defaults.faviconUrl,
            accentColor: data.settings.accentColor || defaults.accentColor,
          });
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, refresh: loadSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
