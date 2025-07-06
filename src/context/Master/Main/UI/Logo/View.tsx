import './Style.scss';
import { IconLogo } from '../../../../shared/Icons';

interface Props {
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<Props> = (props) => (
  <div onClick={props.onClick} className="logo">
    <div className="logo-container">
      <IconLogo className={props.className} />
    </div>
    <div className="logo-container-shadow">
      <IconLogo className={props.className} />
    </div>
  </div>
);
