"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

import { register } from "@/lib/actions/auth";
import { useNotificationStore } from '@/lib/stores/notification';

import AuthFormContainer from "@/components/ui/authFormContainer";
import AuthInput from "@/components/ui/authInput";
import AuthButton from "@/components/ui/authButton";

import parentStyles from "../style.module.css";
import styles from "./style.module.css";

export default function Register() {
  const router = useRouter()
  const { showNotification } = useNotificationStore()
  const [fullname, setFullName] = useState("")
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [confirmEmail, setconfirmEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setconfirmConfirmPassword] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!agreeTerms) {
      showNotification("Você precisa concordar com os termos de serviço.", 'failed')
      return;
    }

    if(confirmEmail != email){
      showNotification("E-mails não coincidem", 'failed');
      return;
    }
    if(confirmPassword != password){
      showNotification("Senhas não coincidem", 'failed')
      return;
    }
    const result = await register(fullname, userName, email, password);

    if (result.success) {
      setIsSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));

      router.push("/dashboard");
      router.refresh();
    } else {
      showNotification(result.error || "Erro desconhecido", 'failed')
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
