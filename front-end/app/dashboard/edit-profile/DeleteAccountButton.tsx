"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"
import { deleteUserProfile } from "@/lib/actions/profile";
import Notification from "@/components/shared/notification";
import styles from "./edit-profile.module.css";

export default function DeleteAccountButton() {
  const router = useRouter()
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function handleDelete() {
    if (!window.confirm("Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.")) return;
    setDeleteLoading(true);
    setDeleteError("");
    setDeleteSuccess(false);
    try {
      await deleteUserProfile();
      setDeleteSuccess(true);
      router.push("/auth/login")
      await new Promise((resolve) => setTimeout(resolve, 5000));
      router.refresh()
    } catch (err: any) {
      setDeleteError((err instanceof Error && err.message) ? err.message : String(err));
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className={styles.wrapperDelete}>
      <div className={styles.deleteInfo}>
        <h2>Deletar conta</h2>
        <p>Delete sua conta e informação do sistema</p>
      </div>
      <button
        type="button"
        className={styles.deleteButton}
        onClick={handleDelete}
        disabled={deleteLoading}
      >
        {deleteLoading ? "Deletando..." : "Deletar"}
      </button>
      {deleteSuccess && (
        <Notification
          message="Conta deletada com sucesso!"
          type="success"
          onClose={() => setDeleteSuccess(false)}
        />
      )}
      {deleteError && (
        <Notification
          message={deleteError}
          type="failed"
          onClose={() => setDeleteError("")}
        />
      )}
    </div>
  );
}
