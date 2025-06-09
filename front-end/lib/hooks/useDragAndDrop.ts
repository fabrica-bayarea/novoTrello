import { useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import type { DragEndEvent } from '@dnd-kit/core';
import { useBoardStore } from '@/lib/stores/board';

export function useDragAndDrop() {
  const { lists, setLists, getListIndex, getTaskPosition, moveTask } = useBoardStore();

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Lógica para arrastar listas
    const activeListIdx = getListIndex(active.id as string);
    const overListIdx = getListIndex(over.id as string);

    if (activeListIdx !== -1 && overListIdx !== -1) {
      const newLists = arrayMove(lists, activeListIdx, overListIdx);
      setLists(newLists);
      return;
    }

    // Lógica para arrastar tarefas
    const sourcePosition = getTaskPosition(active.id as string);
    if (!sourcePosition) return;

    const { listIndex: sourceListIdx, taskIndex: taskIdx } = sourcePosition;

    // Verificar se está sendo solto em uma lista
    let destListIdx = getListIndex(over.id as string);
    let destTaskIdx = -1;

    // Se não for uma lista, verificar se é uma tarefa
    if (destListIdx === -1) {
      const destPosition = getTaskPosition(over.id as string);
      if (destPosition) {
        destListIdx = destPosition.listIndex;
        destTaskIdx = destPosition.taskIndex;
      }
    }

    if (destListIdx === -1) return;

    moveTask(sourceListIdx, taskIdx, destListIdx, destTaskIdx === -1 ? undefined : destTaskIdx);
  }, [lists, setLists, getListIndex, getTaskPosition, moveTask]);

  return {
    handleDragEnd,
  };
}
