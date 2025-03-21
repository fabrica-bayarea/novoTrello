/* eslint-disable @typescript-eslint/no-floating-promises */
import * as bcrypt from 'bcrypt';
// ^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$
// regex para os requisitos da senha
const registroTeste: {
  usuario: string;
  senhaPura: string;
  email: string;
}[] = [];
//essa primeira parte é pra mostra uma variável que vai receber os seguintes parametros, para fins de testes mesmo
// async function registrarSite(
//   usuario: string,
//   senhaPura: string,
//   email: string,
// )
(async () => {
    // variáveis VERDADEIRAS para testes dentro do programa
  await registrarSite('correto', 'Asd12#');

  await entrarSite('correto', 'Asd12#') // login para teste
})();
//aqui é um comando que já existe para SIMULAR um banco de dados, só pra validar se o login está sendo possível de entrar

async function registrarSite(
  usuario: string,
  senhaPura: string,
){
  function checarSenha(senhaPura: string): boolean {
  let regex =/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$/;
  return regex.test(senhaPura);
}
  if (!checarSenha(senhaPura)){
    console.log('Senha não corresponde os requisitos necessários');
  } else {
    let saltRounds = 10;
    let hash = await bcrypt.hash(senhaPura, saltRounds);
    registroTeste.push({
      usuario, senhaPura: hash,
      email: ''
    });
    console.log('Usuário cadastrado com sucesso');
  }
}
//essa primeira function é usada para salvar o usuário no banco de dados, ou seja, tudo que
//o usuário digitar no formulário vão ser armazenados e então quando ele for tentar entrar de novo
//vai ser testado os dados dele



//essa parte é pra validar se os dados que o usuário colocar aqui são verdadeiros para poder
//fazer login sem problemas
async function entrarSite(usuario: string, senhaPura: string) {
  //como aqui é os dados que a pessoa botar pra ENTRAR no site, precisamos criar outro CONST
  //para armazenar os dados que vão ser enviados atráves do form do site, então ficaria assim:
  const checarUser = registroTeste.find(p => p.usuario === usuario);
  if (!checarUser) {
    console.log('Usuário não existe');
    return;
  } else {
    console.log('usuário válido, digite a senha');
    
  }
  //aqui ficou o seguinte: primeiro vamos testar se o usuário que a pessoa colocou está
  //passando e depois disso verificar se é o mesmo usuário cadastrado.
  //depois disso caso passado, vamos criar uma CONST para checar se a senha é válida
  const senhaCerta = await bcrypt.compare(senhaPura, checarUser.senhaPura);
  if (!senhaCerta) {
    console.log('Senha Inválida');
  } else {
    console.log('Senha certa, bem-vindo');
  }
}
