import { Bell, CircleHelp, Check } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import styles from './style.module.css';
import Section from "@/components/section";

export default function dashboard() {
    return (
        <main>
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
                        <Bell size={40} color="#303030" strokeWidth={2} />
                        <CircleHelp size={40} color="#303030" strokeWidth={2} />
                        <Link href="#" className={styles.profileImage}></Link>
                    </div>
                </div>
            </header>
            <div>
                <Section title="Pendencias">
                    <div className={styles.wrapperPendencias}>
                        <p>Você não possui pendências no momento, continue assim!</p>
                        <Check size={40} color="#15bd2e" strokeWidth={2} />
                    </div>
                </Section>
                <Section title="boards">
                    <div> </div>
                </Section>
            </div>
        </main>
    )
}