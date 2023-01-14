import util from 'util';
import { DateUtils } from '../utils/DateUtils';

////////////////////////////////////////

export const LOG_DATE_FORMAT = 'DD/MM/YYYY HH:mm:ss.SSS';

////////////////////////////////////////

export interface LogMessage {
  name: string;
  level?: LogLevel;
  timestamp?: string;
  details?: any;
}

export type LogLevel = 'error' | 'info';

////////////////////////////////////////

export namespace Logger {
  export const formatMessage = (log: LogMessage) => {
    const level = log.level || 'info';

    if (Object.keys({ ...log.details }).length === 0) delete log.details;

    /////

    const toLog: LogMessage = {
      name: log.name,
      level,
      timestamp: DateUtils.getFormatedTimeStamp(LOG_DATE_FORMAT),
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
  export const log = (log: LogMessage) => {
    const formatedJSON = formatMessage({
      ...log,
      level: 'info',
    });

    console.log(formatedJSON);
  };

  /**
   * Format and print to stderr, sets the level to 'error'
   */
  export const error = (log: LogMessage) => {
    const formatedJSON = formatMessage({
      ...log,
      level: 'error',
    });

    console.error(formatedJSON);
  };
}
