import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

export type NodeEnv = 'dev' | 'production';

export class SystemUtils {
  static wait = (seconds: number) =>
    new Promise((resolve) => setTimeout(resolve, seconds * 1000));

  static exit = (code = 0) => process.exit(code);

  static getEnv = () => process.env.NODE_ENV as NodeEnv;

  static shell = (
    command: string,
  ): Promise<{ stdout?: string; stderr?: string }> => {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) reject(error);

        stdout = stdout || undefined;
        stderr = stderr || undefined;
        resolve({ stdout, stderr });
      });
    });
  };

  static getAbsolutePath = (filePath: string) =>
    path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);

  static doesFileExists = (relativePath: string): boolean =>
    fs.existsSync(this.getAbsolutePath(relativePath)) || false;
}
