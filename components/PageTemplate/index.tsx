import { AppShell, Burger, Button, Flex, Image, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ChangeTheme from '../ChangeTheme';
import { IconPlus } from '@tabler/icons-react';
import { useChatStore } from '../../store/useChatStore';

type Props = {
  children: React.ReactNode;
};

export const PageTemplate = ({ children }: Props) => {
  const [opened, { toggle }] = useDisclosure();
  const clearMessages = useChatStore((state) => state.clearMessages);

  const handleCreateNewChat = () => clearMessages();
  
  return (
    <AppShell
      header={{ height: 75 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding='md'>
      <AppShell.Header p={'sm'}>
        <Flex justify={'space-between'} align={'center'} style={{ height: '100%' }}>
          <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />
          <Flex align={'center'} gap={'md'}>
            <Image visibleFrom='sm' src='/ia-estanzuela-logo.webp' w={'auto'} h={48} alt='IA Estanzuela logo' />
            <Title order={3}>
              <Text
                component='span'
                fz={24}
                fw={700}
                variant='gradient'
                gradient={{ from: 'teal', to: 'indigo', deg: 110 }}>
                Estanzuela GPT
              </Text>
            </Title>
          </Flex>
          <Flex justify={'space-between'} align={'center'}>
            <ChangeTheme />
          </Flex>
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar p='md'>
        <Flex>
          <Button onClick={handleCreateNewChat} fullWidth leftSection={<IconPlus size={20} stroke={3} />}>
            Nuevo chat
          </Button>
        </Flex>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};
