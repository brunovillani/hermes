import { io } from 'socket.io-client';
import { Arguments, CommandBuilder } from 'yargs';
import { getInterupt, socketOnToPromise } from '../helpers/utils';

type Options = {
  message: string;
};

export const command: string = 'comm <message>';
export const description: string = 'Communication to the client';
export const alias: string = 'c';

export const builder: CommandBuilder<Options, Options> = (yargs) => yargs.positional('message', { type: 'string', demandOption: true });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { message } = argv;
  const socket = io('http://localhost:3000');
  getInterupt(() => process.stdout.write('Ops! I was interupted\n'));
  process.stdout.write(`message: ${message}\n`);
  await socketOnToPromise('connect', socket);
  process.stdout.write('connected!\n');
  socket.emit('chat', message);
  const messageConfirmation = await socketOnToPromise('response', socket);
  process.stdout.write(`${messageConfirmation}\n`);
  process.exit(0);
};
