"use client";

import { useEffect } from "react";

/**
 * Remove a query string da URL ao montar a página.
 *
 * As rotas de /auth não usam query string legítima — mas versões antigas dos
 * forms (sem method="POST") faziam submit nativo GET e vazavam credenciais
 * pra URL (?email=...&password=...). Links assim ainda existem em históricos
 * e bookmarks; este hook limpa a barra de endereço assim que o JS carrega,
 * pra senha não ficar visível nem seguir como referer.
 *
 * Usa window.location.pathname (e não usePathname) de propósito: o pathname
 * do browser já inclui o basePath /sprint.
 */
export function useScrubUrlQuery() {
  useEffect(() => {
    if (window.location.search) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);
}
