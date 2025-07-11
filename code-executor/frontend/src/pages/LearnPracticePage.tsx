import React from 'react';
import { Link } from 'react-router-dom';

const languages = [
  {
    id: 'c',
    name: 'C',
    description: 'Low-level programming language',
    color: 'from-blue-500 to-blue-700',
    icon: '🔧',
  },
  {
    id: 'python',
    name: 'Python',
    description: 'High-level, versatile language',
    color: 'from-green-500 to-green-700',
    icon: '🐍',
  },
  {
    id: 'cpp',
    name: 'C++',
    description: 'Object-oriented C extension',
    color: 'from-purple-500 to-purple-700',
    icon: '⚙️',
  },
  {
    id: 'ruby',
    name: 'Ruby',
    description: 'Dynamic, elegant language',
    color: 'from-red-500 to-red-700',
    icon: '💎',
  },
  {
    id: 'rust',
    name: 'Rust',
    description: 'Systems programming language',
    color: 'from-orange-500 to-orange-700',
    icon: '🦀',
  },
];

const LearnPracticePage: React.FC = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">🌍 Select a Language</h1>
          <p className="text-gray-300 text-lg">Choose a programming language to start your learning journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {languages.map((language) => (
            <Link
              key={language.id}
              to={`/learn/${language.id}`}
              className="group relative overflow-hidden bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${language.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className="text-6xl mb-4">{language.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{language.name}</h3>
                <p className="text-gray-300">{language.description}</p>
                
                <div className="mt-6 flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                  <span className="text-sm font-medium">Start Learning</span>
                  <svg
                    className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearnPracticePage;