import { Buffer } from 'buffer';
import { Dispatch } from 'redux';
import { AdapterIndexedDB } from '../../../shared/Infraestructure/AdapterIndexedDB';
import { RepositoryImplGeneric } from '../../../shared/Infraestructure/RepositoryImplGeneric';
import { EntityUser } from '../Domain/EntityUser';
import { IRequestServiceChangePassword, IResponseServiceChangePassword } from '../Domain/IServiceChangePassword';
import { IResponseServiceMe } from '../Domain/IServiceMe';
import { IRequestServiceRefresh, IResponseServiceRefresh } from '../Domain/IServiceRefresh';
import { IRequestServiceSignIn, IResponseServiceSignIn } from '../Domain/IServiceSignIn';
import { IRequestServiceSignUp, IResponseServiceSignUp } from '../Domain/IServiceSignUp';
import { RepositoryMain } from '../Domain/RepositoryMain';
import { AdapterConfigure } from './AdapterConfigure';

export class RepositoryImplMain extends RepositoryImplGeneric<EntityUser> implements RepositoryMain {
  constructor(dbLocal: AdapterIndexedDB, dispatch: Dispatch) {
    super(dbLocal, dispatch);
  }

  private basic(): Record<string, string> {
    return { Authorization: `Basic ${Buffer.from(AdapterConfigure.AUTHBASIC).toString('base64')}` };
  }

  private bearer(token: string): Record<string, string> {
    return { Authorization: `Bearer ${token}` };
  }

  public async signUp(params: IRequestServiceSignUp): Promise<IResponseServiceSignUp> {
    const url = `${AdapterConfigure.URL}/${AdapterConfigure.SCHEMA}/${AdapterConfigure.ENTITY}/signUp`;
    const response = await this.service.bgCall<IResponseServiceSignUp>('POST', url, JSON.stringify(params), 'basic', 'json', 'json', this.basic(), 0);
    return response as IResponseServiceSignUp;
  }

  public async signIn(params: IRequestServiceSignIn): Promise<IResponseServiceSignIn> {
    const url = `${AdapterConfigure.URL}/${AdapterConfigure.SCHEMA}/${AdapterConfigure.ENTITY}/signIn`;
    const response = await this.service.bgCall<IResponseServiceSignIn>('POST', url, JSON.stringify(params), 'basic', 'json', 'json', this.basic(), 0);
    return response as IResponseServiceSignIn;
  }

  public async me(accessToken: string): Promise<IResponseServiceMe> {
    const url = `${AdapterConfigure.URL}/${AdapterConfigure.SCHEMA}/${AdapterConfigure.ENTITY}/me`;
    const response = await this.service.bgCall<IResponseServiceMe>('GET', url, '', 'bearer', 'json', 'json', this.bearer(accessToken), 0);
    return response as IResponseServiceMe;
  }

  public async refresh(params: IRequestServiceRefresh): Promise<IResponseServiceRefresh> {
    const url = `${AdapterConfigure.URL}/${AdapterConfigure.SCHEMA}/${AdapterConfigure.ENTITY}/refresh`;
    const response = await this.service.bgCall<IResponseServiceRefresh>('POST', url, JSON.stringify(params), 'basic', 'json', 'json', this.basic(), 0);
    return response as IResponseServiceRefresh;
  }

  public async signOut(accessToken: string): Promise<void> {
    const url = `${AdapterConfigure.URL}/${AdapterConfigure.SCHEMA}/${AdapterConfigure.ENTITY}/signOut`;
    await this.service.bgCall('POST', url, '', 'bearer', 'json', 'json', this.bearer(accessToken), 0);
  }

  public async changePassword(accessToken: string, params: IRequestServiceChangePassword): Promise<IResponseServiceChangePassword> {
    const url = `${AdapterConfigure.URL}/${AdapterConfigure.SCHEMA}/${AdapterConfigure.ENTITY}/changePassword`;
    const response = await this.service.bgCall<IResponseServiceChangePassword>('POST', url, JSON.stringify(params), 'bearer', 'json', 'json', this.bearer(accessToken), 0);
    return response as IResponseServiceChangePassword;
  }
}
