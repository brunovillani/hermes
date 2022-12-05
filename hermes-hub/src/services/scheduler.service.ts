import { Injectable } from '@nestjs/common';
import * as Schedule from 'node-schedule';

export type Rule = {
  hour: number;
  minute: number;
  second: number;
  cron: string;
};
// CronJob: s m h d m w
@Injectable()
export class SchedulerService {
  private schedules: { [key: string]: Schedule.Job } = {};

  public setSchedule(
    rule: Rule,
    action: (name: string) => void = null,
  ): string {
    const { hour, minute, second, cron } = rule;
    let scheduleName = cron != null ? `cron` : `${hour}:${minute}:${second}`;
    const index = Object.keys(this.schedules).filter((p) =>
      p.includes(scheduleName),
    ).length;
    scheduleName = index != 0 ? `${index}_${scheduleName}` : scheduleName;
    let job: Schedule.Job;
    if (cron != null) {
      job = Schedule.scheduleJob(cron, () => action && action(scheduleName));
    } else {
      const date = new Date();
      hour && date.setHours(hour);
      minute && date.setMinutes(minute);
      second && date.setSeconds(second);
      job = Schedule.scheduleJob(date, () => action && action(scheduleName));
    }
    this.schedules[scheduleName] = job;
    return scheduleName;
  }

  public getSchedules(): string[] {
    return Object.keys(this.schedules);
  }

  public clearSchedule(name: string): boolean {
    console.log(`clearing ${name}`);
    Object.keys(this.schedules).forEach((k) => {
      console.log(k);
    });
    const job = this.schedules[name];
    const ack = job && job.cancel();
    delete this.schedules[name];
    return ack;
  }
}
