import { Module } from '@nestjs/common';
import { ApiClientProxy } from './client-proxy';

@Module({
  imports: [ApiClientProxy.natsClientProxy()],
  exports: [ApiClientProxy.natsClientProxy()],
})
export class NatsModule {}
