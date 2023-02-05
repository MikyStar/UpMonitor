import { SystemUtils } from './system.utils';

////////////////////////////////////////

export type OnFailureProps = {
  tryIndex: number;
  error: any;
};

////////////////////////////////////////

export class AsyncUtils {
  static retry = async <T>(
    callback: () => Promise<T>,
    onFailure: (props: OnFailureProps) => void,
    maxRetries: number,
    waitBeforeRetry: number,
  ): Promise<T> => {
    return new Promise(async (resolve, reject) => {
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
    });
  };
}
