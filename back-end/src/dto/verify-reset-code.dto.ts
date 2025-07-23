import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyResetCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
