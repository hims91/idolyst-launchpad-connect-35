
import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Lightbulb, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Role {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

interface RoleSelectorProps {
  selectedRoles: string[];
  onChange: (roles: string[]) => void;
  error?: string;
}

const RoleSelector = ({ selectedRoles, onChange, error }: RoleSelectorProps) => {
  const roles: Role[] = [
    {
      id: "entrepreneur",
      title: "Entrepreneur",
      description: "Submit ideas to PitchHub and connect with mentors",
      icon: Lightbulb,
    },
    {
      id: "mentor",
      title: "Mentor",
      description: "Offer expertise, guidance and earn from mentoring sessions",
      icon: User,
    },
  ];

  const toggleRole = (roleId: string) => {
    if (selectedRoles.includes(roleId)) {
      onChange(selectedRoles.filter((id) => id !== roleId));
    } else {
      onChange([...selectedRoles, roleId]);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select your role(s)
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => {
          const isSelected = selectedRoles.includes(role.id);
          
          return (
            <motion.div
              key={role.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleRole(role.id)}
              className={cn(
                "relative cursor-pointer rounded-lg p-4 border-2 transition-all duration-200",
                isSelected
                  ? "border-idolyst-purple bg-idolyst-purple/5"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="flex items-start">
                <div className={cn(
                  "p-2 rounded-full mr-3",
                  isSelected ? "bg-idolyst-purple/20 text-idolyst-purple" : "bg-gray-100 text-gray-500"
                )}>
                  <role.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{role.title}</h3>
                  <p className="text-sm text-gray-500">{role.description}</p>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2 flex items-center justify-center h-5 w-5 bg-idolyst-purple rounded-full text-white">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default RoleSelector;
