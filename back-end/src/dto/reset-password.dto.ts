import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'example@email',
    description: 'Email do usuário para o qual a senha será redefinida',
  })
  @IsNotEmpty({ message: 'O email não pode estar vazio' })
  @IsString({ message: 'O email deve ser uma string' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'token123',
    description: 'Token de redefinição de senha enviado por email',
  })
  @IsNotEmpty({
    message: 'O token de redefinição de senha não pode estar vazio',
  })
  @IsString({ message: 'O token deve ser uma string' })
  token: string;

  @ApiProperty({
    example: 'NewPassword123!',
    description: 'Nova senha do usuário',
  })
  @IsNotEmpty({ message: 'A nova senha não pode estar vazia' })
  @IsString({ message: 'A nova senha deve ser uma string' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  newPassword: string;

  @ApiProperty({
    example: 'NewPassword123!',
    description: 'Confirmação da nova senha do usuário',
  })
  @IsNotEmpty({ message: 'A confirmação da senha não pode estar vazia' })
  @IsString({ message: 'A confirmação da senha deve ser uma string' })
  @MinLength(8, {
    message: 'A confirmação da senha deve ter no mínimo 8 caracteres',
  })
  confirmPassword: string;
}
