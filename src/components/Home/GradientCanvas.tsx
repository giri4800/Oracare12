import React, { useEffect, useRef } from 'react';

export const GradientCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame: number;
    let gradient: CanvasGradient;
    let hue = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createGradient = () => {
      gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, `hsl(${hue}, 80%, 50%)`);
      gradient.addColorStop(0.5, `hsl(${hue + 60}, 80%, 50%)`);
      gradient.addColorStop(1, `hsl(${hue + 120}, 80%, 50%)`);
    };

    const animate = () => {
      hue = (hue + 0.1) % 360;
      createGradient();
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      frame = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 opacity-30"
      style={{ mixBlendMode: 'soft-light' }}
    />
  );
};
