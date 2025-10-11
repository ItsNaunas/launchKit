'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { cn } from '@/lib/utils';
import { useAutoResizeTextarea } from '@/hooks/use-auto-resize-textarea';
import {
  ArrowUpIcon,
  Paperclip,
  PlusIcon,
  Target,
  TrendingUp,
  Globe,
} from 'lucide-react';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

interface ConversationalIntakeProps {
  onComplete: (data: any) => void;
  initialBusinessIdea?: string;
}

export default function ConversationalIntake({ onComplete, initialBusinessIdea }: ConversationalIntakeProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize conversation with business idea if provided
  useEffect(() => {
    if (initialBusinessIdea && messages.length === 0) {
      // Start the conversation with the business idea
      setTimeout(async () => {
        setIsLoading(true);
        try {
          // Start conversation and get conversationId
          const response = await fetch('/api/intake/conversation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              message: '', 
              step: 'start',
              initialBusinessIdea: initialBusinessIdea 
            }),
          });
          
          const data = await response.json();
          setConversationId(data.conversationId);
          
          // Add user message
          const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: initialBusinessIdea,
            timestamp: new Date(),
          };
          
          // Add AI response
          const aiMessage: Message = {
            id: Date.now().toString() + '_ai',
            type: 'ai',
            content: data.nextQuestion,
            timestamp: new Date(),
          };
          
          setMessages([userMessage, aiMessage]);
          setProgress(data.progress || 0);
        } catch (error) {
          console.error('Error starting conversation:', error);
        } finally {
          setIsLoading(false);
        }
      }, 500);
    }
  }, [initialBusinessIdea, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Only start conversation if no initial business idea
    if (!initialBusinessIdea) {
      startConversation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startConversation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/intake/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: '', 
          step: 'start',
          initialBusinessIdea: initialBusinessIdea 
        }),
      });
      
      const data = await response.json();
      setConversationId(data.conversationId);
      
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'ai',
        content: data.nextQuestion,
        timestamp: new Date(),
      };
      
      setMessages([welcomeMessage]);
      setProgress(data.progress || 0);
    } catch (error) {
      console.error('Error starting conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!currentInput.trim() || isLoading || !conversationId) {
      console.log('Send message blocked:', { 
        hasInput: !!currentInput.trim(), 
        isLoading, 
        conversationId 
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentInput,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    adjustHeight(true); // Reset textarea height
    setIsLoading(true);

    try {
      console.log('Sending message:', { message: currentInput, conversationId, step: 'continue' });
      const response = await fetch('/api/intake/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          conversationId,
          step: 'continue',
        }),
      });

      const data = await response.json();
      console.log('API response:', data);
      
      if (data.nextQuestion) {
        const aiMessage: Message = {
          id: Date.now().toString() + '_ai',
          type: 'ai',
          content: data.nextQuestion,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setProgress(data.progress || 0);
      }

      if (data.isComplete) {
        setIsComplete(true);
        onComplete(data.gatheredData);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentInput.trim()) {
        sendMessage();
      }
    }
  };

  if (isComplete) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-mint-500 to-mint-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Your Business Kit is Ready!</h2>
            <p className="text-gray-300 text-lg">I&apos;ve gathered all the details I need to create your personalized roadmap</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-mint-500/10 to-mint-600/10"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-white mb-3">Business Case</h3>
                <p className="text-gray-300 mb-4">Market positioning, pricing strategy, and competitive analysis tailored to your idea.</p>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-sm">Unlock to see full analysis</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-600/10"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-white mb-3">Content Strategy</h3>
                <p className="text-gray-300 mb-4">30-day content calendar with viral hooks and channel-specific optimization.</p>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-sm">Unlock to see full strategy</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-mint-500/10 to-mint-600/10"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-white mb-3">Website Template</h3>
                <p className="text-gray-300 mb-4">Custom landing page optimized for conversions and your brand.</p>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-sm">Unlock to see full template</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-mint-500 to-mint-600 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Unlock Your Complete Business Kit</h3>
              <p className="text-blue-100 mb-6">Get instant access to your personalized roadmap</p>
              <Button 
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-4 text-lg"
              >
                Unlock Now - £37
              </Button>
              <p className="text-blue-200 text-sm mt-4">No subscriptions • Instant access • Money-back guarantee</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-black to-dark rounded-2xl border border-mint-600/20 overflow-hidden">
        {/* Header */}
        <div className="bg-dark px-6 py-4 border-b border-mint-600/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-mint-500 to-mint-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">AI Business Consultant</h3>
                <p className="text-gray-400 text-sm">Gathering your business details</p>
              </div>
            </div>
              <div className="text-right">
                <div className="text-white text-sm font-medium">{Math.round(progress * 100)}% Complete</div>
                <div className="w-24 bg-black/50 rounded-full h-2 mt-1">
                  <div 
                    className="bg-gradient-to-r from-mint-500 to-mint-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress * 100}%` }}
                  ></div>
                </div>
              </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-mint-500 to-mint-600 text-white'
                    : 'bg-dark text-gray-100 border border-mint-600/20'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-dark text-gray-100 px-4 py-3 rounded-2xl border border-mint-600/20">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-mint-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-mint-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-mint-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-dark px-6 py-4 border-t border-mint-600/20">
          <div className="relative rounded-xl border border-mint-600/30 bg-black/20">
            <div className="overflow-y-auto">
              <Textarea
                ref={textareaRef}
                value={currentInput}
                onChange={(e) => {
                  setCurrentInput(e.target.value);
                  adjustHeight();
                }}
                onKeyDown={handleKeyPress}
                placeholder="Type your response..."
                disabled={isLoading}
                className={cn(
                  'w-full px-4 py-3',
                  'resize-none',
                  'bg-transparent',
                  'border-none',
                  'text-sm',
                  'focus:outline-none',
                  'focus-visible:ring-0 focus-visible:ring-offset-0',
                  'placeholder:text-sm',
                  'min-h-[60px]',
                  'text-white',
                  'placeholder:text-gray-400'
                )}
                style={{
                  overflow: 'hidden',
                }}
              />
            </div>

            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="group hover:bg-mint-600/20 flex items-center gap-1 rounded-lg p-2 border-mint-600/30 text-gray-300"
                >
                  <Paperclip className="h-4 w-4" />
                  <span className="hidden text-xs transition-opacity group-hover:inline">
                    Attach
                  </span>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="border-mint-600/30 flex items-center justify-between gap-1 rounded-lg border border-dashed px-2 py-1 text-sm transition-colors bg-mint-600/10 text-gray-300"
                >
                  <PlusIcon className="h-4 w-4" />
                  Project
                </Button>
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!currentInput.trim() || isLoading}
                  className={cn(
                    'border-mint-600/30 flex items-center justify-between gap-1 rounded-lg border px-1.5 py-1.5 text-sm transition-colors',
                    currentInput.trim() && !isLoading ? 'bg-mint-500 text-white' : 'text-gray-400',
                  )}
                >
                  {isLoading ? (
                    <svg className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ) : (
                    <ArrowUpIcon
                      className={cn(
                        'h-4 w-4',
                        currentInput.trim() && !isLoading ? 'text-white' : 'text-gray-400',
                      )}
                    />
                  )}
                  <span className="sr-only">Send</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4">
            <div className="flex flex-col flex-wrap items-start gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-3 sm:overflow-x-auto sm:pb-2">
              <ActionButton
                icon={<Target className="h-4 w-4" />}
                label="Business Strategy"
              />
              <ActionButton
                icon={<TrendingUp className="h-4 w-4" />}
                label="Content Planning"
              />
              <ActionButton
                icon={<Globe className="h-4 w-4" />}
                label="Website Design"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
}

function ActionButton({ icon, label }: ActionButtonProps) {
  return (
    <Button
      type="button"
      variant="secondary"
      className="border-mint-600/30 bg-mint-600/10 flex w-full flex-shrink-0 items-center gap-2 rounded-full border px-3 py-2 whitespace-nowrap transition-colors sm:w-auto sm:px-4 text-gray-300 hover:bg-mint-600/20"
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Button>
  );
}
