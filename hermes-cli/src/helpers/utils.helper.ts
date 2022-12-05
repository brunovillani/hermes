import { execSync } from 'child_process';
import inquirer from 'inquirer';
import { io, Socket } from 'socket.io-client';

export const getInterupt = (action: () => void = () => {}) => {
  process.on('SIGINT', function () {
    process.stdout.write('\nCaught interrupt signal\n');
    action();
    process.exit();
  });
};

export const asyncSleep = (milliseconds: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, milliseconds));

export const processSleep = (seconds: number) => execSync(`sleep ${seconds}`);

export const consoleWrite = (message: string) => {
  process.stdout.write(`${message}\n`);
};

export const toPromise = <T>(name: string, ...rest: any[]): Promise<T> => {
  return new Promise((resolve, _) => {
    const method = rest.pop();
    const data = rest.pop();
    if (data) {
      method(name, data, (response: any) => resolve(response));
    } else {
      method(name, (response: any) => resolve(response));
    }
  });
};

export const getConnectedSocket = async (options: { host?: string; port?: number } = { host: null, port: null }): Promise<Socket> => {
  const questions: inquirer.QuestionCollection<{ host: string; port: number }> = [
    {
      type: 'input',
      name: 'host',
      message: 'Set host address',
      default: '127.0.0.1',
      validate(value: string) {
        const pass = value.match(/^(localhost)$|^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/);
        if (pass) {
          return true;
        }
        return 'Please enter a valid ip';
      },
    },
    {
      type: 'input',
      name: 'port',
      message: 'Set port',
      default: '3000',
      validate(value: number) {
        const pass = value > 0 && value < 10000;
        if (pass) {
          return true;
        }
        return 'Please enter a valid port';
      },
    },
  ];

  const { host, port } = await inquirer.prompt(questions, options).then((answers) => {
    // const jsonAnswer = JSON.stringify(answers, null, '  ');
    // consoleWrite(`\nYou chose ${jsonAnswer}!\n\n`);
    return answers;
  });

  return io(`ws://${host}:${port}`);
};
