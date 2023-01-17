import { Config } from '../../config/config';
import { IConfig } from '../../config/IConfig';
import Fetcher, { IFetcher } from '../core/Fetcher';
import DiscordHandler, { IDiscordHandler } from './discord.handler';

////////////////////////////////////////////////////////////////////////////////

export type IFetcherHandler = FetcherHandler;

////////////////////////////////////////////////////////////////////////////////

class FetcherHandler {
  fetcher: IFetcher;
  discordHandler: IDiscordHandler;
  config: IConfig;

  constructor(
    fetcher: IFetcher,
    discordHandler: IDiscordHandler,
    config: IConfig,
  ) {
    this.fetcher = fetcher;
    this.discordHandler = discordHandler;
    this.config = config;
  }

  isAlive = async (endpointName: string) => {
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
  };

  checkEveryEndpoints = async () => {
    await Promise.all(
      this.fetcher.endpointsNames.map((name) => this.isAlive(name)),
    );
  };
}

export default new FetcherHandler(Fetcher, DiscordHandler, Config);
