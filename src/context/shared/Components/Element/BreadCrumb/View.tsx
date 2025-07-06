import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BreadCrumb as BreadCrumbPR } from 'primereact/breadcrumb';
import { useNavigate } from 'react-router-dom';
import { ENVIRONMENT } from '../../../../../env';
import './Style.scss';

interface Props {
  list: Array<{ text: string; navigate: boolean; path: string }>;
  home?: string;
  className?: string;
}

export const BreadCrumb = ({ home, list, className }: Props) => {
  const navigate = useNavigate();
  const items = list.map((row) => {
    if (row.navigate) {
      return {
        label: row.text,
        command: () => navigate(row.path),
      };
    } else {
      return { label: row.text };
    }
  });
  const navigateHome = { icon: <FontAwesomeIcon icon={faHome} />, command: () => navigate(home ? home : `/${ENVIRONMENT.ROUTE.MASTER}`) };

  return <BreadCrumbPR className={`${!className ? '' : className} breadcrumb`} model={items} home={navigateHome} />;
};
