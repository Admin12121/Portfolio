import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  resolvedTheme: "dark" | "light";
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => undefined,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  // Safe initializer: avoid touching window/localStorage at module eval time
  const getInitialTheme = (): Theme => {
    if (typeof window === "undefined") return defaultTheme;
    try {
      const stored = localStorage.getItem(storageKey) as Theme | null;
      return (stored as Theme) || defaultTheme;
    } catch {
      return defaultTheme;
    }
  };

  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const resolve = (t: Theme): "dark" | "light" => {
    if (t === "system") {
      if (typeof window === "undefined") return "light";
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return t === "dark" ? "dark" : "light";
  };

  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">(
    resolve(theme)
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = window.document.documentElement;

    const apply = (r: "dark" | "light") => {
      root.classList.remove("light", "dark");
      root.classList.add(r);
    };

    if (theme === "system") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const mqlChangeHandler = (e: MediaQueryListEvent) => {
        const r = e.matches ? "dark" : "light";
        setResolvedTheme(r);
        apply(r);
      };

      const initial = mql.matches ? "dark" : "light";
      setResolvedTheme(initial);
      apply(initial);

      // addEventListener on MediaQueryList is modern; fallback to addListener for older browsers
      if (mql.addEventListener) {
        mql.addEventListener("change", mqlChangeHandler);
        return () => mql.removeEventListener("change", mqlChangeHandler);
      } else {
        mql.addListener(mqlChangeHandler);
        return () => {
          mql.removeListener(mqlChangeHandler);
        };
      }
    } else {
      const r = resolve(theme);
      setResolvedTheme(r);
      apply(r);
    }
  }, [theme]);

  const setTheme = (t: Theme) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, t);
      }
    } catch {
      // ignore localStorage errors (e.g. private mode)
    }
    setThemeState(t);
  };

  const value: ThemeProviderState = {
    theme,
    resolvedTheme,
    setTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
