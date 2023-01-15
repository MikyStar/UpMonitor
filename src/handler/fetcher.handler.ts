import Fetcher, { IFetcher } from '../core/Fetcher';
import DiscordHandler, { IDiscordHandler } from './discord.handler';

////////////////////////////////////////////////////////////////////////////////

class FetcherHandler {
  fetcher: IFetcher;
  discord: IDiscordHandler;

  constructor(fetcher: IFetcher, discord: IDiscordHandler) {
    this.fetcher = fetcher;
    this.discord = discord;
  }

  checkEveryEndpoints = async () => {
    const eachStatus = await this.fetcher.getEachStatus();

    eachStatus.forEach(async ({ name, isAlive }) => {
      if (!isAlive) {
        await this.discord.error(name, {
          name: 'Endpoint not alive',
        });
      } else {
        await this.discord.info(name, {
          name: 'Endpoint alive',
        });
      }
    });
  };
}

export default new FetcherHandler(Fetcher, DiscordHandler);
