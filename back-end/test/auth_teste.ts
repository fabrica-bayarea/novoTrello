/* eslint-disable @typescript-eslint/no-floating-promises */
import * as bcrypt from 'bcrypt';

const registroTeste: {
  usuario: string;
  senhaPura: string;
  email: string;
}[] = [];
//essa primeira parte é pra mostra uma variável que vai receber os seguintes parametros, para fins de testes mesmo
(async () => {
  await registrarSite('roberto', 'minhasenha123', 'roberto.bob@gmail.com');
  await entrarSite('roberto', 'minhasenha123');
  await entrarSite('roberto', 'senhaerrada');
})();
//aqui é um comando que já existe para SIMULAR um banco de dados, só pra validar se o login está sendo possível de entrar

async function registrarSite(
  usuario: string,
  senhaPura: string,
  email: string,
) {
  const saltRounds = 5;
  const hash = await bcrypt.hash(senhaPura, saltRounds);
  registroTeste.push({ usuario, senhaPura: hash, email });
  console.log(usuario, hash);
  console.log('Usuário cadastrado com sucesso');
}
//essa primeira function é usada para salvar o usuário no banco de dados, ou seja, tudo que
//o usuário digitar no formulário vão ser armazenados e então quando ele for tentar entrar de novo
//vai ser testado os dados dele

async function entrarSite(usuario: string, senhaPura: string) {
  //como aqui é os dados que a pessoa botar pra ENTRAR no site, precisamos criar outro CONST
  //para armazenar os dados que vão ser enviados atráves do form do site, então ficaria assim:
  const checarUser = registroTeste.find(p => p.usuario === usuario);
  if (!checarUser) {
    console.log('Usuário não existe');
    return;
  }
  //aqui ficou o seguinte: primeiro vamos testar se o usuário que a pessoa colocou está
  //passando e depois disso verificar se é o mesmo usuário cadastrado.
  //depois disso caso passado, vamos criar uma CONST para checar se a senha é válida
  const senhaCerta = await bcrypt.compare(senhaPura, checarUser.senhaPura);
  console.log(checarUser.senhaPura);
  if (!senhaCerta) {
    console.log('Senha Inválida');
  } else {
    console.log('Senha certa, bem-vindo');
  }
}
