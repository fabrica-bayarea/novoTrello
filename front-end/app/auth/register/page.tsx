"use client"

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/actions/auth";
import styles from "@/app/auth/style.module.css";
import { CheckCircle } from "lucide-react";

export default function Register() {
  const router = useRouter()
  const [fullname, setFullName] = useState("")
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [confirmEmail, setconfirmEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setconfirmConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if(confirmEmail != email){
      setError("E-mails não coincidem")
      return;
    }
    if(confirmPassword != password){
      setError("Senhas não coincidem")
      return;
    }
    try {
      const result = await register(fullname, userName, email, password)

      if (result.success) {
        router.push("/dashboard")
        await new Promise((resolve) => setTimeout(resolve, 2000));
        router.refresh()
      } else {
        setError(result.error || "Falha na autenticação")
      }
    } catch (err) {
      setError("Ocorreu um erro ao tentar fazer registro")
    } finally {
      setIsSuccess(true)
    }
  }

  if (isSuccess) {
    return (
      <div className={styles.formContainer}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
            <CheckCircle size={60} color="white" strokeWidth={3} />
          </div>

          <div className={styles.successMessage}>CONTA CRIADA COM SUCESSO!</div>

          <div className={styles.successRedirect}>
            <p>Aguarde!</p>
            <p>Estamos redirecionando você para sua conta!</p>
          </div>
        </div>

        <div className={styles.footer}>IESB - BAY AREA</div>
      </div>
    )
  }

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>CRIE UMA CONTA</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <input type="text" placeholder="NOME COMPLETO" className={styles.input} onChange={(e) => setFullName(e.target.value)} required />
        </div>

        <div className={styles.inputGroup}>
          <input type="text" placeholder="NOME DE USUÁRIO" className={styles.input} onChange={(e) => setUserName(e.target.value)} required />
        </div>

        <div className={styles.inputGroup}>
          <input type="email" placeholder="E-MAIL" className={styles.input} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className={styles.inputGroup}>
          <input type="email" placeholder="CONFIRME SEU EMAIL" className={styles.input} onChange={(e) => setconfirmEmail(e.target.value)} required />
        </div>

        <div className={styles.inputGroup}>
          <input type="password" placeholder="SENHA" className={styles.input} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <div className={styles.passwordInfo}>
          <small>Combinação de 8 a 16 letras (maiúsculas/minúsculas), números e símbolos especiais.</small>
        </div>

        <div className={styles.inputGroup}>
          <input type="password" placeholder="CONFIRME A SENHA" className={styles.input} onChange={(e) => setconfirmConfirmPassword(e.target.value)}  required />
        </div>
        <div className={styles.checkboxContainer}>
          <input type="checkbox" id="privacy" className={styles.checkbox} required />
          <label htmlFor="privacy" className={styles.checkboxLabel}>
            Li e aceito os{" "}
            <Link href="/privacy" className={styles.link}>
              Política de privacidade
            </Link>
          </label>
        </div>

        <button type="submit" className={styles.button} onClick={handleSubmit}>
          CRIAR CONTA
        </button>
      </form>

      <div className={styles.footer}>IESB - BAY AREA</div>
    </div>
  )
}
