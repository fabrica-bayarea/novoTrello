'use client';

import { useEffect } from 'react';
import styles from '../auth/style.module.css';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.authPage}>
      <h2 style={{ color: 'white' }}>Ocorreu um erro!</h2>
      <p style={{ color: 'white' }}>{error.message}</p>
      <button onClick={reset} className={styles.createAccountLink}>
        Tentar novamente
      </button>
    </div>
  );
}
