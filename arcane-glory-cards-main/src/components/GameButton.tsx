
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface GameButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  glowColor?: 'teal' | 'violet' | 'gold';
  children: React.ReactNode;
}

export function GameButton({ 
  className, 
  variant = 'primary', 
  glowColor = 'teal',
  children,
  ...props 
}: GameButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  const glowMap = {
    teal: 'shadow-neon-teal before:from-game-neon-teal before:to-transparent',
    violet: 'shadow-neon before:from-game-neon-violet before:to-transparent',
    gold: 'shadow-neon-gold before:from-game-neon-gold before:to-transparent'
  };
  
  const variantClasses = {
    primary: 'bg-gradient-to-b from-primary/80 to-primary/30 text-white',
    secondary: 'bg-gradient-to-b from-secondary/80 to-secondary/30 text-white',
    outline: 'bg-transparent border-2 border-white/20 text-white'
  };

  return (
    <button
      className={cn(
        'relative font-cinzel px-6 py-2.5 rounded-lg backdrop-blur-md',
        'transition-all duration-300 overflow-hidden',
        variantClasses[variant],
        isHovered ? `${glowMap[glowColor]} scale-105` : '',
        isPressed ? 'scale-95' : '',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      {...props}
    >
      {/* Glow effect overlay */}
      <span 
        className={cn(
          'absolute inset-0 bg-gradient-to-t opacity-0 transition-opacity duration-300 rounded-lg',
          isHovered ? 'opacity-20' : ''
        )}
      />
      
      {/* Button content */}
      <span className="relative z-10 font-bold tracking-wider">{children}</span>
    </button>
  );
}
