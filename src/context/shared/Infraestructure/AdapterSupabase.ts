import { createClient, User } from '@supabase/supabase-js';
import { ENVIRONMENT } from '../../../env';

// Configuración de Supabase
const SUPABASE_URL = ENVIRONMENT.SUPABASE.URL || '';
const SUPABASE_ANON_KEY = ENVIRONMENT.SUPABASE.ANON_KEY || '';

export class AdapterSupabase {
  static client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  static async createUser(email: string, password: string) {
    const { data, error } = await this.client.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
    return data;
  }

  static async fetchData(table: string) {
    const { data, error } = await this.client.from(table).select();
    if (error) throw new Error(error.message);
    return data;
  }

  static async insertData(table: string, payload: Record<string, any>) {
    const { data, error } = await this.client.from(table).insert([payload]);
    if (error) throw new Error(error.message);
    return data;
  }

  static async signInWithPassword(email: string, password: string) {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return data;
  }

  static async getUser(): Promise<User | null> {
    return (await this.client.auth.getUser()).data.user;
  }

  static async signOut() {
    const { error } = await this.client.auth.signOut();
    if (error) throw new Error(error.message);
  }

  static async signInWithProvider(provider: 'google' | 'github', redirectTo: string) {
    console.log({ provider, redirectTo });
    await this.client.auth.signInWithOAuth({
      provider,
      // options: {
      //   redirectTo: null,
      // },
    });
    // return data;
    return (await this.client.auth.getUser()).data.user;
  }
}
