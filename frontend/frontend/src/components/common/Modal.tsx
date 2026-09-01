import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ModalProps {
 isOpen: boolean;
 onClose: () => void;
 title?: string;
 subtitle?: string;
 children: React.ReactNode;
 maxWidth?: 'sm' | 'md' | 'lg' | 'full';
 showCloseButton?: boolean;
 className?: string;
}

export const Modal: React.FC<ModalProps> = ({
 isOpen,
 onClose,
 title,
 subtitle,
 children,
 maxWidth = 'md',
 showCloseButton = true,
 className,
}) => {
 useEffect(() => {
 if (isOpen) {
 document.body.style.overflow = 'hidden';
 } else {
 document.body.style.overflow = '';
 }
 return () => {
 document.body.style.overflow = '';
 };
 }, [isOpen]);

 const maxWidths = {
 sm: 'max-w-sm',
 md: 'max-w-md',
 lg: 'max-w-lg',
 full: 'max-w-xl',
 };

 return (
 <AnimatePresence>
 {isOpen && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.2 }}
 className="fixed inset-0 bg-black/40 backdrop-blur-sm"
 onClick={onClose}
 />

 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 15 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 15 }}
 transition={{ type: 'spring', damping: 25, stiffness: 350 }}
 className={cn(
 'relative w-full bg-white rounded-3xl shadow-xl z-10 overflow-hidden flex flex-col',
 maxWidths[maxWidth],
 className
 )}
 >
 {(title || showCloseButton) && (
 <div className="flex items-start justify-between p-5 pb-3 border-b border-gray-100/80">
 <div>
 {title && <h3 className="font-bold text-lg text-ink-primary tracking-tight">{title}</h3>}
 {subtitle && <p className="text-xs text-ink-secondary mt-0.5">{subtitle}</p>}
 </div>
 {showCloseButton && (
 <button
 onClick={onClose}
 className="font-semibold p-1.5 rounded-full text-ink-muted hover:text-ink-primary hover:bg-gray-100 transition-colors"
 >
 <X className="w-5 h-5" />
 </button>
 )}
 </div>
 )}

 <div className="p-5">{children}</div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 );
};
