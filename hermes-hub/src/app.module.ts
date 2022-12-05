import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { SchedulerService, GpioService } from './services';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppGateway, SchedulerService, GpioService],
})
export class AppModule {}
