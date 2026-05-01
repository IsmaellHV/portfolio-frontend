import { RepositoryMain } from '../Domain/RepositoryMain';

export class UseCaseSignOut {
  private repository: RepositoryMain;
  constructor(repository: RepositoryMain) {
    this.repository = repository;
  }
  public async exec(accessToken: string): Promise<void> {
    await this.repository.signOut(accessToken);
  }
}
