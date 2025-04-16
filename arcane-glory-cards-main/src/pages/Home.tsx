
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ParticleBackground } from '@/components/ParticleBackground';
import { GameTitle } from '@/components/GameTitle';
import { GameButton } from '@/components/GameButton';

export default function Home() {
  useEffect(() => {
    document.title = 'Arcane Glory Cards - Home';
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      <ParticleBackground />
      
      <div className="w-full max-w-4xl flex flex-col items-center justify-center gap-12 animate-fade-in">
        <GameTitle 
          title="Arcane Glory" 
          subtitle="Master the cards, claim your destiny" 
          className="mb-8"
        />
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8 w-full max-w-xl">
          <Link to="/battle" className="w-full">
            <GameButton glowColor="teal" className="w-full">
              Start Match
            </GameButton>
          </Link>
          
          <Link to="/deck-builder" className="w-full">
            <GameButton glowColor="violet" variant="secondary" className="w-full">
              Deck Builder
            </GameButton>
          </Link>
          
          <Link to="/profile" className="w-full">
            <GameButton glowColor="gold" variant="outline" className="w-full">
              Profile
            </GameButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
