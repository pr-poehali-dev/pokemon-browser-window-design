import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface Pokemon {
  id: number;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  type: string;
  level: number;
  exp: number;
  moves: Move[];
  sprite: string;
}

interface Move {
  name: string;
  damage: number;
  type: string;
  pp: number;
  maxPp: number;
}

interface Player {
  name: string;
  level: number;
  exp: number;
  badges: number;
  money: number;
  pokemon: Pokemon[];
  items: { [key: string]: number };
}

const PokemonGame = () => {
  const [currentScreen, setCurrentScreen] = useState<'menu' | 'battle' | 'map' | 'pokedex' | 'inventory' | 'profile'>('menu');
  const [player, setPlayer] = useState<Player>({
    name: 'Тренер',
    level: 10,
    exp: 1250,
    badges: 3,
    money: 5000,
    pokemon: [
      {
        id: 25,
        name: 'Пикачу',
        hp: 85,
        maxHp: 120,
        attack: 95,
        defense: 75,
        speed: 110,
        type: 'Электричество',
        level: 15,
        exp: 850,
        moves: [
          { name: 'Удар молнии', damage: 40, type: 'Электричество', pp: 15, maxPp: 25 },
          { name: 'Быстрая атака', damage: 25, type: 'Обычная', pp: 20, maxPp: 30 }
        ],
        sprite: '/img/582f76c1-8853-4dcb-977c-f13788613312.jpg'
      }
    ],
    items: {
      'Покебол': 10,
      'Супер шар': 3,
      'Зелье': 5,
      'Супер зелье': 2
    }
  });

  const [battleState, setBattleState] = useState({
    playerPokemon: player.pokemon[0],
    enemyPokemon: {
      id: 19,
      name: 'Раттата',
      hp: 45,
      maxHp: 60,
      attack: 56,
      defense: 35,
      speed: 72,
      type: 'Обычный',
      level: 12,
      exp: 0,
      moves: [
        { name: 'Укус', damage: 30, type: 'Тёмный', pp: 25, maxPp: 25 },
        { name: 'Рывок', damage: 20, type: 'Обычная', pp: 35, maxPp: 35 }
      ],
      sprite: '/img/582f76c1-8853-4dcb-977c-f13788613312.jpg'
    },
    turn: 'player' as 'player' | 'enemy',
    battleLog: ['Дикий Раттата появился!'],
    isAnimating: false
  });

  const handleAttack = (move: Move) => {
    if (battleState.isAnimating) return;
    
    setBattleState(prev => ({ ...prev, isAnimating: true }));
    
    setTimeout(() => {
      setBattleState(prev => {
        const damage = Math.floor(Math.random() * move.damage) + 15;
        const newEnemyHp = Math.max(0, prev.enemyPokemon.hp - damage);
        
        const newLog = [...prev.battleLog, `${prev.playerPokemon.name} использует ${move.name}! Урон: ${damage}HP`];
        
        return {
          ...prev,
          enemyPokemon: { ...prev.enemyPokemon, hp: newEnemyHp },
          battleLog: newLog,
          turn: 'enemy',
          isAnimating: false
        };
      });
    }, 1000);
  };

  useEffect(() => {
    if (battleState.turn === 'enemy' && battleState.enemyPokemon.hp > 0) {
      setTimeout(() => {
        const enemyMove = battleState.enemyPokemon.moves[Math.floor(Math.random() * battleState.enemyPokemon.moves.length)];
        const damage = Math.floor(Math.random() * enemyMove.damage) + 10;
        const newPlayerHp = Math.max(0, battleState.playerPokemon.hp - damage);
        
        setBattleState(prev => ({
          ...prev,
          playerPokemon: { ...prev.playerPokemon, hp: newPlayerHp },
          battleLog: [...prev.battleLog, `${prev.enemyPokemon.name} использует ${enemyMove.name}! Урон: ${damage}HP`],
          turn: 'player'
        }));
      }, 2000);
    }
  }, [battleState.turn, battleState.enemyPokemon.hp]);

  const renderMenu = () => (
    <div className="min-h-screen bg-pokemon-blue p-4 font-pixel">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl text-pokemon-yellow text-center mb-8 animate-float">
          🎮 POKÉMON ADVENTURE
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Button 
            onClick={() => setCurrentScreen('battle')}
            className="h-20 bg-pokemon-red hover:bg-pokemon-red/80 text-pokemon-white font-pixel text-lg"
          >
            <Icon name="Zap" className="mr-2" />
            Битва
          </Button>
          
          <Button 
            onClick={() => setCurrentScreen('map')}
            className="h-20 bg-pokemon-green hover:bg-pokemon-green/80 text-pokemon-white font-pixel text-lg"
          >
            <Icon name="Map" className="mr-2" />
            Карта мира
          </Button>
          
          <Button 
            onClick={() => setCurrentScreen('pokedex')}
            className="h-20 bg-pokemon-yellow hover:bg-pokemon-yellow/80 text-pokemon-black font-pixel text-lg"
          >
            <Icon name="Book" className="mr-2" />
            Покедекс
          </Button>
          
          <Button 
            onClick={() => setCurrentScreen('inventory')}
            className="h-20 bg-purple-600 hover:bg-purple-700 text-pokemon-white font-pixel text-lg"
          >
            <Icon name="Package" className="mr-2" />
            Инвентарь
          </Button>
          
          <Button 
            onClick={() => setCurrentScreen('profile')}
            className="h-20 bg-orange-600 hover:bg-orange-700 text-pokemon-white font-pixel text-lg"
          >
            <Icon name="User" className="mr-2" />
            Профиль
          </Button>
          
          <Button className="h-20 bg-pink-600 hover:bg-pink-700 text-pokemon-white font-pixel text-lg">
            <Icon name="MessageCircle" className="mr-2" />
            Чат
          </Button>
        </div>
      </div>
    </div>
  );

  const renderBattle = () => (
    <div className="min-h-screen bg-cover bg-center p-4 font-pixel" 
         style={{ backgroundImage: "url('/img/230acc89-718a-4351-90d2-f0756f464475.jpg')" }}>
      <div className="max-w-4xl mx-auto bg-black/80 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <Button 
            onClick={() => setCurrentScreen('menu')}
            variant="outline"
            className="font-pixel"
          >
            <Icon name="ArrowLeft" className="mr-2" />
            Меню
          </Button>
          <h2 className="text-2xl text-pokemon-yellow font-pixel">БИТВА ПОКЕМОНОВ</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Enemy Pokemon */}
          <Card className="bg-pokemon-red/90">
            <CardHeader>
              <CardTitle className="text-pokemon-white font-pixel text-center">
                {battleState.enemyPokemon.name} (Lv.{battleState.enemyPokemon.level})
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-pokemon-gray rounded-lg flex items-center justify-center">
                <span className="text-4xl">🐭</span>
              </div>
              <Progress 
                value={(battleState.enemyPokemon.hp / battleState.enemyPokemon.maxHp) * 100} 
                className="mb-2"
              />
              <p className="text-pokemon-white font-pixel text-sm">
                HP: {battleState.enemyPokemon.hp}/{battleState.enemyPokemon.maxHp}
              </p>
            </CardContent>
          </Card>

          {/* Player Pokemon */}
          <Card className="bg-pokemon-blue/90">
            <CardHeader>
              <CardTitle className="text-pokemon-white font-pixel text-center">
                {battleState.playerPokemon.name} (Lv.{battleState.playerPokemon.level})
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-pokemon-yellow rounded-lg flex items-center justify-center">
                <span className="text-4xl">⚡</span>
              </div>
              <Progress 
                value={(battleState.playerPokemon.hp / battleState.playerPokemon.maxHp) * 100} 
                className="mb-2"
              />
              <p className="text-pokemon-white font-pixel text-sm">
                HP: {battleState.playerPokemon.hp}/{battleState.playerPokemon.maxHp}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Battle Actions */}
        {battleState.turn === 'player' && battleState.playerPokemon.hp > 0 && battleState.enemyPokemon.hp > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {battleState.playerPokemon.moves.map((move, index) => (
              <Button
                key={index}
                onClick={() => handleAttack(move)}
                disabled={battleState.isAnimating}
                className="h-16 bg-pokemon-green hover:bg-pokemon-green/80 text-pokemon-white font-pixel"
              >
                <div className="text-center">
                  <div>{move.name}</div>
                  <div className="text-xs">PP: {move.pp}/{move.maxPp}</div>
                </div>
              </Button>
            ))}
          </div>
        )}

        {/* Battle Log */}
        <Card className="bg-pokemon-white/90">
          <CardHeader>
            <CardTitle className="font-pixel text-pokemon-black">Лог битвы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 overflow-y-auto space-y-1">
              {battleState.battleLog.map((log, index) => (
                <p key={index} className="font-pixel text-sm text-pokemon-black">
                  {log}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderMap = () => (
    <div className="min-h-screen bg-pokemon-green p-4 font-pixel">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Button 
            onClick={() => setCurrentScreen('menu')}
            variant="outline"
            className="font-pixel"
          >
            <Icon name="ArrowLeft" className="mr-2" />
            Меню
          </Button>
          <h2 className="text-2xl text-pokemon-white font-pixel">КАРТА МИРА</h2>
        </div>
        
        <Card className="bg-pokemon-white/95">
          <CardContent className="p-6">
            <div className="aspect-video bg-cover bg-center rounded-lg mb-4"
                 style={{ backgroundImage: "url('/img/a5ecbdd3-b6dd-4215-b03f-3a6cf0604567.jpg')" }}>
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 bg-pokemon-red rounded-full animate-bounce flex items-center justify-center">
                  <span className="text-pokemon-white text-lg">🚶</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button className="bg-pokemon-blue hover:bg-pokemon-blue/80 text-pokemon-white font-pixel text-sm">
                Город Палет
              </Button>
              <Button className="bg-pokemon-red hover:bg-pokemon-red/80 text-pokemon-white font-pixel text-sm">
                Лес Виридиан
              </Button>
              <Button className="bg-pokemon-gray hover:bg-pokemon-gray/80 text-pokemon-white font-pixel text-sm">
                Пещера
              </Button>
              <Button className="bg-pokemon-yellow hover:bg-pokemon-yellow/80 text-pokemon-black font-pixel text-sm">
                Лига Покемонов
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPokedex = () => (
    <div className="min-h-screen bg-pokemon-red p-4 font-pixel">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Button 
            onClick={() => setCurrentScreen('menu')}
            variant="outline"
            className="font-pixel"
          >
            <Icon name="ArrowLeft" className="mr-2" />
            Меню
          </Button>
          <h2 className="text-2xl text-pokemon-white font-pixel">ПОКЕДЕКС</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { id: 1, name: 'Бульбазавр', type: 'Трава/Яд', caught: true },
            { id: 4, name: 'Чармандер', type: 'Огонь', caught: false },
            { id: 7, name: 'Сквиртл', type: 'Вода', caught: false },
            { id: 25, name: 'Пикачу', type: 'Электричество', caught: true },
            { id: 150, name: 'Мьюту', type: 'Психика', caught: false },
            { id: 151, name: 'Мью', type: 'Психика', caught: false }
          ].map((pokemon) => (
            <Card key={pokemon.id} className={`${pokemon.caught ? 'bg-pokemon-green' : 'bg-pokemon-gray'}`}>
              <CardHeader>
                <CardTitle className="text-pokemon-white font-pixel text-sm">
                  #{pokemon.id.toString().padStart(3, '0')} {pokemon.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-16 h-16 mx-auto mb-2 bg-pokemon-white rounded-lg flex items-center justify-center">
                  <span className="text-2xl">
                    {pokemon.caught ? '⚡' : '❓'}
                  </span>
                </div>
                <Badge variant="outline" className="font-pixel text-xs">
                  {pokemon.type}
                </Badge>
                {pokemon.caught && (
                  <div className="mt-2 text-pokemon-white font-pixel text-xs">
                    ✅ Поймано
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="min-h-screen bg-purple-900 p-4 font-pixel">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Button 
            onClick={() => setCurrentScreen('menu')}
            variant="outline"
            className="font-pixel"
          >
            <Icon name="ArrowLeft" className="mr-2" />
            Меню
          </Button>
          <h2 className="text-2xl text-pokemon-white font-pixel">ИНВЕНТАРЬ</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(player.items).map(([item, count]) => (
            <Card key={item} className="bg-pokemon-white/90">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-pokemon-gray rounded-lg flex items-center justify-center">
                  <span className="text-2xl">
                    {item.includes('шар') ? '⚾' : item.includes('зелье') ? '🧪' : '📦'}
                  </span>
                </div>
                <h3 className="font-pixel text-sm text-pokemon-black mb-1">{item}</h3>
                <Badge className="bg-pokemon-blue text-pokemon-white font-pixel">
                  {count}x
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="min-h-screen bg-orange-900 p-4 font-pixel">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Button 
            onClick={() => setCurrentScreen('menu')}
            variant="outline"
            className="font-pixel"
          >
            <Icon name="ArrowLeft" className="mr-2" />
            Меню
          </Button>
          <h2 className="text-2xl text-pokemon-white font-pixel">ПРОФИЛЬ ТРЕНЕРА</h2>
        </div>
        
        <Card className="bg-pokemon-white/95 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-pokemon-blue rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">🧑‍🚀</span>
              </div>
              <div>
                <h3 className="text-2xl font-pixel text-pokemon-black">{player.name}</h3>
                <p className="font-pixel text-pokemon-gray">Уровень: {player.level}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-pixel text-pokemon-red mb-1">{player.badges}</div>
                <div className="font-pixel text-sm text-pokemon-black">Значки</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-pixel text-pokemon-yellow mb-1">{player.money}₽</div>
                <div className="font-pixel text-sm text-pokemon-black">Деньги</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-pixel text-pokemon-green mb-1">{player.pokemon.length}</div>
                <div className="font-pixel text-sm text-pokemon-black">Покемоны</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-pixel text-pokemon-blue mb-1">{player.exp}</div>
                <div className="font-pixel text-sm text-pokemon-black">Опыт</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-pokemon-white/95">
          <CardHeader>
            <CardTitle className="font-pixel text-pokemon-black">ДОСТИЖЕНИЯ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Первый покемон', desc: 'Поймать первого покемона', completed: true },
                { name: 'Победитель лиги', desc: 'Стать чемпионом лиги', completed: false },
                { name: 'Мастер покемонов', desc: 'Поймать 50 покемонов', completed: false },
                { name: 'Коллекционер', desc: 'Заполнить 50% покедекса', completed: true }
              ].map((achievement, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded ${achievement.completed ? 'bg-pokemon-green' : 'bg-pokemon-gray'}`}
                >
                  <h4 className="font-pixel text-pokemon-white text-sm mb-1">
                    {achievement.completed ? '✅' : '❌'} {achievement.name}
                  </h4>
                  <p className="font-pixel text-pokemon-white text-xs">{achievement.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const screens = {
    menu: renderMenu,
    battle: renderBattle,
    map: renderMap,
    pokedex: renderPokedex,
    inventory: renderInventory,
    profile: renderProfile
  };

  return screens[currentScreen]();
};

export default PokemonGame;