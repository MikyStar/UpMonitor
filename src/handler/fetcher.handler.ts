import Fetcher, { IFetcher } from '../core/Fetcher';
import Discord, { IDiscord } from '../services/Discord';

////////////////////////////////////////////////////////////////////////////////

class FetcherHandler {
  fetcher: IFetcher;
  discord: IDiscord;

  constructor(fetcher: IFetcher, discord: IDiscord) {
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

export default new FetcherHandler(Fetcher, Discord);
