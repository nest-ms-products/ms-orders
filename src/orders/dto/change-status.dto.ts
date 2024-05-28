import { OrdersStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { OrdersStatusList } from '../enum/order-status.enum';

export class ChangeStatusDto {
  @IsUUID()
  id: string;
  @IsOptional()
  @IsEnum(OrdersStatusList, {
    message: `Status must be one of the following values: ${OrdersStatusList}`,
  })
  status: OrdersStatus;
}
