import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ChatInterface from '../components/ChatInterface';
import ProgressBar from '../components/ProgressBar';
import Editor from "@monaco-editor/react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";


// Define learning steps for each topic
const topicSteps = {
  'hello-world': ['Setup', 'Code', 'Run', 'Understand'],
  'variables': ['Concept', 'Declaration', 'Assignment', 'Practice', 'Quiz'],
  'data-types': ['Overview', 'Integers', 'Floats', 'Characters', 'Practice'],
  'operators': ['Arithmetic', 'Comparison', 'Logical', 'Assignment', 'Practice'],
  'pointers': ['Concept', 'Declaration', 'Dereferencing', 'Arithmetic', 'Practice'],
  'strings': ['Basics', 'Functions', 'Manipulation', 'Practice'],
  'arrays': ['Declaration', 'Access', 'Iteration', 'Multi-dimensional', 'Practice'],
  'functions': ['Definition', 'Parameters', 'Return Values', 'Scope', 'Practice'],
  'classes': ['Definition', 'Objects', 'Methods', 'Inheritance', 'Practice'],
  'modules': ['Import', 'Create', 'Packages', 'Practice'],
  'exceptions': ['Try-Catch', 'Types', 'Custom', 'Best Practices'],
  'memory-management': ['Allocation', 'Deallocation', 'Memory Leaks', 'Best Practices'],
  'system-calls': ['Overview', 'File Operations', 'Process Control', 'Practice'],
  'file-handling': ['Open', 'Read', 'Write', 'Close', 'Practice'],
  'inheritance': ['Basics', 'Types', 'Virtual Functions', 'Practice'],
  'polymorphism': ['Concept', 'Runtime', 'Compile-time', 'Practice'],
  'templates': ['Function Templates', 'Class Templates', 'Specialization', 'Practice'],
  'smart-pointers': ['unique_ptr', 'shared_ptr', 'weak_ptr', 'Practice'],
  'stl': ['Containers', 'Iterators', 'Algorithms', 'Practice'],
  'concurrency': ['Threads', 'Synchronization', 'Async', 'Practice'],
  'lists': ['Creation', 'Methods', 'Comprehensions', 'Practice'],
  'dictionaries': ['Basics', 'Methods', 'Iteration', 'Practice'],
  'decorators': ['Concept', 'Built-in', 'Custom', 'Practice'],
  'generators': ['Basics', 'Yield', 'Expressions', 'Practice'],
  'async': ['Async/Await', 'Coroutines', 'Event Loop', 'Practice'],
  'hashes': ['Basics', 'Methods', 'Symbols', 'Practice'],
  'blocks': ['Syntax', 'Yield', 'Procs', 'Practice'],
  'methods': ['Definition', 'Parameters', 'Visibility', 'Practice'],
  'metaprogramming': ['Reflection', 'Dynamic Methods', 'DSL', 'Practice'],
  'gems': ['Installation', 'Bundler', 'Creating', 'Practice'],
  'rails': ['MVC', 'Routes', 'Models', 'Practice'],
};

// Function to construct the correct WebSocket URL
function getWebSocketUrl(): string {
  const hostname = window.location.hostname;
  
  // Check if we're in a webcontainer environment (contains specific patterns)
  if (hostname.includes('webcontainer-api.io') || hostname.includes('local-credentialless')) {
    // Replace the frontend port in the hostname with the backend port (8080)
    const backendHostname = hostname.replace(/-5173--/, '-8080--');
    return `ws://${backendHostname}/`;
  } else {
    // For local development, use the hostname with port 8080
    return `ws://${hostname}:8080`;
  }
}

const ChatCodePage: React.FC = () => {
  const { language, topic } = useParams<{ language: string; topic: string }>();
  const [code, setCode] = useState(getInitialCode(language));
  const [currentStep, setCurrentStep] = useState(0);
  const [isValidatingStep, setIsValidatingStep] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  const steps = topicSteps[topic as keyof typeof topicSteps] || ['Learn', 'Practice', 'Master'];
  
  // Function to validate current step
  const validateCurrentStep = async () => {
    setIsValidatingStep(true);
    try {
      const response = await fetch('http://localhost:8000/api/validate-step', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('🔍 Step validation response:', data);
        
        if (data.success === true) {
          console.log('✅ Step validation successful, advancing to next step');
          if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            
            // Reset validation status after advancing to prevent multiple clicks
            try {
              const resetResponse = await fetch('http://localhost:8000/api/validate-step', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ success: false }),
              });
              
              if (resetResponse.ok) {
                console.log('🔄 Step validation status reset to false');
              } else {
                console.error('❌ Failed to reset validation status:', resetResponse.status);
              }
            } catch (resetError) {
              console.error('❌ Error resetting validation status:', resetError);
            }
          }
          return true;
        } else {
          console.log('❌ Step validation failed');
          return false;
        }
      } else {
        console.error('❌ Failed to validate step:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Error validating step:', error);
      return false;
    } finally {
      setIsValidatingStep(false);
    }
  };

  const handleLoadAgentCode = () => {
    fetch("http://localhost:8000/api/editor/code")
      .then((res) => res.json())
      .then((data) => {
        if (data.code && data.code !== code) {
          console.log("📥 Agent code loaded");
          setCode(data.code);
        } else {
          console.log("⚠️ No new code from agent");
        }
      })
      .catch((err) => {
        console.error("❌ Failed to fetch agent code:", err);
      });
  };

  useEffect(() => {
    // Get the correct WebSocket URL
    const wsUrl = getWebSocketUrl();
    
    // Initialize WebSocket connection
    socketRef.current = new WebSocket(wsUrl);
    
    socketRef.current.onopen = () => {
      console.log("🧠 WebSocket connected to code execution backend");
      if (xtermRef.current) {
        xtermRef.current.writeln("🔗 Connected to execution backend");
      }
    };
    
    socketRef.current.onclose = () => {
      console.log("❌ WebSocket disconnected from backend");
      if (xtermRef.current) {
        xtermRef.current.writeln("----------");// Disconnected from backend ----------");
      }
    };
    
    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      if (xtermRef.current) {
        xtermRef.current.writeln("⚠️ Connection error - check backend");
      }
    };

    // Initialize terminal
    if (terminalRef.current && !xtermRef.current) {
      xtermRef.current = new Terminal({
        convertEol: true,
        fontSize: 14,
        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
        theme: {
          background: "#1a1a1a",
          foreground: "#00ff00",
          cursor: "#00ff00",
          selection: "#ffffff20",
        },
        cursorBlink: true,
        rows: 15,
        cols: 80,
      });
      
      fitAddonRef.current = new FitAddon();
      xtermRef.current.loadAddon(fitAddonRef.current);
      xtermRef.current.open(terminalRef.current);
      
      // Fix race condition by delaying the fit() call
      setTimeout(() => {
        if (fitAddonRef.current) {
          fitAddonRef.current.fit();
        }
      }, 100);
      
      xtermRef.current.writeln("💻 Terminal ready. Click 'Run Code' to execute your program.");
      
      // Handle WebSocket messages
      if (socketRef.current) {
        socketRef.current.onmessage = (event) => {
          if (xtermRef.current) {
            // Clean the message data to remove control characters and fix encoding
            let cleanData = event.data;
            
            // Remove invalid UTF-8 characters and control characters (except newlines, carriage returns, tabs)
            cleanData = cleanData.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/g, '');
            
            // Remove the replacement character (�)
            cleanData = cleanData.replace(/\ufffd/g, '');
            
            // Remove any stray 'p' character at the beginning of lines with emojis
            cleanData = cleanData.replace(/^p([📨📤📦✅🚀🏁🔒⚙️📁💻])/gm, '$1');
            
            // Clean up any other stray control characters that might interfere with display
            cleanData = cleanData.replace(/[\x00-\x1F\x7F]/g, function(char) {
              // Keep newlines, carriage returns, and tabs
              if (char === '\n' || char === '\r' || char === '\t') {
                return char;
              }
              return '';
            });
            
            xtermRef.current.write(cleanData);
            
            // Auto-advance progress when code runs successfully (detect success patterns)
            if (cleanData.includes('✅') || cleanData.includes('🏁') || cleanData.includes('Program finished')) {
              // Check step validation after successful code execution
              setTimeout(() => {
                validateCurrentStep();
              }, 2000);
            }
          }
        };
      }
      
      // Handle terminal input (for interactive programs)
      xtermRef.current.onData((data) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify({ 
            type: "input", 
            language: getBackendLanguage(language), 
            payload: data 
          }));
        }
      });
    }

    return () => {
      if (xtermRef.current) {
        xtermRef.current.dispose();
        xtermRef.current = null;
      }
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [language, currentStep, steps.length]);

  const runCode = () => {
    if (!xtermRef.current || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      if (xtermRef.current) {
        xtermRef.current.clear();
        xtermRef.current.writeln("❌ WebSocket not connected. Please check backend connection.");
      }
      return;
    }

    xtermRef.current.clear();
    xtermRef.current.writeln("🔄 Compiling & Running...\n");

    // Prepare the payload to send over WebSocket
    const payload = {
      type: "code",
      language: getBackendLanguage(language),
      payload: code.trim() + "\n__EOF__\n",
    };

    // Send code to the backend
    socketRef.current.send(JSON.stringify(payload));
  };

  const handleStepComplete = () => {
    // Validate step before advancing
    validateCurrentStep();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden shadow-2xl">
          {/* Header - Fixed */}
          <div className="bg-white/5 border-b border-white/10 p-6 flex-shrink-0">
            <h1 className="text-2xl font-bold text-white">
              {language?.toUpperCase()} - {topic?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h1>
          </div>

          {/* Progress Bar - Fixed */}
          <div className="flex-shrink-0">
            <ProgressBar 
              currentStep={currentStep} 
              totalSteps={steps.length} 
              stepLabels={steps}
            />
          </div>

          {/* Main Content Grid - Increased Height */}
          <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-16rem)]">
            {/* Chat Interface - Left Column with Fixed Height */}
            <div className="border-r border-white/10 h-full overflow-hidden">
              <ChatInterface 
                language={language} 
                topic={topic} 
                currentStep={currentStep}
                onStepComplete={handleStepComplete}
                onValidateStep={validateCurrentStep}
              />
            </div>

            {/* Code Editor and Terminal - Right Column with Fixed Height */}
            <div className="h-full flex flex-col overflow-hidden">
              {/* Code Editor - Takes 60% of right column */}
              <div className="h-3/5 border-b border-white/10 overflow-hidden">
                <div className="h-full">
                  <Editor
                    height="100%"
                    language={language === 'cpp' ? 'cpp' : language}
                    value={code}
                    //onChange={(value) => setCode(value || '')}
                    onChange={(value) => {
                      const updatedCode = value || '';
                      setCode(updatedCode);
                    
                      console.log("📝 Editor change triggered");
                    
                      fetch("http://localhost:8000/api/editor/code", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ code: updatedCode }),
                      })
                      .then((res) => {
                        if (!res.ok) {
                          console.error("❌ Failed to save code");
                        }
                        return res.json();
                      })
                      .then((data) => console.log("✅ Code save response:", data))
                      .catch((err) => console.error("❌ Fetch error:", err));
                    }}
                    
                    theme="vs-dark"
                    options={{
                      fontSize: 14,
                      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      wordWrap: 'on',
                      lineNumbers: 'on',
                      renderWhitespace: 'selection',
                      tabSize: 2,
                      insertSpaces: true,
                      scrollbar: {
                        vertical: 'visible',
                        horizontal: 'visible',
                        verticalScrollbarSize: 12,
                        horizontalScrollbarSize: 12,
                      },
                    }}
                  />
                </div>
              </div>

            {/* Run Button - Fixed Height */}
            <div className="bg-white/5 p-4 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={runCode} 
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  ▶️ Run Code
                </button>

                {/* 📥 Load Agent Code Button */}
                <button 
                  onClick={handleLoadAgentCode}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                >
                   Load generated Code
                </button>

                <button 
                  onClick={handleStepComplete}
                  disabled={currentStep >= steps.length - 1 || isValidatingStep}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2"
                >
                  {isValidatingStep ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Validating...</span>
                    </>
                  ) : (
                    <span>Next Step</span>
                  )}
                </button>
              </div>
            </div>

              {/* Terminal - Takes remaining 40% with manual scrollbar */}
              <div className="flex-1 bg-gray-900 overflow-hidden">
                <div className="h-full p-3">
                  <div 
                    ref={terminalRef} 
                    className="h-full w-full rounded border border-gray-700 terminal-container"
                    style={{ 
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#4a5568 #2d3748'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function getBackendLanguage(language?: string): string {
  switch (language) {
    case 'c':
      return 'c';
    case 'cpp':
      return 'cpp';
    case 'python':
      return 'python';
    case 'rust':
      return 'rust';
    default:
      return 'cpp';
  }
}

function getInitialCode(language?: string): string {
  switch (language) {
    case 'c':
      return `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`;

    case 'cpp':
      return `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`;

    case 'python':
      return `print("Hello, World!")`;

    case 'ruby':
      return `puts "Hello, World!"`;

    default:
      return `// Welcome to ${language?.toUpperCase()}\n// Start coding here!`;
  }
}

export default ChatCodePage;