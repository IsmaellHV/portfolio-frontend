import { IError } from '../Domain/IError';

export type TypeResponseService = 'json' | 'text' | 'blob';

onmessage = async (evt) => {
  try {
    const { data } = evt;
    const { url, typeResponse, options, tries } = data;

    const headers = new Headers();

    for (const key of Object.keys(options.headers)) {
      headers.set(key, options.headers[key]);
    }
    options.headers = headers;

    const response = await __exec(url, typeResponse, options, tries);

    if (typeof response === 'object') {
      if (!Array.isArray(response)) {
        if (Reflect.has(response, 'logout') || Reflect.has(response, 'refresh') || Reflect.has(response, 'errorDescription')) {
          postMessage(response);
          return;
        }
      }
    }

    postMessage({ response });
    // if (refresh) { postMessage({ refresh: true }); }
    // else { postMessage({ response }); }
  } catch (error: any) {
    postMessage({ error: error.message });
  }
};

async function __exec(url: string, typeResponse: TypeResponseService, options: RequestInit, tries: number): Promise<any> {
  try {
    let result = null;
    const res: Response = await fetch(url, options);
    if (!res.ok) {
      try {
        result = await res.json();
      } catch (error) {
        console.info('error: ', error);
        throw new Error(res.statusText);
      }
      if (Reflect.has(result, 'error')) {
        switch (res.status) {
          case 400:
          case 500:
            tries = 0;
            throw new IError(result.Error.error, result.errorCode || 0);
          case 401:
            return { errorDescription: result.Error.error };
          case 412:
            return { refresh: true };
          case 403:
            return { logout: true };
          default:
            break;
        }
        throw new Error(result.errorDescription);
      } else {
        throw new Error('Servicio Web de Acceso Inaccesible');
      }
    }
    result = await res[typeResponse]();
    return result;
  } catch (error) {
    console.error('error: ', error);

    if (tries > 0) {
      tries--;
      return await __exec(url, typeResponse, options, tries);
    }
    if (error instanceof TypeError) {
      throw new Error('Existe inconveniente para comunicarse con el servicio, verificar su conexión a internet y volver a intentar la acción deseada');
    } else {
      throw error;
    }
  }
}
