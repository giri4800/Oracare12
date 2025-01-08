import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';

interface ParallaxTextProps {
  children: React.ReactNode;
  speed?: number;
  delay?: number;
}

export const ParallaxText: React.FC<ParallaxTextProps> = ({ 
  children, 
  speed = 1, 
  delay = 0 
}) => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const spring = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { 
      opacity: inView ? 1 : 0, 
      transform: inView ? 'translateY(0px)' : 'translateY(50px)' 
    },
    delay,
    config: { mass: 1, tension: 280, friction: 60 * speed },
  });

  return (
    <animated.div ref={ref} style={spring}>
      {children}
    </animated.div>
  );
};
