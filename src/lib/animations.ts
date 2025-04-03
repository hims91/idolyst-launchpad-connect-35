
import { Variants } from "framer-motion";

// Fade in animation
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.3 
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      duration: 0.2 
    }
  }
};

// Fade in animation from bottom
export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5 
    }
  },
  exit: { 
    opacity: 0,
    y: 20,
    transition: { 
      duration: 0.3 
    }
  }
};

// Slide in from left
export const slideInLeft: Variants = {
  hidden: { 
    x: -100, 
    opacity: 0 
  },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      duration: 0.4 
    }
  },
  exit: { 
    x: -100, 
    opacity: 0,
    transition: { 
      duration: 0.3 
    }
  }
};

// Slide in from right
export const slideInRight: Variants = {
  hidden: { 
    x: 100, 
    opacity: 0 
  },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      duration: 0.4 
    }
  },
  exit: { 
    x: 100, 
    opacity: 0,
    transition: { 
      duration: 0.3 
    }
  }
};

// Scale animation
export const scaleAnimation: Variants = {
  hidden: { 
    scale: 0.9, 
    opacity: 0 
  },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      duration: 0.3 
    }
  },
  exit: { 
    scale: 0.9, 
    opacity: 0,
    transition: { 
      duration: 0.2 
    }
  }
};

// Scale in animation (quick pop in)
export const scaleIn: Variants = {
  hidden: { 
    scale: 0.8, 
    opacity: 0 
  },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 500, 
      damping: 25 
    }
  },
  exit: { 
    scale: 0.8, 
    opacity: 0,
    transition: { 
      duration: 0.15 
    }
  }
};

// List item staggered animation
export const listItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 10 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.3 
    }
  }
};

// Container for staggered animations
export const listContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Stagger container - for staggered entry of child elements
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

// Stagger item - for individual items within a staggered container
export const staggerItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

// Pulse animation
export const pulse: Variants = {
  hidden: { 
    scale: 1 
  },
  visible: { 
    scale: [1, 1.05, 1],
    transition: { 
      repeat: Infinity, 
      repeatType: "reverse", 
      duration: 1.5 
    }
  }
};

// Page transition
export const pageTransition: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.5, 
      when: "beforeChildren" 
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      duration: 0.3, 
      when: "afterChildren" 
    }
  }
};

// Notification bell animation
export const bellAnimation: Variants = {
  hidden: { 
    rotate: 0 
  },
  visible: { 
    rotate: [0, 15, -15, 10, -10, 0],
    transition: { 
      duration: 1 
    }
  }
};

// Button hover animation
export const buttonHover: Variants = {
  hover: { 
    scale: 1.05,
    transition: { 
      duration: 0.2 
    }
  },
  tap: { 
    scale: 0.95 
  }
};
