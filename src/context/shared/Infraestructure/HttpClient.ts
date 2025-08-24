import { errorHandler } from './ErrorHandler';

export interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(config: HttpClientConfig = {}) {
    this.baseURL = config.baseURL || '';
    this.timeout = config.timeout || 10000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  /**
   * Realiza una petición HTTP con manejo automático de errores
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const url = this.buildURL(endpoint);
    const requestConfig = this.buildRequestConfig(config);

    try {
      const response = await this.fetchWithTimeout(url, requestConfig);
      
      if (!response.ok) {
        throw await this.createErrorFromResponse(response);
      }

      return await this.parseResponse<T>(response);
    } catch (error) {
      // El ErrorHandler se encarga del manejo centralizado
      throw errorHandler.handleApiError(error);
    }
  }

  /**
   * Construye la URL completa
   */
  private buildURL(endpoint: string): string {
    if (endpoint.startsWith('http')) {
      return endpoint;
    }
    return `${this.baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  }

  /**
   * Construye la configuración de la petición
   */
  private buildRequestConfig(config: RequestConfig): RequestInit {
    return {
      ...config,
      headers: {
        ...this.defaultHeaders,
        ...config.headers,
      },
    };
  }

  /**
   * Fetch con timeout personalizado
   */
  private async fetchWithTimeout(
    url: string,
    config: RequestInit & { timeout?: number }
  ): Promise<Response> {
    const timeout = config.timeout || this.timeout;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw error;
    }
  }

  /**
   * Crea un error estructurado desde la respuesta HTTP
   */
  private async createErrorFromResponse(response: Response): Promise<Error> {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorDetails: unknown;

    try {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        errorDetails = await response.json();
        errorMessage = (errorDetails as any)?.message || errorMessage;
      } else {
        errorDetails = await response.text();
      }
    } catch {
      // Si no se puede parsear el error, usar el mensaje por defecto
    }

    const error = new Error(errorMessage) as Error & {
      status: number;
      code: string;
      details: unknown;
    };
    
    error.status = response.status;
    error.code = `HTTP_${response.status}`;
    error.details = errorDetails;

    return error;
  }

  /**
   * Parsea la respuesta según el tipo de contenido
   */
  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      return await response.json();
    }
    
    if (contentType?.includes('text/')) {
      return (await response.text()) as unknown as T;
    }
    
    return (await response.blob()) as unknown as T;
  }

  /**
   * Métodos HTTP públicos
   */
  public async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  public async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * Configura headers globales (útil para tokens de autenticación)
   */
  public setHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  public removeHeader(key: string): void {
    delete this.defaultHeaders[key];
  }
}

// Instancia por defecto para uso global
export const httpClient = new HttpClient();