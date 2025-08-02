import { Image } from "@/components/ui";

import Header from "@/components/layout/header";

import styles from "./style.module.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className={styles.main}>
      <Header />
      <Image
        className={styles.cornerBottomLeft}
        src="/images/auth-background-bottom.png"
        alt="Decorativo"
        width={450}
        height={450}
      />
      {children}
    </main>
  );
}
