"use server"

import { cookies } from "next/headers"
import { parseJwt, setAuthTokenCookie } from "@/utils/auth";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function login(email: string, password: string, rememberMe: boolean) {
  try {
    const response = await fetch(`${apiBaseUrl}/v1/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, rememberMe }),
    });

    if (!response.ok) {
      let errorMsg = "Erro ao fazer login";
      let status = response.status;
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorMsg;
      } catch {}
      return { success: false, error: errorMsg, status };
    }

    const { accessToken } = await response.json();
    const payload = parseJwt(accessToken);
    if (!payload) return { success: false, error: "Token inválido" };
    await setAuthTokenCookie(accessToken, payload.exp);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao conectar com o servidor" };
  }
}

export async function register(fullName: string, userName: string, email: string, password: string) {
  try {
    const response = await fetch(`${apiBaseUrl}/v1/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: fullName, userName, email, password }),
    });

    if (!response.ok) {
      let errorMsg = "Erro ao fazer registro";
      let status = response.status;
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorMsg;
      } catch {}
      return { success: false, error: errorMsg, status };
    }

    const { accessToken } = await response.json();
    const payload = parseJwt(accessToken);
    if (!payload) return { success: false, error: "Token inválido" };
    await setAuthTokenCookie(accessToken, payload.exp);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao conectar com o servidor" };
  }
}

export async function forgotPassword(email: string) {
  try {
    const response = await fetch(`${apiBaseUrl}/v1/auth/forgot-password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      let errorMsg = "Erro ao solicitar redefinição de senha";
      let status = response.status;
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorMsg;
      } catch {}
      return { success: false, error: errorMsg, status };
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Erro ao conectar com o servidor" };
  }
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
