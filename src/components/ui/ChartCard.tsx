import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card';
import { ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

export interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactElement;
  height?: number;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Reusable dark-themed ChartCard wrapper around ResponsiveContainer from Recharts.
 * Ensures charts are fully responsive and readable from 320px mobile screens to large desktop.
 */
export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  children,
  height = 280,
  actions,
  className,
}) => {
  return (
    <Card className={cn('flex flex-col h-full text-left', className)}>
      <CardHeader className="flex-row items-center justify-between pb-2 border-b-0">
        <div>
          <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </CardHeader>

      <CardContent className="pt-2 flex-1 w-full overflow-hidden">
        <div style={{ width: '100%', height: height }} className="min-h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
