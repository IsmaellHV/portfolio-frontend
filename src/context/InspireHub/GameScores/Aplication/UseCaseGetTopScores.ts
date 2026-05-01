import { IRequestServiceGetTopScores, IResponseServiceGetTopScores } from '../Domain/IServiceGetTopScores';
import { RepositoryMain } from '../Domain/RepositoryMain';

export class UseCaseGetTopScores {
  private repository: RepositoryMain;
  constructor(repository: RepositoryMain) {
    this.repository = repository;
  }
  public async exec(params: IRequestServiceGetTopScores): Promise<IResponseServiceGetTopScores[]> {
    return await this.repository.getTopScores(params);
  }
}
