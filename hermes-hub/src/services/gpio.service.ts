import { Injectable } from '@nestjs/common';
import { BinaryValue, Gpio } from 'onoff';

@Injectable()
export class GpioService {
  private inverseValue: { [key: number]: BinaryValue } = {
    1: 0,
    0: 1,
  };
  public toggleOutput(id: number): void {
    const output = new Gpio(id, 'out');
    const state: BinaryValue = output.readSync();
    output.writeSync(this.inverseValue[state]);
  }
}
