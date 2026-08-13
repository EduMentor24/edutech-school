import AsyncStorage from "@react-native-async-storage/async-storage";
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from "react";

import { EduColors, ThemeMode, palettes } from "@/lib/edutech/palette";

const STORAGE_KEY = "edutech-school-theme";
type ThemeContextValue = { mode: ThemeMode; colors: EduColors; isReady: boolean; setMode: (mode: ThemeMode) => Promise<void> };
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function EduThemeProvider({ children }: PropsWithChildren) {
  const [mode, setModeState] = useState<ThemeMode>("light");
  const [isReady, setIsReady] = useState(false);
  useEffect(() => { AsyncStorage.getItem(STORAGE_KEY).then((stored) => { if (stored === "light" || stored === "dark") setModeState(stored); }).finally(() => setIsReady(true)); }, []);
  const value = useMemo<ThemeContextValue>(() => ({ mode, colors: palettes[mode], isReady, setMode: async (nextMode) => { setModeState(nextMode); await AsyncStorage.setItem(STORAGE_KEY, nextMode); } }), [isReady, mode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useEduTheme() { const context = useContext(ThemeContext); if (!context) throw new Error("useEduTheme doit être utilisé dans EduThemeProvider."); return context; }
