import { IRequestServiceCreateShortLink, IResponseServiceCreateShortLink } from './IServiceCreateShortLink';

export interface RepositoryMain {
  createLink(params: IRequestServiceCreateShortLink): Promise<IResponseServiceCreateShortLink>;
}
