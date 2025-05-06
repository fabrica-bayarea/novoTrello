import { Bell, CircleHelp } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import styles from "./style.module.css";

export default function
 AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className={styles.main}>
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
                    <Bell size={40} color="#949494" strokeWidth={2} />
                    <CircleHelp size={40} color="#949494" strokeWidth={2} />
                    <Link href="dashboard/edit-profile/" className={styles.profileImage}></Link>
                </div>
            </div>
        </header>
        <Image
            className={styles.cornerBottomLeft}
            src="/images/auth-background-bottom.png" 
            alt="Logo IESB" 
            width={450}
            height={450}
        />
      {children}
    </main>
  );
}
