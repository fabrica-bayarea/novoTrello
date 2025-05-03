import styles from './style.module.css';

export default function Section ({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.title}>{title}</h2>
      </div>
      {children}
    </section>
  );
} 