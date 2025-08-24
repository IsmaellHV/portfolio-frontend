import { toast } from 'sonner';
import { useCallback } from 'react';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

export class ErrorHandler {
  private static instance: ErrorHandler;

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Maneja errores de API de forma centralizada
   */
  public handleApiError(error: unknown, context?: string): ApiError {
    const apiError = this.parseError(error);
    this.logError(apiError, context);
    this.showUserNotification(apiError);
    return apiError;
  }

  /**
   * Parsea diferentes tipos de errores a un formato estándar
   */
  private parseError(error: unknown): ApiError {
    // Error de fetch/axios
    if (error instanceof Response) {
      return {
        message: `Error ${error.status}: ${error.statusText}`,
        status: error.status,
        code: 'HTTP_ERROR',
      };
    }

    // Error de red
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        message: 'Error de conexión. Verifica tu conexión a internet.',
        code: 'NETWORK_ERROR',
      };
    }

    // Error con estructura personalizada
    if (typeof error === 'object' && error !== null) {
      const errorObj = error as Record<string, unknown>;
      return {
        message: (errorObj.message as string) || 'Error desconocido',
        status: errorObj.status as number,
        code: (errorObj.code as string) || 'UNKNOWN_ERROR',
        details: errorObj,
      };
    }

    // Error genérico
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'GENERIC_ERROR',
        details: error,
      };
    }

    // Fallback para errores desconocidos
    return {
      message: 'Ha ocurrido un error inesperado',
      code: 'UNKNOWN_ERROR',
      details: error,
    };
  }

  /**
   * Registra el error para debugging/monitoring
   */
  private logError(error: ApiError, context?: string): void {
    console.error('API Error:', {
      message: error.message,
      status: error.status,
      code: error.code,
      context,
      timestamp: new Date().toISOString(),
      details: error.details,
    });

    // Aquí se puede integrar con servicios de monitoring como Sentry
    // Sentry.captureException(error);
  }

  /**
   * Muestra notificación al usuario según el tipo de error
   */
  private showUserNotification(error: ApiError): void {
    const shouldShowToast = this.shouldShowNotification(error);
    
    if (!shouldShowToast) return;

    const message = this.getUserFriendlyMessage(error);
    
    if (error.status && error.status >= 500) {
      toast.error(message, {
        description: 'Error del servidor. Intenta nuevamente más tarde.',
        duration: 5000,
      });
    } else if (error.status === 401) {
      toast.error('Sesión expirada', {
        description: 'Por favor, inicia sesión nuevamente.',
        duration: 4000,
      });
    } else if (error.status === 403) {
      toast.error('Acceso denegado', {
        description: 'No tienes permisos para realizar esta acción.',
        duration: 4000,
      });
    } else if (error.status === 404) {
      toast.error('Recurso no encontrado', {
        description: 'El recurso solicitado no existe.',
        duration: 3000,
      });
    } else {
      toast.error(message, {
        duration: 3000,
      });
    }
  }

  /**
   * Determina si se debe mostrar una notificación al usuario
   */
  private shouldShowNotification(error: ApiError): boolean {
    // No mostrar notificaciones para ciertos códigos de error
    const silentCodes = ['VALIDATION_ERROR', 'EXPECTED_ERROR'];
    return !silentCodes.includes(error.code || '');
  }

  /**
   * Convierte el mensaje técnico en uno amigable para el usuario
   */
  private getUserFriendlyMessage(error: ApiError): string {
    const friendlyMessages: Record<string, string> = {
      NETWORK_ERROR: 'Error de conexión',
      TIMEOUT_ERROR: 'La solicitud tardó demasiado',
      VALIDATION_ERROR: 'Datos inválidos',
      UNAUTHORIZED: 'Credenciales inválidas',
      FORBIDDEN: 'Acceso denegado',
      NOT_FOUND: 'Recurso no encontrado',
      SERVER_ERROR: 'Error del servidor',
    };

    return friendlyMessages[error.code || ''] || error.message;
  }

  /**
   * Wrapper para manejar errores en funciones async
   */
  public async handleAsyncOperation<T>(
    operation: () => Promise<T>,
    customErrorMessage?: string
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      this.handleApiError(error);
      if (customErrorMessage) {
        toast.error(customErrorMessage);
      }
      return null;
    }
  }
}

// Instancia singleton para uso global
export const errorHandler = ErrorHandler.getInstance();

/**
 * Hook personalizado para manejo de errores en componentes
 */
export const useErrorHandler = () => {
  const handleError = useCallback((error: unknown, context?: string) => {
    errorHandler.handleApiError(error, context);
    // El error ya fue manejado por el ErrorHandler
    // Este hook puede extenderse para lógica específica del componente
  }, []);

  return { handleError };
};