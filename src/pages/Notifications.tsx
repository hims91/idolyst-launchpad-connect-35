
import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

const Notifications = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto pb-20 md:pb-0 text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-idolyst-purple/20 p-6 mb-6">
            <Bell className="h-12 w-12 text-idolyst-purple" />
          </div>
          
          <h1 className="text-3xl font-bold gradient-text mb-4">Notifications</h1>
          <p className="text-lg text-idolyst-gray-dark mb-8 max-w-md">
            Stay updated with activity related to your posts, pitches, mentorship sessions, and more.
          </p>
          
          <Button className="gradient-bg hover-scale text-lg py-6 px-8">
            <Bell className="mr-2 h-5 w-5" />
            Sign In to View
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Notifications;
