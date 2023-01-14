import { Logger } from './core/Logger';
import Discord from './services/Discord';
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

    await Discord.setup();
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
