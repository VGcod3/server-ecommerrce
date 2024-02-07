import { IsOptional, IsString } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsString()
  page?: number;

  @IsOptional()
  @IsString()
  take: number;
}

export class OrderWithPagination extends PaginationDto {
  @IsOptional()
  orderBy?: 'dec' | 'asc';
}
