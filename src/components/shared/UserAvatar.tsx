
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  user: {
    id: string;
    name: string;
    image?: string;
  };
  size?: "sm" | "md" | "lg";
  showStatus?: boolean;
  status?: "online" | "offline" | "away";
}

const UserAvatar = ({ 
  user, 
  size = "md", 
  showStatus = false, 
  status = "offline" 
}: UserAvatarProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };
  
  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    away: "bg-amber-400"
  };
  
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative">
      <Avatar className={`${sizeClasses[size]}`}>
        <AvatarImage src={user.image} alt={user.name} />
        <AvatarFallback className="bg-idolyst-purple/20 text-idolyst-purple">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      {showStatus && (
        <span className={`absolute -bottom-0.5 -right-0.5 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${statusColors[status]}`} />
      )}
    </div>
  );
};

export default UserAvatar;
