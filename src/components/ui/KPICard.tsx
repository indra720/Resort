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
          <span className="text-xs sm:text-sm font-medium text-[#A1A1AA] truncate">
            {title}
          </span>
          {Icon && (
            <div className="w-9 h-9 rounded-xl bg-[#1C1C24] border border-[#2A2A35] flex items-center justify-center text-[#FF8A3D] shrink-0">
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F5F7]">
            {value}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            {change && (
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded text-[11px]',
                  trend === 'up' && 'text-[#22C55E] bg-[#22C55E]/10',
                  trend === 'down' && 'text-[#EF4444] bg-[#EF4444]/10',
                  trend === 'neutral' && 'text-[#A1A1AA] bg-[#1C1C24]'
                )}
              >
                {trend === 'up' && <TrendingUp className="w-3 h-3" />}
                {trend === 'down' && <TrendingDown className="w-3 h-3" />}
                {change}
              </span>
            )}

            {subtitle && (
              <span className="text-[#A1A1AA] text-[11px] truncate">{subtitle}</span>
            )}

            {badge && (
              <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-[#CC5500]/18 text-[#FF8A3D] font-medium border border-[#CC5500]/30">
                {badge}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
