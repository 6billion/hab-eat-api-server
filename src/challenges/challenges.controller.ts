import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BearerGuard } from 'src/auth/guards/bearer.guard';
import { ChallengesService } from './services/challenges.service';
import { RequestUser } from 'src/request-user.decorator';
import { User } from 'src/users/user';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetChallengeResponseDto } from './dtos/get-challenges.dto';
import {
  PostParticipantsRequestDto,
  PostParticipantsResponseDto,
} from './dtos/post-participants.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { EventNames } from 'src/constants';
import { TargetNutrients } from '@type';
import {
  GetCertificationLogsRequestDto,
  GetCertificationLogsResponseDto,
} from './dtos/get-certification-logs.dto';

@ApiTags('챌린지')
@ApiBearerAuth()
@UseGuards(BearerGuard)
@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get()
  @ApiOperation({ summary: '챌린지 리스트 조회하기' })
  @ApiResponse({ type: GetChallengeResponseDto })
  getChallenges(@RequestUser() user: User): Promise<GetChallengeResponseDto> {
    return this.challengesService.getChallenges(user);
  }

  @Post(':id/participants')
  @ApiOperation({ summary: '챌린지 참여하기' })
  @ApiBody({ type: PostParticipantsRequestDto })
  @ApiResponse({ type: PostParticipantsResponseDto })
  async postChallengeParticipants(
    @RequestUser() user: User,
    @Param('id') id: number,
    @Body() body: PostParticipantsRequestDto,
  ) {
    const participant =
      await this.challengesService.createChallengeParticipants({
        id,
        userId: user.id,
        goalDays: body.goalDays,
      });

    return new PostParticipantsResponseDto(participant);
  }

  @Get(':id/certification-logs')
  @ApiOperation({ summary: '챌린지 인증 로그 조회 (챌린지 캘린더 조회)' })
  @ApiQuery({ type: GetCertificationLogsRequestDto })
  @ApiResponse({ type: [GetCertificationLogsResponseDto] })
  getChallengeCertificationLogs(
    @Param('id') challengeId: number,
    @Query() query: GetCertificationLogsRequestDto,
    @RequestUser() user: User,
  ): Promise<GetCertificationLogsResponseDto[]> {
    return this.challengesService.getChallengeCertificationLogs({
      challengeId,
      userId: user.id,
      startDate: query.endDate,
      endDate: query.endDate,
    });
  }

  @OnEvent(EventNames.certifiyNutritionChallenges)
  async certifiyNutritionChallenges({
    user,
    data,
  }: {
    user: User;
    data: TargetNutrients;
  }) {
    const participants =
      await this.challengesService.findNutritionChallengeParticipants(user.id);
    return this.challengesService.certifyManyNutritionChallenges({
      user,
      data,
      participants,
    });
  }
}
