export class SystemUtils {
  static wait = (seconds: number) =>
    new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
