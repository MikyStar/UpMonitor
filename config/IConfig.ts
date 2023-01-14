export type IConfig = {
  errorsChannelID: string;
  discordToken: string;

  endpointsConfigs: EndpointConfig[];
};

export type EndpointConfig = {
  name: string;
  url: string;
  channelID: string;
  cronJobSchedule: string;

  retry?: Retry;

  onSuccess?: VoidFunction;
  onError?: (statusCode: number, content?: string) => void;
};

export type Retry = {
  number: number;
  wait: string;
};
