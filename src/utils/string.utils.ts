export class StringUtils {
  /** @see : https://stackoverflow.com/a/6259543 */
  static splitEveryNChar = (txt: string, n: number) =>
    txt.match(new RegExp('[\\s\\S]{1,' + n + '}', 'g'));
}
