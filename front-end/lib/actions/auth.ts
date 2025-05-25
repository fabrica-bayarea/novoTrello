"use server"

import { parseJwt, setAuthTokenCookie, handleFetchError } from "@/lib/utils/auth";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function login(email: string, password: string, rememberMe: boolean) {
  const response = await fetch(`${apiBaseUrl}/v1/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, rememberMe }),
  });

  if (!response.ok) {
    await handleFetchError(response, "Erro ao fazer login");
  }

  const { accessToken } = await response.json();
  const payload = parseJwt(accessToken);

  await setAuthTokenCookie(accessToken, payload.exp);
  
  return { message: 'success' };
}

export async function register(fullName: string, userName: string, email: string, password: string) {
  const response = await fetch(`${apiBaseUrl}/v1/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: fullName, userName, email, password }),
  });

  if (!response.ok) {
    await handleFetchError(response, "Erro ao fazer registro");
  }

  const { accessToken } = await response.json();
  const payload = parseJwt(await response.json());

  await setAuthTokenCookie(accessToken, payload.exp);

  return { message: 'success' };
}

export async function forgotPassword(email: string) {
  const response = await fetch(`${apiBaseUrl}/v1/auth/forgot-password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    await handleFetchError(response, "Erro ao solicitar redefinição de senha");
  }

  return { message: 'success' };
}

// export async function logout() {
//   try {
//     const cookieStore = await cookies()

//     cookieStore.delete("auth-token")
//     redirect("/auth/login")
//   } catch (error) {
//     console.error("Erro ao fazer logout:", error)
//     redirect("/auth/login")
//   }
// }
