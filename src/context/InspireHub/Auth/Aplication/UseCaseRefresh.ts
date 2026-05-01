import { IRequestServiceRefresh, IResponseServiceRefresh } from '../Domain/IServiceRefresh';
import { RepositoryMain } from '../Domain/RepositoryMain';

export class UseCaseRefresh {
  private repository: RepositoryMain;
  constructor(repository: RepositoryMain) {
    this.repository = repository;
  }
  public async exec(params: IRequestServiceRefresh): Promise<IResponseServiceRefresh> {
    return await this.repository.refresh(params);
  }
}
