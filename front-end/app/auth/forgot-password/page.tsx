"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

import styles from "@/app/auth/style.module.css";
import { forgotPassword } from "@/actions/auth";

export default function ForgotPassword() {
  const router = useRouter()
  const [email, setEmail] = useState("")

  async function handleSubmit(e: React.FormEvent) {
      e.preventDefault()

      try {
        const result = await forgotPassword(email)
        console.log(result)
        if (result.success) {
          router.push("/auth/login")
          router.refresh()
        }
      } catch (err) {
        console.log(err)
      }
  }
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
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Insira o seu email"
              className={`${styles.input} ${styles.inputWithIconPadding}`}
            />
          </div>
        </div>

        <button type="submit" onClick={handleSubmit} className={`${styles.button} ${styles.forgotPasswordButton}`}>
          ENVIAR E-MAIL
        </button>
      </form>

      <div className={styles.footer}>IESB - BAY AREA</div>
    </div>
  )
}
