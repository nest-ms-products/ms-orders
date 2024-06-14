import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersMessages } from 'src/common/enums/messages-tcp.enum';
import { ChangeStatusDto } from './dto/change-status.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { PaidOrderDto } from './dto/paid-order.dto';
import { OrdersService } from './orders.service';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern(OrdersMessages.Create)
  async create(@Payload() createOrderDto: CreateOrderDto) {
    const order = await this.ordersService.create(createOrderDto);
    const paymentSession = await this.ordersService.createPaymentSession(order);
    return { order, paymentSession };
  }

  @MessagePattern(OrdersMessages.FindAll)
  findAll(@Payload() orderPaginationDto: OrderPaginationDto) {
    return this.ordersService.findAll(orderPaginationDto);
  }

  @MessagePattern(OrdersMessages.FindOne)
  findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern(OrdersMessages.ChangeStatus)
  changeOrderStatuss(@Payload() changeStatusDto: ChangeStatusDto) {
    return this.ordersService.changeOrderStatus(changeStatusDto);
  }

  @EventPattern(OrdersMessages.PaymentSuccess)
  async paidOrder(@Payload() payload: PaidOrderDto) {
    console.log({ payload });
    return '';
  }
}
