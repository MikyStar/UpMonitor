import { Config } from '../config/config';
import Logger from './core/Logger';
import DiscordHandler from './handler/discord.handler';
import { ConfigUtils } from './utils/config.utils';
import FetcherHandler from './handler/fetcher.handler';
import CronHandler from './handler/cron.handler';
import { SystemUtils } from './utils/system.utils';

////////////////////////////////////////

process.on('uncaughtException', (error) => {
  Logger.error({
    name: 'Process uncaught exception',
    details: error,
  });

  SystemUtils.exit(-1);
});

process.on('unhandledRejection', (error) => {
  Logger.error({
    name: 'Process unhandled rejection',
    details: error,
  });

  SystemUtils.exit(-1);
});

process.on('SIGINT', () => {
  Logger.log({ name: 'Received SIGINT' });

  SystemUtils.exit(-1);
});

////////////////////////////////////////

const main = async () => {
  try {
    Logger.log({ name: 'Starting Server' });

    // Blocking methods
    ConfigUtils.check(Config);
    await DiscordHandler.setup();

    // Concurrent methods
    FetcherHandler.checkEveryEndpoints();
    CronHandler.startJobs();
  } catch (error) {
    Logger.error({
      name: 'Unexpected error in main',
      details: error,
    });

    SystemUtils.exit(-1);
  }
};

////////////////////////////////////////

main();
