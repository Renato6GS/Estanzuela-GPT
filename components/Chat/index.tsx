import { ActionIcon, Button, FileButton, Flex, Popover, Textarea, Tooltip } from '@mantine/core';

import styles from './styles.module.css';
import { IconArrowUp, IconPaperclip, IconX } from '@tabler/icons-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useChatStore } from '../../store/useChatStore';

export default function Chat() {
  const [textAreaValue, setTextAreaValue] = useState('');
  const [disableForm, setDisableForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const addMessage = useChatStore((state) => state.addMessage);

  const toggle = () => {
    setIsLoading((prev) => !prev);
  };

  const handleTextAreaValue = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.currentTarget.value;
    setTextAreaValue(value);
    setDisableForm(() => value === '');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !isLoading) {
      event.preventDefault();
      if (textAreaValue.trim()) {
        handleSubmit();
      }
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
  };

  const getBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      // Crear una nueva instancia de FileReader
      const reader = new FileReader();

      // Convertir el archivo a texto base64
      reader.readAsDataURL(file);

      // Cuando el lector termina la lectura
      reader.onload = () => {
        const baseURL = reader.result;
        resolve(baseURL); // Resolver la promesa con el resultado Base64
      };

      // En caso de error
      reader.onerror = (error) => {
        console.error('Error al leer el archivo: ', error);
        reject(error); // Rechazar la promesa si ocurre un error
      };
    });
  };

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    toggle();
    if (textAreaValue.trim()) {
      addMessage(textAreaValue, 'user');
      let typeOfMessage = textAreaValue.startsWith('@Imagen') ? 'image' : 'chat';
      let base64Image = null;

      if (file && file.name) {
        typeOfMessage = 'image_data';
        base64Image = await getBase64(file);
      }

      setTextAreaValue('');

      try {
        const res = await fetch('/api/chatgpt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: textAreaValue, typeOfMessage, imageBase64: base64Image }),
        });

        if (res.ok) {
          const content = await res.json();
          addMessage(content, 'bot');
          toggle();
          setFile(null);
        } else {
          console.error('Failed to fetch response from API');
        }
      } catch (error) {
        console.error('Error fetching response from API:', error);
        toggle();
      }
    }
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {file ? (
          <Tooltip label='Quitar imagen adjunta'>
            <ActionIcon
              className={`${styles.popoverButton} ${isLoading ? styles.loading : ''}`}
              type='button'
              variant='filled'
              size='lg'
              radius='xl'
              aria-label='Settings'
              color='red'
              onClick={handleRemoveImage}
              loading={isLoading}>
              <IconX style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        ) : (
          <Popover trapFocus position='top' withArrow shadow='md'>
            <Popover.Target>
              <ActionIcon
                className={`${styles.popoverButton} ${isLoading ? styles.loading : ''}`}
                type='button'
                variant='filled'
                size='lg'
                radius='xl'
                aria-label='Settings'
                loading={isLoading}>
                <IconPaperclip style={{ width: '70%', height: '70%' }} stroke={1.5} />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
              <Flex direction={'column'} gap={'md'} justify={'start'} align={'start'}>
                <FileButton onChange={setFile} accept='image/png,image/jpeg'>
                  {(props) => (
                    <Button
                      variant='transparent'
                      size='md'
                      radius='xl'
                      aria-label='Settings'
                      loading={isLoading}
                      leftSection={<IconPaperclip stroke={1.5} />}
                      {...props}>
                      Subir imagen
                    </Button>
                  )}
                </FileButton>
              </Flex>
            </Popover.Dropdown>
          </Popover>
        )}

        <Textarea
          className={styles.textArea}
          placeholder='@Imagen para imagenes'
          label={file ? 'Imagen adjuntada con éxito' : ''}
          rows={1}
          size='xl'
          radius={'xl'}
          value={textAreaValue}
          onChange={handleTextAreaValue}
          onKeyDown={handleKeyDown}
        />

        <ActionIcon
          className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
          type='submit'
          variant='filled'
          size='lg'
          radius='xl'
          aria-label='Settings'
          disabled={disableForm}
          loading={isLoading}>
          <IconArrowUp style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
      </form>
    </div>
  );
}
