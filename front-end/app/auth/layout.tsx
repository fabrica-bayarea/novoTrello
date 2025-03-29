import styles from "./style.module.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <img className={styles.logo} src="/images/logoIesb.png" alt="Logo IESB" />
      <img className={styles.topImage} src="/images/elementTop.png" alt="" />
      <img className={styles.bottomImage} src="/images/elementBottom1.png" alt="" />
      {children}
    </div>
  );
}