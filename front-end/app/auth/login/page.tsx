"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { login } from "@/actions/auth"
import styles from "@/app/auth/style.module.css";

import AuthFormContainer from "@/components/auth/AuthFormContainer";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import AuthError from "@/components/auth/AuthError";

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

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  return (
    <AuthFormContainer title="ACESSE SUA CONTA">
      <form className={styles.form} onSubmit={handleSubmit}>
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
        <div className={styles.inputGroup}>
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            continuar conectado
          </label>
        </div>
        <AuthError message={error} />
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
  );
}
