
import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const Profile = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto pb-20 md:pb-0 text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-idolyst-purple/20 p-6 mb-6">
            <User className="h-12 w-12 text-idolyst-purple" />
          </div>
          
          <h1 className="text-3xl font-bold gradient-text mb-4">Profile</h1>
          <p className="text-lg text-idolyst-gray-dark mb-8 max-w-md">
            Manage your profile, track your activity, and connect with other entrepreneurs and mentors.
          </p>
          
          <div className="flex space-x-4">
            <Button className="gradient-bg hover-scale">
              <User className="mr-2 h-5 w-5" />
              Sign In
            </Button>
            
            <Button variant="outline" className="hover-scale">
              Create Account
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
