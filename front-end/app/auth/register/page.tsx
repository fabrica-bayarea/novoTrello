"use client"

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/actions/auth";
import styles from "@/app/auth/style.module.css";
import { CheckCircle } from "lucide-react";
import AuthFormContainer from "@/components/auth/AuthFormContainer";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import AuthError from "@/components/auth/AuthError";
import AuthSuccess from "@/components/auth/AuthSuccess";

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
  const [agreeTerms, setAgreeTerms] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!agreeTerms) {
      setError("Você precisa concordar com os termos de serviço.");
      return;
    }

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
      <AuthFormContainer title="Cadastro realizado!">
        <AuthSuccess message="Cadastro realizado com sucesso! Redirecionando..." />
      </AuthFormContainer>
    );
  }

  return (
    <AuthFormContainer title="CRIE SUA CONTA" showBackToLogin={true}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <AuthInput
          onChange={(e) => setFullName(e.target.value)}
          type="text"
          placeholder="Nome completo"
          value={fullname}
        />
        <AuthInput
          onChange={(e) => setUserName(e.target.value)}
          type="text"
          placeholder="Nome de usuário"
          value={userName}
        />
        <AuthInput
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="E-mail"
          value={email}
        />
        <AuthInput
          onChange={(e) => setconfirmEmail(e.target.value)}
          type="email"
          placeholder="Confirme o e-mail"
          value={confirmEmail}
        />
        <AuthInput
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Senha"
          value={password}
        />
        <AuthInput
          onChange={(e) => setconfirmConfirmPassword(e.target.value)}
          type="password"
          placeholder="Confirme a senha"
          value={confirmPassword}
        />
        <div className={styles.inputGroup}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'white', fontSize: 14 }}>
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={() => setAgreeTerms(!agreeTerms)}
              style={{ accentColor: '#fff', width: 18, height: 18, borderRadius: 4, marginRight: 4 }}
            />
            Concordo com os <a href="/termos" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'underline' }}>termos de serviço</a>
          </label>
        </div>
        <AuthError message={error} />
        <AuthButton type="submit">Cadastrar</AuthButton>
      </form>
    </AuthFormContainer>
  );
}
