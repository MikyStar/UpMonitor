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
  errorsChannelID: 'Global errors channel ID',
  logChannelID: 'Global logs channel ID',

  endpointsConfigs: [
    {
      name: 'Endpoint name',
      url: 'http://url.com',
      channelID: 'Channel ID',
      cronJobSchedule: '15 14 1 * *', // At 14:15 on day-of-month 1
    },
  ],
};
