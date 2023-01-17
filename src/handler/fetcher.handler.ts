import { Config } from '../../config/config';
import { IConfig } from '../../config/IConfig';
import Fetcher, { IFetcher } from '../core/Fetcher';
import Logger, { ILogger } from '../core/Logger';
import { SystemUtils } from '../utils/system.utils';
import DiscordHandler, { IDiscordHandler } from './discord.handler';

////////////////////////////////////////////////////////////////////////////////

export type IFetcherHandler = FetcherHandler;

////////////////////////////////////////////////////////////////////////////////

class FetcherHandler {
  fetcher: IFetcher;
  discordHandler: IDiscordHandler;
  config: IConfig;
  logger: ILogger;

  constructor(
    fetcher: IFetcher,
    discordHandler: IDiscordHandler,
    config: IConfig,
    logger: ILogger,
  ) {
    this.fetcher = fetcher;
    this.discordHandler = discordHandler;
    this.config = config;
    this.logger = logger;
  }

  checkLiveliness = async (endpointName: string) => {
    const isAlive = await this.isAlive(endpointName);

    if (!isAlive) {
      const waitSeconds = 30;

      this.logger.warn({
        name: `Retrying in ${waitSeconds} seconds`,
        details: { channelName: endpointName },
      });

      await SystemUtils.wait(waitSeconds);
      await this.isAlive(endpointName);
    }
  };

  checkEveryEndpoints = async () => {
    await Promise.all(
      this.fetcher.endpointsNames.map((name) => this.checkLiveliness(name)),
    );
  };

  private isAlive = async (endpointName: string) => {
    const status = await this.fetcher.ping(endpointName);
    const { expectedStatusCode } = this.config.endpointsConfigs.find(
      (conf) => conf.name === endpointName,
    );

    const isAlive = status === expectedStatusCode;

    if (!isAlive) {
      await this.discordHandler.error(endpointName, {
        name: 'Endpoint not alive',
        details: { status },
      });
    } else {
      await this.discordHandler.info(endpointName, {
        name: 'Endpoint alive',
      });
    }

    return isAlive;
  };
}

export default new FetcherHandler(Fetcher, DiscordHandler, Config, Logger);
