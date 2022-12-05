import { Arguments, CommandBuilder } from 'yargs';
import { readConfigFile, updateConfigFile } from '../../helpers/config.helper';
import { consoleWrite } from '../../helpers/utils.helper';

type Options = {
  name: string;
  value?: string;
  clear?: boolean;
};

export const command: string = 'prop <name>';
export const description: string = 'configure property value';
export const alias: string = 'c';

export const builder: CommandBuilder<Options, Omit<Options, 'name'>> = (yargs) =>
  yargs.positional('name', { describe: 'config property name' }).options({
    value: { type: 'string', alias: 'v', default: null },
    clear: { type: 'boolean' },
  });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { name, value, clear } = argv;
  if (clear) {
    updateConfigFile(name, null);
    process.exit(0);
  }

  if (value) {
    updateConfigFile(name, value);
  } else {
    const configJson = readConfigFile(true);
    consoleWrite(configJson[name]);
  }
  process.exit(0);
};
