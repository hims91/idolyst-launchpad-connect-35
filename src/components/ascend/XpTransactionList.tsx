
import React from 'react';
import { motion } from "framer-motion";
import { format } from "date-fns";
import { XpTransaction } from "@/api/ascend";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  MessageCircle, 
  Award, 
  Gift, 
  CalendarClock, 
  BarChart,
  ThumbsUp,
  Rocket
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeIn } from "@/lib/animations";

interface XpTransactionListProps {
  transactions: XpTransaction[];
}

const XpTransactionList: React.FC<XpTransactionListProps> = ({ transactions }) => {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'pitch_submission':
        return <Rocket className="h-5 w-5 text-orange-500" />;
      case 'pitch_feedback':
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'mentor_session':
        return <Award className="h-5 w-5 text-purple-500" />;
      case 'login_streak':
        return <CalendarClock className="h-5 w-5 text-green-500" />;
      case 'reward_claim':
        return <Gift className="h-5 w-5 text-red-500" />;
      case 'level_up':
        return <BarChart className="h-5 w-5 text-yellow-500" />;
      case 'post_engagement':
        return <ThumbsUp className="h-5 w-5 text-pink-500" />;
      default:
        return <Zap className="h-5 w-5 text-indigo-500" />;
    }
  };
  
  if (transactions.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center">
        <Zap className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium mb-2">No XP Transactions</h3>
        <p className="text-muted-foreground mb-4">
          Your XP history will appear here as you earn XP through various activities.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {transactions.map((transaction, index) => (
        <motion.div
          key={transaction.id}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.05 }}
        >
          <Card className={cn(
            "overflow-hidden border-l-4",
            transaction.amount > 0 
              ? "border-l-green-500" 
              : "border-l-red-500"
          )}>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                  transaction.amount > 0 
                    ? "bg-green-100 dark:bg-green-900/20" 
                    : "bg-red-100 dark:bg-red-900/20"
                )}>
                  {transaction.amount > 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-base">
                      {transaction.description}
                    </h4>
                    <div className={cn(
                      "font-bold text-base",
                      transaction.amount > 0 
                        ? "text-green-600 dark:text-green-400" 
                        : "text-red-600 dark:text-red-400"
                    )}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount} XP
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      {getTransactionIcon(transaction.transaction_type)}
                      <span className="ml-1 capitalize">
                        {transaction.transaction_type.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(transaction.created_at), 'MMM d, yyyy • h:mm a')}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default XpTransactionList;
