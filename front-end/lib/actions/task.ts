'use server';

import { getAuthTokenCookie, handleFetchError } from "@/lib/utils/tokenCookie";

const BASE_URL_API = process.env.BASE_URL_API || 'http://localhost:3000';

interface TaskData {
  listId: string;
  title: string;
  description?: string;
  position: number;
  status: string;
  dueDate?: string;
}

interface UpdateTaskData {
  listId?: string;
  title?: string;
  description?: string;
  position?: number;
  status?: string;
  dueDate?: string;
}

interface TaskResponse {
  id: string;
  listId: string;
  title: string;
  description?: string;
  position: number;
  status: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export async function createTask(taskData: TaskData) {
  const token = await getAuthTokenCookie();
  const response = await fetch(`${BASE_URL_API}/v1/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    return {
      success: false,
      error: await handleFetchError(response, "Falha ao criar a tarefa"),
    };
  }

  const data: TaskResponse = await response.json();
  return { success: true, data };
}

export async function getTasksByList(listId: string) {
  const token = await getAuthTokenCookie();
  const response = await fetch(`${BASE_URL_API}/v1/tasks/list/${listId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return {
      success: false,
      error: await handleFetchError(response, "Falha ao buscar as tarefas da lista"),
    };
  }

  const data: TaskResponse[] = await response.json();
  return { success: true, data };
}

export async function getTaskById(taskId: string) {
  const token = await getAuthTokenCookie();
  const response = await fetch(`${BASE_URL_API}/v1/tasks/${taskId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return {
      success: false,
      error: await handleFetchError(response, "Falha ao buscar a tarefa"),
    };
  }

  const data: TaskResponse = await response.json();
  return { success: true, data };
}

export async function updateTask(taskId: string, updateData: UpdateTaskData) {
  const token = await getAuthTokenCookie();
  const response = await fetch(`${BASE_URL_API}/v1/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    return {
      success: false,
      error: await handleFetchError(response, "Falha ao atualizar a tarefa"),
    };
  }

  const data: TaskResponse = await response.json();
  return { success: true, data };
}

export async function deleteTask(taskId: string) {
  const token = await getAuthTokenCookie();
  const response = await fetch(`${BASE_URL_API}/v1/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return {
      success: false,
      error: await handleFetchError(response, "Falha ao deletar a tarefa"),
    };
  }

  return { success: true, data: { message: 'Tarefa deletada com sucesso' } };
}

export async function moveTask(taskId: string, newPosition: number) {
  const token = await getAuthTokenCookie();
  const response = await fetch(`${BASE_URL_API}/v1/tasks/${taskId}/position`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ newPosition }),
  });

  if (!response.ok) {
    return {
      success: false,
      error: await handleFetchError(response, "Falha ao mover a tarefa"),
    };
  }
  
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return { success: true, data: await response.json() };
  } else {
    return { success: true, data: null };
  }
}

export async function getExpiredTasks() {
  const token = await getAuthTokenCookie();
  const response = await fetch(`${BASE_URL_API}/v1/tasks/due/today`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return {
      success: false,
      error: await handleFetchError(response, "Falha ao buscar tarefas expiradas"),
    };
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data = await response.json();
    return { success: true, data };
  } else {
    return { success: true, data: [] };
  }
}
