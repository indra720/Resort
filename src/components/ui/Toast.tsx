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
    success: <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0" />,
    info: <Info className="w-5 h-5 text-[#2563EB] shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200',
    error: 'border-rose-200',
    warning: 'border-amber-200',
    info: 'border-blue-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-white border ${borders[toast.type]} shadow-xl text-[#0F172A]`}
    >
      {icons[toast.type]}

      <div className="flex-1 text-left min-w-0">
        <h4 className="text-sm font-semibold text-[#0F172A]">{toast.title}</h4>
        {toast.description && (
          <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed break-words">
            {toast.description}
          </p>
        )}
      </div>

      <button
        onClick={onDismiss}
        className="w-8 h-8 -mr-1 -mt-1 flex items-center justify-center rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
