import { cookies } from "next/headers";

export function parseJwt(token: string) {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
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
