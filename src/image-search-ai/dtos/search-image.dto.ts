import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class SearchImageDto {
  @ApiProperty({ description: 'S3에 업로드된 이미지의 key', type: String })
  @IsString()
  key: string;

  @ApiProperty({ description: '사용할 AI 모델의 ID', type: Number })
  @IsNumber()
  aiModelId: number;
}
