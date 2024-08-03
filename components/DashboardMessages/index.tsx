import { Box, Flex, Image, Text, useMantineColorScheme } from '@mantine/core';

import styles from './styles.module.css';
import { useChatStore } from '../../store/useChatStore';
import { useEffect, useRef } from 'react';
import Markdown from 'react-markdown';

type Props = {};

export default function DashboardMessages({}: Props) {
  const messages = useChatStore((state) => state.messages);
  const { colorScheme } = useMantineColorScheme();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Flex ref={containerRef} direction={'column'} w={'100%'} gap={'xl'}>
      {messages.map((message, index) => {
        const isLastMessage = index === messages.length - 1;
        if (message.role === 'user') {
          return (
            <Box
              key={message.id}
              className={styles.messageBlock}
              bg='var(--mantine-primary-color-filled)'
              ref={isLastMessage ? messagesEndRef : null}>
              <Text size='lg' c={'white'}>
                {message.content}
              </Text>
            </Box>
          );
        } else {
          return (
            <Flex key={message.id} gap={'md'} ref={isLastMessage ? messagesEndRef : null}>
              <Image src='/ia-estanzuela-logo.webp' w={48} h={48} mt={25} alt='IA Estanzuela logo' />
              {message.content.startsWith('https') ? (
                <>
                  <Image hiddenFrom='sm' src={message.content} w={256} h={256} alt='Image generated' />
                  <Image visibleFrom='sm' src={message.content} w={356} h={356} alt='Image generated' />
                </>
              ) : (
                <Text size='lg' mt={'sm'} c={colorScheme === 'light' ? 'dark' : 'white'} component='span'>
                  <Markdown>{message.content}</Markdown>
                </Text>
              )}
            </Flex>
          );
        }
      })}
    </Flex>
  );
}
