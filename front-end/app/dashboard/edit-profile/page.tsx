import { getUserProfile } from "@/lib/actions/profile";
import EditProfileForm from "./EditProfileForm";
import DeleteAccountButton from "./DeleteAccountButton";
import styles from "./edit-profile.module.css";

export default async function EditProfilePage() {
  const profile = await getUserProfile();

  return (
    <div className={styles.container}>
      <p style={{ color: '#777', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
        Dashboard &gt; edit-profile
      </p>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Informações Pessoais</h1>
      <EditProfileForm profile={profile} />
      <DeleteAccountButton />
    </div>
  );
}
