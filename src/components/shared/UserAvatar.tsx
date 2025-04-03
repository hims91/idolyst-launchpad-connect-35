
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  src?: string;
  fallbackText?: string;
  className?: string;
  user?: {
    id: string;
    name: string;
    image?: string;
  };
  size?: "sm" | "md" | "lg";
  showStatus?: boolean;
  status?: "online" | "offline" | "away";
}

const UserAvatar = ({
  src,
  fallbackText,
  className = "",
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
  
  // Use either the provided fallback text or get initials from user name
  const initials = fallbackText || (user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?");

  // Use either the provided src or the user's image
  const imageSrc = src || user?.image;

  return (
    <div className="relative">
      <Avatar className={`${sizeClasses[size]} ${className}`}>
        <AvatarImage src={imageSrc} alt={user?.name || "Avatar"} />
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
