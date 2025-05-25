"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link";

import { login } from "@/lib/actions/auth"
import AuthFormContainer from "@/components/auth/authFormContainer";
import AuthInput from "@/components/auth/authInput";
import AuthButton from "@/components/auth/authButton";
import Notification from "@/components/shared/notification";

import parentStyles from "../style.module.css";
import styles from "./style.module.css";

export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [showNotification, setShowNotification] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setShowNotification(false)
    try {
      await login(email, password, rememberMe)

      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError((err instanceof Error && err.message) ? err.message : String(err))
      setShowNotification(true)
    }
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  return (
    <>
      {showNotification && error && (
        <Notification
          message={error}
          type="failed"
          onClose={() => setShowNotification(false)}
        />
      )}
      <AuthFormContainer title="ACESSE SUA CONTA">
        <form className={parentStyles.form} onSubmit={handleSubmit}>
          <AuthInput
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Nome de usuário ou e-mail"
            value={email}
          />
          <AuthInput
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Senha"
            value={password}
          />
          <AuthInput
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              label="Lembrar de mim"
          />
          <AuthButton type="submit">Entrar</AuthButton>
          <div className={styles.links}>
            <Link href="/auth/forgot-password" className={styles.forgotPasswordLink}>Esqueceu sua senha?</Link>
            <Link href="/auth/register" className={styles.createAccountLink}>Criar uma conta.</Link>
          </div>
        </form>
        <div className={styles.divider}><span>Conecte-se também com:</span></div>
        <div className={styles.oauthButtons}>
          <AuthButton type="button" onClick={() => window.location.href = `${apiBaseUrl}/v1/auth/google`} className={styles.oauthCircleButton} aria-label="Entrar com Google">
            <img src="/images/google-icon.png" alt="Google" width={28} height={28} />
          </AuthButton>
          <AuthButton type="button" onClick={() => window.location.href = `${apiBaseUrl}/v1/auth/microsoft`} className={styles.oauthCircleButton} aria-label="Entrar com Microsoft">
            <img src="/images/microsoft-icon.png" alt="Microsoft" width={28} height={28} />
          </AuthButton>
        </div>
      </AuthFormContainer>
    </>
  );
}
