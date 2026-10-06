import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options?: SelectOption[];
  placeholder?: string;
}

/**
 * Custom dark styled select dropdown with 44px mobile touch target and orange focus ring.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      options,
      placeholder,
      id,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || React.useId();

    return (
      <div className="w-full flex flex-col space-y-1.5 text-left">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-[#F5F5F7] select-none">
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={cn(
              // Layout & sizing (min 44px for touch compliance)
              'w-full min-h-[44px] px-3.5 py-2.5 pr-10 text-sm rounded-lg appearance-none cursor-pointer transition-all duration-150',
              // Dark background & borders
              'bg-[#14141A] text-[#F5F5F7] border border-[#2A2A35]',
              // Orange focus ring
              'focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/25',
              // Disabled state
              'disabled:bg-[#1C1C24] disabled:text-[#A1A1AA]/50 disabled:cursor-not-allowed',
              // Error state
              error ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/25' : '',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-[#1C1C24] text-[#A1A1AA]">
                {placeholder}
              </option>
            )}

            {options
              ? options.map((opt) => (
                  <option
                    key={String(opt.value)}
                    value={opt.value}
                    disabled={opt.disabled}
                    className="bg-[#1C1C24] text-[#F5F5F7] py-2"
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          {/* Custom Chevron icon */}
          <div className="absolute right-3.5 flex items-center pointer-events-none text-[#A1A1AA]">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {error && <p className="text-xs text-[#EF4444] font-medium">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-[#A1A1AA]">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
