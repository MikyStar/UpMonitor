import { IConfig } from '../../config/IConfig';
import { ERRORS_CHANNEL, LOGS_CHANNEL } from '../services/Discord';

////////////////////////////////////////

export class ConfigUtils {
  static check = (config: IConfig) => {
    const names: string[] = [LOGS_CHANNEL, ERRORS_CHANNEL];

    config.endpointsConfigs.forEach((endpoint) => {
      const { name } = endpoint;

      if (names.includes(name))
        throw new Error(`Duplicate endpoint name '${name}'`);
    });
  };
}
