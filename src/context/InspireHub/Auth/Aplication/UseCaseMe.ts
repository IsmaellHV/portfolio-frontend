import { IResponseServiceMe } from '../Domain/IServiceMe';
import { RepositoryMain } from '../Domain/RepositoryMain';

export class UseCaseMe {
  private repository: RepositoryMain;
  constructor(repository: RepositoryMain) {
    this.repository = repository;
  }
  public async exec(accessToken: string): Promise<IResponseServiceMe> {
    return await this.repository.me(accessToken);
  }
}
