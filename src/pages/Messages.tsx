
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/providers/AuthProvider";
import { useMessages } from "@/hooks/use-messages";
import Layout from "@/components/layout/Layout";
import ConversationList from "@/components/messages/ConversationList";
import ConversationView from "@/components/messages/ConversationView";
import NewMessageModal from "@/components/messages/NewMessageModal";
import MobileHeader from "@/components/messages/MobileHeader";
import EmptyState from "@/components/messages/EmptyState";
import { fadeInUp } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LogIn, MessageSquare, UserPlus } from "lucide-react";

const Messages = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const {
    conversations,
    currentConversation,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    selectConversation,
    setCurrentConversation
  } = useMessages();

  const handleBackToList = () => {
    setCurrentConversation(null);
  };

  // Loading state
  if (authLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-idolyst-purple"></div>
        </div>
      </Layout>
    );
  }

  // Not authenticated view
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto pb-20 md:pb-0 text-center">
          <motion.div 
            className="flex flex-col items-center justify-center py-12"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="rounded-full bg-idolyst-purple/20 p-6 mb-6">
              <MessageSquare className="h-12 w-12 text-idolyst-purple" />
            </div>
            
            <h1 className="text-3xl font-bold gradient-text mb-4">Messages</h1>
            <p className="text-lg text-idolyst-gray-dark mb-8 max-w-md">
              Connect directly with mentors and other entrepreneurs. Message your connections and build valuable relationships.
            </p>
            
            <div className="flex gap-4">
              <Button 
                className="gradient-bg hover-scale"
                asChild
              >
                <Link to="/auth/login">
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                className="hover-scale"
                asChild
              >
                <Link to="/auth/signup">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Create Account
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Mobile header - only shown on small screens */}
      <div className="md:hidden">
        <MobileHeader 
          onNewMessage={() => setNewMessageOpen(true)} 
          showBackButton={!!currentConversation}
          onBackClick={handleBackToList}
          conversationTitle={currentConversation?.otherParticipant?.profile?.username || ""}
        />
      </div>
      
      <div className="flex h-[calc(100vh-8rem)] w-full max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
        {/* Conversation List - Hidden on mobile when viewing a conversation */}
        <div className={`${currentConversation ? 'hidden md:block' : ''} w-full md:w-1/3 border-r border-gray-200 dark:border-gray-800`}>
          <ConversationList 
            conversations={conversations}
            isLoading={isLoadingConversations}
            selectedId={currentConversation?.id}
            onSelectConversation={selectConversation}
            onNewMessage={() => setNewMessageOpen(true)}
          />
        </div>
        
        {/* Conversation View - Full width on mobile */}
        <div className={`${currentConversation ? 'flex' : 'hidden md:flex'} flex-col w-full md:w-2/3 h-full`}>
          {currentConversation ? (
            <ConversationView 
              conversation={currentConversation}
              messages={messages}
              isLoading={isLoadingMessages}
            />
          ) : (
            <EmptyState onNewMessage={() => setNewMessageOpen(true)} />
          )}
        </div>
      </div>
      
      {/* New Message Modal */}
      <NewMessageModal 
        isOpen={newMessageOpen} 
        onClose={() => setNewMessageOpen(false)} 
      />
    </Layout>
  );
};

export default Messages;
