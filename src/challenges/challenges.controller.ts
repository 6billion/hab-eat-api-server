import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BearerGuard } from 'src/auth/guards/bearer.guard';
import { ChallengesService } from './services/challenges.service';
import { RequestUser } from 'src/request-user.decorator';
import { User } from 'src/users/user';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { PostChallengeCertificationRequestDto } from './dtos/post-certification.dto';
import { GetChallengeConditonResponseDto } from './dtos/get-challenge-condition.dto';
import { ChallengeParticipants } from '@prisma/client';

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

  @ApiOperation({ summary: '습관 챌린지 이미지 업로드 하기' })
  @ApiBody({ type: PostChallengeCertificationRequestDto })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ type: Boolean, description: '인증 성공 여부' })
  @Post(':id/images')
  @UseInterceptors(FileInterceptor('file'))
  async postChallengeCertifications(
    @UploadedFile() data: Express.Multer.File,
    @RequestUser() user: User,
    @Param('id', ParseIntPipe) challengeId: number,
  ) {
    const participant =
      await this.challengesService.findUniqueParticipantOrThrow(
        user.id,
        challengeId,
      );

    return this.challengesService.certyfyChallenge({
      data,
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
      '영양 챌린지 인증 조건 조회(영양 챌린지: "habit" 타입 챌린지 제외한 모든 챌린지)',
  })
  @ApiResponse({ type: GetChallengeConditonResponseDto })
  async getChallengeNutrientCondition(
    @Param('id') id: number,
    @RequestUser() user: User,
  ) {
    return this.challengesService.getChallengeConditions(id, user);
  }

  @OnEvent(EventNames.certifiyNutritionChallenges)
  async certifiyNutritionChallenges({
    user,
    data,
  }: {
    user: User;
    data: TargetNutrients;
  }): Promise<ChallengeParticipants[]> {
    const participants =
      await this.challengesService.findNutritionChallengeParticipants(user.id);
    return this.challengesService.certifyManyNutritionChallenges({
      user,
      data,
      participants,
    });
  }
}
