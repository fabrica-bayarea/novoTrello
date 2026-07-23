import axios from 'axios';
import { getCookie } from '@/lib/utils/session-cookie';

// BASE_URL_API deve ser definida via variável de ambiente.
// Lançar erro evita fallback para URL hardcoded (Sonar S5332).
function getBaseUrlApi(): string {
  const url = process.env.BASE_URL_API;
  if (!url) {
    throw new Error(
      'BASE_URL_API não está definida. Configure no .env ou no ambiente.',
    );
  }
  return url;
}

const BASE_URL_API = getBaseUrlApi();


export const api = axios.create({
  baseURL: BASE_URL_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  try {
    const tokenCookie = await getCookie("sprinttacker-session");
    if (tokenCookie) {
      config.headers['Cookie'] = tokenCookie;
    }
  } catch {
  }
  return config;
});

/** Erro lançado quando a API devolve HTML no lugar de JSON (sessão expirada). */
export const SESSION_EXPIRED_MESSAGE =
  'Sessão expirada. Faça login novamente.';

function looksLikeHtml(data: unknown): boolean {
  return (
    typeof data === 'string' && /^\s*(<!doctype\s|<html[\s>])/i.test(data)
  );
}

// O CloudFront na frente do site tem um Custom Error Response que converte
// 403 da API em "200 + index.html" (regra de SPA aplicada também às rotas
// de API). Quando o JWT expira, a chamada "dá certo" (200) mas o body é
// HTML — e quem consome quebra com "unexpected character" ao tratar como
// JSON. Este interceptor detecta o HTML e converte num erro claro de
// sessão expirada, nos DOIS caminhos (200-com-HTML e erro-com-HTML).
api.interceptors.response.use(
  (response) => {
    if (looksLikeHtml(response.data)) {
      return Promise.reject(new Error(SESSION_EXPIRED_MESSAGE));
    }
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error) && looksLikeHtml(error.response?.data)) {
      return Promise.reject(new Error(SESSION_EXPIRED_MESSAGE));
    }
    return Promise.reject(error);
  },
);

export default api;
