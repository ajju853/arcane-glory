
import { useState } from 'react';
import { cn } from '@/lib/utils';

export type CardType = 'attack' | 'skill' | 'summon';

export interface CardProps {
  id: string;
  name: string;
  type: CardType;
  cost: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
  imageUrl: string;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  isInDeck?: boolean;
  className?: string;
}

const typeColorMap = {
  attack: 'from-red-500/70 to-red-900/70',
  skill: 'from-blue-500/70 to-blue-900/70',
  summon: 'from-green-500/70 to-green-900/70',
};

const rarityEffectMap = {
  common: '',
  rare: 'border-blue-400 shadow-blue-400/20',
  epic: 'border-purple-400 shadow-purple-400/30',
  legendary: 'border-yellow-400 shadow-yellow-400/40 animate-pulse-glow',
};

export function GameCard({
  id,
  name,
  type,
  cost,
  rarity,
  description,
  imageUrl,
  onClick,
  onDragStart,
  isInDeck = false,
  className,
}: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('card', JSON.stringify({ id, name, type, cost, rarity, description, imageUrl }));
    if (onDragStart) onDragStart(e);
    
    // Create a drag image
    const dragImg = document.createElement('div');
    dragImg.className = 'w-20 h-28 rounded-md bg-game-deep-purple border border-game-card-border flex items-center justify-center';
    dragImg.textContent = name;
    document.body.appendChild(dragImg);
    e.dataTransfer.setDragImage(dragImg, 40, 60);
    
    // Remove after drag completes
    setTimeout(() => {
      document.body.removeChild(dragImg);
    }, 0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Create particle effect on hover
    const card = document.getElementById(`card-${id}`);
    if (card && rarity === 'legendary') {
      for (let i = 0; i < 5; i++) {
        createParticle(card);
      }
    }
  };

  const createParticle = (parent: HTMLElement) => {
    const particle = document.createElement('div');
    particle.className = 'particle animate-particle-float';
    particle.style.width = `${Math.random() * 5 + 2}px`;
    particle.style.height = particle.style.width;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.setProperty('--random-x', `${(Math.random() - 0.5) * 100}px`);
    particle.style.setProperty('--random-y', `${(Math.random() - 0.5) * 100}px`);
    particle.style.setProperty('--random-duration', `${2 + Math.random() * 3}s`);
    parent.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
      parent.contains(particle) && parent.removeChild(particle);
    }, 5000);
  };

  return (
    <div
      id={`card-${id}`}
      className={cn(
        'relative group',
        isInDeck ? 'w-32 h-44' : 'w-40 h-56',
        className
      )}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      draggable
      onDragStart={handleDragStart}
    >
      <div
        className={cn(
          'absolute inset-0 transition-all duration-300',
          isHovered ? 'scale-105' : 'scale-100'
        )}
      >
        {/* Card Glow Effect */}
        <div 
          className={cn(
            'absolute -inset-0.5 bg-gradient-to-r from-game-neon-violet to-game-neon-teal rounded-lg blur-sm opacity-0 transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'opacity-0',
            rarityEffectMap[rarity]
          )}
        />

        {/* Card Front */}
        <div className="absolute inset-0 bg-card-gradient border-2 border-game-card-border rounded-lg shadow-xl overflow-hidden flex flex-col">
          {/* Cost Circle */}
          <div className="absolute top-1 left-1 w-8 h-8 bg-game-mana-blue rounded-full flex items-center justify-center text-white font-bold z-10 border border-white/30">
            {cost}
          </div>
          
          {/* Card Type Badge */}
          <div className={cn(
            'absolute top-1 right-1 px-2 py-0.5 rounded text-xs text-white font-bold bg-gradient-to-r z-10',
            typeColorMap[type]
          )}>
            {type.toUpperCase()}
          </div>

          {/* Card Image */}
          <div className="h-1/2 overflow-hidden">
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${imageUrl || 'https://placehold.co/400x300/1A1235/FFFFFF?text=' + name})`,
              }}
            />
          </div>

          {/* Card Name */}
          <div className="px-2 pt-1 font-cinzel font-bold text-sm text-white">
            {name}
          </div>

          {/* Card Description */}
          <div className="px-2 py-1 text-xs text-white/90 flex-grow overflow-y-auto">
            {description}
          </div>
          
          {/* Rarity Indicator */}
          {rarity !== 'common' && (
            <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full border"
              style={{
                backgroundColor: 
                  rarity === 'rare' ? '#3b82f6' : 
                  rarity === 'epic' ? '#8b5cf6' : 
                  '#eab308',
                boxShadow: `0 0 5px ${
                  rarity === 'rare' ? '#3b82f6' : 
                  rarity === 'epic' ? '#8b5cf6' : 
                  '#eab308'
                }`
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default GameCard;
