import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <h1>404 - Página não encontrada</h1>
      <p>A página que você está tentando acessar não existe.</p>
      <Link href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
        Voltar para a página inicial
      </Link>
    </div>
  );
}
