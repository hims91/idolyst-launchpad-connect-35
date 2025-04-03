

import { Variants } from "framer-motion";

// Fade in animation
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

// Fade in up animation
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// Fade in down animation
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// Scale in animation
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
};

// Stagger container animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Stagger item animation
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};

// Pop in animation
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

// Slide in from right
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
};

// Slide in from left
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
};

// Rotate in animation
export const rotateIn: Variants = {
  hidden: { opacity: 0, rotate: -45 },
  visible: { opacity: 1, rotate: 0, transition: { duration: 0.5 } }
};

// Bounce animation
export const bounce: Variants = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: [0, -20, 0, -10, 0, -5, 0],
    transition: { duration: 1 }
  }
};

// Pulse animation
export const pulse: Variants = {
  hidden: { opacity: 0, scale: 1 },
  visible: {
    opacity: 1,
    scale: [1, 1.05, 1, 1.03, 1],
    transition: { duration: 1, repeat: Infinity, repeatType: "loop" }
  }
};

// Add the missing animations below:

// Bell animation 
export const bellAnimation: Variants = {
  hidden: { rotate: 0 },
  visible: { 
    rotate: [0, 15, -15, 10, -10, 5, -5, 0],
    transition: { duration: 0.5 }
  }
};

// Scale animation for buttons and interactive elements
export const scaleAnimation = {
  initial: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } }
};

// Page transition animation
export const pageTransition = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.1
    } 
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    transition: { 
      duration: 0.3 
    } 
  }
};

