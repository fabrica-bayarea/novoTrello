"use client";

import { useEffect, useState } from "react";
import { Check, Trash2 } from "lucide-react";

import { getBoards } from "@/lib/actions/board";
import { useNotificationStore } from '@/lib/stores/notification';

import Section from '@/components/dashboard/section/Section';

import styles from './style.module.css';

/*
* Dados fictícios para o dashboard
* TODO: Integrar com a API real
*/

const pendencias = [
  {
    id: 1,
    titulo: "Trocar o nome do trello",
    grupo: "Bay-Area",
    status: "Atrasado!",
    statusColor: "#e02b2b",
    andamento: "Andamento",
    data: "10/04/2025",
    atrasado: true
  },
  {
    id: 2,
    titulo: "Criar conta no dockerhub",
    grupo: "Bay-Area",
    status: "",
    statusColor: "#15bd2e",
    andamento: "Andamento",
    data: "20/05/2025",
    atrasado: false
  },
  {
    id: 3,
    titulo: "Criar modulo Auth",
    grupo: "Back-End",
    status: "",
    statusColor: "#15bd2e",
    andamento: "Andamento",
    data: "24/05/2025",
    atrasado: false
  }
];


interface Board {
  id: string;
  name: string;
  members: { id: string; name: string; avatar: string }[];
  image: string;
}

export default function Dashboard() {
  const [boards, setBoards] = useState<Board[]>([]);
  const { showNotification } = useNotificationStore()

  useEffect(() => {
    async function fetchBoards() {
      const result = await getBoards();
      if (result.success) {
        setBoards(result.data as Board[]);
      } else {
        showNotification(result.error || "Erro ao buscar boards", 'failed')
      }
    }
    fetchBoards();
  }, []);

  return (
    <main className={styles.dashboardMainCustom}>
      <Section title="Pendências">
        <div className={styles.pendenciasList}>
          {pendencias.map((p) => (
            <div className={styles.pendenciaRow} key={p.id}>
              <span className={styles.pendenciaTitulo}>{p.titulo}</span>
              <span className={styles.pendenciaAtrasadoWrapper}>
                {p.atrasado && <span className={styles.pendenciaAtrasado}>Atrasado!</span>}
              </span>
              <span className={styles.pendenciaGrupo}>{p.grupo}/<span>{p.andamento}</span></span>
              <button className={styles.pendenciaAction}><Trash2 size={18} /></button>
              <button className={styles.pendenciaAction}><Check size={18} /></button>
              <span className={styles.pendenciaData}>{p.data}</span>
            </div>
          ))}
        </div>
      </Section>
      
      <Section 
        title="Espaços de trabalho"
        actionButton={() => window.location.href = '/dashboard/new-board'}
      >
        <div className={styles.boardsGridCustom}>
          {boards.map((b) => (
            <div
              className={
                styles.boardCardCustom + ' ' + styles.noImage
              }
              key={b.id}
              onClick={() => window.location.href = `/dashboard/${b.id}`}
            >
              <div className={styles.boardImgCustom}></div>
              <div className={styles.boardInfoCustom}>
                <span className={styles.boardNameCustom}>{b.name}</span> 
                <span className={styles.boardMembrosCustom}>1 Membros</span> 
              </div>
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}