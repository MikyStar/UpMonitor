export type IConfig = {
  discordToken: string;
  logsChannelID: string;
  errorsChannelID: string;

  endpointsConfigs: EndpointConfig[];
};

export type EndpointConfig = {
  name: string;
  url: string;
  expectedStatusCode: number;
  channelID: string;
  cronJobSchedule: string;

  retry?: Retry;
};

export type Retry = {
  times: number;
  waitSeconds: number;
};

export const DEFAULT_RETRY: Retry = {
  times: 2,
  waitSeconds: 30,
};
