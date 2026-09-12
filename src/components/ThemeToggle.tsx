"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const storageKey = "uailibras-theme";

function getSystemTheme(): Theme {
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(storageKey);
    const initialTheme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : getSystemTheme();

    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem(storageKey, nextTheme);
    applyTheme(nextTheme);
  }

  const isDark = theme === "dark";

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      aria-pressed={isDark}
      onClick={toggleTheme}
    >
      <i className={isDark ? "fas fa-sun" : "fas fa-moon"} aria-hidden="true" />
      <span className="visually-hidden">{isDark ? "Ativar tema claro" : "Ativar tema escuro"}</span>
    </button>
  );
}
