import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'text';
}

/**
 * Skeleton loading placeholder with smooth dark pulse animation.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  ...props
}) => {
  const variantStyles = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded-md h-4 w-full',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-[#1C1C24] border border-[#2A2A35]/30',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
};
