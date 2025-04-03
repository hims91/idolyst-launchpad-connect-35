
import React from 'react';
import { XpTransaction } from '@/api/ascend';
import { format } from 'date-fns';
import { ArrowDown, ArrowUp, LucideIcon } from 'lucide-react';
import { useIconByName } from '@/hooks/use-icon-by-name';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface XpTransactionListProps {
  transactions: XpTransaction[];
  className?: string;
}

const XpTransactionList: React.FC<XpTransactionListProps> = ({ transactions, className }) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No XP transactions to display.
      </div>
    );
  }
  
  return (
    <div className={cn("space-y-3", className)}>
      {transactions.map((transaction, index) => (
        <motion.div
          key={transaction.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm border"
        >
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center mr-3",
            transaction.amount >= 0 
              ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
              : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
          )}>
            {transaction.amount >= 0 ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="text-sm font-medium">{transaction.description}</div>
            <div className="text-xs text-muted-foreground">
              {format(new Date(transaction.created_at), 'MMM d, yyyy • hh:mm a')}
            </div>
          </div>
          
          <div className={cn(
            "font-bold",
            transaction.amount >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          )}>
            {transaction.amount > 0 ? '+' : ''}{transaction.amount} XP
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default XpTransactionList;
