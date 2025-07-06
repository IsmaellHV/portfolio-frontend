import { Buffer } from 'buffer';
import { RepositoryImplGeneric } from '../../../shared/Infraestructure/RepositoryImplGeneric';
import { EntityMain } from '../Domain/EntityMain';
import { IRequestServiceCreateShortLink, IResponseServiceCreateShortLink } from '../Domain/IServiceCreateShortLink';
import { RepositoryMain } from '../Domain/RepositoryMain';
import { AdapterConfigure } from './AdapterConfigure';

export class RepositoryImplMain extends RepositoryImplGeneric<EntityMain> implements RepositoryMain {
  public async createLink(params: IRequestServiceCreateShortLink): Promise<IResponseServiceCreateShortLink> {
    const response: IResponseServiceCreateShortLink = await this.service.bgCall<any>('GET', `${AdapterConfigure.URL}/${AdapterConfigure.SCHEMA}/${AdapterConfigure.ENTITY}/createLink/${params.originalLink}/${params.captcha}`, '', 'basic', 'json', 'json', { Authorization: `Basic ${Buffer.from(AdapterConfigure.AUTHBASIC).toString('base64')}` }, 0);
    return response;
  }
}
