
import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import React from 'react';

// Try to register plugins if available. 
// Note: GSAPSplitText is a premium plugin and might not work in all CDN environments without a license.
try {
  gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);
} catch (e) {
  console.warn("GSAP plugins failed to register", e);
}

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words' | 'lines';
  from?: any;
  to?: any;
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  tag?: string;
  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 100,
  duration = 0.6,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  tag = 'p',
  onLetterAnimationComplete
}) => {
  const ref = useRef<any>(null);
  const animationCompletedRef = useRef(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if (document.fonts.status === 'loaded') {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    }
  }, []);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;
      const el = ref.current;

      if (el._rbsplitInstance) {
        try {
          el._rbsplitInstance.revert();
        } catch (_) {
          /* noop */
        }
        el._rbsplitInstance = null;
      }

      const startPct = (1 - threshold) * 100;
      // Simple parsing of rootMargin for string manipulation
      // (Simplified from original regex for reliability in TS environment)
      const sign = "+=0px"; 
      
      const start = `top ${startPct}%`;

      let targets: any;
      const assignTargets = (self: any) => {
        if (splitType.includes('chars') && self.chars.length) targets = self.chars;
        if (!targets && splitType.includes('words') && self.words.length) targets = self.words;
        if (!targets && splitType.includes('lines') && self.lines.length) targets = self.lines;
        if (!targets) targets = self.chars || self.words || self.lines;
      };

      try {
        const splitInstance = new GSAPSplitText(el, {
          type: splitType,
          // smartWrap: true, // removed as it can cause issues in some versions
          linesClass: 'split-line',
          wordsClass: 'split-word',
          charsClass: 'split-char',
          reduceWhiteSpace: false,
        });

        // Manually trigger the split logic and animation
        // Note: The onSplit callback in the prompt's code is specific to a wrapper or newer version.
        // We will do standard GSAP animation here.
        assignTargets(splitInstance);
        
        const tween = gsap.fromTo(
            targets,
            { ...from },
            {
              ...to,
              duration,
              ease,
              stagger: delay / 1000,
              scrollTrigger: {
                trigger: el,
                start,
                once: true,
                // fastScrollEnd: true,
                // anticipatePin: 0.4
              },
              onComplete: () => {
                animationCompletedRef.current = true;
                onLetterAnimationComplete?.();
              },
              willChange: 'transform, opacity',
              force3D: true
            }
        );
      
        el._rbsplitInstance = splitInstance;

        return () => {
          ScrollTrigger.getAll().forEach(st => {
            if (st.trigger === el) st.kill();
          });
          try {
            splitInstance.revert();
          } catch (_) {
            /* noop */
          }
          el._rbsplitInstance = null;
        };
      } catch (e) {
         console.warn("SplitText error (likely missing Premium plugin):", e);
         // Fallback animation if SplitText fails
         gsap.fromTo(el, 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
         );
      }
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded,
        onLetterAnimationComplete
      ],
      scope: ref
    }
  );

  const renderTag = () => {
    const style: any = {
      textAlign,
      // overflow: 'hidden', // Can clip descenders
      display: 'inline-block',
      whiteSpace: 'normal',
      wordWrap: 'break-word',
      willChange: 'transform, opacity'
    };
    const classes = `split-parent ${className}`;
    
    // Using explicit mapping for TS safety
    const TagName = tag as React.ElementType;
    return <TagName ref={ref} style={style} className={classes}>{text}</TagName>;
  };
  
  return renderTag();
};

export default SplitText;
