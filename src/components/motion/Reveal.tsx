import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { easeOut } from '../../lib/motion';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'article' | 'li';
}

export default function Reveal({
  children,
  className = '',
  delay = 0,
  as = 'div',
}: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = motion[as];

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay, ease: easeOut }}
    >
      {children}
    </Comp>
  );
}
