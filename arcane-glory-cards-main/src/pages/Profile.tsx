
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ParticleBackground } from "@/components/ParticleBackground";
import { GameButton } from "@/components/GameButton";
import { ArrowLeft, Trophy, User, BarChart3, Clock } from "lucide-react";

export default function Profile() {
  useEffect(() => {
    document.title = "Arcane Glory Cards - Profile";
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <ParticleBackground className="opacity-30" />
      
      {/* Header */}
      <header className="p-4 flex justify-between items-center frosted-panel m-4 rounded-lg">
        <Link to="/">
          <GameButton variant="outline" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            <span>Back</span>
          </GameButton>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold font-cinzel text-center bg-gradient-to-r from-game-neon-gold to-white bg-clip-text text-transparent">
          Player Profile
        </h1>
        <div className="w-28">
          {/* Empty div for flex spacing */}
        </div>
      </header>
      
      <div className="flex-1 flex flex-col items-center p-4 gap-8">
        {/* Avatar and Player Info */}
        <div className="frosted-panel p-6 w-full max-w-md flex flex-col items-center relative">
          <div className="absolute -top-12 w-24 h-24 rounded-full border-4 border-game-neon-violet bg-gradient-to-b from-game-neon-teal/30 to-game-neon-violet/30 flex items-center justify-center">
            <User size={40} className="text-white" />
          </div>
          
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-cinzel font-bold text-white">Arcane Master</h2>
            <p className="text-white/70">Level 32 • Joined Apr 2025</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 w-full mt-6">
            <div className="flex flex-col items-center">
              <div className="text-game-neon-gold text-2xl font-bold">27</div>
              <div className="text-white/70 text-sm">Wins</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-white text-2xl font-bold">12</div>
              <div className="text-white/70 text-sm">Losses</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-game-neon-teal text-2xl font-bold">69%</div>
              <div className="text-white/70 text-sm">Win Rate</div>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
          <div className="frosted-panel p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Trophy className="text-game-neon-gold" />
              <h3 className="font-cinzel">Achievements</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>First Victory</span>
                <span className="text-game-neon-gold">✓</span>
              </div>
              <div className="flex justify-between">
                <span>Deck Master</span>
                <span className="text-game-neon-gold">✓</span>
              </div>
              <div className="flex justify-between">
                <span>Legendary Collection</span>
                <span className="text-white/50">7/10</span>
              </div>
              <div className="flex justify-between">
                <span>Perfect Game</span>
                <span className="text-white/50">0/1</span>
              </div>
            </div>
          </div>
          
          <div className="frosted-panel p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-game-neon-teal" />
              <h3 className="font-cinzel">Card Stats</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Cards Owned</span>
                <span>87/120</span>
              </div>
              <div className="flex justify-between">
                <span>Legendaries</span>
                <span>7/15</span>
              </div>
              <div className="flex justify-between">
                <span>Most Used</span>
                <span>Flame Strike</span>
              </div>
              <div className="flex justify-between">
                <span>Favorite Type</span>
                <span>Attack</span>
              </div>
            </div>
          </div>
          
          <div className="frosted-panel p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Clock className="text-game-neon-violet" />
              <h3 className="font-cinzel">Recent Activity</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Last Match</span>
                <span>Today</span>
              </div>
              <div className="flex justify-between">
                <span>Win Streak</span>
                <span>3 games</span>
              </div>
              <div className="flex justify-between">
                <span>Time Played</span>
                <span>23 hours</span>
              </div>
              <div className="flex justify-between">
                <span>Total Matches</span>
                <span>39</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Saved Decks */}
        <div className="frosted-panel p-4 w-full max-w-4xl">
          <h3 className="font-cinzel mb-4">Saved Decks</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-b from-game-neon-violet/20 to-transparent border border-game-neon-violet/30 rounded-lg p-4 hover:shadow-neon transition-shadow">
              <h4 className="font-cinzel text-game-neon-violet">Frost Mage</h4>
              <p className="text-sm text-white/70">30 cards - Control focused</p>
              <div className="mt-2 flex justify-between">
                <span className="text-xs text-white/50">Updated 2 days ago</span>
                <span className="text-xs text-game-neon-teal">17-5</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-b from-game-neon-teal/20 to-transparent border border-game-neon-teal/30 rounded-lg p-4 hover:shadow-neon-teal transition-shadow">
              <h4 className="font-cinzel text-game-neon-teal">Nature's Fury</h4>
              <p className="text-sm text-white/70">30 cards - Aggro deck</p>
              <div className="mt-2 flex justify-between">
                <span className="text-xs text-white/50">Updated 5 days ago</span>
                <span className="text-xs text-game-neon-teal">8-3</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-b from-game-neon-gold/20 to-transparent border border-game-neon-gold/30 rounded-lg p-4 hover:shadow-neon-gold transition-shadow">
              <h4 className="font-cinzel text-game-neon-gold">Holy Light</h4>
              <p className="text-sm text-white/70">30 cards - Combo deck</p>
              <div className="mt-2 flex justify-between">
                <span className="text-xs text-white/50">Updated 1 week ago</span>
                <span className="text-xs text-game-neon-teal">12-4</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
