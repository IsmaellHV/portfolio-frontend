import { FC } from 'react';

interface Props {
  className?: string;
  onClick?: () => void;
}

export const IconLinkedin: FC<Props> = (props) => (
  <div className={`svg-linkedin ${props.className ?? ''}`}>
    <svg width="50" height="50" role="img" viewBox="0 0 448 512" fill="none" stroke="black" onClick={props.onClick}>
      <title>Linkedin</title>
      <g>
        <path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" />
      </g>
    </svg>
  </div>
);

export const IconLogo: FC<Props> = (props) => (
  <div className={`svg-logo ${props.className ?? ''}`}>
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="black" role="img" onClick={props.onClick}>
      <title>Logo</title>
      <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
      <text x="50" y="65" fontFamily="Times Roman" fontSize="45" strokeWidth="1" textAnchor="middle" stroke="black" fill="black">
        I
      </text>
    </svg>
  </div>
);

export const IconMenu: React.FC<Props> = (props) => (
  <div className={`svg-menu ${props.className ?? ''}`}>
    <svg width="50" height="50" viewBox="0 0 100 100" fill="none" stroke="black" role="img" onClick={props.onClick}>
      <title>Menu</title>
      <line x1="20" y1="30" x2="80" y2="30" strokeWidth="5" strokeLinecap="round" fill="none" />
      <line x1="30" y1="50" x2="80" y2="50" strokeWidth="5" strokeLinecap="round" />
      <line x1="40" y1="70" x2="80" y2="70" strokeWidth="5" strokeLinecap="round" />
    </svg>
  </div>
);

export const IconX2: React.FC<Props> = (props) => (
  <div className={`svg-x ${props.className}`}>
    <svg viewBox="0 0 24 24" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-lrsllp r-1nao33i r-16y2uox r-8kz0gk">
      <title>X</title>
      <g>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
      </g>
    </svg>
  </div>
);

export const IconX: React.FC<Props> = (props) => (
  <div className={`svg-x ${props.className ?? ''}`}>
    {/* <svg width="50" height="50" viewBox="0 0 512 512" aria-hidden="true" fill="none" stroke="black" role="img" onClick={props.onClick}> */}
    <svg viewBox="0 0 512 512" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-lrsllp r-1nao33i r-16y2uox r-8kz0gk">
      <title>X</title>
      <g>
        <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
      </g>
    </svg>
  </div>
);

export const IconExternal: React.FC<Props> = (props) => (
  <div className={`svg-external ${props.className ?? ''}`}>
    <svg width="100" height="100" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-external-link">
      <title>External Link</title>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  </div>
);

export const IconGitHub: React.FC<Props> = (props) => (
  <div className={`svg-github ${props.className ?? ''}`}>
    <svg width="100" height="100" role="img" viewBox="0 0 496 512" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-external-link">
      <title>Github</title>
      <g>
        <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
      </g>
    </svg>
  </div>
);
