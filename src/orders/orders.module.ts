import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from 'src/config/envs';
import { ProductsService } from 'src/common/enums/services.enum';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ProductsService,
        transport: Transport.TCP,
        options: {
          host: envs.msProductsHost,
          port: envs.msProductsPort,
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
