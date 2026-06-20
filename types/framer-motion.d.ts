declare module 'framer-motion' {
  import { ComponentType, ReactNode, RefObject } from 'react';

  export interface motion {
    div: ComponentType<any>;
    span: ComponentType<any>;
    p: ComponentType<any>;
    h1: ComponentType<any>;
    h2: ComponentType<any>;
    h3: ComponentType<any>;
    section: ComponentType<any>;
    button: ComponentType<any>;
    img: ComponentType<any>;
    svg: ComponentType<any>;
    path: ComponentType<any>;
    circle: ComponentType<any>;
    rect: ComponentType<any>;
    ellipse: ComponentType<any>;
    line: ComponentType<any>;
    [key: string]: ComponentType<any>;
  }

  export const motion: motion;

  export interface AnimatePresenceProps {
    mode?: 'wait' | 'sync' | 'popLayout';
    initial?: boolean;
    onExitComplete?: () => void;
    children?: ReactNode;
  }

  export const AnimatePresence: ComponentType<AnimatePresenceProps>;

  export function useScroll(): { scrollYProgress: any };
  export function useTransform(value: any, input: number[], output: number[]): any;
  export function useInView(ref: RefObject<any>, options?: any): boolean;
  export function useAnimation(): any;
  export function useMotionValue(initial: number): any;
  export function useSpring(value: any, config?: any): any;
}
