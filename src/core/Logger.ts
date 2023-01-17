import util from 'util';
import { DateUtils } from '../utils/date.utils';

////////////////////////////////////////

export const LOG_DATE_FORMAT = 'DD/MM/YYYY HH:mm:ss.SSS';

////////////////////////////////////////

export type LogMessage = {
  name: string;
  level?: LogLevel;
  timestamp?: string;
  details?: any;
  env?: NodeEnv;
};

export type ILogger = Logger;

export type LogLevel = 'error' | 'warning' | 'info';
export type NodeEnv = 'dev' | 'production';

////////////////////////////////////////

class Logger {
  formatMessage = (log: LogMessage) => {
    const level = log.level || 'info';

    if (log?.details === undefined) delete log.details;

    /////

    const toLog: LogMessage = {
      name: log.name,
      level,
      timestamp: DateUtils.getFormatedTimeStamp(LOG_DATE_FORMAT),
      env: process.env.NODE_ENV as NodeEnv,
      ...log,
    };

    const formatedJSON = util.inspect(toLog, {
      depth: null,
      showHidden: false,
    });

    return formatedJSON;
  };

  /**
   * Format and print to stdout, sets the level to 'info'
   */
  log = (log: LogMessage) => {
    const formatedJSON = this.formatMessage({
      ...log,
      level: 'info',
    });

    console.log(formatedJSON);
  };

  /**
   * Format and print to stdout, sets the level to 'info'
   */
  warn = (log: LogMessage) => {
    const formatedJSON = this.formatMessage({
      ...log,
      level: 'warning',
    });

    console.warn(formatedJSON);
  };

  /**
   * Format and print to stderr, sets the level to 'error'
   */
  error = (log: LogMessage) => {
    const formatedJSON = this.formatMessage({
      ...log,
      level: 'error',
    });

    console.error(formatedJSON);
  };
}

export default new Logger();
