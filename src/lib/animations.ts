
// Animation variants for Framer Motion
// These can be imported and used with the motion components

// Fade in animation
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.4
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

// Fade in from bottom
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: {
      duration: 0.2
    }
  }
};

// Staggered fade in for list items
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Child item for staggered animations
export const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

// Pulse animation for buttons
export const pulseAnimation = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      yoyo: Infinity,
      ease: "easeInOut"
    }
  },
  tap: { scale: 0.95 }
};

// Scale animation for click effects
export const scaleAnimation = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

// Slide in animation
export const slideIn = (direction: "left" | "right" | "up" | "down") => {
  const x = direction === "left" ? "-100%" : direction === "right" ? "100%" : 0;
  const y = direction === "up" ? "-100%" : direction === "down" ? "100%" : 0;
  
  return {
    hidden: { 
      x,
      y,
      opacity: 0 
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    },
    exit: {
      x,
      y,
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };
};

// Bounce animation
export const bounceAnimation = {
  initial: { scale: 1 },
  hover: {
    scale: 1.1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: {
    scale: 0.9,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

// CSS animation classes
export const animationClasses = {
  gradientPulse: "animate-gradient-pulse",
  slideIn: "animate-slide-in",
  fadeIn: "animate-fade-in",
  bounce: "animate-bounce",
  pulse: "animate-pulse",
  spin: "animate-spin",
  slideUp: "animate-slide-up",
  slideDown: "animate-slide-down",
  scaleIn: "animate-scale-in",
};
