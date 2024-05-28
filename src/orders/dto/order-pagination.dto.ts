import { OrdersStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { OrdersStatusList } from '../enum/order-status.enum';

export class OrderPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrdersStatusList, {
    message: `Status must be one of the following values: ${OrdersStatusList}`,
  })
  status: OrdersStatus;
}
