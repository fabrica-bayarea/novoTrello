import { Check, Trash2, PlusCircle } from "lucide-react";
import styles from './style.module.css';
import Section from "@/components/section";
import Image from "next/image";

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

const boards = [
  {
    id: 1,
    nome: "Bay-Area",
    membros: 8,
    img: "/images/board1.jpg"
  },
  {
    id: 2,
    nome: "Back-end",
    membros: 8,
    img: "/images/board2.jpg"
  }
];

export default function Dashboard() {
  return (
    <main className={styles.dashboardMainCustom}>
      <div className={styles.sectionCustom}>
        <div className={styles.sectionHeaderCustom}>
          <span>Pendências</span>
        </div>
        <div className={styles.pendenciasList}>
          {pendencias.map((p) => (
            <div className={styles.pendenciaRow} key={p.id}>
              <span className={styles.pendenciaTitulo}>{p.titulo}</span>
              <span className={styles.pendenciaGrupo}>{p.grupo}/<span>{p.andamento}</span></span>
              {p.atrasado && <span className={styles.pendenciaAtrasado}>Atrasado!</span>}
              <button className={styles.pendenciaAction}><Trash2 size={18} /></button>
              <button className={styles.pendenciaAction}><Check size={18} /></button>
              <span className={styles.pendenciaData}>{p.data}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.sectionCustom}>
        <div className={styles.sectionHeaderCustom}>
          <span>Espaços de trabalho</span>
          <button className={styles.criarButton}>Criar <PlusCircle size={20} /></button>
        </div>
        <div className={styles.boardsGridCustom}>
          {boards.map((b) => (
            <div
              className={
                b.img
                  ? styles.boardCardCustom
                  : styles.boardCardCustom + ' ' + styles.noImage
              }
              key={b.id}
            >
              {b.img ? (
                <Image src={b.img} alt={b.nome} width={180} height={100} className={styles.boardImgCustom} />
              ) : (
                <div className={styles.boardImgCustom} />
              )}
              <div className={styles.boardInfoCustom}>
                <span className={styles.boardNameCustom}>{b.nome}</span>
                <span className={styles.boardMembrosCustom}>{b.membros} Membros</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}