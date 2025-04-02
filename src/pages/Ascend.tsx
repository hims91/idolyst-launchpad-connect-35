
import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

const Ascend = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto pb-20 md:pb-0 text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-idolyst-purple/20 p-6 mb-6">
            <Trophy className="h-12 w-12 text-idolyst-purple" />
          </div>
          
          <h1 className="text-3xl font-bold gradient-text mb-4">Ascend</h1>
          <p className="text-lg text-idolyst-gray-dark mb-8 max-w-md">
            Level up your entrepreneurial journey with XP, badges, and rewards. Compete with others and unlock special perks.
          </p>
          
          <Button className="gradient-bg hover-scale text-lg py-6 px-8">
            <Trophy className="mr-2 h-5 w-5" />
            View Leaderboard
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Ascend;
