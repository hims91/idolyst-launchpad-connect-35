
import React, { useMemo } from "react";

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

const PasswordStrengthMeter = ({
  password,
  className = ""
}: PasswordStrengthMeterProps) => {
  const strength = useMemo(() => {
    if (!password) return 0;
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Normalize to a 0-4 scale
    return Math.min(Math.floor(score / 1.5), 4);
  }, [password]);
  
  const strengthLabel = useMemo(() => {
    switch (strength) {
      case 0: return "Too weak";
      case 1: return "Weak";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Strong";
      default: return "";
    }
  }, [strength]);
  
  const strengthColor = useMemo(() => {
    switch (strength) {
      case 0: return "bg-gray-200";
      case 1: return "bg-red-500";
      case 2: return "bg-orange-500";
      case 3: return "bg-yellow-500";
      case 4: return "bg-green-500";
      default: return "bg-gray-200";
    }
  }, [strength]);
  
  return (
    <div className={`w-full space-y-1 ${className}`}>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`h-full w-1/4 ${
              i < strength ? strengthColor : "bg-gray-200"
            } ${i > 0 ? "ml-0.5" : ""}`}
          />
        ))}
      </div>
      {password && (
        <p className={`text-xs ${
          strength === 0 ? "text-gray-400" :
          strength === 1 ? "text-red-500" :
          strength === 2 ? "text-orange-500" :
          strength === 3 ? "text-yellow-600" :
          "text-green-600"
        }`}>
          {strengthLabel}
        </p>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
