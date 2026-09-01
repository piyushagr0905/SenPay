import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, MessageSquareWarning, User, AlertTriangle, ShieldCheck, Copy } from 'lucide-react';
import { askSentinel } from '../utils/api';
import { haptics } from '../utils/haptics';

interface AskSentinelScreenProps {
  onBack: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  isScamDetected?: boolean;
}

export const AskSentinelScreen: React.FC<AskSentinelScreenProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'bot',
      text: 'Hi. Paste any suspicious WhatsApp message, SMS, or job offer here, and I will check it for scam patterns.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    haptics.light();

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: input.trim()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askSentinel(userMessage.text);
      const isScam = response.analysisResult?.riskLevel === 'Severe' || response.analysisResult?.riskLevel === 'High';
      if (isScam) haptics.error(); else haptics.success();
      
      const botMessage: ChatMessage = {
        id: response.id,
        sender: 'bot',
        text: response.text,
        isScamDetected: isScam
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: 'Sorry, I encountered an error connecting to the safety server.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-surface-bg font-apple max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <button
          onClick={() => { haptics.light(); onBack(); }}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-6 h-6 text-ink-primary" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-sentinel-50 flex items-center justify-center border border-sentinel-100">
            <MessageSquareWarning className="w-4 h-4 text-sentinel-shield" />
          </div>
          <div>
            <h1 className="font-bold text-[16px] text-ink-primary leading-tight">Message Analyzer</h1>
            <p className="text-[11px] text-ink-secondary">SENTINEL AI</p>
          </div>
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-2.5 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-sentinel-900 flex items-center justify-center shrink-0 shadow-sm border border-sentinel-800">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className={`px-4 py-3 rounded-[20px] ${
                  msg.sender === 'user' 
                  ? 'bg-sentinel-900 text-white rounded-tr-[4px] shadow-sm' 
                  : msg.isScamDetected 
                  ? 'bg-rose-50 border border-rose-100 text-rose-950 rounded-tl-[4px] shadow-sm'
                  : 'bg-white border border-gray-100 text-ink-primary rounded-tl-[4px] shadow-sm'
                }`}>
                  {msg.sender === 'bot' && msg.isScamDetected && (
                    <div className="flex items-center gap-1.5 mb-2 text-rose-700 font-bold text-[11px] uppercase tracking-wider">
                      <AlertTriangle className="w-3.5 h-3.5" /> High Risk Detected
                    </div>
                  )}
                  {msg.sender === 'bot' && msg.isScamDetected === false && msg.id !== 'init' && (
                    <div className="flex items-center gap-1.5 mb-2 text-emerald-700 font-bold text-[11px] uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5" /> Safe Message
                    </div>
                  )}
                  <p className="text-[14px] whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex gap-2.5 max-w-[80%] flex-row">
                <div className="w-7 h-7 rounded-full bg-sentinel-900 flex items-center justify-center shrink-0 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <div className="px-5 py-4 rounded-[20px] bg-white border border-gray-100 rounded-tl-[4px] shadow-sm flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 bg-ink-faint rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-ink-faint rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                  <span className="w-1.5 h-1.5 bg-ink-faint rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} className="h-2" />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 pb-[calc(env(safe-area-inset-bottom)+16px)]">
        <div className="flex items-center gap-2 bg-surface-subtle p-1.5 rounded-3xl border border-gray-200 focus-within:border-sentinel-accent focus-within:bg-white transition-all">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-ink-muted hover:text-ink-primary active:scale-95 transition-all shrink-0">
            <Copy className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Paste a message here..."
            className="flex-1 bg-transparent px-2 text-[15px] focus:outline-none text-ink-primary placeholder-ink-muted"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-full bg-sentinel-900 text-white flex items-center justify-center disabled:opacity-50 disabled:bg-gray-300 transition-colors shrink-0 active:scale-95"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
