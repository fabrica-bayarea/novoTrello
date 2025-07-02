import styles from './edit-profile.module.css'

export default function EditProfilePage() {
  return (
    <div className={styles.container}>
      <p style={{ color: '#777', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
        Dashboard &gt; edit-profile
      </p>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Informações Pessoais</h1>
      <form className={styles.form}>
        <div className={styles.wrapperDivisor}>
          <label>
            Nome:
            <input type="text" name="firstName" placeholder="Digite seu nome" />
          </label>
          <label>
            Sobrenome:
            <input type="text" name="lastName" placeholder="Digite seu sobrenome" />
          </label>
          <label>
            Nome de usuário:
            <input type="text" name="username" placeholder="Escolha um nome de usuário" />
          </label>
          <label>
            E-mail:
            <input type="email" name="email" placeholder="Seu e-mail" />
          </label>
        </div>
        <div className={styles.wrapperDivisor}>
<<<<<<< HEAD
          <label className={styles.photoSection}>
            Foto:
            <input type="file" id="foto" name="foto" accept="image/*" />
          </label>
          <button type="submit" className={styles.submitButton}>Salvar</button>
=======
          <div className={styles.photoSection}>
            <span>Foto de perfil</span>
            <img
              src=""
              alt="Foto de perfil"
              className={styles.profilePhoto}
            />
            <input type="file" id="foto" name="foto" accept="image/*" />
          </div>
          <button type="submit" className={styles.submitButton}>Atualizar</button>
>>>>>>> 51cb81c (feat(profile): atualiza layout e estilos da tela de edição de perfil)
        </div>
      </form>
      <div className={styles.wrapperDelete}>
        <div className={styles.deleteInfo}>
          <h2>Deletar conta</h2>
          <p>Delete sua conta e informação do sistema</p>
        </div>
<<<<<<< HEAD
        <button className={styles.deleteButton}>Deletar</button>
=======
        <input type='button' className={styles.deleteButton} value="Deletar"/>
>>>>>>> 51cb81c (feat(profile): atualiza layout e estilos da tela de edição de perfil)
      </div>
    </div>
  )
}