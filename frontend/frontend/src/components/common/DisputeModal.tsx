import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, FileText, CheckCircle2 } from 'lucide-react';
import { haptics } from '../../utils/haptics';
import { PaymentTransaction } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: PaymentTransaction | null;
}

type Message = { id: string; sender: 'ai' | 'user'; text: string };

export const DisputeModal: React.FC<DisputeModalProps> = ({ isOpen, onClose, transaction }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isResolved, setIsResolved] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && transaction && messages.length === 0) {
      setMessages([
        { 
          id: '1', 
          sender: 'ai', 
          text: `Hi! I'm Sentinel AI. I see you want to dispute the payment of ${formatCurrency(transaction.amount)} to ${transaction.recipient.name}. Can you tell me what happened?` 
        }
      ]);
    } else if (!isOpen) {
      setMessages([]);
      setIsResolved(false);
      setInputText('');
    }
  }, [isOpen, transaction]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    haptics.light();
    
    const newMsg: Message = { id: Date.now().toString(), sender: 'user', text: inputText };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    
    // Simulate AI response
    setTimeout(() => {
      haptics.medium();
      if (messages.length === 1) {
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          sender: 'ai', 
          text: "I understand. I am analyzing the merchant's history and filing a provisional chargeback with your bank right now." 
        }]);
        
        setTimeout(() => {
          haptics.success();
          setIsResolved(true);
          setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            sender: 'ai', 
            text: "Success! A temporary credit has been issued to your account while the bank investigates. You don't need to do anything else." 
          }]);
        }, 3000);
      }
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 300 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 300 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full sm:max-w-md bg-surface-bg rounded-t-[32px] sm:rounded-[32px] h-[85vh] sm:h-[600px] flex flex-col shadow-2xl overflow-hidden font-apple"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Bot className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-bold text-ink-primary">AI Dispute Resolution</h2>
                <p className="text-xs text-ink-secondary">Sentinel AI Agent</p>
              </div>
            </div>
            <button onClick={() => { haptics.light(); onClose(); }} className="p-2 bg-gray-50 rounded-full active:scale-95 text-ink-muted">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map(msg => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center ${msg.sender === 'user' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-600 text-white'}`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-3.5 rounded-[20px] max-w-[75%] text-[14px] leading-relaxed ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-gray-100 text-ink-primary shadow-sm rounded-tl-none'}`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100 shrink-0">
            {isResolved ? (
              <div className="flex items-center justify-center gap-2 p-3 bg-green-50 text-green-700 rounded-xl font-bold border border-green-100">
                <CheckCircle2 className="w-5 h-5" /> Dispute Filed Successfully
              </div>
            ) : (
              <div className="flex items-center gap-2 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Explain the issue..."
                  className="flex-1 pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                />
                <button 
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className="absolute right-2 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:opacity-50 transition-opacity active:scale-95"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
