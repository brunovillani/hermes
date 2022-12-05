import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GpioService } from './services/gpio.service';
import { Rule, SchedulerService } from './services/scheduler.service';

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
    return 'connected';
  }
  async handleDisconnect() {
    this.users--;
    console.log(`connections: ${this.users}`);
    return 'disconnected';
  }
  //#endregion

  @SubscribeMessage('ping')
  handlePing(_: any, msg: string): string {
    console.log(msg);
    return 'pong';
  }

  //#region Scheduler
  @SubscribeMessage('set-scheduler')
  setScheduler(_: any, payload: Rule): string {
    return this.schedulerSrv.setSchedule(payload, this.emitSchedule);
  }

  @SubscribeMessage('get-scheduler')
  getSchedulers(): string[] {
    return this.schedulerSrv.getSchedules();
  }

  @SubscribeMessage('clear-scheduler')
  clearSchedulers(_: any, name: string): boolean {
    return this.schedulerSrv.clearSchedule(name);
  }

  private emitSchedule = (name: string): void => {
    console.log(`emitting ${name}`);
    this.server.emit(name, true);
  };
  //#endregion

  //#region GPIO
  @SubscribeMessage('toggle-output')
  toggleIO(_: any, payload: { id: number }): void {
    this.gpioSrv.toggleOutput(payload.id);
  }
  //#endregion
}
