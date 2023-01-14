export type IConfig = {
  errorsChannelID: string;
  discordToken: string;
  endpointsConfigs: EndpointConfig[];
};

export type EndpointConfig = {
  name: string;
  url: string;
  channelID: string;
  cronJob: string;
  retry?: Retry;
};

export type Retry = {
  number: number;
  wait: string;
};
