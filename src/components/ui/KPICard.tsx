import React from 'react';
import { Card, CardContent } from './Card';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: LucideIcon;
  badge?: string;
  className?: string;
}

/**
 * Responsive Metric/KPI Card displaying financial numbers in ₹ or operational counts.
 */
export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  change,
  trend = 'neutral',
  icon: Icon,
  badge,
  className,
}) => {
  return (
    <Card hoverEffect className={cn('text-left', className)}>
      <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs sm:text-sm font-semibold text-[#64748B] truncate">
            {title}
          </span>
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0F5132] shadow-2xs shrink-0">
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="text-2xl sm:text-[26px] font-extrabold tracking-tight text-[#0F172A]">
            {value}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            {change && (
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded text-[11px]',
                  trend === 'up' && 'text-[#16A34A] bg-emerald-50 border border-emerald-100',
                  trend === 'down' && 'text-[#DC2626] bg-rose-50 border border-rose-100',
                  trend === 'neutral' && 'text-[#64748B] bg-[#F1F5F9]'
                )}
              >
                {trend === 'up' && <TrendingUp className="w-3 h-3" />}
                {trend === 'down' && <TrendingDown className="w-3 h-3" />}
                {change}
              </span>
            )}

            {subtitle && (
              <span className="text-[#64748B] text-[11px] truncate">{subtitle}</span>
            )}

            {badge && (
              <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-[#0F5132] font-semibold border border-emerald-200">
                {badge}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
