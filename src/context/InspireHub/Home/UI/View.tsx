import { Helmet } from 'react-helmet';
import { ENVIRONMENT } from '../../../../env';
import './Style.scss';

export const View = () => {
  return (
    <>
      <Helmet>
        <title>{ENVIRONMENT.APP.TITLE}</title>
        <meta name="description" content={ENVIRONMENT.META.DESCRIPTION} />
        <link rel="canonical" href={`${ENVIRONMENT.META.CANONICAL}${ENVIRONMENT.ROUTE.INSPIREHUB}`} />
      </Helmet>
      <div className="inspireHub-home"></div>
    </>
  );
};
