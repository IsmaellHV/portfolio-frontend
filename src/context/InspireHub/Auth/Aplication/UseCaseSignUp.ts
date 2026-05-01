import { IRequestServiceSignUp, IResponseServiceSignUp } from '../Domain/IServiceSignUp';
import { RepositoryMain } from '../Domain/RepositoryMain';

export class UseCaseSignUp {
  private repository: RepositoryMain;
  constructor(repository: RepositoryMain) {
    this.repository = repository;
  }
  public async exec(params: IRequestServiceSignUp): Promise<IResponseServiceSignUp> {
    return await this.repository.signUp(params);
  }
}
