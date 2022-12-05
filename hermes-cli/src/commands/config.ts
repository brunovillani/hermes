import { Arguments, CommandBuilder } from 'yargs';
import { readConfigFile } from '../helpers/config.helper';
import { consoleWrite } from '../helpers/utils.helper';

type Options = {
  list?: boolean;
};

export const command: string = 'config';
export const description: string = 'configure default values';
export const alias: string = 'c';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs
    .options({
      list: { type: 'boolean', alias: 'l', description: 'list all configurations' },
    })
    .example([['$0 --list', 'return json of configuration']])
    .commandDir('config_cmd');

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { list } = argv;
  if (list) {
    const configString = readConfigFile();
    consoleWrite(configString);
    process.exit(0);
  }
};
