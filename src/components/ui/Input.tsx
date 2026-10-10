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
          <label htmlFor={inputId} className="text-sm font-semibold text-[#1F2937] select-none">
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#6B7280]">
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
              // Light background & borders
              'bg-white text-[#1F2937] placeholder:text-[#6B7280] border border-[#E5E7EB]',
              // Dark orange focus ring
              'focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20',
              // Disabled state
              'disabled:bg-[#F8FAFC] disabled:text-[#6B7280] disabled:cursor-not-allowed',
              // Padding adjustments for left and right icons
              leftIcon ? 'pl-10' : '',
              rightIcon ? 'pr-10' : '',
              // Error state border
              error ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/20' : '',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-[#6B7280]">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="text-xs text-[#DC2626] font-medium">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-[#6B7280]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
