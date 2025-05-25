"use server";

import { getAuthTokenCookie, handleFetchError } from "@/lib/utils/auth";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


export async function getUserProfile() {
  const token = await getAuthTokenCookie();

  const response = await fetch(`${apiBaseUrl}/v1/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    await handleFetchError(response, "Erro ao obter perfil do usuário");
  }

  return await response.json();
}

export async function updateUserProfile(formData: { name: string; userName: string; email: string; }) {
  const token = await getAuthTokenCookie();

  const response = await fetch(`${apiBaseUrl}/v1/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    await handleFetchError(response, "Erro ao atualizar perfil");
  }

  return await response.json();
}

export async function deleteUserProfile() {
  const token = await getAuthTokenCookie();

  const response = await fetch(`${apiBaseUrl}/v1/profile`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    await handleFetchError(response, "Erro ao deletar perfil");
  }
  
  return await response.json();
}

