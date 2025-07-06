import './Style.scss';

interface Props {
  href: string;
  title: string;
  children: React.ReactNode;
}

export const SocialPill = ({ href, title, children }: Props) => {
  return (
    <a title={title} className={'social-pill'} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span>&nbsp;{title}</span>
    </a>
  );
};
