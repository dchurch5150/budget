import type { Metadata } from 'next';
import { TopBar } from '@/components/TopBar';
import './globals.css';
import styles from './layout.module.css';

export const metadata: Metadata = {
  title: 'Budget Tracking',
  description: 'A budget app for tracking expenses, incomes and savings.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className={styles.appShell}>
          <TopBar />
          <main className={styles.main}>{children}</main>
        </div>
      </body>
    </html>
  );
}
