import { execSync } from 'child_process';
import { Socket } from 'socket.io-client';

export const getInterupt = (action: () => void = () => {}) => {
  process.on('SIGINT', function () {
    process.stdout.write('\nCaught interrupt signal\n');
    action();
    process.exit();
  });
};

export const asyncSleep = (milliseconds: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, milliseconds));

export const processSleep = (seconds: number) => execSync(`sleep ${seconds}`);

export const socketOnToPromise = (eventName: string, socket: Socket): Promise<any> =>
  new Promise((resolve) => socket.on(eventName, (args: any) => resolve(args)));

export const consoleWrite = (message: string) => process.stdout.write(message);
