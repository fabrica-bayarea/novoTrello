"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

import styles from "@/app/auth/style.module.css";
import { forgotPassword } from "@/actions/auth";
import AuthFormContainer from "@/components/auth/AuthFormContainer";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";

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
  );
}
