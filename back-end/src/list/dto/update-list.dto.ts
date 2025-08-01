import { IsOptional, IsString, IsInt, IsBoolean } from 'class-validator';

export class UpdateListDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsInt()
  position?: number;

  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;
}
