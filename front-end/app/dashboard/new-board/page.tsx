import NewBoardForm from "./NewBoardForm";
import styles from "./style.module.css";

export default function NewBoardPage() {
  return (
    <div className={styles.container}>
      <p style={{ color: '#777', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
        Dashboard &gt; new-board
      </p>
      <h2 className={styles.title}>Criar um espaço de trabalho</h2>
      <NewBoardForm />
    </div>
  );
}
