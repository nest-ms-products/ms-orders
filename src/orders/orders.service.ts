import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { ProductMessages } from 'src/common/enums/messages-tcp.enum';
import { NatsService } from 'src/common/enums/services.enum';
import { ChangeStatusDto } from './dto/change-status.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderPaginationDto } from './dto/order-pagination.dto';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name);
  constructor(@Inject(NatsService) private readonly client: ClientProxy) {
    super();
  }
  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to the database');
  }
  async create(createOrderDto: CreateOrderDto) {
    try {
      const ids = createOrderDto.items.map((item) => item.productId);

      const products = await firstValueFrom(
        this.client.send(ProductMessages.ValidateProducts, ids),
      );

      const { totalAmount, totalItems } = createOrderDto.items.reduce(
        (acc, item) => {
          acc.totalAmount += item.quantity * products[item.productId].price;
          acc.totalItems += item.quantity;
          return acc;
        },
        { totalAmount: 0, totalItems: 0 },
      );

      const order = await this.order.create({
        data: {
          totalAmount,
          totalItems,
          ordersItems: {
            createMany: {
              data: createOrderDto.items.map((item) => ({
                quantity: item.quantity,
                productId: item.productId,
                price: products[item.productId].price,
              })),
            },
          },
        },
        include: {
          ordersItems: {
            select: {
              quantity: true,
              price: true,
              productId: true,
            },
          },
        },
      });

      return {
        ...order,
        ordersItems: order.ordersItems.map((item) => ({
          ...item,
          name: products[item.productId].name,
        })),
      };
    } catch (error) {
      throw new RpcException(error);
    }
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
      include: {
        ordersItems: {
          select: {
            quantity: true,
            price: true,
            productId: true,
          },
        },
      },
    });
    if (!order) {
      throw new RpcException(
        new NotFoundException(`Order with id ${id} not found`),
      );
    }
    const productsIds = order.ordersItems.map((item) => item.productId);

    const products = await firstValueFrom(
      this.client.send(ProductMessages.ValidateProducts, productsIds),
    );

    order.ordersItems = order.ordersItems.map((item) => ({
      ...item,
      name: products[item.productId].name,
    }));
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
