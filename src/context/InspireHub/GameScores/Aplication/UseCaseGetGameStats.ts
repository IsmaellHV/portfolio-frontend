import { IRequestServiceGetGameStats, IResponseServiceGetGameStats } from '../Domain/IServiceGetGameStats';
import { RepositoryMain } from '../Domain/RepositoryMain';

export class UseCaseGetGameStats {
  private repository: RepositoryMain;
  constructor(repository: RepositoryMain) {
    this.repository = repository;
  }
  public async exec(params: IRequestServiceGetGameStats): Promise<IResponseServiceGetGameStats> {
    return await this.repository.getGameStats(params);
  }
}
