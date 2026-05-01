import { Dispatch } from 'redux';
import { ENVIRONMENT } from '../../../env';
import { AdapterIndexedDB } from './AdapterIndexedDB';
import { AdapterStorage } from './AdapterStorage';
import { EntityUser } from '../../InspireHub/Auth/Domain/EntityUser';
import { UseCaseMe } from '../../InspireHub/Auth/Aplication/UseCaseMe';
import { UseCaseRefresh } from '../../InspireHub/Auth/Aplication/UseCaseRefresh';
import { UseCaseSignIn } from '../../InspireHub/Auth/Aplication/UseCaseSignIn';
import { UseCaseSignOut } from '../../InspireHub/Auth/Aplication/UseCaseSignOut';
import { UseCaseSignUp } from '../../InspireHub/Auth/Aplication/UseCaseSignUp';
import { IRequestServiceSignIn } from '../../InspireHub/Auth/Domain/IServiceSignIn';
import { IRequestServiceSignUp } from '../../InspireHub/Auth/Domain/IServiceSignUp';
import { AdapterConfigure as AuthAdapterConfigure } from '../../InspireHub/Auth/Infraestructure/AdapterConfigure';
import { RepositoryImplMain } from '../../InspireHub/Auth/Infraestructure/RepositoryImplMain';

const KEY_ACCESS = 'auth_access';
const KEY_REFRESH = 'auth_refresh';
const KEY_USER = 'auth_user';

export class AdapterAuth {
  public static persistSession(accessToken: string, refreshToken: string, user: EntityUser): void {
    AdapterStorage.set(KEY_ACCESS, accessToken);
    AdapterStorage.set(KEY_REFRESH, refreshToken);
    AdapterStorage.set(KEY_USER, user);
  }

  public static clearSession(): void {
    AdapterStorage.remove([KEY_ACCESS, KEY_REFRESH, KEY_USER]);
  }

  public static getAccessToken(): string | null {
    const { [KEY_ACCESS]: token } = AdapterStorage.get([KEY_ACCESS]);
    return typeof token === 'string' ? token : null;
  }

  public static getRefreshToken(): string | null {
    const { [KEY_REFRESH]: token } = AdapterStorage.get([KEY_REFRESH]);
    return typeof token === 'string' ? token : null;
  }

  public static getCachedUser(): EntityUser | null {
    const { [KEY_USER]: user } = AdapterStorage.get([KEY_USER]);
    return user && typeof user === 'object' ? (user as EntityUser) : null;
  }

  public static buildRepository(dbLocal: AdapterIndexedDB, dispatch: Dispatch): RepositoryImplMain {
    return new RepositoryImplMain(dbLocal, dispatch);
  }

  public static async signIn(repo: RepositoryImplMain, params: IRequestServiceSignIn): Promise<EntityUser> {
    const result = await new UseCaseSignIn(repo).exec(params);
    AdapterAuth.persistSession(result.accessToken, result.refreshToken, result.user);
    return result.user;
  }

  public static async signUp(repo: RepositoryImplMain, params: IRequestServiceSignUp): Promise<EntityUser> {
    const result = await new UseCaseSignUp(repo).exec(params);
    AdapterAuth.persistSession(result.accessToken, result.refreshToken, result.user);
    return result.user;
  }

  public static async me(repo: RepositoryImplMain): Promise<EntityUser | null> {
    const token = AdapterAuth.getAccessToken();
    if (!token) return null;
    try {
      const user = await new UseCaseMe(repo).exec(token);
      AdapterStorage.set(KEY_USER, user);
      return user;
    } catch {
      const refreshed = await AdapterAuth.tryRefresh(repo);
      if (!refreshed) {
        AdapterAuth.clearSession();
        return null;
      }
      const user = await new UseCaseMe(repo).exec(refreshed);
      AdapterStorage.set(KEY_USER, user);
      return user;
    }
  }

  public static async signOut(repo: RepositoryImplMain): Promise<void> {
    const token = AdapterAuth.getAccessToken();
    if (token) {
      try {
        await new UseCaseSignOut(repo).exec(token);
      } catch {
        // ignore network errors on signOut
      }
    }
    AdapterAuth.clearSession();
  }

  public static oauthStartUrl(provider: 'google' | 'github'): string {
    const base = `${AuthAdapterConfigure.URL}/${AuthAdapterConfigure.SCHEMA}/${AuthAdapterConfigure.ENTITY}/oauth/${provider}/start`;
    const redirect = `${window.location.origin}${ENVIRONMENT.ROUTE.INSPIREHUBHOME}`;
    return `${base}?redirect=${encodeURIComponent(redirect)}`;
  }

  public static consumeOAuthHash(): { user: EntityUser; accessToken: string; refreshToken: string } | { error: string } | null {
    if (typeof window === 'undefined' || !window.location.hash) return null;
    const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
    const params = new URLSearchParams(hash);

    const error = params.get('oauthError');
    if (error) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      return { error };
    }

    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    const userBase64 = params.get('user');
    if (!accessToken || !refreshToken || !userBase64) return null;

    try {
      const userJson = atob(decodeURIComponent(userBase64));
      const user = JSON.parse(userJson) as EntityUser;
      AdapterAuth.persistSession(accessToken, refreshToken, user);
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      return { user, accessToken, refreshToken };
    } catch {
      return null;
    }
  }

  private static async tryRefresh(repo: RepositoryImplMain): Promise<string | null> {
    const refreshToken = AdapterAuth.getRefreshToken();
    if (!refreshToken) return null;
    try {
      const result = await new UseCaseRefresh(repo).exec({ refreshToken });
      AdapterStorage.set(KEY_ACCESS, result.accessToken);
      AdapterStorage.set(KEY_REFRESH, result.refreshToken);
      return result.accessToken;
    } catch {
      return null;
    }
  }
}
