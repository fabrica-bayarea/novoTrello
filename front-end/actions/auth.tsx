"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const apiBaseUrl = process.env.API_HOST + ":" + process.env.API_PORT;

export async function login(email: string, password: string, rememberMe: boolean) {
  try {
    const response = await fetch(`${apiBaseUrl}/v1/auth/signin`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        email: email, 
        password: password,
        rememberMe: rememberMe,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, error: errorData.message || "Erro ao fazer login" }
    }

    const data = await response.json()

    const cookieStore = await cookies();
    cookieStore.set({
      name: "auth-token",
      value: data.token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
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
      body: JSON.stringify({ fullName, userName, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || "Erro ao fazer registro" };
    }

    const { token } = await response.json();

    // Armazenar o token em um cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
    });

    return { success: true };
  } catch (error: any) {
    console.error("Erro ao registrar usuário:", error);
    return { success: false, error: "Erro ao conectar com o servidor" };
  }
}

export async function checkAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")

  if (!token) {
    return false
  }

  try {
    const response = await fetch("API_URL/check-auth", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return false
    }

    return true
  } catch (error) {
    return false
  }
}

// Função para logout
export async function logout() {
  try {
    const cookieStore = await cookies()

    cookieStore.delete("auth-token")
    redirect("/auth/login")
  } catch (error) {
    console.error("Erro ao fazer logout:", error)
    redirect("/auth/login")
  }
}
