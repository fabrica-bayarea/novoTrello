import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableItem from '@/components/dashboard/sortableItem';
import { useDroppable } from '@dnd-kit/core';
import { Trash2 } from 'lucide-react';

import { useTaskOperations } from '@/lib/hooks/useTaskOperations';
import { useListOperations } from '@/lib/hooks/useListOperations';
import { useModalStore } from '@/lib/stores/modal';
import type { Task } from '@/lib/types/board';

import styles from './style.module.css';

interface ListCardProps {
  list: {
    id: string;
    title: string;
    tasks: Task[];
  }
}

export default function ListCard({ list }: ListCardProps) {
  const { setNodeRef } = useDroppable({ id: list.id });
  const { handleDeleteList } = useListOperations( list.id );
  const { handleDeleteTask } = useTaskOperations();
  const { openCreateTaskModal, openTaskDetailsModal } = useModalStore();
  return (
    <div className={styles.listCard}>
      <div className={styles.listHeader}>
        <div className={styles.listTitle}>{list.title}</div>
        <button 
          onClick={() => handleDeleteList(list.id)} 
          className={styles.deleteButton}
          title="Deletar lista"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <input onClick={() => openCreateTaskModal(list.id)} className={styles.addTaskButton} type='button' value='+ Tarefa' />
      <SortableContext items={list.tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} style={{ minHeight: 40 }}>
          {list.tasks.map((task) => (
            <SortableItem key={task.id} id={task.id}>
              <div className={styles.taskCard}>
                <span 
                  onClick={() => openTaskDetailsModal(task)} 
                  style={{ cursor: 'pointer' }}
                >
                  {task.title}
                </span>
                <button 
                  onClick={() => handleDeleteTask(task.id)} 
                  className={styles.deleteTaskButton}
                  title="Deletar tarefa"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
