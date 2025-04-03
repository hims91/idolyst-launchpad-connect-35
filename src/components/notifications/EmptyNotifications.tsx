
import { Bell } from "lucide-react";
import { motion } from "framer-motion";

export function EmptyNotifications() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <Bell className="h-8 w-8 text-idolyst-purple" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        No notifications yet
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-md">
        You're all caught up! Check back later for updates on your posts, ideas, mentorship sessions, and more.
      </p>
    </motion.div>
  );
}
