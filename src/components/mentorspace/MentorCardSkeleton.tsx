
import { Skeleton } from "@/components/ui/skeleton";

const MentorCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center md:items-start gap-4 animate-pulse">
      <Skeleton className="h-16 w-16 md:h-20 md:w-20 rounded-full" />
      
      <div className="flex-1 w-full text-center md:text-left">
        <Skeleton className="h-6 w-40 mx-auto md:mx-0 mb-2" />
        
        <div className="flex flex-wrap justify-center md:justify-start gap-1 mt-1 mb-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      
      <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-2 mt-2 md:mt-0">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
};

export default MentorCardSkeleton;
