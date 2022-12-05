import { io } from 'socket.io-client';
import { promisify } from 'util';
import { Arguments, CommandBuilder } from 'yargs';
import { consoleWrite, getInterupt } from '../helpers/utils.helper';

type Options = {
  listener: string;
  hour: number;
  minute: number;
  host?: string;
  port?: number;
};

export const command: string = 'comm <listener>';
export const description: string = 'Communication to the server';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs
    .option('host', { default: 'localhost' })
    .option('port', { default: 3000 })
    .option('hour', { type: 'number' })
    .option('minute', { type: 'number' })
    .positional('listener', { type: 'string', demandOption: true });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { listener, hour, minute, host, port } = argv;
  const socket = io(`ws://${host}:${port}`);
  const socketOn = promisify(socket.on);
  getInterupt(() => process.stdout.write('Ops! I was interupted\n'));
  await socketOn('connect', () => {});
  consoleWrite(`${hour}:${minute}\n`);
  socket.emit(listener, hour, minute, (ack: boolean) => consoleWrite(String(ack) + '\n'));
  // const messageConfirmation = await socketOnToPromise('response', socket);
  // process.stdout.write(`${messageConfirmation}\n`);
  socket.on('get-scheduler', (response) => consoleWrite(`response at: ${response} - success!\n`));
  setTimeout(() => process.exit(0), 50000);
};
