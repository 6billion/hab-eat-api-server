import { Controller, Get, UseGuards } from '@nestjs/common';
import { BearerGuard } from 'src/auth/guards/bearer.guard';
import { ChallengesService } from './challenges.service';
import { RequestUser } from 'src/request-user.decorator';
import { User } from 'src/users/user';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetChallengeResponseDto } from './dtos/get-challenges-response.dto';

@ApiTags('challenges')
@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get()
  @ApiResponse({ type: GetChallengeResponseDto })
  @UseGuards(BearerGuard)
  getChallenges(@RequestUser() user: User): Promise<GetChallengeResponseDto> {
    return this.challengesService.getChallenges(user);
  }
}
