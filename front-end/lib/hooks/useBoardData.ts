import { useEffect } from 'react';

import { getAllList } from '@/lib/actions/list';
import { getTasksByList } from '@/lib/actions/task';
import { useBoardStore } from '@/lib/stores/board';
import { useNotificationStore } from '@/lib/stores/notification';

import { List, Task } from '@/lib/types/board'

export function useBoardData(boardId: string) {
  const { setLists, setLoading } = useBoardStore();
  const { showNotification } = useNotificationStore();

  useEffect(() => {
    if (!boardId) return;

    const fetchBoardData = async () => {
      setLoading(true);
      
      try {
        const result = await getAllList(boardId);
        if (result.success) {
          const listsWithTasks = await Promise.all(
            (result.data || []).map(async (list: List) => {
              const tasksResult = await getTasksByList(list.id);
              return {
                ...list,
                tasks: tasksResult.success && tasksResult.data ? tasksResult.data.map((task: Task) => ({
                  id: task.id,
                  title: task.title,
                  description: task.description,
                  position: task.position,
                  status: task.status,
                  dueDate: task.dueDate
                })) : []
              };
            })
          );
          setLists(listsWithTasks);
        } else {
          showNotification("Erro ao buscar dados do quadro: " + result.error, "failed");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBoardData();
  }, [boardId, setLists, setLoading, showNotification]);
}
