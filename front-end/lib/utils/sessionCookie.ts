import { cookies } from "next/headers";
import setCookie from "set-cookie-parser";

export function parseJwt(token: string) {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    if (!payload) throw new Error("Token inválido");
    return payload
  } catch {
    return null;
  }
}

export async function setSessioCookie(rawSetCookie: string) {
    const [parsed] = setCookie.parse(rawSetCookie);
    const cookieStore = cookies();
    (await cookieStore).set({
      name: parsed.name,
      value: parsed.value,
      path: parsed.path || "/",
      httpOnly: parsed.httpOnly,
      secure: parsed.secure,
      sameSite: parsed.sameSite as "strict" | "lax" | "none" | undefined,
      maxAge: parsed.maxAge,
      domain: parsed.domain,
    });
}

export async function removeCookie(cookieName: string) {
  const cookieStore = cookies();
  (await cookieStore).delete(cookieName);
}

export async function getCookie(cookieName: string) {
  const cookieStore = cookies();
  const token = (await cookieStore).get(cookieName)?.value;
  if (!token) throw new Error("Cookie não encontrado");
  return `${cookieName}=${token}`;
}