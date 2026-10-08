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
          <label htmlFor={selectId} className="text-sm font-semibold text-[#1F2937] select-none">
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
              'bg-white text-[#1F2937] border border-[#E5E7EB]',
              // Dark orange focus ring
              'focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20',
              // Disabled state
              'disabled:bg-[#FFF8F3] disabled:text-[#6B7280] disabled:cursor-not-allowed',
              // Error state
              error ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/20' : '',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-white text-[#6B7280]">
                {placeholder}
              </option>
            )}

            {options
              ? options.map((opt) => (
                  <option
                    key={String(opt.value)}
                    value={opt.value}
                    disabled={opt.disabled}
                    className="bg-white text-[#1F2937] py-2"
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          {/* Custom Chevron icon */}
          <div className="absolute right-3.5 flex items-center pointer-events-none text-[#6B7280]">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {error && <p className="text-xs text-[#DC2626] font-medium">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-[#6B7280]">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
