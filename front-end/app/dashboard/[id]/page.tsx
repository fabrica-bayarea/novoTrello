"use client";

import React, { use } from 'react';

import BoardLists from '@/components/dashboard/boardLists';
import Section from '@/components/dashboard/section/Section';
import CreateListModal from '@/components/dashboard/CreateList';
import CreateTaskModal from '@/components/dashboard/CreateTask';
import TaskDetailsModal from '@/components/dashboard/taskDetailsModal';

import { useModalStore } from '@/lib/stores/modal';;

import styles from './style.module.css';

export default function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: boardId } = use(params);

  const {
    openCreateListModal,
  } = useModalStore();

  return (
    <main className={styles.dashboardMainCustom}>
      <Section
        title="Bay-Area"
        actionButton={openCreateListModal}
      >
        <BoardLists boardId={ boardId }/>
      </Section>
      <CreateListModal boardId={ boardId }/>
      <CreateTaskModal />
      <TaskDetailsModal/>
    </main>
  );
}
