import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { Sparkles, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  icon?: LucideIcon;
  iconColor?: string;
  user?: string;
}

export interface ActivityFeedProps {
  title?: string;
  activities: ActivityItem[];
  className?: string;
}

/**
 * ActivityFeed timeline component for operational audit and recent resort events.
 */
export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  title = 'Recent Activity',
  activities,
  className,
}) => {
  return (
    <Card className={cn('text-left flex flex-col h-full', className)}>
      <CardHeader className="pb-3 border-b-0">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#B84C00]" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0 flex-1 overflow-y-auto">
        <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E2E8F0]">
          {activities.map((item) => {
            const Icon = item.icon || Sparkles;
            return (
              <div key={item.id} className="relative group text-left">
                {/* Timeline node circle */}
                <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-white border-2 border-[#B84C00] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#B84C00]" />
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#0F172A] group-hover:text-[#B84C00] transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-[#64748B] shrink-0">{item.time}</span>
                  </div>

                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {item.description}
                  </p>

                  {item.user && (
                    <span className="inline-block text-[10px] text-[#B84C00] bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded font-medium mt-1">
                      By: {item.user}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
