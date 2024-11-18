import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PostUserDto {
  @IsString()
  snsToken: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsNumber()
  @IsOptional()
  hight?: number;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsNumber()
  @IsOptional()
  goalKcal?: number;
}
