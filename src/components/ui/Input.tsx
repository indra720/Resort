import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Text Input with 44px touch target, dark theme styling, and orange focus ring.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if none provided for label pairing
    const inputId = id || React.useId();

    return (
      <div className="w-full flex flex-col space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#F5F5F7] select-none">
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#A1A1AA]">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            type={type}
            ref={ref}
            disabled={disabled}
            className={cn(
              // Layout & sizing (min 44px for touch compliance)
              'w-full min-h-[44px] px-3.5 py-2.5 text-sm rounded-lg transition-all duration-150',
              // Dark background & borders
              'bg-[#14141A] text-[#F5F5F7] placeholder:text-[#A1A1AA]/60 border border-[#2A2A35]',
              // Orange focus ring
              'focus:outline-none focus:border-[#CC5500] focus:ring-2 focus:ring-[#CC5500]/25',
              // Disabled state
              'disabled:bg-[#1C1C24] disabled:text-[#A1A1AA]/50 disabled:cursor-not-allowed',
              // Padding adjustments for left and right icons
              leftIcon ? 'pl-10' : '',
              rightIcon ? 'pr-10' : '',
              // Error state border
              error ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/25' : '',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-[#A1A1AA]">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="text-xs text-[#EF4444] font-medium">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-[#A1A1AA]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
