'use client';

import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <h2 className={styles.subtitle}>Página não encontrada</h2>
      <p className={styles.description}>
        A página que você está tentando acessar não existe ou foi removida.
      </p>
      <Link href="/" className={styles.button}>
        Voltar para a página inicial
      </Link>
    </div>
  );
}
