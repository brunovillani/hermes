import { Observable } from 'rxjs';
import { Socket } from 'socket.io-client';
import { readConfigFile } from './config.helper';
import { getConnectedSocket } from './utils.helper';

export class SocketHelper {
  private isConnected: boolean;

  private constructor(private socket: Socket) {
    this.socket.on('disconnected', () => (this.isConnected = false));
  }

  public static async createSocket(): Promise<SocketHelper> {
    const { host, port } = readConfigFile(true);
    const socket = await getConnectedSocket({ host, port });
    return new SocketHelper(socket);
  }

  public get id(): string {
    return this.socket.id;
  }

  public async connect(): Promise<true> {
    return new Promise((res, rej) => {
      if (this.isConnected) {
        res(this.isConnected);
        return;
      }
      this.socket.on('connect', () => {
        this.isConnected = true;
        res(this.isConnected);
      });
    });
  }

  public async emit(name: string, data: any = null): Promise<any> {
    return new Promise((res, rej) => {
      this.socket.emit(name, data, (response: any) => {
        res(response);
      });
    });
  }

  public on(name: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(name, (response: any) => {
        subscriber.next(response);
      });
    });
  }
}
