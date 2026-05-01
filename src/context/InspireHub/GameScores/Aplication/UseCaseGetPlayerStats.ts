import { IRequestServiceGetPlayerStats, IResponseServiceGetPlayerStats } from '../Domain/IServiceGetPlayerStats';
import { RepositoryMain } from '../Domain/RepositoryMain';

export class UseCaseGetPlayerStats {
  private repository: RepositoryMain;
  constructor(repository: RepositoryMain) {
    this.repository = repository;
  }
  public async exec(params: IRequestServiceGetPlayerStats): Promise<IResponseServiceGetPlayerStats[]> {
    return await this.repository.getPlayerStats(params);
  }
}
