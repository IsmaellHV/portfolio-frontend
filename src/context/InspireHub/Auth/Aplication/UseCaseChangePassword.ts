import { IRequestServiceChangePassword, IResponseServiceChangePassword } from '../Domain/IServiceChangePassword';
import { RepositoryMain } from '../Domain/RepositoryMain';

export class UseCaseChangePassword {
  constructor(private repository: RepositoryMain) {}

  public async exec(accessToken: string, params: IRequestServiceChangePassword): Promise<IResponseServiceChangePassword> {
    return await this.repository.changePassword(accessToken, params);
  }
}
