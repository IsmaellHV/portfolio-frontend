import { faArrowDown, faArrowLeft, faArrowRight, faArrowsSpin, faGamepad, faPause, faPlay, faRotate, faSave, faStop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Helmet } from 'react-helmet';
import { Button, Col, Grid, Modal, Panel, Row } from 'rsuite';
import { ENVIRONMENT } from '../../../../env';
import { BreadCrumb } from '../../../shared/Components/Element/BreadCrumb/View';
import { useSEO } from '../../../shared/Hook/useSEO';
import { PropsView } from '../Domain/PropsView';
import { AdapterConfigure } from '../Infraestructure/AdapterConfigure';
import './Style.scss';
import { TetrisBoard } from './TetrisBoard';
import { InputForm } from '../../../shared/Components/Element/InputForm/View';

export const View = (props: PropsView) => {
  useSEO({
    title: `[${props.score.toString()}] ${props.notificationGameOver ? 'Game Over' : !props.isPlaying ? 'Game Paused' : 'Tetris Game'}`,
    description: 'Tetris game made with React',
  });

  return (
    <>
      <Helmet>
        <title>[{props.score.toString()}] Tetris game</title>
        <meta name="description" content="Tetris game made with React" />
        <link rel="canonical" href={`${ENVIRONMENT.META.CANONICAL}${ENVIRONMENT.ROUTE.INSPIREHUBGAMESTETRIS}`} />
      </Helmet>
      <BreadCrumb
        list={[
          { navigate: false, path: '', text: AdapterConfigure.SCHEMA_DESC },
          { navigate: false, path: '', text: AdapterConfigure.ENTITY_DESC },
        ]}
      />
      <section className="inspireHub-gameTetris">
        <Grid>
          <Col xs={24}>
            <Row className="control-score">
              <p>Score: {props.score}</p>
            </Row>
          </Col>

          <Col xs={24} sm={24} md={18}>
            <Row>
              <div className="tetris-board-container">
                <TetrisBoard board={props.board} currentShape={props.currentShape} position={props.position} rowsToClear={props.rowsToClear} />
              </div>
            </Row>

            <Row>
              <div className="controls-moves">
                <Button appearance="ghost" onClick={() => props.moveShape(-1)} className="control-move-button">
                  <FontAwesomeIcon icon={faArrowLeft} />
                </Button>
                <Button appearance="ghost" onClick={() => props.dropShape()} className="control-move-button">
                  <FontAwesomeIcon icon={faArrowDown} />
                </Button>
                <Button appearance="ghost" onClick={() => props.moveShape(1)} className="control-move-button">
                  <FontAwesomeIcon icon={faArrowRight} />
                </Button>
                <Button appearance="ghost" onClick={() => props.rotateShape()} className="control-move-button">
                  <FontAwesomeIcon icon={faArrowsSpin} />
                </Button>
              </div>
            </Row>
          </Col>

          <Col xs={24} sm={24} md={5}>
            <Row>
              <div className="controls-actions">
                <Button title={props.isPlaying ? 'Pause game' : 'Resumen game'} appearance="ghost" onClick={props.togglePauseResumeGame} className="pause-button control-action-button" disabled={props.notificationGameOver}>
                  {props.isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
                </Button>
                <Button title="Restart game" appearance="ghost" onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => props.restartGame(e)} className="restart-button control-action-button" disabled={props.notificationGameOver}>
                  <FontAwesomeIcon icon={faRotate} />
                </Button>
                <Button title="Stop game" appearance="ghost" onClick={props.stopGame} className="stop-button control-action-button" disabled={props.notificationGameOver}>
                  <FontAwesomeIcon icon={faStop} />
                </Button>
              </div>
            </Row>

            <Row>
              <Panel bordered header="Next" className="next-shape-panel">
                {props.nextShape && <TetrisBoard board={props.nextShape} currentShape={props.nextShape} position={{ x: 0, y: 0 }} />}
              </Panel>
            </Row>

            <Row>
              <Panel bordered header="Stats" className="stats-panel">
                <p>Score: {props.score}</p>
                <p>Lines: {props.lines}</p>
                <p>Time: {props.timeElapsed}s</p>
              </Panel>
            </Row>
          </Col>
        </Grid>

        {/* Game Over */}
        <Modal open={props.notificationGameOver} backdrop="static" onClose={() => props.onChangeNotificationGameOver(false)} size={'xs'}>
          <Modal.Header closeButton={true}>
            <Modal.Title>
              <FontAwesomeIcon icon={faGamepad} /> Score: {props.score}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {!!props.score && (
              <InputForm
                xs={24}
                classForm={'mt-15 mb-15'}
                name={'name'}
                value={props.formSaveOne.values['name']}
                text={'Player'}
                maxLength={50}
                size={'sm'}
                upper={false}
                placeholder={'Enter your name'}
                onChange={props.onChangeValueSaveOne}
                onBlur={props.formSaveOne.handleBlur}
                error={props.formSaveOne.touched['name'] && props.formSaveOne.errors['name']}
                // onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                //   if (e.key === 'Enter') props.restartGame(e);
                // }}
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => props.restartGame(e)} appearance="ghost">
              <FontAwesomeIcon icon={faSave} />
            </Button>
          </Modal.Footer>
        </Modal>
      </section>
    </>
  );
};
