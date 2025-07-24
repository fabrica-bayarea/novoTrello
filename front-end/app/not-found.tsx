'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        backgroundColor: '#f9fafb',
        color: '#333',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem', fontWeight: 'bold' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>
        Página não encontrada
      </h2>
      <p style={{ marginBottom: '2rem', maxWidth: '400px', textAlign: 'center' }}>
        A página que você está tentando acessar não existe ou foi removida.
      </p>
      <Link
        href="/"
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#2563eb',
          color: '#fff',
          borderRadius: '0.375rem',
          textDecoration: 'none',
          fontWeight: '600',
          boxShadow: '0 4px 6px rgba(37, 99, 235, 0.5)',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1e40af')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2563eb')}
      >
        Voltar para a página inicial
      </Link>
    </div>
  );
}
