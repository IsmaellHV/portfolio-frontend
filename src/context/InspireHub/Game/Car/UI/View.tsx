import { Col, Row } from 'rsuite';
import './Style.scss';

export const View = () => {
  return (
    <div className="ViewGameCar m-30 outline-color-blue">
      <h3 className="color-primary-300">Car Game</h3>

      <Row>
        <Col className="outline-color-red" xs={24}>
          <div className="container-canvas">
            {/* <canvas id="game" width="800" height="400"></canvas> */}
            <h5 className="color-primary-300">Game</h5>
          </div>
        </Col>
        <Col className="outline-color-red" xs={24}>
          <div className="container-instructions">
            <h5 className="color-primary-300">Instructions</h5>
            <p className="color-light-50">Use the arrow keys to move the car</p>
            <p className="color-light-50">Use the bottons</p>
          </div>
        </Col>
      </Row>
    </div>
  );
};
