import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SearchImageDto {
  @ApiProperty({ description: 'S3에 업로드된 이미지의 key', type: String })
  @IsString()
  key: string;
}
