import { IConfig } from './IConfig';

////////////////////////////////////////

/**
 * You should make your own file named 'config.ts' based on this one,
 * under the 'config' directory just like this one
 */
export const exampleConfig: IConfig = {
  errorsChannelID: 'Error channel ID',
  discordToken: 'Token',

  endpointsConfigs: [
    {
      name: 'Endpoint name',
      url: 'http://url.com',
      channelID: 'Channel ID',
      cronJob: '15 14 1 * *', // At 14:15 on day-of-month 1
    },
  ],
};
