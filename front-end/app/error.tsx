'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ height: '100vh', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', textAlign:'center' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>Erro inesperado</h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Ocorreu um erro. Tente recarregar a página.</p>
      <button onClick={() => reset()} style={{ padding: '0.75rem 1.5rem', cursor: 'pointer' }}>
        Tentar novamente
      </button>
    </div>
  );
}