import styles from "./style.module.css";
import Image from 'next/image';

export default function
 AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className={styles.main}>
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
