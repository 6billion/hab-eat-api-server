import { ApiProperty } from '@nestjs/swagger';

export class ImageSearchResponseDto {
  @ApiProperty({ description: '이미지에서 분석된 이름', type: String })
  name: string;
}
