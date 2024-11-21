import { ApiProperty } from '@nestjs/swagger';

export class PostChallengeCertificationRequestDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File;
}
