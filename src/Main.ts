import { Logger } from './core/Logger';
import Discord from './services/Discord';
import { System } from './core/System';

////////////////////////////////////////

process.on('uncaughtException', (error) => {
  Logger.error({
    name: 'Process uncaught exception',
    details: error,
  });

  System.exit(-1);
});

process.on('unhandledRejection', (error) => {
  Logger.error({
    name: 'Process unhandled rejection',
    details: error,
  });

  System.exit(-1);
});

process.on('SIGINT', () => {
  Logger.log({ name: 'Received SIGINT' });

  System.exit(-1);
});

////////////////////////////////////////

const main = async () => {
  try {
    Logger.log({ name: 'Starting Server' });

    await Discord.setup();
  } catch (error) {
    Logger.error({
      name: 'Unexpected error in main',
      details: error,
    });

    System.exit(-1);
  }
};

////////////////////////////////////////

main();
