import { Check } from "lucide-react";
import styles from './style.module.css';
import Section from "@/components/section";

export default function dashboard() {
    return (
        <main>
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