import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';

import SortableItem from '@/components/dashboard/sortableItem';
import ListCard from '@/components/dashboard/listCard';
import styles from './style.module.css';

interface Task {
  id: string;
  content: string;
}

interface List {
  id: string;
  title: string;
  tasks: Task[];
}

interface BoardListsProps {
  lists: List[];
  onAddTask: (listId: string) => void;
  onDragEnd: (event: any) => void;
}

export default function BoardLists({ lists, onAddTask, onDragEnd }: BoardListsProps) {
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={lists.map((l) => l.id)} strategy={horizontalListSortingStrategy}>
        <div className={styles.listsContainer}>
          {lists.map((list) => (
            <SortableItem key={list.id} id={list.id}>
              <ListCard
                id={list.id}
                title={list.title}
                tasks={list.tasks}
                onAddTask={onAddTask}
              />
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
