import { CronJob } from 'cron';
import Config from '../core/Config';
import { ILogger } from '../core/Logger';

import { IFetcherHandler } from './fetcher.handler';

////////////////////////////////////////////////////////////////////////////////

export default class CronHandler {
  fetcherHandler: IFetcherHandler;
  cronJobs: CronJob[];
  logger: ILogger;

  constructor(
    fetcherHandler: IFetcherHandler,
    config: Config,
    logger: ILogger,
  ) {
    this.fetcherHandler = fetcherHandler;
    this.logger = logger;

    this.cronJobs = config.endpointsConfigs.map((conf) => {
      return new CronJob(conf.cronJobSchedule, async () => {
        await this.fetcherHandler.checkLiveliness(conf.name);
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
