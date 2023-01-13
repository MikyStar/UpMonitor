import Environment from '../core/Environment';

import { DateUtils, SystemUtils } from '.';

////////////////////////////////////////

interface OnFailureProps {
  tryIndex: number;
  error: any;
}

export class AsyncUtils {
  /**
   * @description Retries a Promise
   */
  static retry = async <T>(
    callback: () => Promise<T>,
    onFailure: (props: OnFailureProps) => void,
    maxRetries: number = Environment.MAX_RETRIES,
    waitBeforeRetry: number = DateUtils.computeTime(
      Environment.RETRY_WAIT,
      'seconds',
    ),
  ): Promise<T> => {
    return new Promise(
      async (
        resolve,
        reject, // TODO add a timeout feature to wait a bit before testing
      ) => {
        let lastError;

        for (let tryNb = 1; tryNb < maxRetries + 1; tryNb++) {
          try {
            const response = await callback();

            return resolve(response);
          } catch (error) {
            lastError = error;
            onFailure({ tryIndex: tryNb, error: lastError });

            if (tryNb < maxRetries) await SystemUtils.wait(waitBeforeRetry);
          }
        }

        reject(lastError);
      },
    );
  };
}
