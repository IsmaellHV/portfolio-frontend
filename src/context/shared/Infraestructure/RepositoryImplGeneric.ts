import { Dispatch } from 'redux';
import { RepositoryGeneric } from '../Domain/RepositoryGeneric';
import { AdapterIndexedDB } from './AdapterIndexedDB';
import { AdapterService } from './AdapterService';

export abstract class RepositoryImplGeneric<T> implements RepositoryGeneric<T> {
  protected dbLocal: AdapterIndexedDB;
  protected dispatch: Dispatch;
  protected service: AdapterService;

  constructor(dbLocal: AdapterIndexedDB, dispatch: Dispatch) {
    this.dbLocal = dbLocal;
    this.dispatch = dispatch;
    this.service = new AdapterService(dispatch);
  }
}
