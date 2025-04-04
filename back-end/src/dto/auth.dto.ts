import {IsEmail,IsNotEmpty,IsString,IsStrongPassword,} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SignUpUsuarioDto {
    @ApiProperty({ example: 'username'})
    @IsNotEmpty({ message: 'Preencha o campo de nome'})
    @IsString({ message: 'O nome deve ser uma string'})
    name: string

    @ApiProperty({ example: 'username@gmail.com'})
    @IsEmail({}, { message: 'Preencha o campo de email'})
    @IsString({ message: 'O email deve ser uma string'})
    email: string

    @ApiProperty({example: 'Senha123!'})
    @IsStrongPassword(
        {},
        {
            message: 'Senha deve ter 8 caracteres, 1 especial, 1 número e uma letra maiúscula'
        },
    )
    password: string
}

export class SignInUsuarioDto {
    @ApiProperty ({example:'username@gmail.com' })
    @IsEmail ({}, {message: 'deve ser no modelo de email'})
    email: string;

    @ApiProperty({example: 'Senha123!'})
    @IsNotEmpty({message: 'preencha com sua senha'})
    @IsString({message: 'senha deve ser uma string'})
    password: string;
}
