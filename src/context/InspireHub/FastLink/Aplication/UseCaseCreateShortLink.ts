import { IRequestServiceCreateShortLink, IResponseServiceCreateShortLink } from '../Domain/IServiceCreateShortLink';
import { RepositoryMain } from '../Domain/RepositoryMain';

export class UseCaseCreateShortLink {
  private repository: RepositoryMain;

  constructor(repository: RepositoryMain) {
    this.repository = repository;
  }
  public async exec(params: IRequestServiceCreateShortLink): Promise<IResponseServiceCreateShortLink> {
    return await this._exec(params);
  }

  private async _exec(params: IRequestServiceCreateShortLink): Promise<IResponseServiceCreateShortLink> {
    const result: IResponseServiceCreateShortLink = await this.repository.createLink(params);
    return result;
  }
}
