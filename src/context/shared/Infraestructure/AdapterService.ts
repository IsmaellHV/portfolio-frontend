import { Dispatch } from 'redux';
import { IError } from '../Domain/IError';
// import { AdapterGeneric } from './AdapterGeneric';
import { AdapterStorage } from './AdapterStorage';

type TypeMethodService = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type TypeRequestService = 'json' | 'text' | 'form';
type TypeResponseService = 'json' | 'text' | 'blob';
type TypeAuthService = 'basic' | 'basicFiles' | 'bearer';

export class AdapterService {
  private dispatch: Dispatch;

  constructor(dispatch: Dispatch) {
    this.dispatch = dispatch;
  }

  public async call<T>(method: TypeMethodService = 'GET', url: string, body: string | FormData | undefined, auth: TypeAuthService, typeRequest: TypeRequestService = 'json', typeResponse: TypeResponseService = 'json', adicionalHeaders: object, tries: number = 2): Promise<Array<T> | T | null> {
    if (!window.navigator.onLine) throw Error('No posee conexión a internet');

    const headers = new Headers({});

    switch (typeRequest) {
      case 'json':
        headers.append('Content-Type', 'application/json');
        break;
      case 'text':
        headers.append('Content-Type', 'text/plain');
        break;
      default:
        break;
    }

    if (typeof adicionalHeaders === 'object') {
      if (!Array.isArray(adicionalHeaders)) {
        for (const row of Object.entries(adicionalHeaders)) {
          headers.set(row[0], row[1]);
        }
      }
    }

    const { token }: { token: string } = AdapterStorage.get('token');
    if (auth === 'bearer') headers.set('Authorization', `Bearer ${token}`);

    const options: RequestInit = { method, headers };
    if (method !== 'GET') {
      Object.assign(options, { body });
    }

    const data = await this.__exec(url, typeResponse, options, tries);
    return data;
  }

  public bgCall<T>(method: TypeMethodService = 'GET', url: string, body: string | FormData, auth: TypeAuthService = 'bearer', typeRequest: TypeRequestService = 'json', typeResponse: TypeResponseService = 'json', adicionalHeaders: object, tries: number = 2): Promise<Array<T> | T | null> {
    return new Promise((resolve, reject) => {
      if (!window.navigator.onLine) {
        reject(new Error('No posee conexión a internet'));
        return null;
      }

      const headers: any = {};

      // let headers = {
      //   Authorization: `Basic ${Buffer.from(ENVIRONMENT.API_ACCESO.AUTH_BASIC).toString('base64')}`,
      // };

      switch (typeRequest) {
        case 'json':
          Object.assign(headers, { 'Content-Type': 'application/json' });
          break;
        case 'text':
          Object.assign(headers, { 'Content-Type': 'text/plain' });
          break;
        default:
          break;
      }

      if (typeof adicionalHeaders === 'object') {
        if (!Array.isArray(adicionalHeaders)) {
          Object.assign(headers, { ...adicionalHeaders });
        }
      }

      const { token }: { token: string } = AdapterStorage.get('token');
      if (auth === 'bearer') headers['Authorization'] = `Bearer ${token}`;

      const options: RequestInit = { method, headers };
      if (method !== 'GET') {
        Object.assign(options, { body });
      }

      const workerBg: Worker = new Worker(new URL('./WorkerService.ts', import.meta.url), { type: 'module' });

      workerBg.onmessage = async (evt) => {
        workerBg.terminate();
        if (evt.data.error) {
          reject(new Error(evt.data.error));
        } else if (evt.data.logout) {
          resolve(null);
          if (evt.data.errorDescription) {
            alert(evt.data.errorDescription);
            // AdapterGeneric.createMessage('Alerta', evt.data.errorDescription, 'warning');
          }
        } else if (evt.data.refresh) {
          const data = await this.bgCall<T>(method, url, body, auth, typeRequest, typeResponse, adicionalHeaders, tries);
          resolve(data);
        } else if (evt.data.response) {
          resolve(evt.data.response);
        } else {
          resolve(null);
        }
      };
      workerBg.onerror = (evt) => {
        workerBg.terminate();
        reject(evt.error);
      };
      workerBg.onmessageerror = (evt) => {
        workerBg.terminate();
        reject(evt.data);
      };

      workerBg.postMessage(JSON.parse(JSON.stringify({ url, typeRequest, typeResponse, options, tries })));
    });
  }

  private async __exec(url: string, type: TypeResponseService, options: RequestInit, tries: number): Promise<any> {
    try {
      let result: any = null;
      const res: Response = await fetch(url, options);
      if (!res.ok) {
        try {
          result = await res.json();
        } catch (error) {
          console.error(error);
          throw new IError(res.statusText, 0);
        }
        if (Reflect.has(result, 'error')) {
          switch (res.status) {
            case 400:
            case 500:
              tries = 0;
              throw new IError(result.Error.error, result.errorCode || 0);
            case 401:
              tries = 0;
              throw new IError(result.errorDescription, result.errorCode || 0);
            case 412:
              // let state = await this.__refreshToken();
              // if (!state) return null;
              tries++;
              // tries = 0;
              throw new IError('Cambio de Token', result.errorCode || 0);
            case 403:
              tries = 0;
              return null;
            default:
              break;
          }
          throw new IError(result.errorDescription, result.errorCode || 0);
        } else if (Reflect.has(result, 'errorDescription')) {
          throw new IError(result.errorDescription, result.errorCode || 0);
        } else if (Reflect.has(result, 'message')) {
          throw new IError(result.message, result.errorCode || 0);
        } else {
          throw new IError('Servicio Web no accesible', result.errorCode || 0);
        }
      }
      result = await res[type]();
      return result;
    } catch (error) {
      if (tries > 0) {
        tries--;
        return await this.__exec(url, type, options, tries);
      }
      if (error instanceof TypeError) {
        throw new IError('Existe inconveniente para comunicarse con el servicio, verificar su conexión a internet y volver a intentar la acción deseada', 0);
      } else {
        throw error as IError;
      }
    }
  }
}
