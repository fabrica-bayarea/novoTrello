import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
    <section className={styles.loginSection}>
      <h1 className={styles.h1}>ACESSE SUA CONTA</h1>
      <div className={styles.divInput}>
             <span className={`material-symbols-outlined ${styles.icon}`}>
            account_circle
            </span> 
        <input className={styles.inputs} type="email" name="emailL" id="emailL" placeholder="Nome de usuário ou email"/>
        </div>


      <div className={styles.divInput}>
            <span  className={`material-symbols-outlined ${styles.icon}`}>
            lock
            </span>
        <input className={styles.inputs} type="password" name="SenhaL" id="SenhaL" placeholder="Digite sua senha"/>
      </div>

      <div className={styles.checkbox}>
        <p className={styles.checkbox} ><input className={styles.checkbox} type="checkbox" name="manterConectado" id="manterConectado"/>Continuar conectado</p>
      </div>

      <input className={styles.enter} type="button" value="ENTRAR" />
       <p className={styles.forgot} >Esqueceu sua senha? </p>
       <a className={styles.link} href="#">Clique aqui</a> 
       <div className={styles.divider}>
<span>Conecte-se também com:</span>
</div>

<div className={styles.socialIcons}>
<img src="../images/google.png" alt="Login com Google" />
<img src="../images/microsoft.png" alt="Login com Microsoft" />
</div>

<div className={styles.createAccount}>
<span>Clique aqui para criar uma conta.</span>
</div>

      <p className={styles.rodape}>IESB - BAY AREA</p>
    </section>
  </main>
  );
}
