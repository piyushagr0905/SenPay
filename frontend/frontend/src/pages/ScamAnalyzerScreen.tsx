import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 Sparkles,
 ArrowLeft,
 AlertTriangle,
 Send,
 Loader2,
 Bot,
 User,
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { Modal } from '../components/common/Modal';
import { ScamMessageAnalysis } from '../types';
import { fetchScamMessages, analyzeMessage } from '../utils/api';
// import { analyzeScamMessage } from '../utils/riskEngine';

interface ScamAnalyzerScreenProps {
 onBack: () => void;
}

export const ScamAnalyzerScreen: React.FC<ScamAnalyzerScreenProps> = ({ onBack }) => {
 const [messageText, setMessageText] = useState('');
 const [senderInfo, setSenderInfo] = useState('');
 const [isAnalyzing, setIsAnalyzing] = useState(false);
 const [analysisProgress, setAnalysisProgress] = useState('Reading context...');
 const [analysisResult, setAnalysisResult] = useState<ScamMessageAnalysis | null>(null);

 // Real DB Samples
 const [sampleScamMessages, setSampleScamMessages] = useState<ScamMessageAnalysis[]>([]);

 React.useEffect(() => {
 fetchScamMessages()
 .then((data) => {
 setSampleScamMessages(data);
 if (data.length > 0) setMessageText(data[0].rawText);
 })
 .catch((err) => console.error("Error fetching scam messages:", err));
 }, []);

 const resultRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 if (analysisResult && resultRef.current) {
 setTimeout(() => {
 resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
 }, 100);
 }
 }, [analysisResult]);

 // Ask Sentinel Chat Modal State
 const [isChatOpen, setIsChatOpen] = useState(false);
 const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
 {
 sender: 'bot',
 text: 'Hello bro! I analyzed this job message. It matches known advance-fee recruitment scams. What questions do you have?',
 },
 ]);
 const [chatInput, setChatInput] = useState('');
 const [isBotTyping, setIsBotTyping] = useState(false);

 const handleAnalyze = async () => {
 if (!messageText.trim()) return;
 setIsAnalyzing(true);
 setAnalysisResult(null);

 setAnalysisProgress('Sending message to SENTINEL AI Engine...');

 try {
 const result = await analyzeMessage(messageText, senderInfo);
 setAnalysisProgress('Scanning complete...');
 setTimeout(() => {
 setAnalysisResult(result);
 setIsAnalyzing(false);
 }, 800);
 } catch (error) {
 console.error(error);
 setAnalysisProgress('Failed to analyze. Check server connection.');
 setTimeout(() => setIsAnalyzing(false), 2000);
 }
 };

 const handleSendChat = () => {
 if (!chatInput.trim()) return;
 const userMsg = chatInput;
 setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
 setChatInput('');
 setIsBotTyping(true);

 setTimeout(() => {
 setIsBotTyping(false);
 let reply = 'Legitimate employers will never ask for payment via personal UPI before giving you a job. We recommend blocking this contact immediately.';
 if (userMsg.toLowerCase().includes('money') || userMsg.toLowerCase().includes('safe')) {
 reply = 'Do not transfer any amount. Once sent via UPI, funds are difficult to recover. Always contact the company through their official verified careers website.';
 } else if (userMsg.toLowerCase().includes('police') || userMsg.toLowerCase().includes('report')) {
 reply = 'You can report this number directly to the National Cyber Crime Portal or call 1930 Helpline. We can also generate an incident timeline for you in the Protect tab.';
 }
 setChatMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
 }, 1000);
 };

 return (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0 }}
 className="p-4 space-y-4 w-full max-w-lg mx-auto pb-12 overflow-x-hidden"
 >
 {/* Top Bar */}
 <div className="flex items-center justify-between">
 <button
 onClick={onBack}
 className="font-semibold p-2 rounded-full bg-white/70 hover:bg-white border border-white/80 shadow-sm text-ink-secondary hover:text-ink-primary transition-all active:scale-95 flex items-center gap-1 text-xs"
 >
 <ArrowLeft className="w-4 h-4" />
 <span>Back</span>
 </button>

 <h1 className="font-bold text-base text-ink-primary tracking-tight">AI Scam Analyzer</h1>

 <div className="w-8" />
 </div>

 {/* Screen Title & Subtitle */}
 <div className="space-y-1">
 <h2 className="font-bold text-xl text-ink-primary tracking-tight font-apple">
 Analyze a suspicious message
 </h2>
 <p className="text-xs text-ink-secondary">
 Paste the message you received.
 </p>
 </div>

 {/* Sample Quick Chips */}
 <div>
 <span className="text-[11px] text-ink-muted uppercase tracking-wider block mb-1.5">
 Try Sample Scenarios:
 </span>
 <div className="grid grid-cols-3 gap-1.5">
 {sampleScamMessages.slice(0, 3).map((sample) => (
 <button
 key={sample.id}
 onClick={() => {
 setMessageText(sample.rawText);
 setAnalysisResult(null);
 }}
 className={`p-2 rounded-xl text-left border transition-all text-xs ${messageText === sample.rawText
 ? 'bg-blue-50 border-sentinel-accent text-blue-950 '
 : 'bg-white/80 border-gray-200 text-ink-secondary hover:bg-white'
 }`}
 >
 <p className="text-[11px] truncate">{sample.detectedType}</p>
 <p className="text-[9px] text-ink-muted mt-0.5">{sample.riskLevel}</p>
 </button>
 ))}
 </div>
 </div>

 {/* Large Glass Textarea & Sender Input */}
 <GlassCard className="p-3.5 space-y-3">
 <div>
 <label className="text-[10px] text-ink-muted uppercase tracking-wider block mb-1">
 Sender Information (Optional)
 </label>
 <input
 type="text"
 value={senderInfo}
 onChange={(e) => setSenderInfo(e.target.value)}
 placeholder="Who sent this? (e.g. +91 9988776655, 'Unknown', 'Mom')"
 className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200/80 text-xs text-ink-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sentinel-accent/40 shadow-inner"
 />
 </div>
 <div>
 <label className="text-[10px] text-ink-muted uppercase tracking-wider block mb-1">
 Message Content
 </label>
 <textarea
 rows={4}
 value={messageText}
 onChange={(e) => setMessageText(e.target.value)}
 placeholder="Paste SMS, WhatsApp message, email or job offer…"
 className="w-full p-3 rounded-xl bg-white border border-gray-200/80 text-xs text-ink-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sentinel-accent/40 shadow-inner resize-none font-apple"
 />
 </div>

 <GlassButton
 variant="primary"
 fullWidth
 size="lg"
 disabled={isAnalyzing || !messageText.trim()}
 onClick={handleAnalyze}
 leftIcon={
 isAnalyzing ? (
 <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
 ) : (
 <Sparkles className="w-4 h-4 text-blue-400" />
 )
 }
 >
 {isAnalyzing ? analysisProgress : 'Analyze with SENTINEL'}
 </GlassButton>
 </GlassCard>

 {/* Structured AI Analysis Result Card */}
 <AnimatePresence>
 {analysisResult && (
 <motion.div
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0 }}
 className="space-y-3"
 >
 {/* Header Result Card */}
 <GlassCard className={`p-4 ${
 analysisResult.riskLevel === 'Safe' ? 'bg-gradient-to-br from-emerald-50/80 via-white/90 to-green-50/60 border-emerald-200/80' :
 analysisResult.riskLevel === 'Low' ? 'bg-gradient-to-br from-yellow-50/80 via-white/90 to-amber-50/60 border-yellow-200/80' :
 'bg-gradient-to-br from-rose-50/80 via-white/90 to-amber-50/60 border-rose-200/80'
 } shadow-md space-y-3`} ref={resultRef}>
 <div className="flex items-start justify-between gap-3">
 <div className="flex-1 min-w-0">
 <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-1.5 ${
 analysisResult.riskLevel === 'Safe' ? 'text-emerald-700 bg-emerald-100' :
 analysisResult.riskLevel === 'Low' ? 'text-yellow-700 bg-yellow-100' :
 'text-rose-700 bg-rose-100'
 }`}>
 {analysisResult.riskLevel === 'Safe' ? 'Safe Message' : 'Pattern Match Found'}
 </span>
 <h3 className="font-bold text-base text-ink-primary tracking-tight font-apple leading-tight">
 {analysisResult.detectedType}
 </h3>
 </div>

 <div className="text-right shrink-0">
 <span className={`text-xs px-2.5 py-1 rounded-full border whitespace-nowrap inline-block ${
 analysisResult.riskLevel === 'Safe' ? 'text-emerald-600 bg-emerald-100/80 border-emerald-200' :
 analysisResult.riskLevel === 'Low' ? 'text-yellow-600 bg-yellow-100/80 border-yellow-200' :
 'text-rose-600 bg-rose-100/80 border-rose-200'
 }`}>
 Risk: {analysisResult.riskLevel}
 </span>
 <p className="text-[10px] text-ink-muted mt-1.5 text-center">{analysisResult.confidenceScore}% confidence</p>
 </div>
 </div>

 {/* Specific Reasons */}
 <div className={`space-y-1.5 pt-2 border-t ${analysisResult.riskLevel === 'Safe' ? 'border-emerald-100' : 'border-rose-100'}`}>
 <p className="text-[11px] text-ink-muted uppercase tracking-wider">
 {analysisResult.riskLevel === 'Safe' ? 'Details:' : 'Reasons:'}
 </p>
 <div className="space-y-1.5 text-xs">
 {(analysisResult.keyRedFlags || []).map((flag, idx) => (
 <div key={idx} className="flex items-start gap-2 text-ink-primary">
 <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${analysisResult.riskLevel === 'Safe' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
 <span>{flag}</span>
 </div>
 ))}
 {(analysisResult.legitimacyChecks || []).map((check, idx) => (
 <div key={`check-${idx}`} className="flex items-start gap-2 text-ink-primary">
 <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${analysisResult.riskLevel === 'Safe' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
 <span>{check}</span>
 </div>
 ))}
 </div>
 </div>

 {/* Recommended Action */}
 <div className={`p-3 rounded-xl border text-xs space-y-1 ${
 analysisResult.riskLevel === 'Safe' ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
 }`}>
 <p className={` flex items-center gap-1.5 ${analysisResult.riskLevel === 'Safe' ? 'text-emerald-900' : 'text-amber-900'}`}>
 <AlertTriangle className={`w-4 h-4 shrink-0 ${analysisResult.riskLevel === 'Safe' ? 'text-emerald-600' : 'text-amber-600'}`} />
 Recommended Action
 </p>
 <p className={`text-[11px] leading-relaxed ${analysisResult.riskLevel === 'Safe' ? 'text-emerald-900' : 'text-amber-900'}`}>
 {analysisResult.recommendedAction}
 </p>
 </div>

 {/* Ask SENTINEL Interactive Chat & Mark Safe CTAs */}
 <div className="pt-2 flex gap-2">
 <GlassButton
 variant="primary"
 className="flex-1"
 size="md"
 onClick={() => setIsChatOpen(true)}
 leftIcon={<Bot className="w-4 h-4 text-blue-400" />}
 >
 Ask SENTINEL
 </GlassButton>
 {analysisResult.riskLevel !== 'Safe' && (
 <GlassButton
 variant="glass"
 className="flex-1 border-gray-200 bg-white/50 text-ink-secondary hover:bg-white"
 size="md"
 onClick={() => {
 alert('Sender whitelisted! This contact is now marked as SAFE.');
 setAnalysisResult({ ...analysisResult, riskLevel: 'Safe', detectedType: 'Safe' });
 }}
 >
 Mark as Safe
 </GlassButton>
 )}
 </div>
 </GlassCard>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Ask Sentinel Modal Assistant */}
 <Modal
 isOpen={isChatOpen}
 onClose={() => setIsChatOpen(false)}
 title="Ask SENTINEL Assistant"
 subtitle="Real-time conversational guidance for payment security"
 maxWidth="md"
 >
 <div className="flex flex-col h-[400px]">
 {/* Chat Stream */}
 <div className="flex-1 overflow-y-auto space-y-3 p-1">
 {chatMessages.map((msg, idx) => (
 <div
 key={idx}
 className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
 >
 {msg.sender === 'bot' && (
 <div className="w-7 h-7 rounded-full bg-sentinel-900 text-white flex items-center justify-center shrink-0 mt-0.5">
 <Bot className="w-4 h-4" />
 </div>
 )}
 <div
 className={`p-3 rounded-2xl text-xs max-w-[80%] leading-relaxed ${msg.sender === 'user'
 ? 'bg-sentinel-900 text-white rounded-tr-sm'
 : 'bg-slate-100 text-ink-primary rounded-tl-sm border'
 }`}
 >
 {msg.text}
 </div>
 {msg.sender === 'user' && (
 <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center shrink-0 mt-0.5">
 <User className="w-4 h-4" />
 </div>
 )}
 </div>
 ))}
 {isBotTyping && (
 <div className="flex items-center gap-2 text-xs text-ink-muted">
 <Loader2 className="w-3.5 h-3.5 animate-spin" />
 <span>SENTINEL is thinking...</span>
 </div>
 )}
 </div>

 {/* Chat Input */}
 <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
 <input
 type="text"
 value={chatInput}
 onChange={(e) => setChatInput(e.target.value)}
 onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
 placeholder="Ask about this message..."
 className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs text-ink-primary focus:outline-none focus:ring-2 focus:ring-sentinel-accent/40"
 />
 <button
 onClick={handleSendChat}
 className="font-semibold p-2.5 bg-sentinel-900 hover:bg-black text-white rounded-xl transition-colors"
 >
 <Send className="w-4 h-4" />
 </button>
 </div>
 </div>
 </Modal>
 </motion.div>
 );
};
