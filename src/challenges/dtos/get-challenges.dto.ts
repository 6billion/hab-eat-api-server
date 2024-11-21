import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Challenges, ChallengeParticipants } from '@prisma/client';

export class AvaliableChallenge {
  @ApiProperty({ description: '고유이이디', type: Number })
  id: number;

  @ApiProperty({ description: '이름', type: String })
  name: string;

  @ApiProperty({ description: '설명', type: String })
  description: string;

  @ApiProperty({ description: '시작일', type: Date })
  startDate: Date;

  @ApiProperty({ description: '종료일', type: Date })
  endDate: Date;

  @ApiProperty({ description: '타켓 유저 탕비', type: String })
  targetUserType: $Enums.UserType;

  @ApiProperty({ description: '챌린지 타입', type: String })
  type: $Enums.ChallengeType;

  constructor(challenge: Challenges) {
    Object.assign(this, challenge);
  }
}

export class OngoingChallenge extends AvaliableChallenge {
  @ApiProperty({ description: '목표일수', type: Number })
  goalDays: number;

  @ApiProperty({ description: '성공일수', type: Number })
  successDays: number;

  @ApiProperty({ description: '성공여부', type: Boolean })
  status: boolean;

  constructor(challenge: Challenges, participant: ChallengeParticipants) {
    super(challenge);
    this.goalDays = participant.goalDays;
    this.successDays = participant.successDays;
    this.status = participant.status;
  }
}

export class GetChallengeResponseDto {
  @ApiProperty({
    description: '참여가능챌린지',
    type: [AvaliableChallenge],
  })
  availableChallenges: AvaliableChallenge[];

  @ApiProperty({
    description: '참여중인챌린지',
    type: [OngoingChallenge],
  })
  ongingChallenges: OngoingChallenge[];
}
