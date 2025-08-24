import { createClient, PostgrestError, User } from '@supabase/supabase-js';
import { ENVIRONMENT } from '../../../env';

// Clase para manejo de errores personalizada
export class SupabaseError extends Error {
  constructor(message: string, public originalError?: PostgrestError) {
    super(message);
    this.name = 'SupabaseError';
  }
}

export class AdapterSupabase {
  static client = createClient(ENVIRONMENT.SUPABASE.URL, ENVIRONMENT.SUPABASE.ANON_KEY);

  // Método privado para manejo de errores
  private static handleError(error: PostgrestError | null, operation: string): void {
    if (error) {
      console.error(`Error en ${operation}:`, error);
      throw new SupabaseError(`Error en ${operation}: ${error.message}`, error);
    }
  }

  // === MÉTODOS DE AUTENTICACIÓN ===
  static async createUser(email: string, password: string) {
    const { data, error } = await this.client.auth.signUp({ email, password });
    if (error) throw new SupabaseError(`Error creando usuario: ${error.message}`);
    return data;
  }

  // === MÉTODOS CRUD GENÉRICOS ===
  static async fetchData(table: string, columns = '*') {
    const { data, error } = await this.client.from(table).select(columns);
    this.handleError(error, `obtener datos de ${table}`);
    return data;
  }

  static async fetchDataById(table: string, id: string, columns = '*') {
    const { data, error } = await this.client
      .from(table)
      .select(columns)
      .eq('id', id)
      .single();
    this.handleError(error, `obtener registro por ID de ${table}`);
    return data;
  }

  static async insertData(table: string, payload: Record<string, any>) {
    const { data, error } = await this.client
      .from(table)
      .insert([payload])
      .select();
    this.handleError(error, `insertar datos en ${table}`);
    return data;
  }

  static async updateData(table: string, id: string, payload: Record<string, any>) {
    const { data, error } = await this.client
      .from(table)
      .update(payload)
      .eq('id', id)
      .select();
    this.handleError(error, `actualizar datos en ${table}`);
    return data;
  }

  static async deleteData(table: string, id: string) {
    const { data, error } = await this.client
      .from(table)
      .delete()
      .eq('id', id)
      .select();
    this.handleError(error, `eliminar datos de ${table}`);
    return data;
  }

  static async signInWithPassword(email: string, password: string) {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) throw new SupabaseError(`Error iniciando sesión: ${error.message}`);
    return data;
  }

  static async getUser(): Promise<{ user: User | null; error: any }> {
    const { data, error } = await this.client.auth.getSession();
    return { user: data.session?.user || null, error };
  }

  static async signOut() {
    const { error } = await this.client.auth.signOut();
    if (error) throw new SupabaseError(`Error cerrando sesión: ${error.message}`);
  }

  static async signInWithProvider(provider: 'google' | 'github', redirectTo?: string) {
    const { data, error } = await this.client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectTo || window.location.origin,
      },
    });
    if (error) throw new SupabaseError(`Error con autenticación ${provider}: ${error.message}`);
    return data;
  }



  // Función para verificar la conexión
  static async testConnection() {
    try {
      // Verificamos la conexión obteniendo la sesión actual
      const { error: authError } = await this.client.auth.getSession();
      if (authError) {
        console.error('Error de autenticación:', authError);
        return { connected: false, message: 'Error de autenticación', error: authError };
      }
      
      // Intentamos una consulta simple a una tabla que sabemos que existe
      const { error } = await this.client
        .from('contact_messages')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('Error de conexión a la base de datos:', error);
        return { connected: false, message: 'Error de conexión a la base de datos', error };
      }
      
      return { connected: true, message: 'Conexión exitosa a Supabase' };
    } catch (error) {
      console.error('Error de conexión a Supabase:', error);
      return { connected: false, message: 'Error de conexión', error };
    }
  }
}
