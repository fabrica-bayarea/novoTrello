"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

import { forgotPassword } from "@/lib/actions/auth";
import AuthFormContainer from "@/components/auth/authFormContainer";
import AuthInput from "@/components/auth/authInput";
import AuthButton from "@/components/auth/authButton";
import Notification from "@/components/shared/notification";

import styles from "./style.module.css";

export default function ForgotPassword() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
      e.preventDefault()
      setError("");
      setShowNotification(false);
      try {
        const result = await forgotPassword(email)

        router.push("/auth/login")
        router.refresh()
    } catch (err) {
      setError((err instanceof Error && err.message) ? err.message : String(err))
      setShowNotification(true)
    }
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
      <AuthFormContainer title="ESQUECEU SUA SENHA?" showBackToLogin={true}>
      <div className={styles.forgotPasswordText}>
        <p>
          Para redefinir sua senha, insira seu e-mail cadastrado e clique em "Enviar e-mail". Você receberá um e-mail
          com instruções para a redefinição.
        </p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <AuthInput
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Insira o seu email"
          value={email}
        />
        <AuthButton type="submit">
          Enviar e-mail
        </AuthButton>
      </form>
    </AuthFormContainer>
    </>
  );
}
