import { cookies } from "next/headers";

export function parseJwt(token: string) {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    if (!payload) throw new Error("Token inválido");
    return payload
  } catch {
    return null;
  }
}

export async function setAuthTokenCookie(token: string, exp: number) {
  const cookieStore = cookies();
  (await cookieStore).set({
    name: "auth-token",
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(exp * 1000),
  });
}

export async function removeAuthTokenCookie() {
  const cookieStore = cookies();
  (await cookieStore).delete("auth-token");
}

export async function getAuthTokenCookie() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth-token")?.value;
  if (!token) throw new Error("Usuario não autenticado");
  return token;
}

export async function handleFetchError(response: Response, fallbackMsg = "Erro ao fazer requisição") {
  let errorMsg = fallbackMsg;

  try {
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const data = await response.json();
      errorMsg = data.message || data.error || errorMsg;
    } else {
      const text = await response.text();
      errorMsg = text || errorMsg;
    }
  } catch {
    // ignorar erro ao tentar extrair mensagem
  }

  throw new Error(errorMsg);
}