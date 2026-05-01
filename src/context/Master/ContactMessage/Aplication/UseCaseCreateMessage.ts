import { IRequestServiceCreateMessage, IResponseServiceCreateMessage } from '../Domain/IServiceCreateMessage';
import { RepositoryMain } from '../Domain/RepositoryMain';

export class UseCaseCreateMessage {
  private repository: RepositoryMain;
  constructor(repository: RepositoryMain) {
    this.repository = repository;
  }
  public async exec(params: IRequestServiceCreateMessage): Promise<IResponseServiceCreateMessage> {
    return await this.repository.createMessage(params);
  }
}
