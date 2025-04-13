import styles from "./style.module.css";
import Image from 'next/image';

export default function
 AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className={styles.main}>
      <Image
        className={styles.logoContainer}
        src="/images/iesb-logo.png" 
        alt="Logo IESB" 
        width={100}
        height={120}
      />
      <Image 
        className={styles.cornerTopRight}
        src="/images/auth-background-top.png" 
        alt="Element Top" 
        width={450}
        height={450}
      />
      <Image 
        className={styles.cornerBottomLeft}
        src="/images/auth-background-bottom.png" 
        alt="Element Bottom" 
        width={450}
        height={450}
      />
      {children}
    </main>
  );
}
