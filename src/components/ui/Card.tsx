import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base card styling - Pure Crisp White Surface with Layered Luxury Shadow
          'bg-white text-[#111827] border border-[#E2E8F0] rounded-xl sm:rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_1px_3px_0_rgba(0,0,0,0.02)] transition-all duration-200 overflow-hidden',
          hoverEffect && 'hover:border-[#0F5132]/40 hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-0.5',
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-4 sm:p-5 flex flex-col space-y-1.5 border-b border-[#E2E8F0]', className)}
        {...props}
      />
    );
  }
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('text-base sm:text-lg font-bold text-[#0F5132] tracking-tight', className)}
        {...props}
      >
        {children}
      </h3>
    );
  }
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-xs sm:text-sm text-[#64748B]', className)}
        {...props}
      />
    );
  }
);
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-4 sm:p-5', className)}
        {...props}
      />
    );
  }
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-4 sm:p-5 pt-0 sm:pt-0 flex items-center', className)}
        {...props}
      />
    );
  }
);
CardFooter.displayName = 'CardFooter';
