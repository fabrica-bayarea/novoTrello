"use server"

import { handleFetchError } from "@/lib/utils/handleFetchError";
import { setSessioCookie } from "@/lib/utils/sessionCookie";

const BASE_URL_API = process.env.BASE_URL_API || 'http://trello-api:3000';

export async function login(email: string, password: string, rememberMe: boolean) {
  const response = await fetch(`${BASE_URL_API}/v1/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, rememberMe }),
  });

  if (!response.ok) {
    return {
      success: false,
      error: await handleFetchError(response, "Erro ao fazer login"),
    };
  }

  const rawSetCookie = response.headers.get("set-cookie");
  await setSessioCookie(rawSetCookie!);

  return { success: true, data: { message: 'success' } };
}

export async function register(fullName: string, userName: string, email: string, password: string) {
  const response = await fetch(`${BASE_URL_API}/v1/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: fullName, userName, email, password }),
  });

  if (!response.ok) {
    return {
      success: false,
      error: await handleFetchError(response, "Erro ao fazer registro"),
    };
  }

  const rawSetCookie = response.headers.get("set-cookie");
  await setSessioCookie(rawSetCookie!);

  return { success: true, data: { message: 'success' } };
}

export async function forgotPassword(email: string) {
  const response = await fetch(`${BASE_URL_API}/v1/auth/forgot-password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    return {
      success: false,
      error: await handleFetchError(response, "Erro ao solicitar redefinição de senha"),
    };
  }

  return { success: true, data: { message: 'success' } };
}

// export async function logout() {
//   try {
//     const cookieStore = await cookies()

//     cookieStore.delete("trello-session")
//     redirect("/auth/login")
//   } catch (error) {
//     console.error("Erro ao fazer logout:", error)
//     redirect("/auth/login")
//   }
// }
