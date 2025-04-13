"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { login } from "@/actions/auth"
import styles from "@/app/auth/style.module.css";

import Image from 'next/image';
import Link from "next/link";


export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    try {
      const result = await login(email, password, rememberMe)

      if (result.success) {
        router.push("/dashboard")
        router.refresh()
      } else {
        setError(result.error || "Falha na autenticação")
      }
    } catch (err) {
      setError("Ocorreu um erro ao tentar fazer login")
    }
  }

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>ACESSE SUA CONTA</h1>

      <form className={styles.form}>
        <div className={styles.inputGroup}>
          <input 
            onChange={(e) => setEmail(e.target.value)}
            type="text" 
            placeholder="Nome de usuário ou e-mail" 
            className={styles.input} 
          />
        </div>

        <div className={styles.inputGroup}>
          <input 
            onChange={(e) => setPassword(e.target.value)}
            type="password" 
            placeholder="Digite sua senha" 
            className={styles.input} 
          />
        </div>

        <div className={styles.checkboxContainer}>
          <input 
            type="checkbox" 
            id="remember" 
            className={styles.checkbox} 
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)} 
          />
          <label htmlFor="remember" className={styles.checkboxLabel}>
            Continuar conectado
          </label>
        </div>

        <button type="submit" className={styles.button} onClick={handleSubmit}>
          ENTRAR
        </button>

        <div className={styles.forgotPassword}>
          <span>Esqueceu sua senha?</span>
          <Link href="/auth/forgot-password" className={styles.link}>
            Clique aqui!
          </Link>
        </div>
      </form>

      <div className={styles.divider}>
        <span>Conecte-se também com</span>
      </div>

      <div className={styles.socialLogin}>
        <button className={styles.socialButton}>
          <Image src="/images/iesb-icon.png" alt="IESB" width={24} height={24} />
        </button>
        <button className={styles.socialButton}>
          <Image src="/images/google-icon.png" alt="Google" width={24} height={24} />
        </button>
        <button className={styles.socialButton}>
          <Image src="/images/microsoft-icon.png" alt="Microsoft" width={24} height={24} />
        </button>
      </div>

      <div className={styles.createAccount}>
        <Link href="/auth/register" className={styles.createAccountButton}>
          Clique aqui para criar uma conta
        </Link>
      </div>

      <div className={styles.footer}>IESB - BAY AREA</div>
    </div>
  )
}
