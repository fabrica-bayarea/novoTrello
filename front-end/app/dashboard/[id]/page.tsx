"use client";

import React, { useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';

import BoardLists from '@/components/dashboard/boardLists';
import Section from '@/components/dashboard/section/Section';

import styles from './style.module.css';

export default function BoardPage() {
  interface Task {
    id: string;
    content: string;
  }
  
  interface List {
    id: string;
    title: string;
    tasks: Task[];
  }
  
  const [lists, setLists] = useState<List[]>([]);

  // Adiciona uma nova lista à direita
  const handleAddList = () => {
    const newId = `list-${lists.length + 1}`;
    setLists([
      ...lists,
      {
        id: newId,
        title: `Lista ${lists.length + 1}`,
        tasks: [],
      },
    ]);
  };

  // Adiciona uma nova tarefa ao topo da lista
  const handleAddTask = (listId: string) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          const newTaskNumber = list.tasks.length > 0 ? Math.max(...list.tasks.map(t => parseInt(t.content.replace(/\D/g, '')) || 0)) + 1 : 1;
          return {
            ...list,
            tasks: [
              { id: `${Date.now()}-${Math.random()}`, content: `Tarefa ${newTaskNumber}` },
              ...list.tasks,
            ],
          };
        }
        return list;
      })
    );
  };

  // Drag and drop handlers (mock, sem persistência)
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    // Drag de listas
    const activeListIdx = lists.findIndex((l) => l.id === active.id);
    const overListIdx = lists.findIndex((l) => l.id === over.id);
    if (activeListIdx !== -1 && overListIdx !== -1) {
      setLists((prev) => arrayMove(prev, activeListIdx, overListIdx));
      return;
    }

    // Drag de tarefas (pode ser entre listas)
    let sourceListIdx = -1;
    let taskIdx = -1;
    lists.forEach((list, idx) => {
      const idxTask = list.tasks.findIndex((t) => t.id === active.id);
      if (idxTask !== -1) {
        sourceListIdx = idx;
        taskIdx = idxTask;
      }
    });
    if (sourceListIdx === -1) return;

    // Descobrir lista de destino
    let destListIdx = lists.findIndex((l) => l.id === over.id);
    let destTaskIdx = -1;
    if (destListIdx === -1) {
      // Se não for uma lista, é uma tarefa
      lists.forEach((list, idx) => {
        const idxTask = list.tasks.findIndex((t) => t.id === over.id);
        if (idxTask !== -1) {
          destListIdx = idx;
          destTaskIdx = idxTask;
        }
      });
    }

    if (destListIdx === -1) return;

    setLists((prev) => {
      const newLists = prev.map((l) => ({ ...l, tasks: [...l.tasks] }));
      // Remove da lista de origem
      const [removed] = newLists[sourceListIdx].tasks.splice(taskIdx, 1);
      // Adiciona na lista de destino
      if (destTaskIdx === -1) {
        // Soltou no topo da lista
        newLists[destListIdx].tasks.unshift(removed);
      } else {
        // Soltou sobre uma tarefa
        newLists[destListIdx].tasks.splice(destTaskIdx, 0, removed);
      }
      return newLists;
    });
  };

  return (
    <main className={styles.dashboardMainCustom}>
      <Section 
        title="Bay-Area"
        actionButton={handleAddList}
      >
        <BoardLists lists={lists} onAddTask={handleAddTask} onDragEnd={handleDragEnd} />
      </Section>
    </main>
  );
}
