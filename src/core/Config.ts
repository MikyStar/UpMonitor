import { System } from './System';

////////////////////////////////////////

export const DEFAULT_CONFIG_FILE_NAME = 'task.config.json';

export const DEFAULT_CONFIG_DATAS: ConfigFile = {
  shouldNotPrintAfter: false,
  hideCompleted: false,
  hideDescription: false,
  hideTree: false,
  clearBefore: false,
};

export interface ConfigFile {
  storageFile?: string;
  configFile?: string;

  /////

  shouldNotPrintAfter?: boolean;
  hideDescription?: boolean;
  hideTimestamp?: boolean;
  hideSubCounter?: boolean;
  hideTree?: boolean;
  hideCompleted?: boolean;
  clearBefore?: boolean;

  depth?: number;
}

////////////////////////////////////////

/**
 * Expose task.config.json is current working directory datas
 */
export class Config implements ConfigFile {
  relativePath: string;

  storageFile?: string;
  configFile?: string;

  /////

  shouldNotPrintAfter?: boolean;
  hideDescription?: boolean;
  hideTimestamp?: boolean;
  hideSubCounter?: boolean;
  hideTree?: boolean;
  hideCompleted?: boolean;
  clearBefore?: boolean;

  depth?: number;

  ////////////////////////////////////////

  constructor(relativePath: string) {
    this.relativePath = relativePath;
    const configDatas = System.readJSONFile(this.relativePath);

    Object.assign(this, configDatas);
  }
}
