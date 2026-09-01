import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, ShieldAlert } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ToastMessage {
 id: string;
 type: 'success' | 'warning' | 'error' | 'info';
 title: string;
 description?: string;
}

interface ToastProps {
 toasts: ToastMessage[];
 onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
 return (
 <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
 <AnimatePresence>
 {toasts.map((toast) => {
 const icons = {
 success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
 warning: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />,
 error: <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />,
 info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
 };

 const styles = {
 success: 'bg-white/95 border-emerald-200 text-emerald-950 shadow-emerald-500/10',
 warning: 'bg-white/95 border-amber-200 text-amber-950 shadow-amber-500/10',
 error: 'bg-white/95 border-rose-200 text-rose-950 shadow-rose-500/10',
 info: 'bg-white/95 border-blue-200 text-blue-950 shadow-blue-500/10',
 };

 return (
 <motion.div
 key={toast.id}
 initial={{ opacity: 0, y: -20, scale: 0.95 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: -15, scale: 0.95 }}
 transition={{ type: 'spring', stiffness: 400, damping: 25 }}
 onClick={() => onDismiss(toast.id)}
 className={cn(
 'pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border backdrop-blur-xl shadow-lg cursor-pointer',
 styles[toast.type]
 )}
 >
 {icons[toast.type]}
 <div className="flex-1 min-w-0">
 <p className="text-xs tracking-tight">{toast.title}</p>
 {toast.description && (
 <p className="text-[11px] text-ink-secondary mt-0.5 leading-snug">
 {toast.description}
 </p>
 )}
 </div>
 </motion.div>
 );
 })}
 </AnimatePresence>
 </div>
 );
};
