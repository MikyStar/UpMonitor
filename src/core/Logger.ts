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

export type LogLevel = 'error' | 'warning' | 'info';

////////////////////////////////////////

export namespace Logger {
  /**
   * @description Print the message
   */
  export const log = (log: LogMessage) => {
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

    level === 'error' ? console.error(formatedJSON) : console.log(formatedJSON);

    return formatedJSON;
  };
}
