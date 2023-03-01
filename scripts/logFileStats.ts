import { SystemUtils } from '../src/utils/system.utils';
import { DateUtils } from '../src/utils/date.utils';
import { LOG_DATE_FORMAT } from '../src/core/Logger';

////////////////////////////////////////

const main = async () => {
  const logFilePath = process.argv[1];

  if (!logFilePath) throw new Error('You need to provide a log file');

  if (!SystemUtils.doesFileExists(logFilePath))
    throw new Error(`File '${logFilePath}' does not exists`);

  ///// /////

  const date = DateUtils.getFormatedTimeStamp(LOG_DATE_FORMAT);
  const { stdout: wcOut } = await SystemUtils.shell(`wc -l ${logFilePath}`);
  const { stdout: duOut } = await SystemUtils.shell(`du -sh ${logFilePath}`);

  const lineCount = trimWcOutput(wcOut);
  const diskUsage = trimDuOutput(duOut);

  console.log(`[${date}]
File: ${logFilePath}
Lines: ${lineCount}
DiskUsage: ${diskUsage}
  `);
};

const trimWcOutput = (out: string) => {
  const regexAnyGroupOfDigits = /\d+/;
  const lines = out.match(regexAnyGroupOfDigits)[0];

  return lines;
};

const trimDuOutput = (out: string) => {
  const regexStringSeparatedSpace = /\w+\.?\w+/;
  const use = out.match(regexStringSeparatedSpace)[0];

  return use;
};

////////////////////////////////////////

main();
