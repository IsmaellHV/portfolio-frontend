import { ChartBar, Gamepad2, Search, Trophy, Target, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button, Card, Divider, Pagination, Stat, StatGroup, Table, Tabs, Text, Input, InputGroup, SelectPicker, Badge, Loader } from 'rsuite';
import imgSnake from '../../../../assets/img/games/snake.webp';
import imgTetris from '../../../../assets/img/games/tetris.webp';
import { ENVIRONMENT } from '../../../../env';
import { PropsView } from '../Domain/PropsView';
import './Style.scss';

import { GameScoresService, GameScore } from '../../../../lib/supabase';

const { Column, HeaderCell, Cell } = Table;

export const View = (props: PropsView) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [gameScores, setGameScores] = useState<GameScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [gameStats, setGameStats] = useState<any>({});
  const [selectedGameFilter, setSelectedGameFilter] = useState('all');

  // Load scores and stats from Supabase
  useEffect(() => {
    const loadGameData = async () => {
      try {
        setLoading(true)
        const [scores, tetrisStats, snakeStats] = await Promise.all([
          GameScoresService.getScores(),
          GameScoresService.getGameStats('tetris'),
          GameScoresService.getGameStats('snake')
        ])
        
        setGameScores(scores)
        setGameStats({
          tetris: tetrisStats,
          snake: snakeStats
        })
      } catch (error) {
        console.error('Error loading game data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadGameData()
  }, [])

  // Game data with enhanced information
  const gamesData = [
    {
      id: 'tetris',
      name: 'Tetris',
      description: 'El clásico juego de bloques que caen. Organiza las piezas para completar líneas y obtener puntos.',
      image: imgTetris,
      category: 'puzzle',
      difficulty: 'Medium',
      players: gameStats.tetris?.totalPlayers?.toString() || '0',
      route: ENVIRONMENT.ROUTE.INSPIREHUBGAMESTETRIS,
      features: ['Rotación de piezas', 'Líneas múltiples', 'Niveles progresivos'],
      bestScore: gameStats.tetris?.highestScore || 15000,
      rating: 4.8
    },
    {
      id: 'snake',
      name: 'Snake',
      description: 'Controla la serpiente para comer comida y crecer. ¡Evita chocar contigo mismo!',
      image: imgSnake,
      category: 'arcade',
      difficulty: 'Easy',
      players: gameStats.snake?.totalPlayers?.toString() || '0',
      route: ENVIRONMENT.ROUTE.INSPIREHUBGAMESSNAKE,
      features: ['Crecimiento dinámico', 'Velocidad variable', 'Puntuación alta'],
      bestScore: gameStats.snake?.highestScore || 8500,
      rating: 4.5
    },
    {
      id: 'pong',
      name: 'Pong',
      description: 'El clásico juego de ping pong. Controla tu paleta y vence a la IA en este juego retro.',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=retro%20pong%20game%20with%20neon%20paddles%20and%20ball%20on%20dark%20background%2C%20minimalist%20design%2C%20glowing%20effects&image_size=square_hd',
      category: 'arcade',
      difficulty: 'Medium',
      players: gameStats.pong?.totalPlayers?.toString() || '0',
      route: ENVIRONMENT.ROUTE.INSPIREHUBGAMESPONG,
      features: ['IA inteligente', 'Controles suaves', 'Física realista'],
      bestScore: gameStats.pong?.highestScore || 12000,
      rating: 4.6
    },
    {
      id: '2048',
      name: '2048',
      description: 'Combina números para llegar a 2048. Un juego de puzzle adictivo que desafía tu estrategia.',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=2048%20game%20board%20with%20colorful%20number%20tiles%2C%20modern%20design%2C%20gradient%20background%2C%20mathematical%20puzzle%20game&image_size=square_hd',
      category: 'puzzle',
      difficulty: 'Medium',
      players: gameStats.games2048?.totalPlayers?.toString() || '0',
      route: ENVIRONMENT.ROUTE.INSPIREHUBGAMES2048,
      features: ['Estrategia', 'Deshacer jugadas', 'Animaciones suaves'],
      bestScore: gameStats.games2048?.highestScore || 15000,
      rating: 4.7
    },
    {
      id: 'memory',
      name: 'Memory',
      description: 'Pon a prueba tu memoria encontrando pares de cartas. Un juego clásico con diferentes niveles de dificultad.',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=memory%20card%20game%20with%20colorful%20cards%20face%20down%2C%20some%20flipped%20showing%20cute%20emojis%2C%20modern%20design%2C%20brain%20training%20game&image_size=square_hd',
      category: 'puzzle',
      difficulty: 'Easy',
      players: gameStats.gamesMemory?.totalPlayers?.toString() || '0',
      route: ENVIRONMENT.ROUTE.INSPIREHUBGAMESMEMORY,
      features: ['Múltiples dificultades', 'Entrenamiento mental', 'Puntuación por tiempo'],
      bestScore: gameStats.gamesMemory?.highestScore || 8500,
      rating: 4.5
    }
  ];

  const categories = [
    { label: 'Todos los juegos', value: 'all' },
    { label: 'Puzzle', value: 'puzzle' },
    { label: 'Arcade', value: 'arcade' },
    { label: 'Acción', value: 'action' }
  ];

  const sortOptions = [
    { label: 'Nombre', value: 'name' },
    { label: 'Puntuación', value: 'rating' },
    { label: 'Dificultad', value: 'difficulty' }
  ];

  // Filter and sort games
  const filteredGames = gamesData
    .filter(game => {
      const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           game.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'difficulty': {
          const difficultyOrder: { [key: string]: number } = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        }
        default:
          return a.name.localeCompare(b.name);
      }
    });

  // Filter scores by selected game
  const filteredScores = selectedGameFilter === 'all' 
    ? gameScores 
    : gameScores.filter(score => score.game_type === selectedGameFilter);

  const handleChangeLimit = (dataKey: number) => {
    setPage(1);
    setLimit(dataKey);
  };



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
            <div className="games-header">
              <div className="games-stats">
                <div className="stat-item">
                  <Gamepad2 className="stat-icon" />
                  <div>
                    <Text weight="bold">{gamesData.length}</Text>
                    <Text size="sm" muted>Juegos Disponibles</Text>
                  </div>
                </div>
                <div className="stat-item">
                  <Trophy className="stat-icon" />
                  <div>
                    <Text weight="bold">{loading ? <Loader /> : Math.max(...gamesData.map(g => g.bestScore)).toLocaleString()}</Text>
                    <Text size="sm" muted>Mejor Puntuación</Text>
                  </div>
                </div>
              </div>
              
              <div className="games-filters">
                <InputGroup className="search-input">
                  <Input 
                    placeholder="Buscar juegos..."
                    value={searchTerm}
                    onChange={setSearchTerm}
                  />
                  <InputGroup.Addon>
                    <Search size={16} />
                  </InputGroup.Addon>
                </InputGroup>
                
                <SelectPicker
                  data={categories}
                  value={selectedCategory}
                  onChange={(value) => value && setSelectedCategory(value)}
                  placeholder="Categoría"
                  cleanable={false}
                  className="filter-select"
                />
                
                <SelectPicker
                  data={sortOptions}
                  value={sortBy}
                  onChange={(value) => value && setSortBy(value)}
                  placeholder="Ordenar por"
                  cleanable={false}
                  className="filter-select"
                />
              </div>
            </div>

            <section className="game-grid">
              {filteredGames.map((game) => (
                <Card key={game.id} className="game-card enhanced">
                  <div className="game-image-container">
                    <img src={game.image} alt={game.name} />
                    <div className="game-overlay">
                      <Button 
                        appearance="primary" 
                        size="lg"
                        className="play-button"
                        onClick={() => props.handleGo(game.route)}
                      >
                        <Gamepad2 className="mr-2" />
                        Jugar Ahora
                      </Button>
                    </div>
                    <Badge className="difficulty-badge" color={game.difficulty === 'Easy' ? 'green' : game.difficulty === 'Medium' ? 'orange' : 'red'}>
                      {game.difficulty}
                    </Badge>
                  </div>
                  
                  <Card.Body className="game-content">
                    <div className="game-header">
                      <Text size="xl" weight="bold" className="game-title">
                        {game.name}
                      </Text>
                      <div className="game-rating">
                        <Star className="star-icon" />
                        <Text size="sm">{game.rating}</Text>
                      </div>
                    </div>
                    
                    <Text className="game-description">
                      {game.description}
                    </Text>
                    
                    <div className="game-meta">
                      <div className="meta-item">
                        <Target className="meta-icon" />
                        <Text size="sm">{game.bestScore.toLocaleString()}</Text>
                      </div>
                      <div className="meta-item">
                        <Text size="sm" muted>{game.players}</Text>
                      </div>
                    </div>
                    
                    <div className="game-features">
                      {game.features.slice(0, 2).map((feature, index) => (
                        <Badge key={index} className="feature-badge">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button 
                      appearance="ghost" 
                      size="sm"
                      block
                      className="quick-play-btn"
                      onClick={() => props.handleGo(game.route)}
                    >
                      Jugar
                    </Button>
                  </Card.Body>
                </Card>
              ))}
            </section>
            
            {filteredGames.length === 0 && (
              <div className="no-games-found">
                <Gamepad2 size={48} className="no-games-icon" />
                <Text size="lg" weight="bold">No se encontraron juegos</Text>
                <Text muted>Intenta cambiar los filtros de búsqueda</Text>
              </div>
            )}
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
                <div className="scores-filters mb-4">
                  <SelectPicker
                    data={[
                      { label: 'Todos los juegos', value: 'all' },
                      { label: 'Tetris', value: 'tetris' },
                      { label: 'Snake', value: 'snake' }
                    ]}
                    value={selectedGameFilter}
                    onChange={(value) => value && setSelectedGameFilter(value)}
                    placeholder="Filtrar por juego"
                    style={{ width: 200 }}
                  />
                </div>

                <Table
                  data={filteredScores}
                  loading={loading}
                  height={400}
                  className="scores-table"
                >
                  <Column width={150} align="center" fixed>
                    <HeaderCell>Jugador</HeaderCell>
                    <Cell dataKey="player_name" />
                  </Column>

                  <Column width={100} align="center">
                    <HeaderCell>Juego</HeaderCell>
                    <Cell>
                      {(rowData: GameScore) => (
                        <Badge color={rowData.game_type === 'tetris' ? 'blue' : 'green'}>
                          {rowData.game_type.charAt(0).toUpperCase() + rowData.game_type.slice(1)}
                        </Badge>
                      )}
                    </Cell>
                  </Column>

                  <Column width={120} align="center">
                    <HeaderCell>Puntuación</HeaderCell>
                    <Cell>
                      {(rowData: GameScore) => rowData.score.toLocaleString()}
                    </Cell>
                  </Column>

                  <Column width={100} align="center">
                    <HeaderCell>Nivel/Líneas</HeaderCell>
                    <Cell dataKey="level_or_lines" />
                  </Column>

                  <Column width={120} align="center">
                    <HeaderCell>Duración</HeaderCell>
                    <Cell>
                      {(rowData: GameScore) => {
                        const minutes = Math.floor(rowData.duration / 60);
                        const seconds = rowData.duration % 60;
                        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
                      }}
                    </Cell>
                  </Column>

                  <Column width={150} align="center">
                    <HeaderCell>Fecha</HeaderCell>
                    <Cell>
                      {(rowData: GameScore) => new Date(rowData.created_at).toLocaleDateString()}
                    </Cell>
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
