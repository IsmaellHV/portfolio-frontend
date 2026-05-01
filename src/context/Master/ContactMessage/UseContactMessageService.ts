import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../../shared/Infraestructure/AdapterStore';
import { UseCaseCreateMessage } from './Aplication/UseCaseCreateMessage';
import { IRequestServiceCreateMessage } from './Domain/IServiceCreateMessage';
import { RepositoryImplMain } from './Infraestructure/RepositoryImplMain';

export const useContactMessageService = () => {
  const dispatch: Dispatch = useDispatch();
  const { dbLocal } = useSelector((state: RootState) => state.generic);
  const repository = new RepositoryImplMain(dbLocal, dispatch);

  return {
    createMessage: (params: IRequestServiceCreateMessage) => new UseCaseCreateMessage(repository).exec(params),
  };
};
