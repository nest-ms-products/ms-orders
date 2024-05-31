import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { ChangeStatusDto } from './dto/change-status.dto';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name);
  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to the database');
  }
  create(createOrderDto: CreateOrderDto) {
    return {
      service: 'orders service',
      createOrderDto,
    };
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {
    const { status, limit, page } = orderPaginationDto;
    const totalOrders = await this.order.count({
      where: {
        status,
      },
    });
    const totalPages = Math.ceil(totalOrders / limit);
    const data = await this.order.findMany({
      where: {
        status,
      },
      take: limit,
      skip: (page - 1) * limit,
    });
    return {
      data,
      metadata: {
        totalOrders,
        totalPages,
        currentPage: page,
      },
    };
  }

  async findOne(id: string) {
    const order = await this.order.findFirst({
      where: {
        id,
      },
    });
    if (!order) {
      throw new RpcException(
        new NotFoundException(`Order with id ${id} not found`),
      );
    }
    return order;
  }

  async changeOrderStatus(changeStatusDto: ChangeStatusDto) {
    const { id, status } = changeStatusDto;
    const order = await this.findOne(id);

    if (order.status === status) {
      return order;
    }

    return this.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }
}
