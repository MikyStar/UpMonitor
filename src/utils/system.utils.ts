export type NodeEnv = 'dev' | 'production';

export class SystemUtils {
  static wait = (seconds: number) =>
    new Promise((resolve) => setTimeout(resolve, seconds * 1000));

  static exit = (code = 0) => process.exit(code);

  static getEnv = () => process.env.NODE_ENV as NodeEnv;
}
