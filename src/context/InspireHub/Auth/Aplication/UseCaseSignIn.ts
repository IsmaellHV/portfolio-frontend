import { IRequestServiceSignIn, IResponseServiceSignIn } from '../Domain/IServiceSignIn';
import { RepositoryMain } from '../Domain/RepositoryMain';

export class UseCaseSignIn {
  private repository: RepositoryMain;
  constructor(repository: RepositoryMain) {
    this.repository = repository;
  }
  public async exec(params: IRequestServiceSignIn): Promise<IResponseServiceSignIn> {
    return await this.repository.signIn(params);
  }
}
