import React from 'react';
import { useParams, Link } from 'react-router-dom';

const topicData = {
  c: {
    name: 'C Programming',
    icon: '🔧',
    topics: {
      beginner: [
        { id: 'hello-world', name: 'Hello World', description: 'Your first C program' },
        { id: 'variables', name: 'Variables', description: 'Store and manipulate data' },
        { id: 'data-types', name: 'Data Types', description: 'Understanding different data types' },
        { id: 'operators', name: 'Operators', description: 'Arithmetic and logical operations' },
      ],
      intermediate: [
        { id: 'pointers', name: 'Pointers', description: 'Memory addresses and indirection' },
        { id: 'strings', name: 'Strings', description: 'Working with character arrays' },
        { id: 'arrays', name: 'Arrays', description: 'Collections of similar data' },
        { id: 'functions', name: 'Functions', description: 'Modular programming' },
      ],
      advanced: [
        { id: 'memory-management', name: 'Memory Management', description: 'Dynamic allocation and deallocation' },
        { id: 'system-calls', name: 'System Calls', description: 'Interacting with the operating system' },
        { id: 'file-handling', name: 'File Handling', description: 'Reading and writing files' },
      ],
    },
  },
  python: {
    name: 'Python Programming',
    icon: '🐍',
    topics: {
      beginner: [
        { id: 'hello-world', name: 'Hello World', description: 'Your first Python program' },
        { id: 'variables', name: 'Variables', description: 'Store and manipulate data' },
        { id: 'lists', name: 'Lists', description: 'Ordered collections of items' },
        { id: 'dictionaries', name: 'Dictionaries', description: 'Key-value data structures' },
      ],
      intermediate: [
        { id: 'classes', name: 'Classes', description: 'Object-oriented programming' },
        { id: 'modules', name: 'Modules', description: 'Organizing code into modules' },
        { id: 'exceptions', name: 'Exception Handling', description: 'Handling errors gracefully' },
      ],
      advanced: [
        { id: 'decorators', name: 'Decorators', description: 'Modifying functions and classes' },
        { id: 'generators', name: 'Generators', description: 'Creating iterators efficiently' },
        { id: 'async', name: 'Async Programming', description: 'Asynchronous programming patterns' },
      ],
    },
  },
  cpp: {
    name: 'C++ Programming',
    icon: '⚙️',
    topics: {
      beginner: [
        { id: 'hello-world', name: 'Hello World', description: 'Your first C++ program' },
        { id: 'variables', name: 'Variables', description: 'Store and manipulate data' },
        { id: 'data-types', name: 'Data Types', description: 'Understanding different data types' },
        { id: 'operators', name: 'Operators', description: 'Arithmetic and logical operations' },
      ],
      intermediate: [
        { id: 'classes', name: 'Classes', description: 'Object-oriented programming' },
        { id: 'inheritance', name: 'Inheritance', description: 'Code reuse through inheritance' },
        { id: 'polymorphism', name: 'Polymorphism', description: 'Multiple forms of functions' },
        { id: 'templates', name: 'Templates', description: 'Generic programming' },
      ],
      advanced: [
        { id: 'smart-pointers', name: 'Smart Pointers', description: 'Modern memory management' },
        { id: 'stl', name: 'STL', description: 'Standard Template Library' },
        { id: 'concurrency', name: 'Concurrency', description: 'Multi-threading programming' },
      ],
    },
  },
  ruby: {
    name: 'Ruby Programming',
    icon: '💎',
    topics: {
      beginner: [
        { id: 'hello-world', name: 'Hello World', description: 'Your first Ruby program' },
        { id: 'variables', name: 'Variables', description: 'Store and manipulate data' },
        { id: 'arrays', name: 'Arrays', description: 'Ordered collections of items' },
        { id: 'hashes', name: 'Hashes', description: 'Key-value data structures' },
      ],
      intermediate: [
        { id: 'classes', name: 'Classes', description: 'Object-oriented programming' },
        { id: 'modules', name: 'Modules', description: 'Mixins and namespaces' },
        { id: 'blocks', name: 'Blocks', description: 'Code blocks and iterators' },
        { id: 'methods', name: 'Methods', description: 'Defining and calling methods' },
      ],
      advanced: [
        { id: 'metaprogramming', name: 'Metaprogramming', description: 'Code that writes code' },
        { id: 'gems', name: 'Gems', description: 'Ruby package management' },
        { id: 'rails', name: 'Rails Basics', description: 'Web framework introduction' },
      ],
    },
  },
};

const TopicPage: React.FC = () => {
  const { language } = useParams<{ language: string }>();
  const currentLanguage = topicData[language as keyof typeof topicData] || topicData.c;

  const difficultyColors = {
    beginner: 'from-green-500 to-green-700',
    intermediate: 'from-yellow-500 to-orange-600',
    advanced: 'from-red-500 to-red-700',
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{currentLanguage.icon}</div>
          <h1 className="text-4xl font-bold text-white mb-4">Learn {currentLanguage.name}</h1>
          <p className="text-gray-300 text-lg">Select a topic to begin your learning journey</p>
        </div>

        <div className="space-y-12">
          {Object.entries(currentLanguage.topics).map(([difficulty, topics]) => (
            <div key={difficulty}>
              <div className="flex items-center mb-6">
                <div className={`bg-gradient-to-r ${difficultyColors[difficulty as keyof typeof difficultyColors]} text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide`}>
                  {difficulty}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map((topic) => (
                  <Link
                    key={topic.id}
                    to={`/learn/${language}/${topic.id}`}
                    className="group bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                  >
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">{topic.name}</h3>
                    <p className="text-gray-300 mb-4">{topic.description}</p>
                    
                    <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                      <span className="text-sm font-medium">Start Topic</span>
                      <svg
                        className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicPage;