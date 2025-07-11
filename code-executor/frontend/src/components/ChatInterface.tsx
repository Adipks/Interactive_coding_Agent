import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, CheckCircle } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  language?: string;
  topic?: string;
  currentStep?: number;
  onStepComplete?: () => void;
  onValidateStep?: () => Promise<boolean>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  language, 
  topic, 
  currentStep = 0, 
  onStepComplete,
  onValidateStep
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `Welcome! Let's learn about ${topic?.replace('-', ' ')} in ${language?.toUpperCase()}. I'm here to help you understand the concepts and answer any questions you have. Let's start with step ${currentStep + 1}!`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingStep, setIsValidatingStep] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (currentStep > 0) {
      const stepMessage: Message = {
        id: `step-${currentStep}`,
        type: 'bot',
        content: `Great progress! `,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, stepMessage]);
    }
  }, [currentStep, topic]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // const userId = 'ADi';
      // const sessionId = `session_${Date.now()}`;

      // // Create session
      // const sessionResponse = await fetch(`http://localhost:8083/apps/my_agent/users/${userId}/sessions/${sessionId}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({})
      // });

      // if (!sessionResponse.ok) {
      //   throw new Error('Failed to create session');
      // }

      // Send message (streaming)

      const sessionInfoRes = await fetch("http://localhost:8000/api/session-info");
      const { userId, sessionId } = await sessionInfoRes.json();
      const response = await fetch('http://localhost:8083/run_sse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appName: 'my_agent',
          userId,
          sessionId,
          newMessage: {
            role: 'user',
            parts: [{ text: currentInput }]
          },
          streaming: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body reader');

      let botMessageId = Date.now().toString();
      let accumulatedContent = '';
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (!line.trim().startsWith('data:')) continue;

            const dataStr = line.replace(/^data:\s*/, '');

            if (dataStr === '[DONE]') {
              setIsLoading(false);
              return;
            }

            try {
              const data = JSON.parse(dataStr);
              const text = data?.content?.parts?.[0]?.text;

              if (text) {
                accumulatedContent += text;

                setMessages(prev => {
                  const existingIndex = prev.findIndex(msg => msg.id === botMessageId);
                  const botMessage: Message = {
                    id: botMessageId,
                    type: 'bot',
                    content: accumulatedContent,
                    timestamp: new Date(),
                  };

                  if (existingIndex >= 0) {
                    const newMessages = [...prev];
                    newMessages[existingIndex] = botMessage;
                    return newMessages;
                  } else {
                    return [...prev, botMessage];
                  }
                });
              }
            } catch (parseErr) {
              console.error('JSON parse error:', parseErr, dataStr);
            }
          }
        }
      } finally {
        reader.releaseLock();
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Message send failed:', error);
      setIsLoading(false);

      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: '❌ Could not connect to the agent. Please check if the server is running.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="bg-white/5 border-b border-white/10 p-4 flex-shrink-0">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <Bot className="h-5 w-5 mr-2 text-blue-400" />
          Chat with Tutor
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-messages">
        <style jsx>{`
          .chat-messages::-webkit-scrollbar {
            width: 8px;
          }
          .chat-messages::-webkit-scrollbar-thumb {
            background: rgba(74, 85, 104, 0.8);
            border-radius: 4px;
          }
        `}</style>

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs lg:max-w-sm xl:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-100 border border-white/20'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.type === 'bot' && <Bot className="h-4 w-4 mt-1 text-blue-400" />}
                {message.type === 'user' && <User className="h-4 w-4 mt-1" />}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 max-w-xs">
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4 text-blue-400" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-white/10 p-4 flex-shrink-0">
        <div className="flex space-x-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about the topic..."
            className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white p-2 rounded-lg transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>

        {onStepComplete && (
          <div className="mt-3">
            <button
              onClick={async () => {
                if (onValidateStep) {
                  setIsValidatingStep(true);
                  const isValid = await onValidateStep();
                  setIsValidatingStep(false);
                  
                  if (!isValid) {
                    // Add a message indicating step validation failed
                    const validationMessage: Message = {
                      id: Date.now().toString(),
                      type: 'bot',
                      content: '❌ Step validation failed. Please complete the current step requirements before proceeding.',
                      timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, validationMessage]);
                  }
                } else if (onStepComplete) {
                  onStepComplete();
                }
              }}
              disabled={isValidatingStep}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isValidatingStep ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Validating Step...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Mark Step Complete</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
