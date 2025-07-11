import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LearnPracticePage from './pages/LearnPracticePage';
import TopicPage from './pages/TopicPage';
import ChatCodePage from './pages/ChatCodePage';
import QuizPage from './pages/QuizPage';
import NotesPage from './pages/NotesPage';
import ResourcesPage from './pages/ResourcesPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/learn" element={<LearnPracticePage />} />
          <Route path="/learn/:language" element={<TopicPage />} />
          <Route path="/learn/:language/:topic" element={<ChatCodePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;