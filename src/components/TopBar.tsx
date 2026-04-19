import styles from './TopBar.module.css';

export function TopBar() {
  return (
    <header className={styles.topBar}>
      <h1 className={styles.title}>Budget Tracking</h1>
    </header>
  );
}
