"use client";

import React, { useState, useEffect } from 'react';

import { useModalStore } from '@/lib/stores/modal';
import { useTaskOperations } from '@/lib/hooks/useTaskOperations';

import { Input, Textarea } from "@/components/ui";

import styles from './style.module.css';

export default function EditTaskModal () {
  const { handleEditTask } = useTaskOperations();
  const { selectedTask, isEditTaskModalOpen, closeEditTaskModal } = useModalStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (isEditTaskModalOpen && selectedTask) {
      setTitle(selectedTask.title || '');
      setDescription(selectedTask.description || '');
      setStatus(selectedTask.status || 'pending');
      setDueDate(selectedTask.dueDate ? toLocalDateTime(selectedTask.dueDate) : '');
    }
  }, [isEditTaskModalOpen, selectedTask]);

  if (!isEditTaskModalOpen || !selectedTask) return null;

  function toLocalDateTime(iso: string) {
    const date = new Date(iso);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  const formatToISO = (dateTimeLocal: string): string | undefined => {
    if (!dateTimeLocal.trim()) return undefined;
    try {
      const date = new Date(dateTimeLocal);
      if (isNaN(date.getTime())) return undefined;
      return date.toISOString();
    } catch {
      return undefined;
    }
  };

  const handleSubmit = () => {
    if (title.trim()) {
      handleEditTask(
        selectedTask.id,
        {
          title: title.trim(),
          description: description.trim() || undefined,
          status,
          dueDate: formatToISO(dueDate),
          position: selectedTask.position
        }
      );
      closeEditTaskModal();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeEditTaskModal();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <h2>Editar Tarefa</h2>
        
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título da tarefa"
          className={styles.modalInput}
          autoFocus
        />
        
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição (opcional)"
          className={styles.modalTextarea}
          rows={3}
        />
        
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={styles.modalSelect}
        >
          <option value="pending">Pendente</option>
          <option value="in-progress">Em Progresso</option>
          <option value="completed">Concluída</option>
        </select>
        
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          placeholder="Data de vencimento (opcional)"
          className={styles.modalInput}
        />
              
        <div className={styles.modalActions}>
          <button onClick={closeEditTaskModal} className={styles.cancelButton}>Cancelar</button>
          <button onClick={handleSubmit} className={styles.submitButton}>Salvar Alterações</button>
        </div>
      </div>
    </div>
  );
};