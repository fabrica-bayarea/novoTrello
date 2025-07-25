import { Bell, CircleHelp } from "lucide-react";
import { Image } from "@/components/ui";
import Link from 'next/link';
import styles from "./style.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.wrapper_header}>
        <Image
          className={styles.logoContainer}
          src="/images/iesb-icon.png"
          alt="Logo IESB"
          width={100}
          height={100}
        />
        <div className={styles.wrapper_header_helps}>
          <Bell size={32} color="#949494" strokeWidth={2} aria-label="Notificações" />
          <CircleHelp size={32} color="#949494" strokeWidth={2} aria-label="Ajuda" />
          <Link href="/dashboard/edit-profile/" className={styles.profileImage} aria-label="Editar perfil"></Link>
        </div>
      </div>
    </header>
  )
}