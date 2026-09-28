import React from 'react';
import { cn } from '../../lib/utils';

export const TooltipProvider: React.FC<React.PropsWithChildren> = ({ children }) => <>{children}</>;

export const Tooltip: React.FC<React.PropsWithChildren> = ({ children }) => (
    <span className="group relative inline-flex">{children}</span>
);

interface TooltipTriggerProps extends React.HTMLAttributes<HTMLSpanElement> {
    asChild?: boolean;
}

export const TooltipTrigger: React.FC<React.PropsWithChildren<TooltipTriggerProps>> = ({ children }) => <>{children}</>;

export const TooltipContent: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className, ...props }) => (
    <span
        role="tooltip"
        className={cn('pointer-events-none absolute right-0 top-full z-50 mt-2 hidden w-max max-w-64 bg-foreground px-3 py-1.5 text-xs text-background shadow-md group-hover:block group-focus-within:block', className)}
        {...props}
    />
);
