import { DateUtils } from '../utils';
import Discord from '../services/Discord';
import Environment from './Environment';

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

interface LogRetryParams {
  tryIndex: number;
  error: any;
  maxRetries?: number;
}

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

    const formatedJSON = require('util').inspect(toLog, {
      depth: null,
      showHidden: false,
    });

    level === 'error' ? console.error(formatedJSON) : console.log(formatedJSON);

    if (Environment.DISCORD_ENABLED && Discord.isConnected) {
      Discord.send(toLog);
    }
  };

  /**
   * @description Logger handler for retry Promise
   */
  export const logRetry = (params: LogRetryParams) => {
    const { tryIndex, error, maxRetries = Environment.MAX_RETRIES } = params;

    const toLog: Partial<LogMessage> = {
      details: { retryNumber: tryIndex, error },
    };

    if (tryIndex !== maxRetries) {
      Logger.log({
        ...toLog,
        name: 'Retrying',
        level: 'warning',
      });
    } else {
      Logger.log({
        ...toLog,
        name: 'Error on last retry',
        level: 'error',
      });
    }
  };
}
