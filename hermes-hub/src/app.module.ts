import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageCentralGateway } from './message-central.gateway';
import { GpioGateway } from './gpio.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, MessageCentralGateway, GpioGateway],
})
export class AppModule {}
