import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { X, ChevronRight, ChevronDown } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  forceCollapsible?: boolean;
}

const topicData = {
  c: {
    beginner: [
      { id: 'hello-world', name: 'Hello World' },
      { id: 'variables', name: 'Variables' },
      { id: 'data-types', name: 'Data Types' },
      { id: 'operators', name: 'Operators' },
    ],
    intermediate: [
      { id: 'pointers', name: 'Pointers' },
      { id: 'strings', name: 'Strings' },
      { id: 'arrays', name: 'Arrays' },
      { id: 'functions', name: 'Functions' },
    ],
    advanced: [
      { id: 'memory-management', name: 'Memory Management' },
      { id: 'system-calls', name: 'System Calls' },
      { id: 'file-handling', name: 'File Handling' },
    ],
  },
  python: {
    beginner: [
      { id: 'hello-world', name: 'Hello World' },
      { id: 'variables', name: 'Variables' },
      { id: 'lists', name: 'Lists' },
      { id: 'dictionaries', name: 'Dictionaries' },
    ],
    intermediate: [
      { id: 'classes', name: 'Classes' },
      { id: 'modules', name: 'Modules' },
      { id: 'exceptions', name: 'Exception Handling' },
    ],
    advanced: [
      { id: 'decorators', name: 'Decorators' },
      { id: 'generators', name: 'Generators' },
      { id: 'async', name: 'Async Programming' },
    ],
  },
  cpp: {
    beginner: [
      { id: 'hello-world', name: 'Hello World' },
      { id: 'variables', name: 'Variables' },
      { id: 'data-types', name: 'Data Types' },
      { id: 'operators', name: 'Operators' },
    ],
    intermediate: [
      { id: 'classes', name: 'Classes' },
      { id: 'inheritance', name: 'Inheritance' },
      { id: 'polymorphism', name: 'Polymorphism' },
      { id: 'templates', name: 'Templates' },
    ],
    advanced: [
      { id: 'smart-pointers', name: 'Smart Pointers' },
      { id: 'stl', name: 'STL' },
      { id: 'concurrency', name: 'Concurrency' },
    ],
  },
  ruby: {
    beginner: [
      { id: 'hello-world', name: 'Hello World' },
      { id: 'variables', name: 'Variables' },
      { id: 'arrays', name: 'Arrays' },
      { id: 'hashes', name: 'Hashes' },
    ],
    intermediate: [
      { id: 'classes', name: 'Classes' },
      { id: 'modules', name: 'Modules' },
      { id: 'blocks', name: 'Blocks' },
      { id: 'methods', name: 'Methods' },
    ],
    advanced: [
      { id: 'metaprogramming', name: 'Metaprogramming' },
      { id: 'gems', name: 'Gems' },
      { id: 'rails', name: 'Rails Basics' },
    ],
  },
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, forceCollapsible = false }) => {
  const location = useLocation();
  const { language, topic } = useParams();
  const [expandedSections, setExpandedSections] = React.useState<string[]>(['beginner']);

  const currentTopics = topicData[language as keyof typeof topicData] || topicData.c;

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  // For non-collapsible sidebars (like TopicPage), always show
  const shouldShow = forceCollapsible ? isOpen : true;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && forceCollapsible && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white/10 backdrop-blur-md border-r border-white/20 z-40 transform transition-transform duration-300 ease-in-out ${
          shouldShow ? 'translate-x-0' : '-translate-x-full'
        } ${!forceCollapsible ? 'lg:translate-x-0' : ''}`}
      >
        <div className={`flex items-center justify-between p-4 border-b border-white/20 ${!forceCollapsible ? 'hidden' : 'lg:hidden'}`}>
          <h2 className="text-lg font-semibold text-white">Topics</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-2 overflow-y-auto h-full">
          {Object.entries(currentTopics).map(([section, topics]) => (
            <div key={section} className="space-y-1">
              <button
                onClick={() => toggleSection(section)}
                className="flex items-center justify-between w-full p-2 text-left text-white hover:bg-white/10 rounded-md transition-colors"
              >
                <span className="font-medium capitalize">{section}</span>
                {expandedSections.includes(section) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              
              {expandedSections.includes(section) && (
                <div className="ml-4 space-y-1">
                  {topics.map((topicItem) => {
                    const isActive = topic === topicItem.id;
                    return (
                      <Link
                        key={topicItem.id}
                        to={`/learn/${language}/${topicItem.id}`}
                        onClick={forceCollapsible ? onClose : undefined}
                        className={`block p-2 pl-4 rounded-md text-sm transition-all duration-200 ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-gray-200 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {topicItem.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;