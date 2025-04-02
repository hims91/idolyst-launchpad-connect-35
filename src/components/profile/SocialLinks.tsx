
import { motion } from "framer-motion";
import { ExtendedProfile } from "@/types/profile";
import { fadeInUp } from "@/lib/animations";
import { 
  LinkedinIcon, 
  TwitterIcon, 
  GithubIcon, 
  InstagramIcon, 
  GlobeIcon,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialLinksProps {
  profile: ExtendedProfile;
}

const SocialLinks = ({ profile }: SocialLinksProps) => {
  if (!profile.social_links || profile.social_links.length === 0) {
    return null;
  }

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return <LinkedinIcon className="h-5 w-5" />;
      case 'twitter':
      case 'x':
        return <TwitterIcon className="h-5 w-5" />;
      case 'github':
        return <GithubIcon className="h-5 w-5" />;
      case 'instagram':
        return <InstagramIcon className="h-5 w-5" />;
      default:
        return <GlobeIcon className="h-5 w-5" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return "bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5]/20";
      case 'twitter':
      case 'x':
        return "bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20";
      case 'github':
        return "bg-[#333]/10 text-[#333] dark:text-[#f0f6fc] hover:bg-[#333]/20 dark:hover:bg-[#333]/30";
      case 'instagram':
        return "bg-[#E4405F]/10 text-[#E4405F] hover:bg-[#E4405F]/20";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mt-6"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-2xl font-semibold mb-4">Connect</h2>
      
      <div className="flex flex-wrap gap-3">
        {profile.social_links.map((link) => (
          <Button
            key={link.id}
            variant="outline"
            size="sm"
            className={`${getPlatformColor(link.platform)}`}
            onClick={() => window.open(link.url, "_blank")}
          >
            {getSocialIcon(link.platform)}
            <span className="ml-2 capitalize">{link.platform}</span>
          </Button>
        ))}
        
        {profile.professional_details && (
          <Button
            variant="outline"
            size="sm"
            className="bg-blue-50 text-blue-700 hover:bg-blue-100"
            onClick={() => window.open(`https://linkedin.com/in/${profile.professional_details}`, "_blank")}
          >
            <LinkedinIcon className="h-5 w-5 mr-2" />
            LinkedIn
          </Button>
        )}
        
        {profile.portfolio_url && (
          <Button
            variant="outline"
            size="sm"
            className="bg-purple-50 text-purple-700 hover:bg-purple-100"
            onClick={() => window.open(profile.portfolio_url!, "_blank")}
          >
            <ExternalLink className="h-5 w-5 mr-2" />
            Portfolio
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default SocialLinks;
