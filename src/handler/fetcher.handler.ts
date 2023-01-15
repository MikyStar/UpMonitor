import Fetcher, { IFetcher } from '../core/Fetcher';
import DiscordHandler, { IDiscordHandler } from './discord.handler';

////////////////////////////////////////////////////////////////////////////////

export type IFetcherHandler = FetcherHandler;

////////////////////////////////////////////////////////////////////////////////

class FetcherHandler {
  fetcher: IFetcher;
  discordHandler: IDiscordHandler;

  constructor(fetcher: IFetcher, discordHandler: IDiscordHandler) {
    this.fetcher = fetcher;
    this.discordHandler = discordHandler;
  }

  isAlive = async (endpointName: string) => {
    const isAlive = await this.fetcher.isAlive(endpointName);

    if (!isAlive) {
      await this.discordHandler.error(endpointName, {
        name: 'Endpoint not alive',
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

export default new FetcherHandler(Fetcher, DiscordHandler);
