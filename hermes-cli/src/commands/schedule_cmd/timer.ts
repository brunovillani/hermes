import { Arguments, CommandBuilder } from 'yargs';
import { asyncSleep, getInterupt } from '../../helpers/utils.helper';
import { consoleWrite } from '../../helpers/utils.helper';
import * as Schedule from 'node-schedule';

type Options = {
  hour?: number;
  minute?: number;
  second?: number;
  cron?: string;
};

export const command: string = 'timer';
export const desc: string = 'Schedule a timer.';

export const builder: CommandBuilder<Options, Partial<Options>> = (yargs) =>
  yargs.options({
    hour: { type: 'number', alias: 'h' },
    minute: { type: 'number', alias: 'm' },
    second: { type: 'number', alias: 's' },
    cron: { type: 'string', default: null },
  });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { hour, minute, second, cron } = argv;
  consoleWrite(JSON.stringify(argv, null, ' '));
  // let scheduleName = `${hour}:${minute}:${second}`;
  let job: Schedule.Job;
  getInterupt(() => {
    consoleWrite('Ops! let me close the job.\n');
    job.cancel();
  });
  let finished = false;
  if (cron) {
    job = Schedule.scheduleJob(cron, () => consoleWrite('tik-tok'));
  } else {
    const date = new Date();
    hour && date.setHours(hour);
    minute && date.setMinutes(minute);
    second && date.setSeconds(second);
    job = Schedule.scheduleJob(date, () => {
      consoleWrite('tik-tok');
      finished = true;
    });
  }
  consoleWrite(`job name is ${job.name}`);
  let counter = 0;
  while (!finished) {
    await asyncSleep(1000);
    consoleWrite(`${counter++}`);
  }
  process.exit(0);
};
