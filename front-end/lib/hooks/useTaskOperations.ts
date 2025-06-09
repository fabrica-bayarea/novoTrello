import { useCallback } from 'react';
import { createTask, deleteTask } from '@/lib/actions/task';
import { useBoardStore } from '@/lib/stores/board';
import { useModalStore } from '@/lib/stores/modal';
import { useNotificationStore } from '@/lib/stores/notification';
import type { CreateTaskData } from '@/lib/types/board';

export function useTaskOperations() {
  const { addTask, removeTask, getNextTaskPosition } = useBoardStore();
  const { selectedListId, closeCreateTaskModal } = useModalStore();
  const { showNotification } = useNotificationStore();

  const handleCreateTask = useCallback(async (taskData: CreateTaskData) => {
    if (!taskData.title || taskData.title.trim() === "") {
      showNotification("O título da tarefa não pode estar vazio.", "failed");
      return;
    }

    const newTaskData = {
      listId: selectedListId,
      ...taskData
    };

    const result = await createTask(newTaskData);
    if (result.success && result.data) {
      const task = {
        id: result.data.id,
        title: result.data.title,
        description: result.data.description,
        position: result.data.position,
        status: result.data.status,
        dueDate: result.data.dueDate
      };
      
      addTask(selectedListId, task);
      closeCreateTaskModal();
      showNotification("Tarefa criada com sucesso!", "success");
    } else {
      showNotification("Erro ao criar tarefa: " + result.error, "failed");
    }
  }, [selectedListId, addTask, closeCreateTaskModal, showNotification]);

  const handleDeleteTask = useCallback(async (taskId: string) => {
    const result = await deleteTask(taskId);
    if (result.success) {
      removeTask(taskId);
      showNotification("Tarefa deletada com sucesso!", "success");
    } else {
      showNotification(result.error || 'Erro ao deletar tarefa', "failed");
    }
  }, [removeTask, showNotification]);

  return {
    handleCreateTask,
    handleDeleteTask,
    getNextTaskPosition,
  };
}
