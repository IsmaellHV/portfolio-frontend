import { ENVIRONMENT } from '../../../env';
import { AdapterEncrypt } from './AdapterEncrypt';
import { AdapterGeneric } from './AdapterGeneric';

export class AdapterStorage {
  public static set(key: string, item: string | object | boolean, localMode: boolean = true): void {
    if (typeof key !== 'string') return;

    let value: string;

    value = typeof item === 'object' ? JSON.stringify(item) : item.toString();

    if (ENVIRONMENT.KEY_ENCRYPT.REQUIRE === '1') {
      value = AdapterEncrypt.encrypt(value, ENVIRONMENT.KEY_ENCRYPT.KEY);
    }

    const storage = localMode ? window.localStorage : window.sessionStorage;
    const storageKey = `${key}_${ENVIRONMENT.APP.SYSTEM}_${ENVIRONMENT.APP.VERSION_MAJOR}`;
    storage.setItem(storageKey, value);
  }

  public static get(item: string[] | string, localMode: boolean = true): any {
    const result: any = {};
    const storage = localMode ? window.localStorage : window.sessionStorage;

    if (Array.isArray(item)) {
      for (const key of item) {
        let val = storage.getItem(`${key}_${ENVIRONMENT.APP.SYSTEM}_${ENVIRONMENT.APP.VERSION_MAJOR}`);

        if (ENVIRONMENT.KEY_ENCRYPT.REQUIRE === '1' && val !== null) {
          val = AdapterEncrypt.decrypt(val, ENVIRONMENT.KEY_ENCRYPT.KEY || '');
        }

        result[key] = val !== null && AdapterGeneric.isJSON(val) ? JSON.parse(val) : val;
      }
    } else {
      let val = storage.getItem(`${item}_${ENVIRONMENT.APP.SYSTEM}_${ENVIRONMENT.APP.VERSION_MAJOR}`);

      if (ENVIRONMENT.KEY_ENCRYPT.REQUIRE === '1' && val !== null) {
        val = AdapterEncrypt.decrypt(val, ENVIRONMENT.KEY_ENCRYPT.KEY || '');
      }

      result[item] = val !== null && AdapterGeneric.isJSON(val) ? JSON.parse(val) : val;
    }

    return result;
  }

  public static remove(item: string[] | string, localMode: boolean = true): void {
    const storage = localMode ? window.localStorage : window.sessionStorage;

    if (Array.isArray(item)) {
      for (const key of item) {
        if (typeof key === 'string') {
          storage.removeItem(`${key}_${ENVIRONMENT.APP.SYSTEM}_${ENVIRONMENT.APP.VERSION_MAJOR}`);
        }
      }
    } else if (typeof item === 'string') {
      storage.removeItem(`${item}_${ENVIRONMENT.APP.SYSTEM}_${ENVIRONMENT.APP.VERSION_MAJOR}`);
    }
  }

  public static clear(localMode: boolean = false): void {
    const storage = localMode ? window.localStorage : window.sessionStorage;
    storage.clear();
  }
}
