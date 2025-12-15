import { defineStore } from "pinia";
import { lsGet, lsSet } from "@/composables/useLocalStorage";

export type ThemeMode = "system" | "light" | "dark";
const THEME_KEY = "themeMode";

export const useUiStore = defineStore("ui", {
  state: () => ({
    theme: lsGet<ThemeMode>(THEME_KEY, "system"),
  }),

  getters: {
    themeLabel: (s) => (s.theme === "system" ? "System" : s.theme === "light" ? "Light" : "Dark"),
  },

  actions: {
    applyTheme() {
      const root = document.documentElement;
      if (this.theme === "system") root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", this.theme);
    },

    setTheme(mode: ThemeMode) {
      this.theme = mode;
      lsSet(THEME_KEY, mode);
      this.applyTheme();
    },

    cycleTheme() {
      const next: ThemeMode =
        this.theme === "system" ? "light" : this.theme === "light" ? "dark" : "system";
      this.setTheme(next);
    },
  },
});
