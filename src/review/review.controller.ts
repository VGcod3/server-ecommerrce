import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/user.decorator';
import { ReviewDto } from './review.dto';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  async getAll() {
    return this.reviewService.getAll();
  }

  @Get(':id')
  async byId(@Param('id') id: string) {
    return this.reviewService.byId(+id);
  }

  @Get('avg/:id')
  async getAverageRating(@Param('id') productId: string) {
    return this.reviewService.getAverageRating(+productId);
  }

  @UsePipes(new ValidationPipe())
  @Auth()
  @Post(':id')
  async create(
    @Body() dto: ReviewDto,
    @Param('id') productId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.reviewService.create(+productId, dto, +userId);
  }

  @UsePipes(new ValidationPipe())
  @Auth()
  @Put(':id')
  async update(
    @Body() dto: ReviewDto,
    @Param('id') id: number,
    @CurrentUser('id') userId: string,
  ) {
    return await this.reviewService.update(+id, dto, +userId);
  }

  @Auth()
  @Delete(':id')
  async delete(
    @Param('id') reviewId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.reviewService.delete(+reviewId, +userId);
  }
}
