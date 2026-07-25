"use client";

import { useEffect, useState } from "react";

/**
 * Retorna `false` no HTML renderizado no servidor e `true` assim que o React
 * hidrata a página no navegador.
 *
 * Serve para desabilitar botões de submit até a página estar interativa: sem
 * isso, um clique feito antes da hidratação dispara o submit NATIVO do
 * formulário — o navegador recarrega a página (o que também faz o tema piscar
 * de claro para escuro) e o login "não acontece" na primeira tentativa.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
