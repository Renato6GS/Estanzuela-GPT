import Dashboard from '../Dashboard';

import styles from './styles.module.css';
import Chat from '../Chat';

export default function ChatLayout() {
  return (
    <section className={styles.chatLayout}>
      <Dashboard />
      <Chat />
    </section>
  );
}
