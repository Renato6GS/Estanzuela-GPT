import { create } from 'zustand';
import { customThemes } from '../theme';
import { MantineTheme, MantineThemeOverride } from '@mantine/core';

interface ThemeState {
  theme: MantineTheme | MantineThemeOverride;
  setTheme: (newTheme: MantineTheme | MantineThemeOverride) => void;
}

const useThemeStore = create<ThemeState>((set) => ({
  theme: customThemes.themes[0],
  setTheme: (newTheme) => set({ theme: newTheme }),
}));

export default useThemeStore;
