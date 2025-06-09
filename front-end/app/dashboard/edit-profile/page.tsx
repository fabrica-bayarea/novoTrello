"use client";

import { useEffect, useState } from "react";

import { getUserProfile } from "@/lib/actions/profile";
import { useNotificationStore } from '@/lib/stores/notification';

import EditProfileForm from "@/components/dashboard/editProfile/EditInfoUser";
import DeleteAccountButton from "@/components/dashboard/editProfile/DeleteAccountButton";

import styles from "./style.module.css";

export default function EditProfilePage() {
  const { showNotification } = useNotificationStore()
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchUserProfile() {
      const response = await getUserProfile();

      if (!response.success) {
        showNotification(response.error || "Erro ao carregar perfil", 'failed')
      } else {
        setProfile(response.data);
      }
    }

    fetchUserProfile();
  }, []);

  return (
    <div className={styles.container}>
      <p className={styles.history}>
        Dashboard &gt; edit-profile
      </p>
      <h1 className={styles.title}>Informações Pessoais</h1>
      <EditProfileForm profile={profile} />
      <DeleteAccountButton />
    </div>
  );
}
