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
          <label htmlFor={selectId} className="text-sm font-semibold text-[#0F172A] select-none">
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
              // Light background & borders
              'bg-white text-[#0F172A] border border-[#E2E8F0]',
              // Orange focus ring
              'focus:outline-none focus:border-[#B84C00] focus:ring-2 focus:ring-[#B84C00]/20',
              // Disabled state
              'disabled:bg-[#F1F5F9] disabled:text-[#94A3B8] disabled:cursor-not-allowed',
              // Error state
              error ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/20' : '',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-white text-[#94A3B8]">
                {placeholder}
              </option>
            )}

            {options
              ? options.map((opt) => (
                  <option
                    key={String(opt.value)}
                    value={opt.value}
                    disabled={opt.disabled}
                    className="bg-white text-[#0F172A] py-2"
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          {/* Custom Chevron icon */}
          <div className="absolute right-3.5 flex items-center pointer-events-none text-[#64748B]">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {error && <p className="text-xs text-[#DC2626] font-medium">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-[#64748B]">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
