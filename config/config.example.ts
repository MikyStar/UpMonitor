import { IConfig } from './IConfig';

////////////////////////////////////////

/**
 * You should make your own file named 'config.ts' based on this one
 * under this 'config' directory
 *
 * Check out the interface 'IConfig' for infos about optional types
 */
export const exampleConfig: IConfig = {
  discordToken: 'Token',
  errorsChannelID: 'Global Discord errors channel ID',
  logsChannelID: 'Global Discord logs channel ID',

  endpointsConfigs: [
    {
      name: 'Endpoint name',
      url: 'http://url.com',
      expectedStatusCode: 200,
      channelID: 'Discord Channel ID',
      cronJobSchedule: '15 14 1 * *', // At 14:15 on day-of-month 1
    },
  ],
};
