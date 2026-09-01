import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface BottomSheetProps {
 isOpen: boolean;
 onClose: () => void;
 title?: string;
 subtitle?: string;
 children: React.ReactNode;
 showCloseButton?: boolean;
 className?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
 isOpen,
 onClose,
 title,
 subtitle,
 children,
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

 return (
 <AnimatePresence>
 {isOpen && (
 <div className="fixed inset-0 z-50 flex items-end justify-center">
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.2 }}
 className="fixed inset-0 bg-black/40 backdrop-blur-sm"
 onClick={onClose}
 />

 <motion.div
 initial={{ y: '100%' }}
 animate={{ y: 0 }}
 exit={{ y: '100%' }}
 transition={{ type: 'spring', damping: 30, stiffness: 350 }}
 drag="y"
 dragConstraints={{ top: 0 }}
 dragElastic={0.2}
 onDragEnd={(_, info) => {
 if (info.offset.y > 100) {
 onClose();
 }
 }}
 className={cn(
 'relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-t-ios-2xl border-t border-x border-white/80 shadow-2xl z-10 max-h-[90vh] flex flex-col',
 className
 )}
 >
 {/* iOS Handle Indicator */}
 <div className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
 <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
 </div>

 {(title || showCloseButton) && (
 <div className="flex items-start justify-between px-6 py-3 border-b border-gray-100/80">
 <div>
 {title && <h3 className="font-bold text-lg text-ink-primary tracking-tight">{title}</h3>}
 {subtitle && <p className="text-xs text-ink-secondary mt-0.5">{subtitle}</p>}
 </div>
 {showCloseButton && (
 <button
 onClick={onClose}
 className="font-semibold p-1 rounded-full text-ink-muted hover:text-ink-primary hover:bg-gray-100 transition-colors"
 >
 <X className="w-5 h-5" />
 </button>
 )}
 </div>
 )}

 <div className="p-6 overflow-y-auto">{children}</div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 );
};
