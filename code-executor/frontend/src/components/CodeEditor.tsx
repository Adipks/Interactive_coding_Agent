import React, { useState } from 'react';
import { Play, Square, Trash2, Copy, Download } from 'lucide-react';

interface CodeEditorProps {
  language?: string;
  code: string;
  onChange: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, code, onChange }) => {
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Compiling and running...\n');
    
    // Simulate compilation and execution
    setTimeout(() => {
      if (language === 'c') {
        if (code.includes('printf')) {
          const matches = code.match(/printf\s*\(\s*"([^"]*)"[^)]*\)/g);
          if (matches) {
            const outputs = matches.map(match => {
              const content = match.match(/"([^"]*)"/)?.[1] || '';
              return content.replace(/\\n/g, '\n');
            });
            setOutput(outputs.join(''));
          } else {
            setOutput('Program compiled successfully.\n');
          }
        } else {
          setOutput('Program compiled and executed successfully.\n');
        }
      } else if (language === 'python') {
        if (code.includes('print')) {
          const matches = code.match(/print\s*\(\s*"([^"]*)"[^)]*\)/g);
          if (matches) {
            const outputs = matches.map(match => {
              const content = match.match(/"([^"]*)"/)?.[1] || '';
              return content;
            });
            setOutput(outputs.join('\n') + '\n');
          } else {
            setOutput('Program executed successfully.\n');
          }
        } else {
          setOutput('Program executed successfully.\n');
        }
      } else {
        setOutput('Code executed successfully!\n');
      }
      setIsRunning(false);
    }, 1500);
  };

  const handleClear = () => {
    onChange('');
    setOutput('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  const getLanguageForDisplay = () => {
    return language?.toUpperCase() || 'CODE';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white/5 border-b border-white/10 p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <span className="text-green-400 mr-2">💻</span>
          {getLanguageForDisplay()} Editor
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            title="Copy code"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={handleClear}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            title="Clear editor"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4">
          <textarea
            value={code}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full bg-slate-900 text-green-400 font-mono text-sm p-4 rounded-lg border border-white/20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Write your ${language?.toUpperCase()} code here...`}
            spellCheck={false}
          />
        </div>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center space-x-2 mb-3">
            <button
              onClick={handleRun}
              disabled={isRunning || !code.trim()}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors font-medium"
            >
              {isRunning ? (
                <>
                  <Square className="h-4 w-4" />
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Run</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-900 rounded-lg p-4 min-h-[100px] border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm font-medium">Output</span>
            </div>
            <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
              {output || 'Click "Run" to see output...'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;