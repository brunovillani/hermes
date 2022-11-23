import { Injectable } from '@nestjs/common';
import * as Schedule from 'node-schedule';
import { promisify } from 'util';

@Injectable()
export class SchedulerService {
  private scheduleJob = promisify(Schedule.scheduleJob);
  private schedules = {};

  public setSchedule(
    hour: number,
    minute: number,
    action: (name: string) => void = null,
  ): string {
    let scheduleName = `${hour}:${minute}`;
    const index = Object.keys(this.schedules).filter((p) =>
      p.includes(scheduleName),
    ).length;
    scheduleName += index != 0 ? `_${index}` : '';
    this.schedules[scheduleName];

    this.scheduleJob({ hour, minute }).then(
      () => action && action(scheduleName),
    );
    return scheduleName;
  }

  public getSchedules(): string[] {
    return Object.keys(this.schedules);
  }
}
