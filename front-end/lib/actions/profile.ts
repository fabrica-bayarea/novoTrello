"use server";

import { getAuthTokenCookie, handleFetchError } from "@/lib/utils/tokenCookie";

const BASE_URL_API = process.env.BASE_URL_API || 'http://localhost:3000';

export async function getUserProfile() {
  const token = await getAuthTokenCookie();

  const response = await fetch(`${BASE_URL_API}/v1/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    return { 
      success: false,
      error: await handleFetchError(response, "Erro ao obter perfil do usuário"),
    };
  }
  
  return { success: true, data: await response.json() }
}

export async function updateUserProfile(formData: { name: string; userName: string; email: string; }) {
  const token = await getAuthTokenCookie();

  const response = await fetch(`${BASE_URL_API}/v1/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    return { 
      success: false,
      error: await handleFetchError(response, "Erro ao atualizar perfil"),
    };
  }

  return { success: true, data: await response.json() }
}

export async function deleteUserProfile() {
  const token = await getAuthTokenCookie();

  const response = await fetch(`${BASE_URL_API}/v1/profile`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return { 
      success: false, 
      error: await handleFetchError(response, "Erro ao deletar perfil"),
    };
  }
  
  return { success: true, data: await response.json() }
}

