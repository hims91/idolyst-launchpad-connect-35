
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Users, 
  MessageSquare, 
  Share,
  Search,
  Bell,
  Award,
  PlusCircle
} from "lucide-react";

type EmptyStateIcon = 
  | "post" 
  | "user" 
  | "message" 
  | "notification" 
  | "search" 
  | "achievement" 
  | "share";

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  icon?: EmptyStateIcon;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  actionLink,
  icon = "post",
  className = "",
}) => {
  // Get the appropriate icon
  const renderIcon = () => {
    const iconSize = "h-12 w-12";
    
    switch (icon) {
      case "user":
        return <Users className={`${iconSize} text-blue-400`} />;
      case "message":
        return <MessageSquare className={`${iconSize} text-green-400`} />;
      case "notification":
        return <Bell className={`${iconSize} text-yellow-400`} />;
      case "search":
        return <Search className={`${iconSize} text-purple-400`} />;
      case "achievement":
        return <Award className={`${iconSize} text-amber-400`} />;
      case "share":
        return <Share className={`${iconSize} text-red-400`} />;
      case "post":
      default:
        return <FileText className={`${iconSize} text-idolyst-purple`} />;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col items-center text-center p-8 rounded-lg border border-dashed border-gray-200 ${className}`}
    >
      <div className="bg-gray-50 p-4 rounded-full mb-4">
        {renderIcon()}
      </div>
      
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-idolyst-gray mb-6 max-w-xs mx-auto">{description}</p>
      
      {actionText && actionLink && (
        <Button 
          asChild
          className="gradient-bg hover-scale"
        >
          {actionLink.startsWith("#") ? (
            <button onClick={() => document.querySelector(actionLink)?.scrollIntoView()}>
              <PlusCircle className="h-4 w-4 mr-2" />
              {actionText}
            </button>
          ) : (
            <Link to={actionLink}>
              <PlusCircle className="h-4 w-4 mr-2" />
              {actionText}
            </Link>
          )}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
