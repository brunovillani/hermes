import { io } from 'socket.io-client';
import { promisify } from 'util';
import { Arguments, CommandBuilder } from 'yargs';
import { consoleWrite, getInterupt } from '../helpers/utils.helper';

type Options = {
  pin: number;
  status: boolean | undefined;
  list: boolean | undefined;
};

export const command: string = 'gpio [pin]';
export const desc: string = 'Manipulate gpio pins.';

export const builder: CommandBuilder<Options, Options> = (yargs) => yargs.positional('pin', { type: 'number', demandOption: true });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { pin } = argv;
  const socket = io(`ws://192.168.0.191:3000`);
  const socketOn = promisify(socket.on);
  getInterupt(() => process.stdout.write('Ops! I was interupted\n'));
  socket.on('connect', () => {
    socket.emit('toggle-output', { pin }, () => {});
    setTimeout(() => process.exit(0), 3000);
  });
};
