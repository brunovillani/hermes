import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import * as Schedule from 'node-schedule';
import { GpioService } from './services/gpio.service';
import { SchedulerService } from './services/scheduler.service';

@WebSocketGateway()
export class AppGateway {
  @WebSocketServer() server;
  private users: number = 0;

  constructor(
    private readonly schedulerSrv: SchedulerService,
    private readonly gpioSrv: GpioService,
  ) {}

  //#region Connection
  async handleConnection() {
    this.users++;
    console.log(`connections: ${this.users}`);
  }
  async handleDisconnect() {
    this.users--;
    console.log(`connections: ${this.users}`);
  }
  //#endregion

  @SubscribeMessage('ping')
  handlePing(): string {
    return 'pong';
  }

  //#region Scheduler
  @SubscribeMessage('set-scheduler')
  setScheduler(_: any, payload: { hour: number; minute: number }): string {
    return this.schedulerSrv.setSchedule(payload.hour, payload.minute, (name) =>
      this.emitSchedule(name),
    );
  }

  @SubscribeMessage('get-scheduler')
  getSchedulers(): string[] {
    return this.schedulerSrv.getSchedules();
  }

  private emitSchedule = (name: string): void => this.server.emit(name, true);
  //#endregion

  //#region GPIO
  @SubscribeMessage('toggle-output')
  toggleIO(_: any, payload: { id: number }): void {
    this.gpioSrv.toggleOutput(payload.id);
  }
  //#endregion
}
