import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsDate } from 'class-validator';

export class GetCertificationLogsRequestDto {
  @ApiProperty({ description: '조회 시작 날짜', type: Date })
  @IsDate()
  startDate: Date;

  @ApiProperty({ description: '조회 마지막 날짜', type: Date })
  endDate: Date;
}

export class ChallengeCertificationLogsDto {
  @ApiProperty({ description: '유저 고유 아이디', type: Number })
  userId: number;

  @ApiProperty({ description: '참여 고유아이디', type: Number })
  challengeParticipantsId: number;

  @ApiProperty({ description: '챌린지 인증 날짜', type: Date })
  date: Date;
}

export class GetCertificationLogsResponseDto {
  @ApiProperty({ description: '챌린지 시작일', type: Date })
  startDate: Date;

  @ApiProperty({ description: '챌린지 종료일', type: Date })
  endDate: Date;

  @ApiProperty({ description: '참여 고유아이디', type: Number })
  id: number;

  @ApiProperty({ description: '유저 고유 아이디', type: Number })
  userId: number;

  @ApiProperty({ description: '챌린지 아이디', type: Number })
  challengeId: number;

  @ApiProperty({ description: '챌린지 타입', enum: $Enums.ChallengeType })
  challengeType: $Enums.ChallengeType;

  @ApiProperty({ description: '목표 달성일 수', type: Number })
  goalDays: number;

  @ApiProperty({ description: '성공일 수', type: Number })
  successDays: number;

  @ApiProperty({ description: '마지막 성공일', type: Number, required: false })
  lastSuccessDate: Date | null;

  @ApiProperty({
    description: '성공 여부 일수 업데이트 날짜',
    type: Number,
    required: false,
  })
  lastCheckDate: Date | null;

  @ApiProperty({ description: '챌린지 성공 여부', type: Boolean })
  status: boolean;

  @ApiProperty({ description: '챌린지 가입 시간', type: Date })
  joinedAt: Date;

  @ApiProperty({
    description: '챌린지 인증 날짜 리스트',
    type: [ChallengeCertificationLogsDto],
  })
  challengeCertificationLogs: ChallengeCertificationLogsDto[];
}
