import Fetcher, { IFetcher } from '../core/Fetcher';
import DiscordHandler, { IDiscordHandler } from './discord.handler';

////////////////////////////////////////////////////////////////////////////////

class FetcherHandler {
  fetcher: IFetcher;
  discordHandler: IDiscordHandler;

  constructor(fetcher: IFetcher, discordHandler: IDiscordHandler) {
    this.fetcher = fetcher;
    this.discordHandler = discordHandler;
  }

  checkEveryEndpoints = async () => {
    const eachStatus = await this.fetcher.getEachStatus();

    eachStatus.forEach(async ({ name, isAlive }) => {
      if (!isAlive) {
        await this.discordHandler.error(name, {
          name: 'Endpoint not alive',
        });
      } else {
        await this.discordHandler.info(name, {
          name: 'Endpoint alive',
        });
      }
    });
  };
}

export default new FetcherHandler(Fetcher, DiscordHandler);
