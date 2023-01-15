export class SystemUtils {
  static wait = (seconds: number) =>
    new Promise((resolve) => setTimeout(resolve, seconds * 1000));

  static exit = (code = 0) => process.exit(code);
}
