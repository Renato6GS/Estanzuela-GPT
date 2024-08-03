import { Flex } from '@mantine/core'
import React from 'react'
import DashboardEmpty from './DashboardEmpty'

import styles from './style.module.css'
import DashboardMessages from '../DashboardMessages'
import { useChatStore } from '../../store/useChatStore'

type Props = {}

export default function Dashboard({}: Props) {
  const messages = useChatStore((state) => state.messages);

  return (
    <Flex className={styles.container}>
      {messages.length === 0 ? <DashboardEmpty /> : <DashboardMessages />}
    </Flex>
  )
}