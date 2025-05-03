import styles from './edit-profile.module.css'

export default function EditProfilePage() {
  return (
    <div className={styles.container}>
      <h1>Editar Perfil</h1>
      <div className={styles.formContainer}>
        <form className={styles.form}>
          <h2>Informações Pessoais</h2>
          <label>
            Nome:
            <input type="text" name="firstName" />
          </label>
          <label>
            Sobrenome:
            <input type="text" name="lastName" />
          </label>
          <label>
            Nome de usuário:
            <input type="text" name="username" />
          </label>
          <label>
            E-mail:
            <input type="email" name="email" />
          </label>
          <button type="submit">Salvar</button>
          <button type="button" className={styles.deleteButton}>Deletar Conta</button>
        </form>

        <div className={styles.photoSection}>
          <h3>Foto de Perfil</h3>
          <input type="file" />
        </div>
      </div>
    </div>
  )
}