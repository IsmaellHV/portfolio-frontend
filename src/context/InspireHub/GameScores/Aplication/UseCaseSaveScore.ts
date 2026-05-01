import { IRequestServiceSaveScore, IResponseServiceSaveScore } from '../Domain/IServiceSaveScore';
import { RepositoryMain } from '../Domain/RepositoryMain';

export class UseCaseSaveScore {
  private repository: RepositoryMain;
  constructor(repository: RepositoryMain) {
    this.repository = repository;
  }
  public async exec(params: IRequestServiceSaveScore): Promise<IResponseServiceSaveScore> {
    return await this.repository.saveScore(params);
  }
}
