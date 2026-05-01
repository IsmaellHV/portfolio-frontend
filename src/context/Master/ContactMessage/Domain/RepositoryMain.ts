import { IRequestServiceCreateMessage, IResponseServiceCreateMessage } from './IServiceCreateMessage';

export interface RepositoryMain {
  createMessage(params: IRequestServiceCreateMessage): Promise<IResponseServiceCreateMessage>;
}
