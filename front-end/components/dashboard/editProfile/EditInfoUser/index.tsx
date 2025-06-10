"use client";

import { useState } from "react";
import Image from "next/image";

import { updateUserProfile } from "@/lib/actions/profile";
import { useNotificationStore } from '@/lib/stores/notification';

import styles from "./style.module.css";

interface UserProfile {
  name?: string;
  userName?: string;
  email?: string;
  photoUrl?: string;
}

export default function EditProfileForm({ profile }: { profile: UserProfile | null }) {
  const [form, setForm] = useState<UserProfile>({
    name: profile?.name || "",
    userName: profile?.userName || "",
    email: profile?.email || "",
    photoUrl: profile?.photoUrl || "/images/iesb-icon.png",
  });
  // const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotificationStore()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, files } = e.target;
    if (name === "foto" && files && files[0]) {
      // setPhotoFile(files[0]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const formData = {
      name: form.name || "",
      userName: form.userName || "",
      email: form.email || "",
    };

    const response = await updateUserProfile(formData);

    if (response.success) {
      showNotification("Perfil atualizado com sucesso!", 'success')
    } else {
      showNotification(response.error || "Erro desconhecido", 'failed')
    }

    setLoading(false);
  }

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.wrapperDivisor}>
          <label>
            Nome:
            <input
              type="text"
              name="name"
              placeholder="Digite seu nome"
              value={form.name}
              onChange={handleChange}
            />
          </label>
          <label>
            Nome de usuário:
            <input
              type="text"
              name="userName"
              placeholder="Escolha um nome de usuário"
              value={form.userName}
              onChange={handleChange}
            />
          </label>
          <label>
            E-mail:
            <input
              type="email"
              name="email"
              placeholder="Seu e-mail"
              value={form.email}
              onChange={handleChange}
            />
          </label>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "Atualizando..." : "Atualizar"}
          </button>
        </div>
        <div className={styles.wrapperDivisor}>
          <div className={styles.photoSection}>
            <span>Foto de perfil</span>
            <Image
              src={form.photoUrl || "/images/iesb-icon.png"}
              alt="Foto de perfil"
              className={styles.profilePhoto}
              width={100}
              height={100}
            />
            <input type="file" id="foto" name="foto" accept="image/*" onChange={handleChange} />
          </div>
        </div>
      </form>
    </>
  );
}
