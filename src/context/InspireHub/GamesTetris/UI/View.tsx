import { faArrowDown, faArrowLeft, faArrowRight, faArrowsSpin, faGamepad, faPause, faPlay, faRotate, faSave, faStop, faArrowLeft as faBackArrow } from '@fortawesome/free-solid-svg-icons';
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
import NextPiecePreview from './NextPiecePreview';
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
        home={ENVIRONMENT.ROUTE.INSPIREHUBGAMES}
        list={[
          { navigate: true, path: ENVIRONMENT.ROUTE.INSPIREHUBGAMES, text: AdapterConfigure.SCHEMA_DESC },
          { navigate: false, path: '', text: AdapterConfigure.ENTITY_DESC },
        ]}
      />
      <section className="inspireHub-gameTetris">
        <Grid>
          <Col xs={24}>
            <Row className="control-score">
              <div className="score-and-nav">
                <Button 
                  appearance="ghost" 
                  size="sm"
                  onClick={() => window.location.href = ENVIRONMENT.ROUTE.INSPIREHUBGAMES}
                  className="back-to-games-btn"
                >
                  <FontAwesomeIcon icon={faBackArrow} /> Back to Games
                </Button>
                <p>Score: {props.score}</p>
              </div>
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
                <Button 
                  appearance="ghost" 
                  onClick={() => props.moveShape(-1)}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    props.moveShape(-1);
                  }}
                  className="control-move-button"
                  title="Move Left (A key)"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </Button>
                <Button 
                  appearance="ghost" 
                  onClick={() => props.dropShape()}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    props.dropShape();
                  }}
                  className="control-move-button"
                  title="Drop Down (S key)"
                >
                  <FontAwesomeIcon icon={faArrowDown} />
                </Button>
                <Button 
                  appearance="ghost" 
                  onClick={() => props.moveShape(1)}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    props.moveShape(1);
                  }}
                  className="control-move-button"
                  title="Move Right (D key)"
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </Button>
                <Button 
                  appearance="ghost" 
                  onClick={() => props.rotateShape()}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    props.rotateShape();
                  }}
                  className="control-move-button"
                  title="Rotate (W key)"
                >
                  <FontAwesomeIcon icon={faArrowsSpin} />
                </Button>
              </div>
            </Row>
          </Col>

          <Col xs={24} sm={24} md={5}>
            <Row>
              <div className="controls-actions">
                <Button 
                  title={props.isPlaying ? 'Pause game (Space)' : 'Resume game (Space)'} 
                  appearance="ghost" 
                  onClick={props.togglePauseResumeGame}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    props.togglePauseResumeGame();
                  }}
                  className={`pause-button control-action-button ${props.isPlaying ? 'playing' : 'paused'}`} 
                  disabled={props.notificationGameOver}
                >
                  {props.isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
                </Button>
                <Button 
                  title="Restart game (R key)" 
                  appearance="ghost" 
                  onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => props.restartGame(e)}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    props.restartGame(e as any);
                  }}
                  className="restart-button control-action-button" 
                  disabled={props.notificationGameOver}
                >
                  <FontAwesomeIcon icon={faRotate} />
                </Button>
                <Button 
                  title="Stop game (Esc key)" 
                  appearance="ghost" 
                  onClick={props.stopGame}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    props.stopGame();
                  }}
                  className="stop-button control-action-button" 
                  disabled={props.notificationGameOver}
                >
                  <FontAwesomeIcon icon={faStop} />
                </Button>
              </div>
            </Row>

            <Row>
              <Panel bordered header="Next" className="next-shape-panel">
                <NextPiecePreview shape={props.nextShape} />
              </Panel>
            </Row>

            <Row>
              <Panel bordered header="Stats" className="stats-panel">
                <p>Score: {props.score}</p>
                <p>Lines: {props.lines}</p>
                <p>Time: {props.timeElapsed}s</p>
              </Panel>
            </Row>
            
            <Row className="keyboard-instructions">
              <div className="instructions-panel">
                <h6>Keyboard Controls:</h6>
                <div className="instructions-grid">
                  <span><strong>W</strong> - Rotate</span>
                  <span><strong>A</strong> - Move Left</span>
                  <span><strong>S</strong> - Drop Down</span>
                  <span><strong>D</strong> - Move Right</span>
                  <span><strong>Space</strong> - Pause/Resume</span>
                  <span><strong>R</strong> - Restart</span>
                  <span><strong>Esc</strong> - Stop Game</span>
                </div>
              </div>
            </Row>
          </Col>
        </Grid>

        {/* Game Over */}
        <Modal open={props.notificationGameOver} backdrop="static" onClose={() => props.onChangeNotificationGameOver(false)} size={'sm'} className="game-over-modal">
          <Modal.Header closeButton={true}>
            <Modal.Title className="game-over-title">
              <FontAwesomeIcon icon={faGamepad} className="game-over-icon" /> Game Over!
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="game-over-body">
            <div className="game-stats-summary">
              <div className="final-score">
                <h4>Final Score</h4>
                <div className="score-display">{props.score.toLocaleString()}</div>
              </div>
              
              <div className="game-statistics">
                <div className="stat-item">
                  <span className="stat-label">Lines Cleared:</span>
                  <span className="stat-value">{props.lines}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Time Played:</span>
                  <span className="stat-value">{Math.floor(props.timeElapsed / 60)}:{(props.timeElapsed % 60).toString().padStart(2, '0')}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Lines per Minute:</span>
                  <span className="stat-value">{props.timeElapsed > 0 ? Math.round((props.lines / props.timeElapsed) * 60) : 0}</span>
                </div>
              </div>
            </div>
            
            {!!props.score && (
              <div className="save-score-section">
                <h5>Save Your Score</h5>
                <InputForm
                  xs={24}
                  classForm={'mt-10 mb-10'}
                  name={'name'}
                  value={props.formSaveOne.values['name']}
                  text={'Player Name'}
                  maxLength={50}
                  size={'sm'}
                  upper={false}
                  placeholder={'Enter your name to save score'}
                  onChange={props.onChangeValueSaveOne}
                  onBlur={props.formSaveOne.handleBlur}
                  error={props.formSaveOne.touched['name'] && props.formSaveOne.errors['name']}
                />
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="game-over-footer">
            <div className="modal-actions">
              <Button 
                onClick={() => window.location.href = ENVIRONMENT.ROUTE.INSPIREHUBGAMES} 
                appearance="subtle"
                className="back-to-games-modal-btn"
              >
                <FontAwesomeIcon icon={faBackArrow} /> Back to Games
              </Button>
              
              {!!props.score && (
                <Button 
                  onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => props.restartGame(e)} 
                  appearance="ghost"
                  className="save-score-btn"
                >
                  <FontAwesomeIcon icon={faSave} /> Save & Play Again
                </Button>
              )}
              
              <Button 
                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                  props.onChangeNotificationGameOver(false);
                  props.restartGame(e);
                }} 
                appearance="primary"
                className="play-again-btn"
              >
                <FontAwesomeIcon icon={faRotate} /> Play Again
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </section>
    </>
  );
};
