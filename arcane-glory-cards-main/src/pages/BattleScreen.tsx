import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ParticleBackground } from '@/components/ParticleBackground';
import { GameButton } from '@/components/GameButton';
import GameCard, { CardProps } from '@/components/GameCard';
import { ArrowLeft, Shield, Zap, Flame, RotateCw, Trophy } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface PlayerState {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  hand: CardProps[];
  board: CardProps[];
}

export default function BattleScreen() {
  const [player1, setPlayer1] = useState<PlayerState>({
    health: 30,
    maxHealth: 30,
    mana: 10,
    maxMana: 10,
    hand: [],
    board: []
  });
  
  const [player2, setPlayer2] = useState<PlayerState>({
    health: 30,
    maxHealth: 30,
    mana: 10,
    maxMana: 10,
    hand: [],
    board: []
  });
  
  const [activePlayer, setActivePlayer] = useState<1 | 2>(1);
  const [logs, setLogs] = useState<string[]>([]);
  const [isLogExpanded, setIsLogExpanded] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const [winner, setWinner] = useState<1 | 2 | null>(null);
  
  const MOCK_CARDS: CardProps[] = Array.from({ length: 10 }, (_, i) => ({
    id: `hand-card-${i}`,
    name: `Card ${i + 1}`,
    type: ['attack', 'skill', 'summon'][Math.floor(Math.random() * 3)] as any,
    cost: Math.floor(Math.random() * 5) + 1,
    rarity: ['common', 'rare', 'epic', 'legendary'][Math.floor(Math.random() * 4)] as any,
    description: `This is card ${i + 1}'s description with some game effect description that takes space.`,
    imageUrl: `https://placehold.co/400x300/1A1235/FFFFFF?text=Card${i + 1}`
  }));
  
  useEffect(() => {
    document.title = 'Arcane Glory Cards - Battle';
    
    setPlayer1(prev => ({
      ...prev,
      hand: MOCK_CARDS.slice(0, 5)
    }));
    
    setPlayer2(prev => ({
      ...prev,
      hand: MOCK_CARDS.slice(5, 10)
    }));
    
    addLog("Battle has begun! Player 1 goes first.");
  }, []);
  
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);
  
  useEffect(() => {
    if (activePlayer === 2 && !winner) {
      console.log("AI's turn - planning to play a card");
      const aiPlayTimeout = setTimeout(() => {
        console.log("AI attempting to play a random card");
        const aiPlayer = {...player2};
        
        if (aiPlayer.hand.length === 0) {
          addLog("AI Player has no cards to play.");
          endTurn();
          return;
        }
        
        const playableCards = aiPlayer.hand.filter(card => card.cost <= aiPlayer.mana);
        console.log(`AI has ${playableCards.length} playable cards out of ${aiPlayer.hand.length} total cards`);
        
        if (playableCards.length === 0) {
          addLog("AI Player has no playable cards.");
          endTurn();
          return;
        }
        
        const randomIndex = Math.floor(Math.random() * playableCards.length);
        const chosenCard = playableCards[randomIndex];
        console.log(`AI chose to play: ${chosenCard.name} (cost: ${chosenCard.cost}, mana: ${aiPlayer.mana})`);
        
        addLog(`AI is thinking about playing ${chosenCard.name}...`);
        
        if (!chosenCard.id) {
          chosenCard.id = `ai-card-${Date.now()}`;
        }
        
        const aiCardElement = document.createElement('div');
        aiCardElement.id = `card-${chosenCard.id}`;
        aiCardElement.style.position = 'absolute';
        aiCardElement.style.top = '-1000px';
        aiCardElement.style.left = '-1000px';
        document.body.appendChild(aiCardElement);
        
        setTimeout(() => {
          handleCardPlay(chosenCard, 2);
          
          if (document.body.contains(aiCardElement)) {
            document.body.removeChild(aiCardElement);
          }
          
          setTimeout(() => {
            endTurn();
          }, 1500);
        }, 1000);
      }, 1500);
      
      return () => clearTimeout(aiPlayTimeout);
    }
  }, [activePlayer, winner]);
  
  const addLog = (message: string) => {
    setLogs(prev => [...prev, message]);
  };
  
  const handleCardPlay = (card: CardProps, playerId: 1 | 2) => {
    console.log(`handleCardPlay called for player ${playerId}, card: ${card.name}`);
    
    if (playerId !== activePlayer) {
      console.log("Not this player's turn");
      toast({
        title: "Not your turn",
        description: `It's Player ${activePlayer}'s turn.`,
        variant: "destructive"
      });
      return;
    }
    
    const player = playerId === 1 ? player1 : player2;
    if (player.mana < card.cost) {
      console.log("Not enough mana");
      toast({
        title: "Not enough mana",
        description: `You need ${card.cost} mana to play this card.`,
        variant: "destructive"
      });
      return;
    }
    
    const cardElement = document.getElementById(`card-${card.id}`);
    const boardCenter = document.getElementById('board-center');
    
    if (cardElement && boardCenter) {
      const clone = cardElement.cloneNode(true) as HTMLElement;
      const rect = cardElement.getBoundingClientRect();
      const targetRect = boardCenter.getBoundingClientRect();
      
      clone.style.position = 'fixed';
      clone.style.top = `${rect.top}px`;
      clone.style.left = `${rect.left}px`;
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.zIndex = '100';
      clone.style.transition = 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)';
      clone.style.pointerEvents = 'none';
      document.body.appendChild(clone);
      
      setTimeout(() => {
        clone.style.top = `${targetRect.top + targetRect.height / 2 - rect.height / 2}px`;
        clone.style.left = `${targetRect.left + targetRect.width / 2 - rect.width / 2}px`;
        clone.style.transform = 'scale(1.2)';
        
        setTimeout(() => {
          const burst = document.createElement('div');
          burst.style.position = 'fixed';
          burst.style.top = `${targetRect.top + targetRect.height / 2}px`;
          burst.style.left = `${targetRect.left + targetRect.width / 2}px`;
          burst.style.width = '0';
          burst.style.height = '0';
          burst.style.borderRadius = '50%';
          burst.style.backgroundColor = card.type === 'attack' ? '#FF4136' : 
                                       card.type === 'skill' ? '#1E90FF' : 
                                       '#32CD32';
          burst.style.transform = 'translate(-50%, -50%)';
          burst.style.zIndex = '101';
          burst.style.boxShadow = `0 0 20px ${
            card.type === 'attack' ? '#FF4136' : 
            card.type === 'skill' ? '#1E90FF' : 
            '#32CD32'
          }`;
          burst.style.transition = 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)';
          document.body.appendChild(burst);
          
          setTimeout(() => {
            burst.style.width = '300px';
            burst.style.height = '300px';
            burst.style.opacity = '0';
            
            setTimeout(() => {
              if (document.body.contains(burst)) {
                document.body.removeChild(burst);
              }
            }, 500);
          }, 10);
          
          if (document.body.contains(clone)) {
            document.body.removeChild(clone);
          }
          
          if (playerId === 1) {
            setPlayer1(prev => ({
              ...prev,
              hand: prev.hand.filter(c => c.id !== card.id),
              mana: prev.mana - card.cost,
              board: [...prev.board, card]
            }));
          } else {
            setPlayer2(prev => ({
              ...prev,
              hand: prev.hand.filter(c => c.id !== card.id),
              mana: prev.mana - card.cost,
              board: [...prev.board, card]
            }));
          }
          
          addLog(`Player ${playerId} played ${card.name} (${card.cost} mana).`);
          
          applyCardEffect(card, playerId);
        }, 500);
      }, 10);
    } else {
      console.log(`Card element (${card.id}) or board center not found`);
      if (playerId === 1) {
        setPlayer1(prev => ({
          ...prev,
          hand: prev.hand.filter(c => c.id !== card.id),
          mana: prev.mana - card.cost,
          board: [...prev.board, card]
        }));
      } else {
        setPlayer2(prev => ({
          ...prev,
          hand: prev.hand.filter(c => c.id !== card.id),
          mana: prev.mana - card.cost,
          board: [...prev.board, card]
        }));
      }
      
      addLog(`Player ${playerId} played ${card.name} (${card.cost} mana).`);
      
      applyCardEffect(card, playerId);
    }
  };
  
  const applyCardEffect = (card: CardProps, playerId: 1 | 2) => {
    const opponent = playerId === 1 ? 2 : 1;
    
    if (card.type === 'attack') {
      const damage = card.cost + 2;
      
      if (opponent === 1) {
        setPlayer1(prev => {
          const newHealth = Math.max(0, prev.health - damage);
          if (newHealth <= 0) {
            declareWinner(2);
          }
          return {
            ...prev,
            health: newHealth
          };
        });
      } else {
        setPlayer2(prev => {
          const newHealth = Math.max(0, prev.health - damage);
          if (newHealth <= 0) {
            declareWinner(1);
          }
          return {
            ...prev,
            health: newHealth
          };
        });
      }
      
      addLog(`${card.name} deals ${damage} damage to Player ${opponent}.`);
      
      const opponentAvatar = document.getElementById(`player${opponent}-avatar`);
      if (opponentAvatar) {
        const damageText = document.createElement('div');
        damageText.className = 'text-red-500 font-bold text-2xl';
        damageText.textContent = `-${damage}`;
        damageText.style.position = 'absolute';
        damageText.style.top = '50%';
        damageText.style.left = '50%';
        damageText.style.transform = 'translate(-50%, -50%)';
        damageText.style.zIndex = '100';
        damageText.style.textShadow = '0 0 10px rgba(255, 0, 0, 0.7)';
        opponentAvatar.appendChild(damageText);
        
        setTimeout(() => {
          damageText.style.transition = 'all 1s ease-out';
          damageText.style.transform = 'translate(-50%, -100px)';
          damageText.style.opacity = '0';
          
          const flash = document.createElement('div');
          flash.style.position = 'fixed';
          flash.style.top = '0';
          flash.style.left = '0';
          flash.style.width = '100%';
          flash.style.height = '100%';
          flash.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
          flash.style.zIndex = '90';
          flash.style.pointerEvents = 'none';
          document.body.appendChild(flash);
          
          setTimeout(() => {
            document.body.removeChild(flash);
            if (opponentAvatar.contains(damageText)) {
              opponentAvatar.removeChild(damageText);
            }
          }, 300);
        }, 10);
      }
    } else if (card.type === 'skill') {
      if (playerId === 1) {
        setPlayer1(prev => ({
          ...prev,
          mana: Math.min(prev.maxMana, prev.mana + 2)
        }));
      } else {
        setPlayer2(prev => ({
          ...prev,
          mana: Math.min(prev.maxMana, prev.mana + 2)
        }));
      }
      
      addLog(`${card.name} restores 2 mana to Player ${playerId}.`);
    } else if (card.type === 'summon') {
      addLog(`${card.name} was summoned to the battlefield.`);
    }
    
    if (player1.health <= 0) {
      setTimeout(() => {
        toast({
          title: "Game Over",
          description: "Player 2 wins!",
        });
      }, 1000);
    } else if (player2.health <= 0) {
      setTimeout(() => {
        toast({
          title: "Game Over",
          description: "Player 1 wins!",
        });
      }, 1000);
    }
  };
  
  const declareWinner = (playerNumber: 1 | 2) => {
    setWinner(playerNumber);
    addLog(`Player ${playerNumber} has won the match!`);
  };
  
  const playAgain = () => {
    setPlayer1({
      health: 30,
      maxHealth: 30,
      mana: 10,
      maxMana: 10,
      hand: MOCK_CARDS.slice(0, 5),
      board: []
    });
    
    setPlayer2({
      health: 30,
      maxHealth: 30,
      mana: 10,
      maxMana: 10,
      hand: MOCK_CARDS.slice(5, 10),
      board: []
    });
    
    setActivePlayer(1);
    setLogs([]);
    setWinner(null);
    addLog("Battle has begun! Player 1 goes first.");
  };
  
  const endTurn = () => {
    console.log(`Player ${activePlayer} is ending their turn`);
    
    const newCard: CardProps = {
      id: `drawn-${Date.now()}`,
      name: `New Card ${Date.now() % 100}`,
      type: ['attack', 'skill', 'summon'][Math.floor(Math.random() * 3)] as any,
      cost: Math.floor(Math.random() * 5) + 1,
      rarity: ['common', 'rare', 'epic'][Math.floor(Math.random() * 3)] as any,
      description: "A newly drawn card with some effects.",
      imageUrl: `https://placehold.co/400x300/1A1235/FFFFFF?text=New`
    };
    
    const nextPlayer = activePlayer === 1 ? 2 : 1;
    console.log(`Next player will be: ${nextPlayer}`);
    
    if (nextPlayer === 1) {
      setPlayer1(prev => ({
        ...prev,
        hand: [...prev.hand, newCard],
        mana: prev.maxMana
      }));
    } else {
      setPlayer2(prev => ({
        ...prev,
        hand: [...prev.hand, newCard],
        mana: prev.maxMana
      }));
    }
    
    addLog(`Player ${activePlayer} ended their turn. Player ${nextPlayer}'s turn begins.`);
    
    setActivePlayer(nextPlayer as 1 | 2);
    
    const turnIndicator = document.createElement('div');
    turnIndicator.className = 'fixed inset-0 flex items-center justify-center z-50 pointer-events-none';
    turnIndicator.innerHTML = `
      <div class="bg-black/50 backdrop-blur-sm px-8 py-4 rounded-lg">
        <h2 class="text-3xl font-cinzel text-white">Player ${nextPlayer}'s Turn</h2>
      </div>
    `;
    document.body.appendChild(turnIndicator);
    
    turnIndicator.style.opacity = '0';
    turnIndicator.style.transition = 'all 0.5s ease-in-out';
    
    setTimeout(() => {
      turnIndicator.style.opacity = '1';
      
      setTimeout(() => {
        turnIndicator.style.opacity = '0';
        
        setTimeout(() => {
          if (document.body.contains(turnIndicator)) {
            document.body.removeChild(turnIndicator);
          }
        }, 500);
      }, 1500);
    }, 10);
  };
  
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <ParticleBackground className="opacity-30" />
      
      {winner && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center animate-fade-in">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-b from-game-neon-gold to-orange-500 animate-pulse">
              <Trophy size={48} className="text-white animate-scale-in" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold font-cinzel mb-4 text-white">
              <span className="bg-gradient-to-r from-game-neon-gold to-orange-400 bg-clip-text text-transparent">
                Player {winner} Wins!
              </span>
            </h1>
            
            <p className="text-white/80 text-lg mb-8">
              Victory has been claimed in the Arcane Glory arena
            </p>
            
            <div className="flex gap-4 flex-wrap justify-center">
              <GameButton onClick={playAgain} glowColor="teal">
                Play Again
              </GameButton>
              
              <Link to="/">
                <GameButton variant="outline" glowColor="violet">
                  Main Menu
                </GameButton>
              </Link>
            </div>
          </div>
        </div>
      )}
      
      <header className="p-2 flex justify-between items-center">
        <Link to="/">
          <GameButton variant="outline" className="flex items-center gap-2 text-sm" glowColor="violet">
            <ArrowLeft size={16} />
            <span>Leave Game</span>
          </GameButton>
        </Link>
        
        <h1 className="text-xl md:text-2xl font-bold font-cinzel text-center bg-gradient-to-r from-game-neon-gold to-white bg-clip-text text-transparent">
          Battle Arena
        </h1>
        
        <GameButton
          onClick={endTurn}
          className="flex items-center gap-2 text-sm"
          glowColor="gold"
        >
          <span>End Turn</span>
          <RotateCw size={16} />
        </GameButton>
      </header>
      
      <div className="flex flex-col flex-1">
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-2">
            <div
              id="player2-avatar"
              className={cn(
                "relative w-12 h-12 rounded-full border-2 overflow-hidden",
                activePlayer === 2 ? "border-game-neon-gold animate-pulse" : "border-gray-500"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-purple-900 to-blue-900 flex items-center justify-center">
                <span className="text-white font-bold">P2</span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-1 items-center">
              <div className="flex items-center space-x-2">
                <Shield className="text-red-500" size={16} />
                <div className="w-32 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="health-bar transition-all duration-300"
                    style={{ width: `${(player2.health / player2.maxHealth) * 100}%` }}
                  />
                </div>
                <span className="text-white text-sm">{player2.health}/{player2.maxHealth}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Zap className="text-blue-500" size={16} />
                <div className="w-32 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="mana-bar transition-all duration-300"
                    style={{ width: `${(player2.mana / player2.maxMana) * 100}%` }}
                  />
                </div>
                <span className="text-white text-sm">{player2.mana}/{player2.maxMana}</span>
              </div>
            </div>
          </div>
          
          <div className="frosted-panel mx-4 p-4 flex justify-center min-h-[100px]">
            {player2.board.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-2">
                {player2.board.map(card => (
                  <div key={card.id} className="scale-75 origin-center">
                    <GameCard {...card} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-white/30 flex items-center">
                <span>No cards on the board</span>
              </div>
            )}
          </div>
          
          <div className="relative h-12 overflow-visible flex justify-center">
            {player2.hand.map((_, i) => (
              <div
                key={i}
                className="absolute w-10 h-14 bg-game-deep-purple border border-game-card-border rounded-md shadow-md"
                style={{
                  transform: `translateX(${(i - player2.hand.length / 2) * 20}px) rotate(${(i - player2.hand.length / 2) * -5}deg)`,
                  zIndex: i
                }}
              />
            ))}
          </div>
        </div>
        
        <div id="board-center" className="h-8 relative">
          <Separator className="absolute inset-0 m-auto h-0.5 bg-gradient-to-r from-transparent via-game-neon-teal to-transparent animate-pulse-glow" />
        </div>
        
        <div className="flex-1 flex flex-col-reverse">
          <div className="relative h-36 md:h-40 overflow-visible flex justify-center mb-2">
            {player1.hand.map((card, i) => (
              <div
                key={card.id}
                style={{
                  transform: `translateX(${(i - player1.hand.length / 2) * 60}px) rotate(${(i - player1.hand.length / 2) * 5}deg)`,
                  transformOrigin: 'bottom center',
                  zIndex: i,
                  transition: 'transform 0.2s ease-out'
                }}
                className="absolute bottom-0 hover:translate-y-[-20px] hover:scale-110 hover:z-50 transition-all duration-200"
                onMouseEnter={(e) => {
                  e.currentTarget.style.zIndex = '50';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.zIndex = String(i);
                }}
              >
                <GameCard
                  {...card}
                  onClick={() => handleCardPlay(card, 1)}
                />
              </div>
            ))}
          </div>
          
          <div className="frosted-panel mx-4 p-4 flex justify-center min-h-[100px]">
            {player1.board.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-2">
                {player1.board.map(card => (
                  <div key={card.id} className="scale-75 origin-center">
                    <GameCard {...card} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-white/30 flex items-center">
                <span>No cards on the board</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between p-2">
            <div
              id="player1-avatar"
              className={cn(
                "relative w-12 h-12 rounded-full border-2 overflow-hidden",
                activePlayer === 1 ? "border-game-neon-gold animate-pulse" : "border-gray-500"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-green-900 to-blue-900 flex items-center justify-center">
                <span className="text-white font-bold">P1</span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-1 items-center">
              <div className="flex items-center space-x-2">
                <Shield className="text-red-500" size={16} />
                <div className="w-32 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="health-bar transition-all duration-300"
                    style={{ width: `${(player1.health / player1.maxHealth) * 100}%` }}
                  />
                </div>
                <span className="text-white text-sm">{player1.health}/{player1.maxHealth}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Zap className="text-blue-500" size={16} />
                <div className="w-32 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="mana-bar transition-all duration-300"
                    style={{ width: `${(player1.mana / player1.maxMana) * 100}%` }}
                  />
                </div>
                <span className="text-white text-sm">{player1.mana}/{player1.maxMana}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div
        className={cn(
          "fixed bottom-0 right-0 w-full md:w-64 bg-gradient-to-t from-black/90 to-black/70 backdrop-blur-md transition-all duration-300 ease-in-out",
          isLogExpanded ? "h-64" : "h-8"
        )}
      >
        <div 
          className="h-8 flex items-center justify-between px-4 cursor-pointer"
          onClick={() => setIsLogExpanded(!isLogExpanded)}
        >
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-game-neon-gold" />
            <span className="text-white font-cinzel">Battle Log</span>
          </div>
          <div className="w-4 h-4 border-t-2 border-r-2 border-white/70 transition-transform duration-300"
            style={{ transform: isLogExpanded ? 'rotate(-45deg)' : 'rotate(135deg)' }}
          />
        </div>
        
        {isLogExpanded && (
          <div 
            ref={logRef}
            className="h-[calc(100%-2rem)] overflow-y-auto px-4 py-2 text-sm text-white/80 space-y-1"
          >
            {logs.map((log, i) => (
              <div key={i} className="animate-fade-in">
                {log}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
