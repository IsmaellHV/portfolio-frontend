import { IRequestServiceChangePassword, IResponseServiceChangePassword } from './IServiceChangePassword';
import { IResponseServiceMe } from './IServiceMe';
import { IRequestServiceRefresh, IResponseServiceRefresh } from './IServiceRefresh';
import { IRequestServiceSignIn, IResponseServiceSignIn } from './IServiceSignIn';
import { IRequestServiceSignUp, IResponseServiceSignUp } from './IServiceSignUp';

export interface RepositoryMain {
  signUp(params: IRequestServiceSignUp): Promise<IResponseServiceSignUp>;
  signIn(params: IRequestServiceSignIn): Promise<IResponseServiceSignIn>;
  me(accessToken: string): Promise<IResponseServiceMe>;
  refresh(params: IRequestServiceRefresh): Promise<IResponseServiceRefresh>;
  signOut(accessToken: string): Promise<void>;
  changePassword(accessToken: string, params: IRequestServiceChangePassword): Promise<IResponseServiceChangePassword>;
}
