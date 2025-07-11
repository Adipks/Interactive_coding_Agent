import React from 'react';

const ResourcesPage: React.FC = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">📚 Resources</h1>
          <p className="text-gray-300 text-lg">Additional learning materials and references</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
          <div className="text-center">
            <div className="text-6xl mb-6">🔗</div>
            <h2 className="text-2xl font-bold text-white mb-4">Resources Coming Soon!</h2>
            <p className="text-gray-300">Access curated learning materials, documentation, and tutorials.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;