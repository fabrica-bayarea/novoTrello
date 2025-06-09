"use client";

import React, { useState, useEffect } from 'react';

import { useModalStore } from '@/lib/stores/modal';
import { useListOperations } from '@/lib/hooks/useListOperations';

import styles from './style.module.css';

export default function CreateListModal({ boardId }: { boardId: string }) {
    const [title, setTitle] = useState('');
    const {
      isCreateListModalOpen,
      closeCreateListModal,
    } = useModalStore();
    const { handleCreateList } = useListOperations(boardId);

  useEffect(() => {
    if (isCreateListModalOpen) {
      setTitle('');
    }
  }, [isCreateListModalOpen]);

  if (!isCreateListModalOpen) return null;

  const handleSubmit = () => {
    if (title.trim()) {
      handleCreateList(title.trim());
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeCreateListModal();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <h2>Criar Nova Lista</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite o título da lista"
          className={styles.modalInput}
          autoFocus
        />
        <div className={styles.modalActions}>
          <button onClick={closeCreateListModal} className={styles.cancelButton}>Cancelar</button>
          <button onClick={handleSubmit} className={styles.submitButton}>Criar Lista</button>
        </div>
      </div>
    </div>
  );
};