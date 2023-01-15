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
  };
}

export default new FetcherHandler(Fetcher, Discord);
