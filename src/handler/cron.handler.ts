import { CronJob } from 'cron';
import { Config } from '../../config/config';
import { IConfig } from '../../config/IConfig';
import Logger, { ILogger } from '../core/Logger';

import FetcherHandler, { IFetcherHandler } from './fetcher.handler';

////////////////////////////////////////////////////////////////////////////////

class CronHandler {
  fetcherHandler: IFetcherHandler;
  cronJobs: CronJob[];
  logger: ILogger;

  constructor(
    fetcherHandler: IFetcherHandler,
    config: IConfig,
    logger: ILogger,
  ) {
    this.fetcherHandler = fetcherHandler;
    this.logger = logger;

    this.cronJobs = config.endpointsConfigs.map((conf) => {
      return new CronJob(conf.cronJobSchedule, async () => {
        await this.fetcherHandler.isAlive(conf.name);
      });
    });
  }

  startJobs = () => {
    this.logger.log({ name: 'Starting Cron Jobs' });

    this.cronJobs.forEach((job) => {
      if (!job.running) job.start();
    });
  };
}

export default new CronHandler(FetcherHandler, Config, Logger);
