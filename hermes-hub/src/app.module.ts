import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { SchedulerService } from './services/scheduler.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppGateway, SchedulerService],
})
export class AppModule {}
