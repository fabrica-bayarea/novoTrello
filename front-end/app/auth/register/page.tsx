import styles from "./style.module.css";

export default function Register() {
  return (
    <main className={styles.main}>
      <section className={styles.registerSection}>
        <h1 className={styles.title}>CRIE UMA CONTA</h1>

        <div>
          <input
            className={styles.divInput}
            type="text"
            name="name"
            id="name"
            placeholder="Digite seu nome completo"
          />
        </div>

        <div>
          <input
            className={styles.divInput}
            type="email"
            name="email"
            id="email"
            placeholder="Digite seu email"
          />
        </div>

        <input
            className={styles.divInput}
            type="email"
            name="email"
            id="email"
            placeholder="Confirme seu email"
          />
        <div>
          <input
            className={styles.divInput}
            type="password"
            name="password"
            id="password"
            placeholder="Crie uma senha"
          />
        </div>

        <div className={styles.divText}>
          <p className={styles.text}>
            Combinação de 8 a 25 letras (maiúsculas/minúsculas), números e símbolos sem espaços.
          </p>
        </div>

        <div>
          <input
            className={styles.divInput}
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirme sua senha"
          />
        </div>

        <div>
            <input
              className={styles.checkbox}
              type="checkbox"
              name="acceptTerms"
              id="acceptTerms"
            />
            <label htmlFor="acceptTerms">
              Li e aceito a <a href="/politica-de-privacidade" className={styles.privacyLink}>Política de Privacidade</a>
            </label>
        </div>

        <input className={styles.submit} type="button" value="Registrar" />

        <p className={styles.rodape}>IESB - BAY AREA</p>
      </section>
    </main>
  );
}
