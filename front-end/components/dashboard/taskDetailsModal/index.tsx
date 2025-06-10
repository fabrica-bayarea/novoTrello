import React from 'react';
import { X, Calendar } from 'lucide-react';

import { useModalStore } from '@/lib/stores/modal';

import styles from './style.module.css';

export default function TaskDetailsModal() {
  const {
    isTaskDetailsModalOpen,
    selectedTask,
    closeTaskDetailsModal,
  } = useModalStore();

  if (!isTaskDetailsModalOpen || !selectedTask) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Não definida';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'pendente':
        return styles.statusPending;
      case 'in_progress':
      case 'em_progresso':
        return styles.statusInProgress;
      case 'completed':
      case 'concluído':
        return styles.statusCompleted;
      default:
        return styles.statusDefault;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pendente';
      case 'in_progress':
        return 'Em Progresso';
      case 'completed':
        return 'Concluído';
      default:
        return status;
    }
  };

  return (
    <div className={styles.overlay} onClick={closeTaskDetailsModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{selectedTask.title}</h2>
          <button className={styles.closeButton} onClick={closeTaskDetailsModal}>
            <X size={20} />
          </button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.field}>
            <label className={styles.label}>Descrição:</label>
            <p className={styles.description}>
              {selectedTask.description || 'Sem descrição'}
            </p>
          </div>
          
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>Status:</label>
              <span className={`${styles.status} ${getStatusColor(selectedTask.status)}`}>
                {getStatusLabel(selectedTask.status)}
              </span>
            </div>
            
            <div className={styles.field}>
              <label className={styles.label}>Data de Vencimento:</label>
              <div className={styles.dateContainer}>
                <Calendar size={16} />
                <span>{formatDate(selectedTask.dueDate || '')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
