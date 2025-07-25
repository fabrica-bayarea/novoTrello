import React from "react";
import styles from "./style.module.css";
import Link from "next/link";

interface AuthFormContainerProps {
  title: string;
  children: React.ReactNode;
  showBackToLogin?: boolean;
}

export default function AuthFormContainer({ title, children, showBackToLogin = false }: AuthFormContainerProps) {
    return (
        <div className={styles.formContainer}>
            {showBackToLogin && (
                <Link href="/auth/login" className={styles.backToLoginLink}>
                    <span>
                        <svg width="38" height="38" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
                        Voltar
                    </span>
                </Link>
            )}
            <h1 className={styles.title}>{title}</h1>
            {children}
            <span className={styles.footer}>IESB - BAY AREA</span>
        </div>
    );
}
