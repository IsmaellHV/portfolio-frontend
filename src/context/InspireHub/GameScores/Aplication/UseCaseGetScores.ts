import { IRequestServiceGetScores, IResponseServiceGetScores } from '../Domain/IServiceGetScores';
import { RepositoryMain } from '../Domain/RepositoryMain';

export class UseCaseGetScores {
  private repository: RepositoryMain;
  constructor(repository: RepositoryMain) {
    this.repository = repository;
  }
  public async exec(params: IRequestServiceGetScores): Promise<IResponseServiceGetScores[]> {
    return await this.repository.getScores(params);
  }
}
