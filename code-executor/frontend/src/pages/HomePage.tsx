import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, MessageCircle, TrendingUp, Target, Clock, Award } from 'lucide-react';

const HomePage: React.FC = () => {
  const stats = [
    { label: 'Topics Completed', value: '12', icon: Target },
    { label: 'Day Streak', value: '7', icon: TrendingUp },
    { label: 'Hours Learned', value: '24', icon: Clock },
    { label: 'Badges Earned', value: '5', icon: Award },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">👋 Welcome back, Adithya!</h1>
          <p className="text-gray-300 text-lg">Ready to continue your coding journey?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <Icon className="h-8 w-8 text-blue-400" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Link
            to="/learn"
            className="group bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center space-x-4">
              <BookOpen className="h-12 w-12 text-white" />
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Continue Learning</h3>
                <p className="text-blue-100">Pick up where you left off</p>
              </div>
            </div>
          </Link>

          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-8 hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 cursor-pointer">
            <div className="flex items-center space-x-4">
              <MessageCircle className="h-12 w-12 text-white" />
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Ask the Tutor</h3>
                <p className="text-green-100">Get instant help with your code</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { topic: 'Pointers in C', language: 'C', time: '2 hours ago', status: 'completed' },
              { topic: 'Variables and Data Types', language: 'C', time: '1 day ago', status: 'completed' },
              { topic: 'Hello World', language: 'Python', time: '2 days ago', status: 'in-progress' },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.status === 'completed' ? 'bg-green-400' : 'bg-yellow-400'
                  }`} />
                  <div>
                    <h4 className="text-white font-medium">{activity.topic}</h4>
                    <p className="text-gray-400 text-sm">{activity.language}</p>
                  </div>
                </div>
                <span className="text-gray-400 text-sm">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;