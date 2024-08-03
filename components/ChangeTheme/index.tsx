import { useEffect, useState } from 'react';
import { ActionIcon, Tooltip, Flex, useMantineColorScheme } from '@mantine/core';
import { IconBrush, IconSun } from '@tabler/icons-react';
import Cookies from 'js-cookie';
import useThemeStore from '../../store/useThemeStore';
import { customThemes } from '../../theme';

type Props = {};

export default function ChangeTheme({}: Props) {
  // Inicialización del índice del tema desde las cookies o el primero por defecto
  const initialThemeIndex = parseInt(Cookies.get('themeIndex') || '0');
  const [themeIndex, setThemeIndex] = useState(initialThemeIndex);
  const setTheme = useThemeStore((state) => state.setTheme);

  const { colorScheme, setColorScheme } = useMantineColorScheme();

  // Actualizar el tema al montar y cuando el índice cambie
  useEffect(() => {
    setTheme(customThemes.themes[themeIndex]);
    Cookies.set('themeIndex', themeIndex.toString()); // Guarda el índice en una cookie
  }, [themeIndex, setTheme]);

  // Actualizar esquema de color al montar y cuando cambie
  useEffect(() => {
    if (Cookies.get('colorScheme')) {
      setColorScheme(Cookies.get('colorScheme') as 'light' | 'dark');
    }
  }, [setColorScheme]);

  const handleThemeChange = () => {
    const nextThemeIndex = (themeIndex + 1) % customThemes.themes.length;
    setThemeIndex(nextThemeIndex);
  };

  const handleChangeScheme = () => {
    const nextColorScheme = colorScheme === 'dark' ? 'light' : 'dark';
    setColorScheme(nextColorScheme);
    Cookies.set('colorScheme', nextColorScheme); // Guarda el esquema de color en una cookie
  };

  return (
    <Flex gap={'md'}>
      <Tooltip label='Cambiar tema' withArrow>
        <ActionIcon onClick={handleThemeChange} size={'lg'}>
          <IconBrush size={24} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label={`Cambiar a modo ${colorScheme === 'dark' ? 'claro' : 'oscuro'}`} withArrow>
        <ActionIcon onClick={handleChangeScheme} size={'lg'}>
          <IconSun size={24} />
        </ActionIcon>
      </Tooltip>
    </Flex>
  );
}
