"use client";

import { createContext, useContext, useState, useEffect } from "react";

export type Theme = "brutalism" | "aero" | "skeuomorphism" | "minimalism" | "minimalism-light";

export const THEME_PRESETS: Record<Theme, { name: string; color: string }[]> = {
  brutalism: [
    { name: "Hot Pink", color: "#ff3366" },
    { name: "Cyber Yellow", color: "#ffd700" },
    { name: "Toxic Green", color: "#39ff14" },
    { name: "Deep Violet", color: "#8a2be2" },
    { name: "Electric Blue", color: "#00f0ff" },
    { name: "Blood Red", color: "#ff0000" },
    { name: "Orange Crush", color: "#ff4500" },
    { name: "Magenta", color: "#ff00ff" },
    { name: "Cyan", color: "#00ffff" },
    { name: "Monochrome Black", color: "#111111" }
  ],
  aero: [
    { name: "Sky Blue", color: "#00a8ff" },
    { name: "Vista Green", color: "#3cb371" },
    { name: "Aqua", color: "#00ffff" },
    { name: "Ocean Deep", color: "#005f9e" },
    { name: "Sunset Orange", color: "#ff7f50" },
    { name: "Lavender", color: "#e6e6fa" },
    { name: "Aero Pink", color: "#ffb6c1" },
    { name: "Cloud White", color: "#f0f8ff" },
    { name: "Ice Blue", color: "#add8e6" },
    { name: "Lime", color: "#00ff00" }
  ],
  skeuomorphism: [
    { name: "Leather Red", color: "#8c2111" },
    { name: "Felt Green", color: "#3b422e" },
    { name: "Brass Gold", color: "#d1b954" },
    { name: "Rich Mahogany", color: "#4a0404" },
    { name: "Steel Blue", color: "#4682b4" },
    { name: "Parchment Yellow", color: "#f0e68c" },
    { name: "Charcoal", color: "#36454f" },
    { name: "Bronze", color: "#cd7f32" },
    { name: "Copper", color: "#b87333" },
    { name: "Emerald", color: "#50c878" }
  ],
  minimalism: [
    { name: "Nothing Red", color: "#e60000" },
    { name: "Pure White", color: "#ffffff" },
    { name: "Neon Green", color: "#00ff00" },
    { name: "Electric Blue", color: "#0000ff" },
    { name: "Yellow", color: "#ffff00" },
    { name: "Magenta", color: "#ff00ff" },
    { name: "Cyan", color: "#00ffff" },
    { name: "Orange", color: "#ffa500" },
    { name: "Purple", color: "#800080" },
    { name: "Pink", color: "#ffc0cb" }
  ],
  "minimalism-light": [
    { name: "Nothing Red", color: "#e60000" },
    { name: "Pure Black", color: "#000000" },
    { name: "Navy", color: "#000080" },
    { name: "Forest Green", color: "#228b22" },
    { name: "Crimson", color: "#dc143c" },
    { name: "Teal", color: "#008080" },
    { name: "Coral", color: "#ff7f50" },
    { name: "Plum", color: "#dda0dd" },
    { name: "Slate", color: "#708090" },
    { name: "Gold", color: "#ffd700" }
  ]
};

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  presetIndex: number;
  setPresetIndex: (index: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("minimalism");
  const [presetIndex, setPresetIndex] = useState<number>(0);

  useEffect(() => {
    // Read from localStorage on mount
    const savedTheme = localStorage.getItem("rena_theme") as Theme;
    const savedPreset = localStorage.getItem("rena_preset");
    if (savedTheme) setTheme(savedTheme);
    if (savedPreset) setPresetIndex(parseInt(savedPreset));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-preset", presetIndex.toString());
    
    // Apply preset color
    const activePreset = THEME_PRESETS[theme][presetIndex] || THEME_PRESETS[theme][0];
    document.documentElement.style.setProperty("--primary-color", activePreset.color);
    
    localStorage.setItem("rena_theme", theme);
    localStorage.setItem("rena_preset", presetIndex.toString());
  }, [theme, presetIndex]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, presetIndex, setPresetIndex }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
