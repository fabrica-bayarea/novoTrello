"use client";

import { useState } from "react";
import styles from "./style.module.css";

interface NewBoardFormProps {
  onCreate?: (data: { name: string; description: string; image?: File | null }) => void;
}

export default function NewBoardForm({ onCreate }: NewBoardFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      // Aqui você pode chamar uma action para criar o board
      onCreate?.({ name, description, image });
      setSuccess(true);
      setName("");
      setDescription("");
      setImage(null);
    } catch (err) {
      setError("Erro ao criar espaço de trabalho");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.rowGroups}>
        <div className={styles.leftGroup}>
          <label className={styles.label}>
            Nome
            <input type="text" className={styles.input} value={name} onChange={e => setName(e.target.value)} required />
          </label>
          <label className={styles.label}>
            Descrição
            <textarea className={styles.textarea} value={description} onChange={e => setDescription(e.target.value)} rows={3} />
          </label>
        </div>
        <div className={styles.rightGroup}>
          <label className={styles.label}>
            Foto
            <div className={styles.squarePhotoPreview}>
              {image ? (
                <img src={URL.createObjectURL(image)} alt="Preview" className={styles.squarePhotoImg} />
              ) : (
                <div className={styles.squarePhotoPlaceholder}>Prévia</div>
              )}
            </div>
            <input type="file" className={styles.fileInput} accept="image/*" onChange={handleImageChange} />
          </label>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Criando..." : "Criar"}
          </button>
          {success && <p className={styles.success}>Espaço criado com sucesso!</p>}
          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>
    </form>
  );
}
