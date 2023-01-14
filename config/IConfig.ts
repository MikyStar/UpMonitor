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

  onSuccess?: VoidFunction;
  onError?: (statusCode: number, content?: string) => void;
};

export type Retry = {
  number: number;
  wait: string;
};
