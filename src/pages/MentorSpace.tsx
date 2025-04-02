
import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

const MentorSpace = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto pb-20 md:pb-0 text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-idolyst-purple/20 p-6 mb-6">
            <Users className="h-12 w-12 text-idolyst-purple" />
          </div>
          
          <h1 className="text-3xl font-bold gradient-text mb-4">MentorSpace</h1>
          <p className="text-lg text-idolyst-gray-dark mb-8 max-w-md">
            Connect with experienced mentors, book sessions, and accelerate your professional growth.
          </p>
          
          <Button className="gradient-bg hover-scale text-lg py-6 px-8">
            <Users className="mr-2 h-5 w-5" />
            Browse Mentors
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default MentorSpace;
