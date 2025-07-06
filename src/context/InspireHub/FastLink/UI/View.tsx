import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Helmet } from 'react-helmet';
import Turnstile from 'react-turnstile';
import { Button, Heading, Input, InputGroup, Panel } from 'rsuite';
import { ENVIRONMENT } from '../../../../env';
import { BreadCrumb } from '../../../shared/Components/Element/BreadCrumb/View';
import { InputForm } from '../../../shared/Components/Element/InputForm/View';
import { PropsView } from '../Domain/PropsView';
import { AdapterConfigure } from '../Infraestructure/AdapterConfigure';
import './Style.scss';

export const View = (props: PropsView) => {
  return (
    <>
      <Helmet>
        <title>{ENVIRONMENT.APP.TITLE} - Link Shortener</title>
        <meta name="description" content="Easily shorten your long URLs with our link shortener." />
        <link rel="canonical" href={`${ENVIRONMENT.META.CANONICAL}${ENVIRONMENT.ROUTE.INSPIREHUBFASTLINK}`} />
      </Helmet>

      <BreadCrumb
        list={[
          { navigate: false, path: '', text: AdapterConfigure.SCHEMA_DESC },
          { navigate: false, path: '', text: AdapterConfigure.ENTITY_DESC },
        ]}
      />

      <div className="inspireHub-fastlink">
        {!props.shortURL ? (
          <>
            <Heading className="mb-20" level={3}>
              Fast Link
            </Heading>
            <InputForm
              xs={24}
              sm={20}
              md={18}
              lg={16}
              type={'text'}
              name={'link'}
              value={props.formCreateShortLink.values['link']}
              text={''}
              maxLength={250}
              size={'sm'}
              upper={false}
              placeholder={'Enter your URL here'}
              onChange={props.onChangeValueCreateShortLink}
              onBlur={props.formCreateShortLink.handleBlur}
              error={props.formCreateShortLink.touched['link'] && props.formCreateShortLink.errors['link']}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') props.onSubmitCreateShortLink(e);
              }}
              childrenPostpend={
                <InputGroup.Button
                  disabled={props.isSubmitting}
                  loading={props.isSubmitting}
                  onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                    props.onSubmitCreateShortLink(e);
                  }}
                >
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="color-primary-900" />
                </InputGroup.Button>
              }
            />
            <br />
            <Turnstile sitekey={ENVIRONMENT.RECAPTCHA.KEY} onVerify={props.onChangeRecaptcha} size="normal" action="submit" />
          </>
        ) : (
          <div>
            <Panel bordered className="url-panel" shaded>
              <h2>Your link is ready!</h2>
              <p>Share your link with others, or save it for later use.</p>

              <InputGroup style={{ marginTop: '20px', marginBottom: '10px' }}>
                <Input value={props.shortURL} disabled={true} placeholder="Short URL" />
                <InputGroup.Button onClick={props.onCopy} appearance="primary">
                  Copy Link
                </InputGroup.Button>
              </InputGroup>

              <p className="long-url">
                Original URL:{' '}
                <a href={props.originalURL} target="_blank" rel="noreferrer">
                  {props.originalURL}
                </a>
              </p>

              <div className="action-buttons">
                <Button appearance="primary" onClick={props.onViewStats} style={{ marginBottom: '10px', width: '100%' }}>
                  Visit Link
                </Button>
                <Button appearance="ghost" onClick={props.onNewShorten} style={{ width: '100%' }}>
                  Create Another Link
                </Button>
              </div>

              <p className="note">* Links that are inactive for a month may be disabled.</p>
            </Panel>
          </div>
        )}
      </div>
    </>
  );
};
