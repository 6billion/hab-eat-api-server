import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BearerGuard } from 'src/auth/guards/bearer.guard';
import { ChallengesService } from './services/challenges.service';
import { RequestUser } from 'src/request-user.decorator';
import { User } from 'src/users/user';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetChallengeResponseDto } from './dtos/get-challenges.dto';
import {
  PostParticipantsRequestDto,
  PostParticipantsResponseDto,
} from './dtos/post-participants.dto';

@ApiTags('challenges')
@ApiBearerAuth()
@UseGuards(BearerGuard)
@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get()
  @ApiResponse({ type: GetChallengeResponseDto })
  getChallenges(@RequestUser() user: User): Promise<GetChallengeResponseDto> {
    return this.challengesService.getChallenges(user);
  }

  @Post(':id/participants')
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
}
