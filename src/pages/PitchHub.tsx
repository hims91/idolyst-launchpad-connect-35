

import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Rocket, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const PitchHub = () => {
  return (
    <Layout>
      <Helmet>
        <title>PitchHub - Startup Idea Validation | Idolyst</title>
        <meta name="description" content="Submit your startup ideas, get feedback from mentors, and validate your concepts with the community." />
        <meta property="og:title" content="PitchHub - Startup Idea Validation | Idolyst" />
        <meta property="og:description" content="Submit your startup ideas, get feedback from mentors, and validate your concepts with the community." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PitchHub - Startup Idea Validation | Idolyst" />
        <meta name="twitter:description" content="Submit your startup ideas, get feedback from mentors, and validate your concepts with the community." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="max-w-5xl mx-auto pb-20 md:pb-0">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 py-12">
          <div className="max-w-md">
            <div className="rounded-full bg-idolyst-purple/20 p-3 inline-block mb-4">
              <Rocket className="h-8 w-8 text-idolyst-purple" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-6 animate-fade-in">
              Validate Your Startup Ideas
            </h1>
            
            <p className="text-lg text-idolyst-gray-dark mb-8 animate-fade-in">
              Submit your business concepts, receive feedback from experienced mentors, and get validation from a community of entrepreneurs and innovators.
            </p>
            
            <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row animate-fade-in">
              <Link to="/pitch-hub/new">
                <Button size="lg" className="w-full md:w-auto gradient-bg hover-scale text-lg py-6 px-8">
                  <Rocket className="mr-2 h-5 w-5" />
                  Submit Your Idea
                </Button>
              </Link>
              
              <Link to="/pitch-hub/index">
                <Button size="lg" variant="outline" className="w-full md:w-auto py-6 px-8">
                  Browse Ideas
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 max-w-lg animate-fade-in">
            <img 
              src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop&crop=entropy" 
              alt="People collaborating on startup ideas" 
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
        
        {/* Features Section */}
        <div className="py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 gradient-text">How PitchHub Helps You</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
            <div className="p-6 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow duration-300">
              <div className="rounded-full bg-blue-100 p-3 inline-block mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Idea Validation</h3>
              <p className="text-idolyst-gray-dark">Get your startup concepts validated by a diverse community of entrepreneurs, investors, and industry experts.</p>
            </div>
            
            <div className="p-6 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow duration-300">
              <div className="rounded-full bg-green-100 p-3 inline-block mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Feedback</h3>
              <p className="text-idolyst-gray-dark">Receive valuable insights and constructive feedback from experienced mentors in your industry.</p>
            </div>
            
            <div className="p-6 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow duration-300">
              <div className="rounded-full bg-purple-100 p-3 inline-block mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Growth Potential</h3>
              <p className="text-idolyst-gray-dark">Track your idea's performance through analytics, votes, and engagement metrics to gauge market interest.</p>
            </div>
          </div>
        </div>
        
        {/* How It Works Section */}
        <div className="py-12 bg-gray-50 -mx-4 px-4 md:mx-0 md:px-0 md:rounded-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 gradient-text">How It Works</h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8 relative">
              <div className="hidden md:block absolute left-9 top-10 bottom-10 border-l-2 border-dashed border-idolyst-purple/30"></div>
              
              <div className="flex flex-col md:flex-row gap-6 md:items-center animate-fade-in">
                <div className="flex-shrink-0 w-20 h-20 rounded-full gradient-bg flex items-center justify-center text-white text-2xl font-bold">1</div>
                <div className="flex-1 p-6 bg-white rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">Submit Your Idea</h3>
                  <p className="text-idolyst-gray-dark">Share your startup concept with details about the problem, solution, target audience, and development stage.</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 md:items-center animate-fade-in">
                <div className="flex-shrink-0 w-20 h-20 rounded-full gradient-bg flex items-center justify-center text-white text-2xl font-bold">2</div>
                <div className="flex-1 p-6 bg-white rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">Receive Community Feedback</h3>
                  <p className="text-idolyst-gray-dark">Get votes and comments from the community to help refine and validate your idea's market fit.</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 md:items-center animate-fade-in">
                <div className="flex-shrink-0 w-20 h-20 rounded-full gradient-bg flex items-center justify-center text-white text-2xl font-bold">3</div>
                <div className="flex-1 p-6 bg-white rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">Gain Mentor Insights</h3>
                  <p className="text-idolyst-gray-dark">Experienced mentors provide expert feedback and valuable suggestions to improve your concept.</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 md:items-center animate-fade-in">
                <div className="flex-shrink-0 w-20 h-20 rounded-full gradient-bg flex items-center justify-center text-white text-2xl font-bold">4</div>
                <div className="flex-1 p-6 bg-white rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">Track Performance</h3>
                  <p className="text-idolyst-gray-dark">Monitor analytics, engagement metrics, and leaderboard rankings to measure your idea's resonance.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">Ready to Validate Your Startup Idea?</h2>
          <p className="text-lg text-idolyst-gray-dark mb-8 max-w-xl mx-auto">
            Join our community of innovators and get the feedback you need to turn your concept into a successful business.
          </p>
          
          <div className="space-x-4">
            <Link to="/pitch-hub/new">
              <Button size="lg" className="gradient-bg hover-scale">
                <Rocket className="mr-2 h-5 w-5" />
                Submit Your Idea
              </Button>
            </Link>
            
            <Link to="/pitch-hub/leaderboard">
              <Button size="lg" variant="outline">
                View Leaderboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PitchHub;
