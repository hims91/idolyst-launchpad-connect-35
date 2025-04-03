
import { Variants } from "framer-motion";

// Fade animations
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: { duration: 0.3 }
  }
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Scale animations
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: 0.3 }
  }
};

// Slide animations
export const slideInRight: Variants = {
  hidden: { x: "100%" },
  visible: { 
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  exit: { 
    x: "100%",
    transition: { duration: 0.3 }
  }
};

export const slideInLeft: Variants = {
  hidden: { x: "-100%" },
  visible: { 
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  exit: { 
    x: "-100%",
    transition: { duration: 0.3 }
  }
};

// Staggered animations for lists
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

// Pop-in animation for notifications
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: -20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 17 
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    y: -20,
    transition: { duration: 0.2 }
  }
};

// Message animation
export const messageAnimation: Variants = {
  hidden: (custom: boolean) => ({
    opacity: 0,
    x: custom ? 20 : -20, // custom is isCurrentUser
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 }
  }
};

// Chat bubbles animation
export const chatBubble: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 500, damping: 25 }
  }
};
