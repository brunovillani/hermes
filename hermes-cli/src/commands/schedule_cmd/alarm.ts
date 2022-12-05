import { Arguments, CommandBuilder } from 'yargs';
import { SocketHelper } from '../../helpers/socket.helper';
import { getInterupt } from '../../helpers/utils.helper';
import { consoleWrite } from '../../helpers/utils.helper';

type Options = {
  hour?: number;
  minute?: number;
  second?: number;
  cron?: string;
};

export const command: string = 'alarm';
export const desc: string = 'Schedule an alarm on rpi.';

export const builder: CommandBuilder<Options, Partial<Options>> = (yargs) =>
  yargs.options({
    hour: { type: 'number', alias: 'h' },
    minute: { type: 'number', alias: 'm' },
    second: { type: 'number', alias: 's' },
    cron: { type: 'string', default: null },
  });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  getInterupt(() => consoleWrite('Ops! I was interupted\n'));
  const socket = await SocketHelper.createSocket();
  await socket.connect();
  consoleWrite(`I have id ${socket?.id}`);
  const ack = await socket.emit('set-scheduler', argv);
  consoleWrite(String(ack) + '\n');
  process.exit(0);
};
