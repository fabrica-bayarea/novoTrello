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

export async function removeSessionCookie() {
  const cookieStore = cookies();
  (await cookieStore).delete("trello-session");
}

export async function getSessionCookie() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("trello-session")?.value;
  if (!token) throw new Error("Usuario não autenticado");
  return `trello-session=${token}`;
}
