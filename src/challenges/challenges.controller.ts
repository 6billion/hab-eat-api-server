import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetChallengeResponseDto } from './dtos/get-challenges.dto';
import {
  PostParticipantsRequestDto,
  PostParticipantsResponseDto,
} from './dtos/post-participants.dto';
import {
  GetCertificationLogsRequestDto,
  GetCertificationLogsResponseDto,
} from './dtos/get-certification-logs.dto';
import {
  PostChallengeCertificationRequestDto,
  PostNutritionChallengesCertificationRequestDto,
  PostChallengesCertificationResponseDto,
} from './dtos/post-certification.dto';
import { GetChallengeConditonResponseDto } from './dtos/get-challenge-condition.dto';
import { ChallengeParticipants } from '@prisma/client';
import {
  GetPresignedUrlRequestDto,
  GetPresignedUrlResponseDto,
} from './dtos/get-presigned-url.dto';

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

  @Get('presigned-urls')
  @ApiOperation({ summary: '챌린지 이미지 업로드 presigned url 발급' })
  @ApiResponse({ type: GetPresignedUrlResponseDto })
  getChallengePreSignedUrls(
    @Query() { count }: GetPresignedUrlRequestDto,
    @RequestUser() { id }: User,
  ) {
    return this.challengesService.getPreSignedUrls(id, count);
  }

  @ApiOperation({ summary: '습관 챌린지 이미지 인증하기' })
  @ApiBody({ type: PostChallengeCertificationRequestDto })
  @ApiResponse({
    type: PostChallengesCertificationResponseDto,
    description: '챌린지 참여 정보',
  })
  @Post(':id/certifications')
  async postChallengeCertifications(
    @RequestUser() user: User,
    @Param('id', ParseIntPipe) challengeId: number,
    @Body() body: PostChallengeCertificationRequestDto,
  ) {
    const participant =
      await this.challengesService.findUniqueParticipantOrThrow(
        user.id,
        challengeId,
      );

    return this.challengesService.certyfyChallenge({
      data: body.key,
      participant,
      user,
    });
  }

  @Get(':id/certification-logs')
  @ApiOperation({ summary: '챌린지 인증 로그 조회 (챌린지 캘린더 조회)' })
  @ApiResponse({ type: [GetCertificationLogsResponseDto] })
  getChallengeCertificationLogs(
    @Param('id') challengeId: number,
    @Query() query: GetCertificationLogsRequestDto,
    @RequestUser() user: User,
  ): Promise<GetCertificationLogsResponseDto[]> {
    return this.challengesService.getChallengeCertificationLogs({
      challengeId,
      userId: user.id,
      startDate: query.startDate,
      endDate: query.endDate,
    });
  }

  @Get(':id/conditions')
  @ApiOperation({
    summary:
      '영양 챌린지 인증 조건 조회 (영양 챌린지: 챌린지 타입에 nutri prefix 가 붙은 챌린지 (nutriBulk, nutriDiet...))',
  })
  @ApiResponse({ type: GetChallengeConditonResponseDto })
  async getChallengeNutrientCondition(
    @Param('id') id: number,
    @RequestUser() user: User,
  ) {
    return this.challengesService.getChallengeConditions(id, user);
  }

  @Post('/nutritions/certifications')
  @ApiOperation({ summary: '영양 챌린지 인증' })
  @ApiBody({ type: PostNutritionChallengesCertificationRequestDto })
  @ApiResponse({ type: [PostChallengesCertificationResponseDto] })
  async certifiyNutritionChallenges(
    @RequestUser() user: User,
    @Body() data: PostNutritionChallengesCertificationRequestDto,
  ): Promise<ChallengeParticipants[]> {
    const participants =
      await this.challengesService.findNutritionChallengeParticipants(user.id);
    return this.challengesService.certifyManyNutritionChallenges({
      user,
      data,
      participants,
    });
  }
}
