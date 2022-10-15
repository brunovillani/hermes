import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway()
export class MessageCentralGateway {
  @WebSocketServer() server;
  users: number = 0;

  async handleConnection() {
    // A client has connected
    this.users++;
    console.log(`connections: ${this.users}`);
    // Notify connected clients of current users
    // this.server.emit('users', this.users);
  }
  async handleDisconnect() {
    // A client has disconnected
    this.users--;
    console.log(`connections: ${this.users}`);
    // Notify connected clients of current users
    // this.server.emit('users', this.users);
  }

  @SubscribeMessage('chat')
  handleMessage(client: any, payload: any): void {
    console.log(`payload: ${payload}`);
    this.server.emit('response', `${payload} and here is my response`);
  }
}
