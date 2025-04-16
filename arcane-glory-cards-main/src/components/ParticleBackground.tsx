
import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
}

interface ParticleBackgroundProps {
  className?: string;
}

export function ParticleBackground({ className }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Create particles
    const particles: Particle[] = [];
    const particleCount = Math.floor(window.innerWidth / 10); // Responsive particle count
    const colors = ['#8A2BE2', '#00FFCC', '#FFD700', '#1E90FF'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // Add magical sigils
    const sigils: { x: number, y: number, size: number, rotation: number, speed: number }[] = [];
    const sigilCount = 5;
    
    for (let i = 0; i < sigilCount; i++) {
      sigils.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 80 + 40,
        rotation: Math.random() * Math.PI,
        speed: (Math.random() + 0.1) * 0.001
      });
    }

    // Animation loop
    let animationFrameId: number;

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#1A1235');
      gradient.addColorStop(1, '#0A1930');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw sigils
      ctx.save();
      sigils.forEach(sigil => {
        ctx.save();
        ctx.translate(sigil.x, sigil.y);
        ctx.rotate(sigil.rotation);
        
        // Draw arcane sigil
        ctx.strokeStyle = 'rgba(138, 43, 226, 0.15)';
        ctx.lineWidth = 2;
        
        // Outer circle
        ctx.beginPath();
        ctx.arc(0, 0, sigil.size / 2, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner designs (pentagon)
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5;
          const x = Math.cos(angle) * (sigil.size / 3);
          const y = Math.sin(angle) * (sigil.size / 3);
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.stroke();
        
        // Update rotation
        sigil.rotation += sigil.speed;
        
        ctx.restore();
      });
      ctx.restore();

      // Draw and update particles
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + '30'; // Adding transparency
        ctx.fill();

        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full -z-10 ${className || ''}`}
    />
  );
}
