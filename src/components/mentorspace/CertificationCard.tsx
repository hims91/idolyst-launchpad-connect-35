
import { motion } from "framer-motion";
import { Calendar, ExternalLink } from "lucide-react";
import { MentorCertification } from "@/types/mentor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, isValid, parseISO } from "date-fns";
import { staggerItem } from "@/lib/animations";

interface CertificationCardProps {
  certification: MentorCertification;
}

const CertificationCard = ({ certification }: CertificationCardProps) => {
  const { title, issuer, issue_date, expiry_date, credential_url, image_url } = certification;
  
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return null;
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'MMM yyyy') : null;
  };
  
  const issueDate = formatDate(issue_date);
  const expiryDate = formatDate(expiry_date);

  return (
    <motion.div 
      variants={staggerItem}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 flex gap-4"
    >
      {image_url ? (
        <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden">
          <img 
            src={image_url} 
            alt={`${title} certificate`} 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="flex-shrink-0 w-12 h-12 rounded bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 text-xl font-bold">
          {title.substring(0, 1)}
        </div>
      )}
      
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{issuer}</p>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{issueDate}</span>
            {expiryDate && (
              <>
                <span className="mx-1">-</span>
                <span>{expiryDate}</span>
              </>
            )}
          </div>
          
          {!expiryDate && (
            <Badge 
              variant="outline" 
              className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
            >
              No Expiration
            </Badge>
          )}
        </div>
      </div>
      
      {credential_url && (
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0"
          asChild
        >
          <a href={credential_url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">View credential</span>
          </a>
        </Button>
      )}
    </motion.div>
  );
};

export default CertificationCard;
