import {IsBoolean, IsEmail,IsNotEmpty,IsOptional,IsString,IsStrongPassword,} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SignUpDto {
    @ApiProperty({ example: 'first name last name'})
    @IsNotEmpty({ message: 'Preencha o campo de nome completo'})
    @IsString({ message: 'O nome deve ser uma string'})
    fullName: string

    @ApiProperty({ example: 'username'})
    @IsNotEmpty({ message: 'Preencha o campo de nome de usuario'})
    @IsString({ message: 'O nome deve ser uma string'})
    userName: string

    @ApiProperty({ example: 'username@gmail.com'})
    @IsEmail({}, { message: 'Preencha o campo de email'})
    @IsString({ message: 'O email deve ser uma string'})
    email: string

    @ApiProperty({example: 'Senha123!'})
    @IsString({ message: 'A senha deve ser uma string'})
    @IsStrongPassword(
        {},
        {
            message: 'Senha deve ter 8 caracteres, 1 especial, 1 número e uma letra maiúscula'
        },
    )
    password: string
}

export class SignInDto {
    @ApiProperty ({example:'username@gmail.com' })
    @IsEmail ({}, {message: 'deve ser no modelo de email'})
    email: string;

    @ApiProperty({example: 'Senha123!'})
    @IsNotEmpty({message: 'preencha com sua senha'})
    @IsString({message: 'senha deve ser uma string'})
    password: string;

    @ApiProperty({example: true})
    @IsBoolean({message: 'deve ser um booleano'})
    @IsNotEmpty({message: 'preencha o campo de lembrar de mim'})
    rememberMe: boolean;
}
