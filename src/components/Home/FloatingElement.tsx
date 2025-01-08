import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
}

export const FloatingElement: React.FC<FloatingElementProps> = ({ 
  children, 
  delay = 0 
}) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const spring = useSpring({
    from: { 
      opacity: 0, 
      transform: 'scale(0.9) translateY(50px)' 
    },
    to: { 
      opacity: inView ? 1 : 0, 
      transform: inView ? 'scale(1) translateY(0px)' : 'scale(0.9) translateY(50px)' 
    },
    delay,
    config: { mass: 1, tension: 280, friction: 60 },
  });

  const float = useSpring({
    from: { transform: 'translateY(0px)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'translateY(-10px)' });
        await next({ transform: 'translateY(0px)' });
      }
    },
    config: { mass: 1, tension: 150, friction: 30 },
  });

  return (
    <animated.div ref={ref} style={spring}>
      <animated.div style={float}>
        {children}
      </animated.div>
    </animated.div>
  );
};
