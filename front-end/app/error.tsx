'use client';

import { useEffect } from 'react';
import styles from './error.module.css';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Erro inesperado</h1>
      <p className={styles.message}>Ocorreu um erro. Tente recarregar a página.</p>
      <button onClick={() => reset()} className={styles.button}>
        Tentar novamente
      </button>
    </div>
  );
}
