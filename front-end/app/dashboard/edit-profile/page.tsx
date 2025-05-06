import styles from './edit-profile.module.css'

export default function EditProfilePage() {
  return (
    <div className={styles.container}>
      <h1>Editar Perfil</h1>
      <form className={styles.form}>
        <div className={styles.wrapperDivisor}>
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
        </div>
        <div className={styles.wrapperDivisor}>
          <label className={styles.photoSection}>
            Foto:
            <input type="file" id="foto" name="foto" accept="image/*"/>
          </label>
          <button type="submit" className={styles.submitButton}>Salvar</button>
        </div>
      </form>
      <div className={styles.wrapperDelete}>
        <div className={styles.deleteInfo}>
          <h2>Deletar conta</h2>
          <p>Delete sua conta e informação do sistema</p>
        </div>

        <input type='button' className={styles.deleteButton} value="Deletar"/>
      </div>
    </div>
  )
}