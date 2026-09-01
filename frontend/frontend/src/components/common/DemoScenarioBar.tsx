import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShieldAlert, CheckCircle, MessageSquareWarning, LifeBuoy, ChevronDown, ChevronUp, Smartphone, Monitor } from 'lucide-react';

interface DemoScenarioBarProps {
 onTriggerScenario: (scenarioId: 'job_scam_flow' | 'safe_pay_flow' | 'message_analyzer' | 'incident_case') => void;
 isDeviceFrame: boolean;
 onToggleDeviceFrame: () => void;
}

export const DemoScenarioBar: React.FC<DemoScenarioBarProps> = ({
 onTriggerScenario,
 isDeviceFrame,
 onToggleDeviceFrame,
}) => {
 const [isExpanded, setIsExpanded] = useState(false);

 return (
 <div className="w-full z-40 mb-3 print:hidden">
 <div className="max-w-xl mx-auto px-3">
 <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-xl p-2.5 text-white">
 <div className="flex items-center justify-between gap-2">
 <div className="flex items-center gap-2">
 <span className="flex h-2.5 w-2.5 relative">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
 </span>
 <span className="text-xs tracking-tight text-white flex items-center gap-1.5 font-medium">
 <Sparkles className="w-3.5 h-3.5 text-blue-400" />
 SENTINEL Interactive Scenarios
 </span>
 </div>

 <div className="flex items-center gap-1.5">
 <button
 onClick={onToggleDeviceFrame}
 className="font-semibold px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1 border border-slate-700 transition-colors"
 title="Toggle iPhone frame"
 >
 {isDeviceFrame ? <Smartphone className="w-3 h-3 text-blue-400" /> : <Monitor className="w-3 h-3 text-blue-400" />}
 <span className="hidden sm:inline">{isDeviceFrame ? 'iPhone View' : 'Full Screen'}</span>
 </button>

 <button
 onClick={() => setIsExpanded(!isExpanded)}
 className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
 >
 {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
 </button>
 </div>
 </div>

 <AnimatePresence>
 {isExpanded && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: 'auto' }}
 exit={{ opacity: 0, height: 0 }}
 className="pt-2.5 mt-2 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2"
 >
 <button
 onClick={() => onTriggerScenario('job_scam_flow')}
 className="flex items-center gap-2 p-2 rounded-xl bg-rose-950/40 border border-rose-800/50 hover:bg-rose-900/50 text-left transition-all group"
 >
 <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 group-hover:scale-110 transition-transform" />
 <div>
 <p className="text-[11px] text-rose-200">1. Pause Before Pay</p>
 <p className="text-[9px] text-rose-300/80">₹8,500 Job Scam Flow</p>
 </div>
 </button>

 <button
 onClick={() => onTriggerScenario('safe_pay_flow')}
 className="flex items-center gap-2 p-2 rounded-xl bg-emerald-950/40 border border-emerald-800/50 hover:bg-emerald-900/50 text-left transition-all group"
 >
 <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
 <div>
 <p className="text-[11px] text-emerald-200">2. Safe Payment</p>
 <p className="text-[9px] text-emerald-300/80">₹850 to Rahul Sharma</p>
 </div>
 </button>

 <button
 onClick={() => onTriggerScenario('message_analyzer')}
 className="flex items-center gap-2 p-2 rounded-xl bg-blue-950/40 border border-blue-800/50 hover:bg-blue-900/50 text-left transition-all group"
 >
 <MessageSquareWarning className="w-4 h-4 text-blue-400 shrink-0 group-hover:scale-110 transition-transform" />
 <div>
 <p className="text-[11px] text-blue-200">3. AI Scam Analyzer</p>
 <p className="text-[9px] text-blue-300/80">Analyze suspicious text</p>
 </div>
 </button>

 <button
 onClick={() => onTriggerScenario('incident_case')}
 className="flex items-center gap-2 p-2 rounded-xl bg-amber-950/40 border border-amber-800/50 hover:bg-amber-900/50 text-left transition-all group"
 >
 <LifeBuoy className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
 <div>
 <p className="text-[11px] text-amber-200">4. Incident Case</p>
 <p className="text-[9px] text-amber-300/80">"I got scammed" guide</p>
 </div>
 </button>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </div>
 </div>
 );
};
