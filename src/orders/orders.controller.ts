import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersMessages } from 'src/common/enums/messages-tcp.enum';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern(OrdersMessages.Create)
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @MessagePattern(OrdersMessages.FindAll)
  findAll() {
    return this.ordersService.findAll();
  }

  @MessagePattern(OrdersMessages.FindOne)
  findOne(@Payload() id: number) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern(OrdersMessages.ChangeStatus)
  changeOrderStatuss() {
    throw new Error('Method not implemented.');
  }
}
