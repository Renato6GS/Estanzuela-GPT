import { createTheme, darken } from '@mantine/core';

const FONT_FAMILY = 'Open Sans, sans-serif';
const THEMES = [
  'blue',
  'gray',
  'red',
  'pink',
  'grape',
  'violet',
  'indigo',
  'dark',
  'cyan',
  'teal',
  'green',
  'lime',
  'yellow',
  'orange',
];

export const customThemes = {
  themes: THEMES.map(color => createTheme({
    fontFamily: FONT_FAMILY,
    primaryColor: color,
  })),
};

export const theme = customThemes.themes[0];
