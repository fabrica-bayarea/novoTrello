import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableItem from '@/components/dashboard/sortableItem';
import { useDroppable } from '@dnd-kit/core';
import styles from './style.module.css';

interface Task {
  id: string;
  content: string;
}

interface ListCardProps {
  id: string;
  title: string;
  tasks: Task[];
  onAddTask: (listId: string) => void;
}

export default function ListCard({ id, title, tasks, onAddTask }: ListCardProps) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div className={styles.listCard}>
      <div className={styles.listTitle}>{title}</div>
      <input onClick={() => onAddTask(id)} className={styles.addTaskButton} type='button' value='+ Tarefa' />
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} style={{ minHeight: 40 }}>
          {tasks.map((task) => (
            <SortableItem key={task.id} id={task.id}>
              <div className={styles.taskCard}>{task.content}</div>
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
