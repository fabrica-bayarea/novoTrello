import { useCallback } from 'react';
import { createList, deleteList } from '@/lib/actions/list';
import { useBoardStore } from '@/lib/stores/board';
import { useModalStore } from '@/lib/stores/modal';
import { useNotificationStore } from '@/lib/stores/notification';
import type { CreateListData } from '@/lib/types/board';

export function useListOperations(boardId: string) {
  const { lists, addList, removeList } = useBoardStore();
  const { closeCreateListModal } = useModalStore();
  const { showNotification } = useNotificationStore();

  const handleCreateList = useCallback(async (title: string) => {
    if (!title || title.trim() === "") {
      showNotification("O título da lista não pode estar vazio.", "failed");
      return;
    }

    const newPosition = lists.length > 0 ? Math.max(...lists.map(l => l.position || 0)) + 1 : 1;
    const newListData: CreateListData = {
      boardId: boardId,
      title: title.trim(),
      position: newPosition,
      tasks: [],
    };

    try {
      const result = await createList(newListData);
      if (result.success) {
        addList({ ...result.data, tasks: result.data.tasks || [] });
        closeCreateListModal();
        showNotification("Lista criada com sucesso!", "success");
      } else {
        showNotification("Erro ao adicionar lista: " + result.error, "failed");
      }
    } catch (error) {
      showNotification("Erro inesperado ao criar lista", "failed");
    }
  }, [boardId, lists, addList, closeCreateListModal, showNotification]);

  const handleDeleteList = useCallback(async (listId: string) => {
    try {
      const result = await deleteList(listId);
      if (result.success) {
        removeList(listId);
        showNotification("Lista deletada com sucesso!", "success");
      } else {
        showNotification(result.error || 'Erro ao deletar lista', "failed");
      }
    } catch (error) {
      showNotification('Erro inesperado ao deletar lista', "failed");
    }
  }, [removeList, showNotification]);

  return {
    handleCreateList,
    handleDeleteList,
  };
}
