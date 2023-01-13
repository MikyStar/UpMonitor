import { Logger } from './core/Logger';
import Discord from './services/Discord';
import { AsyncUtils } from './utils';
import Environment from './core/Environment';
import { System } from './core/System';

////////////////////////////////////////

process.on('uncaughtException', (error) => {
  Logger.log({
    name: 'Process uncaught exception',
    level: 'error',
    details: error,
  });
  System.exit(-1);
});

process.on('unhandledRejection', (error) => {
  Logger.log({
    name: 'Process unhandled rejection',
    level: 'error',
    details: error,
  });
  System.exit(-1);
});

process.on('SIGINT', () => {
  Logger.log({ name: 'Received SIGINT', level: 'info' });
  System.exit(-1);
});

////////////////////////////////////////

const main = async () => {
  try {
    Logger.log({ name: 'Starting Server' });

    if (Environment.DISCORD_ENABLED) {
      await AsyncUtils.retry(
        () => Discord.setup(),
        (retryCbInfos) => Logger.logRetry(retryCbInfos),
      );
    }

    // await AsyncUtils.retry(
    // 	() => Server.listen(),
    // 	(retryCbInfos) => Logger.logRetry(retryCbInfos),
    // );
    console.log('hello world');
  } catch (error) {
    Logger.log({
      name: 'Unexpected error in main',
      level: 'error',
      details: error,
    });

    System.exit(-1);
  }
};

////////////////////////////////////////

main();
