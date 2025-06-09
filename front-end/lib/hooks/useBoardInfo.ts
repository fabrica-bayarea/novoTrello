import { useState, useEffect } from 'react';
import { useNotificationStore } from '@/lib/stores/notification';
import { getBoardById } from '@/lib/actions/board'

interface BoardInfo {
  title: string;
  description?: string;
  isLoading: boolean;
}

export function useBoardInfo(boardId: string): BoardInfo {
  const [boardInfo, setBoardInfo] = useState<BoardInfo>({
    title: "Bay-Area",
    description: undefined,
    isLoading: true,
  });
  const { showNotification } = useNotificationStore();

  useEffect(() => {
    if (!boardId) return;

    const fetchBoardInfo = async () => {
      try {
        const { data } = await getBoardById(boardId);
        if ( data ) {
          setBoardInfo({
          title: data.name,
          description: "Workspace do projeto",
          isLoading: false,
        });
        }
      } catch (error) {
        showNotification("Erro ao carregar informações do board", "failed");
        setBoardInfo(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchBoardInfo();
  }, [boardId, showNotification]);

  return boardInfo;
}
