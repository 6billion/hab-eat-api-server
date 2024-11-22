import { ApiProperty } from '@nestjs/swagger';
import { $Enums, ChallengeParticipants } from '@prisma/client';
import { IsNumber, Max, Min } from 'class-validator';

export class PostParticipantsRequestDto {
  @IsNumber()
  @Min(1)
  @Max(7)
  @ApiProperty({ minimum: 1, maximum: 7, description: '목표일수' })
  goalDays: number;
}

export class PostParticipantsResponseDto {
  @ApiProperty({ description: '챌린지 참여 고유아이디', type: Number })
  id: number;

  @ApiProperty({ description: '유저 고유 아이디', type: Number })
  userId: number;

  @ApiProperty({ description: '챌린지 고유 아이디', type: Number })
  challengeId: number;

  @ApiProperty({
    description: '챌린지 타입',
    enum: $Enums.ChallengeType,
  })
  challengeType: $Enums.ChallengeType;

  @ApiProperty({ minimum: 1, maximum: 7, description: '목표일수' })
  goalDays: number;

  @ApiProperty({ minimum: 1, maximum: 7, description: '성공일수' })
  successDays: number;

  @ApiProperty({ description: '챌린지 시작일', type: Date })
  startDate: Date;

  @ApiProperty({ description: '종료일', type: Date })
  endDate: Date;

  @ApiProperty({ description: '마지막 챌린지 성공일', type: Date })
  lastSuccessDate: Date;

  @ApiProperty({ description: '챌린지 성공일 수 수정일 ', type: Date })
  lastCheckDate;

  @ApiProperty({ description: '성공여부', type: Boolean })
  status: boolean;

  @ApiProperty({ description: '참여 정보 업데이트 시간', type: Boolean })
  joinedAt: Date;

  constructor(participant: ChallengeParticipants) {
    Object.assign(this, participant);
  }
}
