import { Buffer } from 'buffer';
import { Dispatch } from 'redux';
import { AdapterIndexedDB } from '../../../shared/Infraestructure/AdapterIndexedDB';
import { RepositoryImplGeneric } from '../../../shared/Infraestructure/RepositoryImplGeneric';
import { EntityMain } from '../Domain/EntityMain';
import { IRequestServiceGetGameStats, IResponseServiceGetGameStats } from '../Domain/IServiceGetGameStats';
import { IRequestServiceGetPlayerStats, IResponseServiceGetPlayerStats } from '../Domain/IServiceGetPlayerStats';
import { IRequestServiceGetScores, IResponseServiceGetScores } from '../Domain/IServiceGetScores';
import { IRequestServiceGetTopScores, IResponseServiceGetTopScores } from '../Domain/IServiceGetTopScores';
import { IRequestServiceSaveScore, IResponseServiceSaveScore } from '../Domain/IServiceSaveScore';
import { RepositoryMain } from '../Domain/RepositoryMain';
import { AdapterConfigure } from './AdapterConfigure';

export class RepositoryImplMain extends RepositoryImplGeneric<EntityMain> implements RepositoryMain {
  constructor(dbLocal: AdapterIndexedDB, dispatch: Dispatch) {
    super(dbLocal, dispatch);
  }

  private headers(): Record<string, string> {
    return { Authorization: `Basic ${Buffer.from(AdapterConfigure.AUTHBASIC).toString('base64')}` };
  }

  public async saveScore(params: IRequestServiceSaveScore): Promise<IResponseServiceSaveScore> {
    const url = `${AdapterConfigure.URL}/${AdapterConfigure.SCHEMA}/${AdapterConfigure.ENTITY}/saveScore`;
    const response = await this.service.bgCall<IResponseServiceSaveScore>('POST', url, JSON.stringify(params), 'basic', 'json', 'json', this.headers(), 0);
    return response as IResponseServiceSaveScore;
  }

  public async getScores(params: IRequestServiceGetScores): Promise<IResponseServiceGetScores[]> {
    const qs = new URLSearchParams();
    if (params.gameType) qs.set('gameType', params.gameType);
    if (params.limit) qs.set('limit', String(params.limit));
    const url = `${AdapterConfigure.URL}/${AdapterConfigure.SCHEMA}/${AdapterConfigure.ENTITY}/getScores${qs.toString() ? `?${qs}` : ''}`;
    const response = await this.service.bgCall<IResponseServiceGetScores>('GET', url, '', 'basic', 'json', 'json', this.headers(), 0);
    return Array.isArray(response) ? (response as IResponseServiceGetScores[]) : [];
  }

  public async getTopScores(params: IRequestServiceGetTopScores): Promise<IResponseServiceGetTopScores[]> {
    const qs = params.limit ? `?limit=${params.limit}` : '';
    const url = `${AdapterConfigure.URL}/${AdapterConfigure.SCHEMA}/${AdapterConfigure.ENTITY}/getTopScores/${encodeURIComponent(params.gameType)}${qs}`;
    const response = await this.service.bgCall<IResponseServiceGetTopScores>('GET', url, '', 'basic', 'json', 'json', this.headers(), 0);
    return Array.isArray(response) ? (response as IResponseServiceGetTopScores[]) : [];
  }

  public async getGameStats(params: IRequestServiceGetGameStats): Promise<IResponseServiceGetGameStats> {
    const url = `${AdapterConfigure.URL}/${AdapterConfigure.SCHEMA}/${AdapterConfigure.ENTITY}/getGameStats/${encodeURIComponent(params.gameType)}`;
    const response = await this.service.bgCall<IResponseServiceGetGameStats>('GET', url, '', 'basic', 'json', 'json', this.headers(), 0);
    return response as IResponseServiceGetGameStats;
  }

  public async getPlayerStats(params: IRequestServiceGetPlayerStats): Promise<IResponseServiceGetPlayerStats[]> {
    const url = `${AdapterConfigure.URL}/${AdapterConfigure.SCHEMA}/${AdapterConfigure.ENTITY}/getPlayerStats/${encodeURIComponent(params.playerName)}`;
    const response = await this.service.bgCall<IResponseServiceGetPlayerStats>('GET', url, '', 'basic', 'json', 'json', this.headers(), 0);
    return Array.isArray(response) ? (response as IResponseServiceGetPlayerStats[]) : [];
  }
}
