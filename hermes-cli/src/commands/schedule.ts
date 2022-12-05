import { Subscription } from 'rxjs';
import { Arguments, CommandBuilder } from 'yargs';
import { SocketHelper } from '../helpers/socket.helper';
import { asyncSleep, consoleWrite, getInterupt } from '../helpers/utils.helper';

type Options = {
  list?: boolean;
  ping?: boolean;
  clear?: boolean;
  name?: string;
  listen?: boolean;
};

export const command: string = 'schedule';
export const desc: string = 'Schedule an alarm on rpi.';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs
    .option({
      list: { type: 'boolean', alias: 'l' },
      ping: { type: 'boolean' },
      clear: { type: 'boolean', alias: 'c' },
      name: { type: 'string' },
      listen: { type: 'boolean' },
    })
    .implies('clear', 'name')
    .implies('listen', 'name')
    .commandDir('schedule_cmd');

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  let subscription: Subscription;
  getInterupt(() => {
    subscription && subscription.unsubscribe();
    consoleWrite('Ops! I was interupted\n');
  });
  const { list, ping, clear, name, listen } = argv;
  const socket = await SocketHelper.createSocket();
  await socket.connect();
  consoleWrite(`I have id ${socket?.id}`);
  if (ping) {
    consoleWrite('ping');
    const pong: string = await socket.emit('ping', 'give me a ping');
    consoleWrite(pong);
  }
  if (list) {
    consoleWrite('list');
    const scheduleList: any[] = await socket.emit('get-scheduler');
    consoleWrite(JSON.stringify(scheduleList));
  }
  if (clear) {
    consoleWrite('clear');
    await socket.emit('clear-scheduler', name);
  }
  if (listen) {
    consoleWrite('listen');
    subscription = socket.on(name).subscribe((response: any) => {
      consoleWrite(`${new Date().toTimeString()} - ${response}`);
    });
    while (true) {
      await asyncSleep(500);
    }
  }
  consoleWrite('go to exit');
  process.exit(0);
};
