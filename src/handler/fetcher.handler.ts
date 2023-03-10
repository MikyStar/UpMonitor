import Config from '../core/Config';
import pkg from '../../package.json';
import { ILogger, LogMessage } from '../core/Logger';
import { AsyncUtils, OnFailureProps } from '../utils/async.utils';
import { DEFAULT_RETRY } from '../../config/IConfig';
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

  /**
   * Also retries according to user's config or default if endpoint not alive
   */
  checkLiveliness = async (endpointName: string) => {
    const { retry } = this.config.findEndpointByName(endpointName);

    const maxRetryTimes = retry?.times || DEFAULT_RETRY.times;
    const waitSeconds = retry?.waitSeconds || DEFAULT_RETRY.waitSeconds;

    const handleChecking = async () => {
      const isEndpointAlive = await this.isAlive(endpointName);

      // As the AsyncUtils.retry function needs a rejection to make a retry
      if (!isEndpointAlive) {
        throw new Error();
      }
    };

    const onFailure = async ({ tryIndex }: OnFailureProps) => {
      const isLastTry = tryIndex === maxRetryTimes;

      this.logger.warn({
        name: `Try n??${tryIndex}/${maxRetryTimes} failed, ${
          !isLastTry
            ? `next retry in ${waitSeconds} seconds`
            : 'endpoint might be unreachable'
        }`,
        details: logDetails,
      });
    };

    const logDetails = { channelName: endpointName };

    //////////

    try {
      await AsyncUtils.retry(
        handleChecking,
        onFailure,
        maxRetryTimes,
        waitSeconds,
      );
    } catch (e) {}
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
    const { expectedStatusCode } = this.config.findEndpointByName(endpointName);

    try {
      status = await this.ping(endpointName);

      isAlive = status === expectedStatusCode;
    } catch (e) {
      isAlive = false;
      status = 'Error fetching';
      error = e;
    }

    if (!isAlive) {
      const log: LogMessage = {
        name: 'Endpoint not alive',
        details: { status, expected: expectedStatusCode },
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
