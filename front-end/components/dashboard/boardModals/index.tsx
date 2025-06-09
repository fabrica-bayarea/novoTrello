import React from 'react';
import CreateListModal from '@/components/dashboard/CreateList';
import CreateTaskModal from '@/components/dashboard/CreateTask';
import TaskDetailsModal from '@/components/dashboard/taskDetailsModal';
import type { Task } from '@/lib/types/board';

interface BoardModalsProps {
  // Modal de lista
  isCreateListModalOpen: boolean;
  closeCreateListModal: () => void;
  handleCreateListSubmit: (title: string) => void;
  
  // Modal de tarefa
  isCreateTaskModalOpen: boolean;
  closeCreateTaskModal: () => void;
  handleCreateTaskSubmit: (taskData: {
    title: string;
    description?: string;
    position: number;
    status: string;
    dueDate?: string;
  }) => void;
  selectedListId: string;
  getNextTaskPosition: (listId: string) => number;
  
  // Modal de detalhes
  isTaskDetailsModalOpen: boolean;
  closeTaskDetailsModal: () => void;
  selectedTask: Task | null;
}

export default function BoardModals({
  isCreateListModalOpen,
  closeCreateListModal,
  handleCreateListSubmit,
  isCreateTaskModalOpen,
  closeCreateTaskModal,
  handleCreateTaskSubmit,
  selectedListId,
  getNextTaskPosition,
  isTaskDetailsModalOpen,
  closeTaskDetailsModal,
  selectedTask,
}: BoardModalsProps) {
  return (
    <>
      <CreateListModal
        isOpen={isCreateListModalOpen}
        onClose={closeCreateListModal}
        onSubmit={handleCreateListSubmit}
      />

      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={closeCreateTaskModal}
        onSubmit={handleCreateTaskSubmit}
        listId={selectedListId}
        nextPosition={getNextTaskPosition(selectedListId)}
      />

      <TaskDetailsModal
        isOpen={isTaskDetailsModalOpen}
        onClose={closeTaskDetailsModal}
        task={selectedTask}
      />
    </>
  );
}
