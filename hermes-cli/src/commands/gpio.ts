import { Arguments, CommandBuilder } from 'yargs';
import { consoleWrite } from '../helpers/utils';

type Options = {
  pin: string;
  status: boolean | undefined;
  list: boolean | undefined;
};

export const command: string = 'gpio <pin> <status> <list>';
export const desc: string = 'Manipulate gpio pins.';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs
    .options({
      upper: { type: 'boolean' },
    })
    .positional('name', { type: 'string', demandOption: true });

export const handler = (argv: Arguments<Options>): void => {
  const { name, upper } = argv;
  const greeting = `Hello, ${name} from narnia!`;
  consoleWrite(upper ? greeting.toUpperCase() : greeting);
  process.exit(0);
};
