import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ParticleBackground } from '@/components/ParticleBackground';
import { GameButton } from '@/components/GameButton';
import GameCard, { CardProps, CardType } from '@/components/GameCard';
import { toast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, X } from 'lucide-react';

const CARD_DATA: CardProps[] = Array.from({ length: 40 }, (_, i) => {
  const types: CardType[] = ['attack', 'skill', 'summon'];
  const rarities = ['common', 'common', 'common', 'rare', 'rare', 'epic', 'legendary'];
  const type = types[Math.floor(Math.random() * types.length)];
  const names = {
    attack: ['Firebolt', 'Ice Spike', 'Thunder Strike', 'Venomous Blade', 'Shadow Slash', 'Meteor Strike', 'Flame Wave'],
    skill: ['Arcane Shield', 'Time Warp', 'Healing Aura', 'Mind Control', 'Frost Nova', 'Magic Missile', 'Stealth'],
    summon: ['Fire Elemental', 'Water Sprite', 'Earth Golem', 'Wind Serpent', 'Shadow Assassin', 'Light Guardian', 'Dragon Whelp']
  };
  
  const nameList = names[type];
  const name = nameList[Math.floor(Math.random() * nameList.length)];
  const rarity = rarities[Math.floor(Math.random() * rarities.length)] as 'common' | 'rare' | 'epic' | 'legendary';
  
  const descriptions = {
    attack: [
      'Deal 3 damage to an enemy',
      'Deal 5 damage to the opponent',
      'Deal 2 damage to all enemy minions',
      'Deal 4 damage and draw a card'
    ],
    skill: [
      'Gain a shield that absorbs 5 damage',
      'Draw 2 cards',
      'Restore 4 health to your hero',
      'Your next spell costs 2 less'
    ],
    summon: [
      'Summon a 3/3 minion',
      'Summon a 2/5 minion with Taunt',
      'Summon a 4/2 minion with Charge',
      'Summon two 1/1 minions with Shield'
    ]
  };
  
  return {
    id: `card-${i}`,
    name: `${name} ${i+1}`,
    type,
    cost: Math.floor(Math.random() * 8) + 1,
    rarity,
    description: descriptions[type][Math.floor(Math.random() * descriptions[type].length)],
    imageUrl: `https://placehold.co/400x300/1A1235/FFFFFF?text=${name}`
  };
});

export default function DeckBuilder() {
  const [deck, setDeck] = useState<CardProps[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const MAX_DECK_SIZE = 30;

  useEffect(() => {
    document.title = 'Arcane Glory Cards - Deck Builder';
  }, []);

  const handleAddToDeck = (card: CardProps) => {
    if (deck.length >= MAX_DECK_SIZE) {
      toast({
        title: "Deck is full",
        description: `You can't add more than ${MAX_DECK_SIZE} cards to your deck.`,
        variant: "destructive"
      });
      return;
    }
    
    setDeck([...deck, card]);
    
    toast({
      title: "Card Added",
      description: `Added ${card.name} to your deck`,
    });
  };

  const handleRemoveFromDeck = (cardId: string) => {
    setDeck(deck.filter(card => card.id !== cardId));
    toast({
      title: "Card Removed",
      description: "Card removed from your deck"
    });
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      const cardData = JSON.parse(e.dataTransfer.getData('card'));
      
      if (deck.length >= MAX_DECK_SIZE) {
        toast({
          title: "Deck is full",
          description: `You can't add more than ${MAX_DECK_SIZE} cards to your deck.`,
          variant: "destructive"
        });
        return;
      }
      
      if (deck.some(card => card.id === cardData.id)) {
        toast({
          title: "Card already in deck",
          description: `${cardData.name} is already in your deck.`,
          variant: "destructive"
        });
        return;
      }
      
      setDeck([...deck, cardData]);
      
      const deckArea = document.getElementById('deck-area');
      if (deckArea) {
        const rect = deckArea.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const card = document.createElement('div');
        card.className = 'absolute w-40 h-56 bg-card-gradient border-2 border-game-card-border rounded-lg shadow-lg';
        card.style.left = `${e.clientX - 70}px`;
        card.style.top = `${e.clientY - 100}px`;
        card.style.transition = 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)';
        card.style.zIndex = '100';
        card.style.opacity = '0.8';
        document.body.appendChild(card);
        
        void card.offsetWidth;
        
        card.style.left = `${centerX - 20}px`;
        card.style.top = `${centerY - 28}px`;
        card.style.transform = 'scale(0.5)';
        card.style.opacity = '0';
        
        setTimeout(() => {
          if (document.body.contains(card)) {
            document.body.removeChild(card);
          }
        }, 500);
      }
      
      toast({
        title: "Card Added",
        description: `Added ${cardData.name} to your deck`,
      });
    } catch (err) {
      console.error("Error adding card to deck", err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const deckArea = document.getElementById('deck-area');
    if (deckArea) {
      deckArea.classList.add('ring-2', 'ring-game-neon-teal', 'scale-105');
    }
  };

  const handleDragLeave = () => {
    const deckArea = document.getElementById('deck-area');
    if (deckArea) {
      deckArea.classList.remove('ring-2', 'ring-game-neon-teal', 'scale-105');
    }
  };

  const handleSaveDeck = () => {
    const saveBtn = document.getElementById('save-deck-btn');
    if (saveBtn) {
      saveBtn.classList.add('scale-110');
      setTimeout(() => saveBtn.classList.remove('scale-110'), 200);
    }
    
    toast({
      title: "Deck Saved",
      description: `Your deck with ${deck.length} cards has been saved.`
    });
    
    const btnRect = saveBtn?.getBoundingClientRect();
    if (btnRect) {
      for (let i = 0; i < 20; i++) {
        createSaveParticle(btnRect);
      }
    }
  };
  
  const createSaveParticle = (rect: DOMRect) => {
    const particle = document.createElement('div');
    const size = Math.random() * 8 + 3;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 100 + 50;
    const duration = Math.random() * 1 + 0.5;
    
    particle.style.position = 'fixed';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.borderRadius = '50%';
    particle.style.backgroundColor = '#00FFCC';
    particle.style.boxShadow = '0 0 10px #00FFCC';
    particle.style.top = `${centerY}px`;
    particle.style.left = `${centerX}px`;
    particle.style.transform = 'translate(-50%, -50%)';
    particle.style.zIndex = '100';
    particle.style.pointerEvents = 'none';
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
      particle.style.transition = `all ${duration}s ease-out`;
      particle.style.transform = `translate(
        calc(-50% + ${Math.cos(angle) * distance}px),
        calc(-50% + ${Math.sin(angle) * distance}px)
      ) scale(0)`;
      particle.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
      if (document.body.contains(particle)) {
        document.body.removeChild(particle);
      }
    }, duration * 1000);
  };

  const filteredCards = selectedTab === "all" 
    ? CARD_DATA 
    : CARD_DATA.filter(card => card.type === selectedTab);
    
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <ParticleBackground className="opacity-30" />
      
      <header className="p-4 flex justify-between items-center frosted-panel m-4 rounded-lg">
        <Link to="/">
          <GameButton variant="outline" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            <span>Back</span>
          </GameButton>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold font-cinzel text-center bg-gradient-to-r from-game-neon-gold to-white bg-clip-text text-transparent">
          Deck Builder
        </h1>
        <div className="w-28">
          {/* Empty div for flex spacing */}
        </div>
      </header>
      
      <div className="flex flex-col md:flex-row flex-1 gap-4 p-4">
        <div className="w-full md:w-2/3 frosted-panel p-4 rounded-lg flex flex-col">
          <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
            <TabsList className="w-full mb-4 grid grid-cols-4">
              <TabsTrigger value="all">All Cards</TabsTrigger>
              <TabsTrigger value="attack">Attack</TabsTrigger>
              <TabsTrigger value="skill">Skill</TabsTrigger>
              <TabsTrigger value="summon">Summon</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedTab} className="mt-0 pt-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto" style={{maxHeight: 'calc(100vh - 250px)'}}>
                {filteredCards.map(card => (
                  <GameCard
                    key={card.id}
                    {...card}
                    onClick={() => handleAddToDeck(card)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div 
          id="deck-area"
          className="w-full md:w-1/3 frosted-panel p-4 rounded-lg flex flex-col transition-all duration-300"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <h2 className="text-xl font-cinzel mb-4 text-center">Your Deck</h2>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-white/70">Cards: {deck.length}/{MAX_DECK_SIZE}</span>
            <Progress 
              value={(deck.length / MAX_DECK_SIZE) * 100} 
              className="h-2 flex-1 mx-2 bg-secondary [&>div]:bg-gradient-to-r [&>div]:from-game-neon-teal [&>div]:to-game-neon-violet"
            />
          </div>
          
          {deck.length > 0 ? (
            <div className="overflow-y-auto flex-1" style={{maxHeight: 'calc(100vh - 300px)'}}>
              <div className="grid grid-cols-2 gap-3">
                {deck.map(card => (
                  <div key={card.id} className="relative group">
                    <GameCard {...card} isInDeck={true} />
                    <button
                      onClick={() => handleRemoveFromDeck(card.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-white/50 border-2 border-dashed border-white/20 rounded-lg p-6">
              <p className="text-center">Drag and drop cards here to build your deck</p>
            </div>
          )}
          
          <div className="mt-4">
            <GameButton
              id="save-deck-btn"
              onClick={handleSaveDeck}
              className="w-full group transition-all"
              glowColor="teal"
            >
              <div className="flex items-center justify-center gap-2">
                <Save size={16} className="group-hover:animate-pulse" />
                <span>Save Deck</span>
              </div>
            </GameButton>
          </div>
        </div>
      </div>
    </div>
  );
}
