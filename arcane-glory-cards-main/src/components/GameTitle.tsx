
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface GameTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  animate?: boolean;
}

export function GameTitle({ title, subtitle, className, animate = true }: GameTitleProps) {
  const titleRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!animate || hasAnimated || !titleRef.current) return;

    const titleElement = titleRef.current;
    
    // Wait a bit for the component to mount properly
    const timeoutId = setTimeout(() => {
      // Initial setup
      titleElement.style.opacity = '0';
      titleElement.style.transform = 'scale(0.8)';
      
      // Create particles
      const createParticles = () => {
        const rect = titleElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create particle container if it doesn't exist
        let container = document.getElementById('title-particles');
        if (!container) {
          container = document.createElement('div');
          container.id = 'title-particles';
          container.style.position = 'absolute';
          container.style.top = '0';
          container.style.left = '0';
          container.style.width = '100%';
          container.style.height = '100%';
          container.style.pointerEvents = 'none';
          container.style.zIndex = '50';
          document.body.appendChild(container);
        }
        
        // Create multiple particles
        for (let i = 0; i < 30; i++) {
          createParticle(container, centerX, centerY);
        }
      };
      
      const createParticle = (container: HTMLElement, x: number, y: number) => {
        const particle = document.createElement('div');
        const size = Math.random() * 10 + 2;
        const duration = Math.random() * 1 + 1;
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        const colors = ['#00FFCC', '#8A2BE2', '#FFD700'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Set styles
        particle.style.position = 'absolute';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = color;
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = `0 0 ${size}px ${color}`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.opacity = '1';
        particle.style.pointerEvents = 'none';
        particle.style.transform = 'translate(-50%, -50%)';
        particle.style.transition = `all ${duration}s cubic-bezier(0.165, 0.84, 0.44, 1)`;
        
        // Append to container
        container.appendChild(particle);
        
        // Force reflow
        void particle.offsetWidth;
        
        // Animate out
        requestAnimationFrame(() => {
          particle.style.opacity = '0';
          particle.style.transform = `translate(
            calc(-50% + ${Math.cos(angle) * distance}px), 
            calc(-50% + ${Math.sin(angle) * distance}px)
          ) scale(0.5)`;
        });
        
        // Remove after animation completes
        setTimeout(() => {
          if (container.contains(particle)) {
            container.removeChild(particle);
          }
        }, duration * 1000);
      };
      
      // Animate in
      setTimeout(() => {
        titleElement.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
        titleElement.style.opacity = '1';
        titleElement.style.transform = 'scale(1)';
        
        // Create particle effect
        createParticles();
      }, 300);
      
      setHasAnimated(true);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [animate, hasAnimated]);

  return (
    <div 
      ref={titleRef}
      className={cn('text-center transition-all', className)}
    >
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-cinzel bg-gradient-to-r from-game-neon-gold via-white to-game-neon-teal bg-clip-text text-transparent drop-shadow-md">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-lg md:text-xl text-white/80 font-cinzel">
          {subtitle}
        </p>
      )}
    </div>
  );
}
