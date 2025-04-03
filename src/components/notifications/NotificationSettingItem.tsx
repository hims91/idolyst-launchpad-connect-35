
import { Switch } from "@/components/ui/switch";
import { NotificationType } from "@/types/notifications";
import { motion } from "framer-motion";
import { NotificationIcon } from "./NotificationIcon";

interface NotificationSettingItemProps {
  type: NotificationType;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function NotificationSettingItem({
  type,
  label,
  description,
  enabled,
  onToggle
}: NotificationSettingItemProps) {
  return (
    <motion.div 
      className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center flex-1">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <NotificationIcon type={type} className="text-idolyst-purple" />
          </div>
        </div>
        <div className="ml-3 flex-1">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {label}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
      <div className="ml-4">
        <Switch
          checked={enabled}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-idolyst-purple"
        />
      </div>
    </motion.div>
  );
}
