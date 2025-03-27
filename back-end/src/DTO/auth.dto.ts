import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsStrongPassword,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
  // export type TipoDeUsuario = 'USUARIO';
  // export type TipoDeConvidado = 'CONVIDADO';
  // export type TipoDeAdministrador = 'ADMINISTRADOR'
  
  // export const TipoDeUsuario: TipoDeUsuario[] = ['USUARIO'];
  // export const TipoDeConvidado: TipoDeConvidado[] = ['CONVIDADO'];
  // export const TipoDeAdministrador: TipoDeAdministrador[] = ['ADMINISTRADOR'];
  
  export class SignUpUsuarioDto {
    @ApiProperty({ example: 'Cleber Guimarães' })
    @IsNotEmpty({ message: 'nome não deve ser omitido' })
    @IsString({ message: 'nome deve ser uma string' })
    nome: string;
  
    @ApiProperty({ example: 'cleber.guimaraes@email.com' })
    @IsEmail({}, { message: 'email deve ser um email válido' })
    @IsString({ message: 'email deve ser uma string' })
    email: string;

    @ApiProperty({ example: 'Senha123!' })
    @IsStrongPassword(
      {},
      {
        message:
          'senha deve conter no mínimo 8 caracteres, 1 letra mínuscula, 1 maíusucula, 1 número e 1 caractere especial',
      },
    )
    senha: string;
  }
  
  export class SignUpAdministradorDto {
    @ApiProperty({ example: 'Rogerio Ceni' })
    @IsNotEmpty({ message: 'nome não deve ser omitido' })
    @IsString({ message: 'nome deve ser uma string' })
    nome: string;
  
    @ApiProperty({ example: 'ceni.rogerin@email.com' })
    @IsEmail({}, { message: 'email deve ser um email válido' })
    @IsString({ message: 'email deve ser uma string' })
    email: string;
  
    @ApiProperty({ example: 'Senha123!' })
    @IsStrongPassword(
      {},
      {
        message:
          'senha deve conter no mínimo 8 caracteres, 1 letra mínuscula, 1 maíusucula, 1 número e 1 caractere especial',
      },
    )
    senha: string;
  }
  

  export class SignUpConvidadoDto {
    @ApiProperty({ example: 'Robson Paiva' })
    @IsNotEmpty({ message: 'nome não pode ser omitido' })
    @IsString({ message: 'nome deve ser uma string' })
    nome: string;
  
    @ApiProperty({ example: 'rpaiva654@email.com' })
    @IsEmail({}, { message: 'email deve ser um email válido' })
    email: string;
  
    @ApiProperty({ example: 'CONVIDADO' })
  
    @ApiProperty({ example: 'Outrasenha321$' })
    @IsStrongPassword(
      {},
      {
        message:
          'senha deve conter no mínimo 8 caracteres, 1 letra mínuscula, 1 maíusucula, 1 número e 1 caractere especial',
      },
    )
    senha: string;
  }
  
  export class SignInUsuarioDto {
    @ApiProperty({ example: 'cleber.guimaraes@email.com' })
    @IsEmail({}, { message: 'email deve ser um email válido' })
    email: string;
  
    @ApiProperty({ example: 'Senha123!' })
    @IsNotEmpty({ message: 'senha não pode ser omitida' })
    @IsString({ message: 'senha deve ser uma string' })
    senha: string;
  }

  export class SignInAdministradorDto {
    @ApiProperty({ example: 'cleber21.guimaraes@email.com' })
    @IsEmail({}, { message: 'email deve ser um email válido' })
    email: string;
  
    @ApiProperty({ example: 'Senha123!' })
    @IsNotEmpty({ message: 'senha não pode ser omitida' })
    @IsString({ message: 'senha deve ser uma string' })
    senha: string;
  }
  
  export class SignInConvidadoDto {
    @ApiProperty({ example: 'rpaiva654@email.com' })
    @IsEmail({}, { message: 'email deve ser um email válido' })
    @IsOptional()
    email?: string;
  
    @ApiProperty({ example: 'Outrasenha321$' })
    @IsNotEmpty({ message: 'senha não pode ser omitida' })
    @IsString({ message: 'senha deve ser uma string' })
    senha: string;
  }
  