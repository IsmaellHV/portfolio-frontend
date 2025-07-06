import { ChartBar, Gamepad2 } from 'lucide-react';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button, Card, Divider, Pagination, Stat, StatGroup, Table, Tabs, Text } from 'rsuite';
import imgSnake from '../../../../assets/img/games/snake.webp';
import imgTetris from '../../../../assets/img/games/tetris.webp';
import { ENVIRONMENT } from '../../../../env';
import { PropsView } from '../Domain/PropsView';
import './Style.scss';
import { IScore } from '../Domain/IScore';

const { Column, HeaderCell, Cell } = Table;

export const View = (props: PropsView) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const handleChangeLimit = (dataKey: number) => {
    setPage(1);
    setLimit(dataKey);
  };

  const data = props.dataScores.filter((v: IScore, i: number) => {
    const start = limit * (page - 1);
    const end = start + limit;
    return i >= start && i < end;
  });

  return (
    <>
      <Helmet>
        <title>{ENVIRONMENT.APP.TITLE} - Games</title>
        <meta name="description" content="Games" />
        <link rel="canonical" href={`${ENVIRONMENT.META.CANONICAL}${ENVIRONMENT.ROUTE.INSPIREHUBGAMES}`} />
      </Helmet>
      {/* <BreadCrumb
        list={[
          { navigate: false, path: '', text: AdapterConfigure.SCHEMA_DESC },
          { navigate: false, path: '', text: AdapterConfigure.ENTITY_DESC },
        ]}
      /> */}
      <section className="inspireHub-games">
        <Tabs defaultActiveKey="1" appearance="subtle">
          <Tabs.Tab eventKey="1" title="Games" icon={<Gamepad2 />}>
            <section className="game-grid">
              <Card size="sm" className="game-card">
                <img src={imgTetris} alt="Tetris" />
                <Card.Header as="h5">
                  <Text size="lg" className="color-primary mt-10">
                    Tetris
                  </Text>
                </Card.Header>
                <Card.Body>
                  <Button className="m-10" size="sm" appearance="primary" onClick={() => props.handleGo(ENVIRONMENT.ROUTE.INSPIREHUBGAMESTETRIS)}>
                    Jugar
                  </Button>
                </Card.Body>
              </Card>
              <Card size="sm" className="game-card">
                <img src={imgSnake} alt="Snake" />
                <Card.Header as="h5">
                  <Text size="lg" className="color-primary mt-10">
                    Snake
                  </Text>
                </Card.Header>
                <Card.Body>
                  <Button className="m-10" size="sm" appearance="primary" onClick={() => props.handleGo(ENVIRONMENT.ROUTE.INSPIREHUBGAMESSNAKE)}>
                    Jugar
                  </Button>
                </Card.Body>
              </Card>
            </section>
          </Tabs.Tab>
          <Tabs.Tab eventKey="2" title="Scores" icon={<ChartBar />}>
            <section>
              <StatGroup spacing={20}>
                <Stat>
                  <Stat.Label>Score Max</Stat.Label>
                  <Stat.Value value={20000} />
                </Stat>
              </StatGroup>
              <Divider />
              <div>
                <Table height={620} data={data} bordered={true} cellBordered={true}>
                  <Column width={50} fixed>
                    <HeaderCell>N</HeaderCell>
                    <Cell dataKey="i" />
                  </Column>

                  <Column width={200} fixed>
                    <HeaderCell>Player Name</HeaderCell>
                    <Cell dataKey="player_name" />
                  </Column>

                  <Column width={80}>
                    <HeaderCell>Score</HeaderCell>
                    <Cell dataKey="score" />
                  </Column>

                  <Column width={80}>
                    <HeaderCell>Lines</HeaderCell>
                    <Cell dataKey="lines_cleared" />
                  </Column>

                  <Column width={180}>
                    <HeaderCell>Duration (seconds)</HeaderCell>
                    <Cell dataKey="duration" />
                  </Column>

                  <Column width={130} flexGrow={1}>
                    <HeaderCell>Date</HeaderCell>
                    <Cell dataKey="created_at" />
                  </Column>
                </Table>
                <div style={{ padding: 20 }}>
                  <Pagination prev next first last ellipsis boundaryLinks maxButtons={5} size="xs" layout={['total', '-', 'limit', '|', 'pager', 'skip']} total={props.dataScores.length} limitOptions={[10, 30, 50]} limit={limit} activePage={page} onChangePage={setPage} onChangeLimit={handleChangeLimit} />
                </div>
              </div>
            </section>
          </Tabs.Tab>
        </Tabs>
      </section>
    </>
  );
};
