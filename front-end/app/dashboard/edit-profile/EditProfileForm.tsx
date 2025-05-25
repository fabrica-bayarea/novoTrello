"use client";

import { useState } from "react";
import { updateUserProfile } from "@/lib/actions/profile";
import Notification from "@/components/shared/notification";
import styles from "./edit-profile.module.css";

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
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, files } = e.target;
    if (name === "foto" && files && files[0]) {
      setPhotoFile(files[0]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    setShowNotification(false);
    setShowSuccess(false);
    try {
      const formData = {
        name: form.name || "",
        userName: form.userName || "",
        email: form.email || "",
      };
      await updateUserProfile(formData);
      setSuccess(true);
      setShowSuccess(true);
    } catch (err: any) {
      setError((err instanceof Error && err.message) ? err.message : String(err));
      setShowNotification(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {showNotification && error && (
        <Notification
          message={error}
          type="failed"
          onClose={() => setShowNotification(false)}
        />
      )}
      {showSuccess && (
        <Notification
          message="Perfil atualizado com sucesso!"
          type="success"
          onClose={() => setShowSuccess(false)}
        />
      )}
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
            <img
              src={form.photoUrl || "/images/iesb-icon.png"}
              alt="Foto de perfil"
              className={styles.profilePhoto}
            />
            <input type="file" id="foto" name="foto" accept="image/*" onChange={handleChange} />
          </div>
        </div>    
      </form>
    </>
  );
}
