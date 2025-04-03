
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { Notification } from '@/types/notifications';
import { NotificationIcon, getNotificationColor } from './NotificationIcon';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  
  const handleMarkAsRead = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (notification.is_read) return;
    
    setIsMarking(true);
    await onMarkAsRead(notification.id);
    setIsMarking(false);
  };
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDeleting(true);
    await onDelete(notification.id);
    setIsDeleting(false);
  };
  
  const time = parseISO(notification.created_at);
  const timeAgo = formatDistanceToNow(time, { addSuffix: true });
  const fullTime = format(time, 'PPpp');
  
  const colorClass = getNotificationColor(notification.type);
  
  const NotificationContent = () => (
    <>
      <div className="flex-shrink-0">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center text-white",
          colorClass
        )}>
          <NotificationIcon type={notification.type} />
        </div>
      </div>
      
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {notification.title}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {notification.content}
            </p>
          </div>
          <div className="ml-2 flex-shrink-0 flex flex-col items-end">
            <p className="text-xs text-gray-500 dark:text-gray-400" title={fullTime}>
              {timeAgo}
            </p>
            <div className="flex mt-1 space-x-1">
              {!notification.is_read && (
                <button 
                  onClick={handleMarkAsRead}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  disabled={isMarking}
                  title="Mark as read"
                >
                  <Check size={16} />
                </button>
              )}
              <button 
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-500 transition-colors"
                disabled={isDeleting}
                title="Delete notification"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {!notification.is_read && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-idolyst-purple rounded-l-md" />
      )}
    </>
  );
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm mb-3",
        "hover:shadow-md transition-shadow duration-200",
        !notification.is_read && "bg-purple-50 dark:bg-gray-700/70"
      )}
    >
      <div className="flex items-start">
        {notification.action_url ? (
          <Link 
            to={notification.action_url} 
            className="flex items-start w-full"
            onClick={() => {
              if (!notification.is_read) {
                onMarkAsRead(notification.id);
              }
            }}
          >
            <NotificationContent />
          </Link>
        ) : (
          <NotificationContent />
        )}
      </div>
    </motion.div>
  );
}
