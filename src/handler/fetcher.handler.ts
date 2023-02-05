import Config from '../core/Config';
import pkg from '../../package.json';
import { ILogger, LogMessage } from '../core/Logger';
import { SystemUtils } from '../utils/system.utils';
import { IDiscordHandler } from './discord.handler';

////////////////////////////////////////////////////////////////////////////////

export type IFetcherHandler = FetcherHandler;

////////////////////////////////////////////////////////////////////////////////

export default class FetcherHandler {
  discordHandler: IDiscordHandler;
  config: Config;
  logger: ILogger;

  //////////

  constructor(
    discordHandler: IDiscordHandler,
    config: Config,
    logger: ILogger,
  ) {
    this.discordHandler = discordHandler;
    this.config = config;
    this.logger = logger;
  }

  //////////

  ping = async (endpointName: string): Promise<number> => {
    const { url, expectedStatusCode } =
      this.config.findEndpointByName(endpointName);

    if (!url) throw new Error(`No URL found for '${endpointName}'`);
    if (!expectedStatusCode)
      throw new Error(`No expected status code found for '${endpointName}'`);

    const headers = new Headers({
      'User-Agent': `${pkg.name} bot`,
    });
    const response = await fetch(url, { headers });

    return response.status;
  };

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
      this.config.endpointsConfigs.map(({ name }) =>
        this.checkLiveliness(name),
      ),
    );
  };

  private isAlive = async (endpointName: string) => {
    let isAlive, status, error;

    try {
      status = await this.ping(endpointName);
      const { expectedStatusCode } =
        this.config.findEndpointByName(endpointName);

      isAlive = status === expectedStatusCode;
    } catch (e) {
      isAlive = false;
      status = 'Error fetching';
      error = e;
    }

    if (!isAlive) {
      const log: LogMessage = {
        name: 'Endpoint not alive',
        details: { status },
      };

      if (error) log.details = { ...log.details, error };

      await this.discordHandler.error(endpointName, log);
    } else {
      await this.discordHandler.info(endpointName, {
        name: 'Endpoint alive',
      });
    }

    return isAlive;
  };
}
