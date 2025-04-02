
import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

const PitchHub = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto pb-20 md:pb-0 text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-idolyst-purple/20 p-6 mb-6">
            <Rocket className="h-12 w-12 text-idolyst-purple" />
          </div>
          
          <h1 className="text-3xl font-bold gradient-text mb-4">PitchHub</h1>
          <p className="text-lg text-idolyst-gray-dark mb-8 max-w-md">
            Submit your startup ideas, get feedback from mentors, and validate your concepts with the community.
          </p>
          
          <Button className="gradient-bg hover-scale text-lg py-6 px-8">
            <Rocket className="mr-2 h-5 w-5" />
            Submit Your Idea
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default PitchHub;
