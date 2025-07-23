import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Match } from 'src/utils/match.decorator';

export class ResetPasswordDto {
  @IsString({ message: 'A nova senha deve ser uma string.' })
  @IsNotEmpty({ message: 'A nova senha não pode ser vazia.' })
  @MinLength(8, { message: 'A nova senha deve ter no mínimo 8 caracteres.' })
  newPassword: string;

  @IsString({ message: 'A confirmação da senha deve ser uma string.' })
  @IsNotEmpty({ message: 'A confirmação da senha não pode ser vazia.' })
  @MinLength(8, {
    message: 'A confirmação da senha deve ter no mínimo 8 caracteres.',
  })
  @Match('newPassword', {
    message: 'A confirmação da senha não corresponde à nova senha.',
  })
  confirmNewPassword: string;
}
