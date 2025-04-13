import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsStrongPassword, } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SignUpDto {
    @ApiProperty({ example: 'first name last name' })
    @IsNotEmpty({ message: 'Preencha o campo de nome completo' })
    @IsString({ message: 'O nome deve ser uma string' })
    fullName: string

    @ApiProperty({ example: 'username' })
    @IsNotEmpty({ message: 'Preencha o campo de nome de usuario' })
    @IsString({ message: 'O nome deve ser uma string' })
    userName: string

    @ApiProperty({ example: 'username@gmail.com' })
    @IsEmail({}, { message: 'Preencha o campo de email' })
    @IsString({ message: 'O email deve ser uma string' })
    email: string

    @ApiProperty({ example: 'Senha123!' })
    @IsString({ message: 'A senha deve ser uma string' })
    @IsStrongPassword(
        {},
        {
            message: 'Senha deve ter 8 caracteres, 1 especial, 1 número e uma letra maiúscula'
        },
    )
    password: string
}

export class SignInDto {
    @ApiProperty({ example: 'username@gmail.com' })
    @IsEmail({}, { message: 'deve ser no modelo de email' })
    email: string;

    @ApiProperty({ example: 'Senha123!' })
    @IsNotEmpty({ message: 'preencha com sua senha' })
    @IsString({ message: 'senha deve ser uma string' })
    password: string;

    @ApiProperty({ example: true })
    @IsBoolean({ message: 'deve ser um booleano' })
    @IsNotEmpty({ message: 'preencha o campo de lembrar de mim' })
    rememberMe: boolean;
}

export class GenerateAuthTokenDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    @IsNotEmpty({ message: 'O token de acesso não pode estar vazio' })
    @IsString({ message: 'O token de acesso deve ser uma string' })
    accessToken: string;

    @ApiProperty({ example: '3600' })
    @IsNotEmpty({ message: 'O tempo de expiração não pode estar vazio' })
    @IsString({ message: 'O tempo de expiração deve ser uma string' })
    expiresIn: string;

    @ApiProperty({ example: new Date().toISOString() })
    @IsNotEmpty({ message: 'A data de criação não pode estar vazia' })
    createdAt: string;
}

export class UserInfoDto {
    @ApiProperty({ example: 1 })
    @IsNotEmpty({ message: 'O id não pode estar vazio' })
    @IsNumber({}, { message: 'O id deve ser um número' })
    id: number;

    @ApiProperty({ example: 'first name last name' })
    @IsNotEmpty({ message: 'Preencha o campo de nome completo' })
    @IsString({ message: 'O nome deve ser uma string' })
    fullName: string

    @ApiProperty({ example: 'username' })
    @IsNotEmpty({ message: 'Preencha o campo de nome de usuario' })
    @IsString({ message: 'O nome deve ser uma string' })
    userName: string

    @ApiProperty({ example: 'example@gmail.com' })
    @IsEmail({}, { message: 'O email deve ser válido' })
    @IsNotEmpty({ message: 'O email não pode estar vazio' })
    email: string;
}

export class SignResponseJwtDto {
    @ApiProperty({ type: GenerateAuthTokenDto })
    @IsNotEmpty({ message: 'Os dados de acesso não podem estar vazios' })
    access: GenerateAuthTokenDto;

    @ApiProperty({ type: UserInfoDto })
    @IsNotEmpty({ message: 'Os dados do usuário não podem estar vazios' })
    user: UserInfoDto;
