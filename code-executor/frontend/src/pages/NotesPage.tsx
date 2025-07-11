import React from 'react';

const NotesPage: React.FC = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">📝 My Notes</h1>
          <p className="text-gray-300 text-lg">Keep track of important concepts and code snippets</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
          <div className="text-center">
            <div className="text-6xl mb-6">📚</div>
            <h2 className="text-2xl font-bold text-white mb-4">Notes Feature Coming Soon!</h2>
            <p className="text-gray-300">Create, organize, and share your learning notes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesPage;