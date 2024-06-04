import { Injectable } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NatsService } from 'src/common/enums/services.enum';
import { envs } from 'src/config/envs';

@Injectable()
export class ApiClientProxy {
  static natsClientProxy() {
    return ClientsModule.register([
      {
        name: NatsService,
        transport: Transport.NATS,
        options: {
          servers: envs.natsServers,
        },
      },
    ]);
  }
}
