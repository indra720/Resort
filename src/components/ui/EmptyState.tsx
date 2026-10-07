import React from 'react';
import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * EmptyState component for tables, lists, and search results when no records are found.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl bg-white border border-[#E2E8F0] shadow-xs',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#B84C00] mb-4 shadow-xs">
        {icon || <Inbox className="w-7 h-7" />}
      </div>

      <h3 className="text-base sm:text-lg font-bold text-[#B84C00] mb-1">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-[#64748B] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {action && <div className="flex items-center justify-center">{action}</div>}
    </div>
  );
};
