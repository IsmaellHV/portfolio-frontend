import { Buffer } from 'buffer';
import { Dispatch } from 'redux';
import { AdapterIndexedDB } from '../../../shared/Infraestructure/AdapterIndexedDB';
import { RepositoryImplGeneric } from '../../../shared/Infraestructure/RepositoryImplGeneric';
import { EntityMain } from '../Domain/EntityMain';
import { IRequestServiceCreateMessage, IResponseServiceCreateMessage } from '../Domain/IServiceCreateMessage';
import { RepositoryMain } from '../Domain/RepositoryMain';
import { AdapterConfigure } from './AdapterConfigure';

export class RepositoryImplMain extends RepositoryImplGeneric<EntityMain> implements RepositoryMain {
  constructor(dbLocal: AdapterIndexedDB, dispatch: Dispatch) {
    super(dbLocal, dispatch);
  }

  public async createMessage(params: IRequestServiceCreateMessage): Promise<IResponseServiceCreateMessage> {
    const url = `${AdapterConfigure.URL}/${AdapterConfigure.SCHEMA}/${AdapterConfigure.ENTITY}/create`;
    const headers = { Authorization: `Basic ${Buffer.from(AdapterConfigure.AUTHBASIC).toString('base64')}` };
    const response = await this.service.bgCall<IResponseServiceCreateMessage>('POST', url, JSON.stringify(params), 'basic', 'json', 'json', headers, 0);
    return response as IResponseServiceCreateMessage;
  }
}
