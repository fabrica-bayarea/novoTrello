import { create } from 'zustand';
import type { Task } from '@/lib/types/board';

interface ModalState {
  // Estados dos modais
  isCreateListModalOpen: boolean;
  isCreateTaskModalOpen: boolean;
  isTaskDetailsModalOpen: boolean;
  
  // Estados específicos
  selectedListId: string;
  selectedTask: Task | null;
  
  // Actions para modal de lista
  openCreateListModal: () => void;
  closeCreateListModal: () => void;
  
  // Actions para modal de tarefa
  openCreateTaskModal: (listId: string) => void;
  closeCreateTaskModal: () => void;
  
  // Actions para modal de detalhes
  openTaskDetailsModal: (task: Task) => void;
  closeTaskDetailsModal: () => void;
}

export const useModalStore = create<ModalState>()((set) => ({
  // Estado inicial
  isCreateListModalOpen: false,
  isCreateTaskModalOpen: false,
  isTaskDetailsModalOpen: false,
  selectedListId: "",
  selectedTask: null,

  // Actions para modal de lista
  openCreateListModal: () => set({ isCreateListModalOpen: true }),
  closeCreateListModal: () => set({ isCreateListModalOpen: false }),

  // Actions para modal de tarefa
  openCreateTaskModal: (listId) => set({ 
    isCreateTaskModalOpen: true, 
    selectedListId: listId 
  }),
  closeCreateTaskModal: () => set({ 
    isCreateTaskModalOpen: false, 
    selectedListId: "" 
  }),

  // Actions para modal de detalhes
  openTaskDetailsModal: (task) => set({ 
    isTaskDetailsModalOpen: true, 
    selectedTask: task 
  }),
  closeTaskDetailsModal: () => set({ 
    isTaskDetailsModalOpen: false, 
    selectedTask: null 
  }),
}));
