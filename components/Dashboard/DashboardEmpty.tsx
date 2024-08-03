import { Flex, Image, Text, UnstyledButton, useComputedColorScheme, useMantineTheme } from '@mantine/core';
import { IconAddressBook, IconBrandOpenai, IconCamera, IconPhotoScan } from '@tabler/icons-react';

import styles from './style.module.css';
import { useChatStore } from '../../store/useChatStore';

type Props = {};

export default function DashboardEmpty({}: Props) {
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const theme = useMantineTheme();
  const addMessage = useChatStore((state) => state.addMessage);

  const MESSAGES = {
    EXPLAIN_IA: 'Explícame qué es la Inteligencia Artificial con un ejemplo sencillo',
    HELP_ME_WITH_HOMEWORKS: 'Quiero que me ayudes con una tarea de la escuela',
    EXPLAIN_IA_2: 'Dime que puedo hacer con ChatGPT',
    HOW_WAS_YOUR_DAY: '¿Cómo estuvo tu día?',
  };

  const handleMessage = async (message: string) => {
    addMessage(message, 'user');

    try {
      const res = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: message }),
      });

      if (res.ok) {
        const content = await res.json();
        addMessage(content, 'bot');
      } else {
        console.error('Failed to fetch response from API');
      }
    } catch (error) {
      console.error('Error fetching response from API:', error);
    }
  };

  return (
    <Flex direction={'column'} justify={'center'} align={'center'} style={{ height: '100%', width: '100%' }}>
      <Image src='/ia-estanzuela-logo.webp' w={152} h={152} alt='IA Estanzuela logo' />
      <Flex visibleFrom='sm' gap={'md'} wrap={'wrap'} p={'lg'}>
        <UnstyledButton
          className={`${styles.dashboardEmptyButton}`}
          onClick={() => handleMessage(MESSAGES['EXPLAIN_IA'])}>
          <IconBrandOpenai size={24} color={computedColorScheme === 'light' ? theme.colors.yellow[9] : 'yellow'} />
          <Text>{MESSAGES['EXPLAIN_IA']}</Text>
        </UnstyledButton>
        <UnstyledButton
          className={`${styles.dashboardEmptyButton}`}
          onClick={() => handleMessage(MESSAGES['HELP_ME_WITH_HOMEWORKS'])}>
          <IconPhotoScan size={24} color={computedColorScheme === 'light' ? theme.colors.lime[9] : 'lime'} />
          <Text>{MESSAGES['HELP_ME_WITH_HOMEWORKS']}</Text>
        </UnstyledButton>
        <UnstyledButton
          className={`${styles.dashboardEmptyButton}`}
          onClick={() => handleMessage(MESSAGES['EXPLAIN_IA_2'])}>
          <IconAddressBook size={24} color={computedColorScheme === 'light' ? theme.colors.violet[9] : 'violet'} />
          <Text>{MESSAGES['EXPLAIN_IA_2']}</Text>
        </UnstyledButton>
        <UnstyledButton
          className={`${styles.dashboardEmptyButton}`}
          onClick={() => handleMessage(MESSAGES['HOW_WAS_YOUR_DAY'])}>
          <IconCamera size={24} color={computedColorScheme === 'light' ? theme.colors.cyan[9] : 'cyan'} />
          <Text>{MESSAGES['HOW_WAS_YOUR_DAY']}</Text>
        </UnstyledButton>
      </Flex>
    </Flex>
  );
}
