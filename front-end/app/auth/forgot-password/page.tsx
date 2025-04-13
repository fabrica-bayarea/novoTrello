import styles from "@/app/auth/style.module.css";
import Image from "next/image"

export default function ForgotPassword() {
  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>ESQUECEU SUA SENHA?</h1>

      <div className={styles.forgotPasswordText}>
        <p>
          Para redefinir sua senha, insira seu e-mail cadastrado e clique em "Enviar e-mail". Você receberá um e-mail
          com instruções para a redefinição.
        </p>
      </div>

      <form className={styles.form}>
        <div className={styles.inputGroup}>
          <div className={styles.inputWithIcon}>
            <input
              type="email"
              placeholder="Insira o seu email"
              className={`${styles.input} ${styles.inputWithIconPadding}`}
            />
          </div>
        </div>

        <button type="submit" className={`${styles.button} ${styles.forgotPasswordButton}`}>
          ENVIAR E-MAIL
        </button>
      </form>

      <div className={styles.footer}>IESB - BAY AREA</div>
    </div>
  )
}
