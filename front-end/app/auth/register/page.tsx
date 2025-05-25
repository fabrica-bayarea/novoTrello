"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

import { register } from "@/lib/actions/auth";
import AuthFormContainer from "@/components/auth/authFormContainer";
import AuthInput from "@/components/auth/authInput";
import AuthButton from "@/components/auth/authButton";
import Notification from "@/components/shared/notification";

import parentStyles from "../style.module.css";
import styles from "./style.module.css";

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
  const [showNotification, setShowNotification] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setShowNotification(false)

    if (!agreeTerms) {
      setError("Você precisa concordar com os termos de serviço.");
      setShowNotification(true);
      return;
    }

    if(confirmEmail != email){
      setError("E-mails não coincidem")
      setShowNotification(true);
      return;
    }
    if(confirmPassword != password){
      setError("Senhas não coincidem")
      setShowNotification(true);
      return;
    }
    try {
      await register(fullname, userName, email, password);

      setIsSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));

      router.push("/dashboard");
      router.refresh();

    } catch (err) {
      setError((err instanceof Error && err.message) ? err.message : String(err))
      setShowNotification(true)
    }
  }

  if (isSuccess) {
    return (
      <AuthFormContainer title="">
        <div className={styles.successDiv}>
          <CheckCircle size={64} color="#fff"/>
          <div className={styles.title}>
            CONTA CRIADA COM SUCESSO!
          </div>
          <div style={{ color: '#fff', textAlign: 'center', fontSize: 15, marginTop: 8 }}>
            Aguarde!<br />Estamos redirecionando você para sua conta!
          </div>
        </div>
      </AuthFormContainer>
    );
  }

  return (
    <>
      {showNotification && error && (
        <Notification
          message={error}
          type="failed"
          onClose={() => setShowNotification(false)}
        />
      )}
      <AuthFormContainer title="CRIE SUA CONTA" showBackToLogin={true}>
        <form className={parentStyles.form} onSubmit={handleSubmit}>
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
          <AuthInput
            type="checkbox"
            checked={agreeTerms}
            onChange={() => setAgreeTerms(!agreeTerms)}
            label="Concordo com ostermos de serviço"
          />
          <AuthButton type="submit">Cadastrar</AuthButton>
        </form>
      </AuthFormContainer>
    </>
  );
}
