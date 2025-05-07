"use server"

import { cookies } from "next/headers"

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function login(email: string, password: string, rememberMe: boolean) {
  try {
    const response = await fetch(`${apiBaseUrl}/v1/auth/signin`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, rememberMe }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, error: errorData.message || "Erro ao fazer login" }
    }

    const { accessToken } = await response.json()

    const cookieStore = await cookies();

    const payload = JSON.parse(
      Buffer.from(accessToken.split('.')[1], 'base64').toString()
    )

    cookieStore.set({
      name: "auth-token",
      value: accessToken,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(payload.exp * 1000),
    });

    return { success: true }
  } catch (error) {
    return { success: false, error: "Erro ao conectar com o servidor" }
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
      const errorData = await response.json();
      return { success: false, error: errorData.message || "Erro ao fazer registro" };
    }

    const { accessToken } = await response.json()

    const cookieStore = await cookies();

    const payload = JSON.parse(
      Buffer.from(accessToken.split('.')[1], 'base64').toString()
    )

    cookieStore.set({
      name: "auth-token",
      value: accessToken,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(payload.exp * 1000),
    });

    return { success: true };
  } catch (error: any) {
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
      const errorData = await response.json();
      return { success: false, error: errorData.message || "Erro ao solicitar redefinição de senha" };
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Erro ao conectar com o servidor" };
  }
}

// TODO implementar essas funções.

// export async function checkAuth() {
//   const cookieStore = await cookies()
//   const token = cookieStore.get("auth-token")

//   if (!token) {
//     return false
//   }

//   try {
//     const response = await fetch("API_URL/check-auth", {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })

//     if (!response.ok) {
//       return false
//     }

//     return true
//   } catch (error) {
//     return false
//   }
// }

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
