import { AppRoutes } from './routes';
import { Helmet } from 'react-helmet';
import { CustomProvider as RsuiteProvider } from 'rsuite';
import { Provider } from 'react-redux';
import { AdapterStore } from '../../context/shared/Infraestructure/AdapterStore';

export const ViewMain = () => {
  const jsonLdData = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    name: 'Ismael Hurtado',
    url: 'https://ismaelhv.com',
    image: 'https://media.licdn.com/dms/image/v2/C4E03AQFrfo_J64dLWA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1600073530911?e=1735171200&v=beta&t=qXnWjxRpcs219FrXEsF1jcWycK5dwPB6rx7s8zLP4Qo',
    jobTitle: 'Web Developer',
    worksFor: {
      '@type': 'Organization',
      name: 'Freelancer',
    },
    sameAs: ['https://www.linkedin.com/in/ihurtadov', 'https://x.com/Ismael_Hv'],
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLdData)}</script>
      </Helmet>
      <Provider store={AdapterStore}>
        <RsuiteProvider>
          <AppRoutes />
        </RsuiteProvider>
      </Provider>
    </>
  );
};
