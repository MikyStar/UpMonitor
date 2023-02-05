import { config as userConfig } from '../config/config';
import Logger from './core/Logger';
import DiscordHandler from './handler/discord.handler';
import FetcherHandler from './handler/fetcher.handler';
import CronHandler from './handler/cron.handler';
import { SystemUtils } from './utils/system.utils';
import Config from './core/Config';
import Fetcher from './core/Fetcher';

////////////////////////////////////////

const logger = new Logger();

////////////////////////////////////////

process.on('uncaughtException', (error) => {
  logger.error({
    name: 'Process uncaught exception',
    details: error,
  });

  SystemUtils.exit(-1);
});

process.on('unhandledRejection', (error) => {
  logger.error({
    name: 'Process unhandled rejection',
    details: error,
  });

  SystemUtils.exit(-1);
});

process.on('SIGINT', () => {
  logger.log({ name: 'Received SIGINT' });

  SystemUtils.exit(-1);
});

////////////////////////////////////////

const main = async () => {
  try {
    logger.log({ name: 'Starting Server' });

    const config = new Config(userConfig);
    const discordHandler = new DiscordHandler(config, logger);
    const fetcherHandler = new FetcherHandler(
      new Fetcher(config),
      discordHandler,
      config, // TODO ugly, already present in fetcher
      logger,
    );
    const cronHandler = new CronHandler(fetcherHandler, config, logger); // TODO ugly, config already present in fetcher

    // Blocking methods
    await discordHandler.setup();

    // Concurrent methods
    fetcherHandler.checkEveryEndpoints();
    cronHandler.startJobs();
  } catch (error) {
    logger.error({
      name: 'Unexpected error in main',
      details: error,
    });

    SystemUtils.exit(-1);
  }
};

////////////////////////////////////////

main();
