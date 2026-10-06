import React from 'react';
import { useToastStore, ToastItem } from '@/store/useToastStore';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none w-full max-w-sm sm:max-w-md px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((item) => (
          <ToastCard key={item.id} toast={item} onDismiss={() => removeToast(item.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: () => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ toast, onDismiss }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0" />,
    info: <Info className="w-5 h-5 text-[#3B82F6] shrink-0" />,
  };

  const borders = {
    success: 'border-[#22C55E]/40',
    error: 'border-[#EF4444]/40',
    warning: 'border-[#F59E0B]/40',
    info: 'border-[#3B82F6]/40',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-[#14141A] border ${borders[toast.type]} shadow-xl text-[#F5F5F7]`}
    >
      {icons[toast.type]}

      <div className="flex-1 text-left min-w-0">
        <h4 className="text-sm font-semibold">{toast.title}</h4>
        {toast.description && (
          <p className="text-xs text-[#A1A1AA] mt-0.5 leading-relaxed break-words">
            {toast.description}
          </p>
        )}
      </div>

      <button
        onClick={onDismiss}
        className="w-8 h-8 -mr-1 -mt-1 flex items-center justify-center rounded-lg text-[#A1A1AA] hover:text-[#F5F5F7] hover:bg-[#1C1C24] transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
