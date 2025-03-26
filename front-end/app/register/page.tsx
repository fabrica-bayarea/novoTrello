import styles from "./register.module.css";
export default function register(){
    return(
        <main className={styles.main}>
            <img className={styles.logo} src="/images/logoIesb.png" alt="Logo IESB" />
            <section className={styles.registerSection}>
                <h1>CRIE UMA CONTA</h1>
                <div>
                    <input className={styles.divInput}type="text" name="name" id="name" placeholder="Digite seu nome completo" />
                </div>
                <div>
                    <input className={styles.divInput} type="email" name="email" id="email" placeholder="Digite seu email" />
                </div>
                <div>
                    <label>Senha</label>
                    <input className={styles.divInput} type="password" name="password" id="password" placeholder="Digite sua senha" />
                </div>
                <div>
                    <label>Confirme sua senha</label>
                    <input className={styles.divInput} type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirme sua senha" />
                </div>
                <input className={styles.submit} type="button" value="Registrar" />
            </section>
        </main>
    )
}