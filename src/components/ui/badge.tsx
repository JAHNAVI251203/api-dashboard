import React from 'react';
import { cn } from '../../lib/utils';

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
    default: 'border-transparent bg-primary text-primary-foreground',
    secondary: 'border-transparent bg-secondary text-secondary-foreground',
    outline: 'border-border text-foreground',
    destructive: 'border-transparent bg-destructive text-destructive-foreground',
    success: 'border-transparent bg-emerald-600 text-white dark:bg-emerald-500 dark:text-emerald-950',
    warning: 'border-transparent bg-amber-400 text-amber-950',
};

export const Badge = ({ className, variant = 'default', ...props }: BadgeProps) => (
    <span
        className={cn('inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold', variantClasses[variant], className)}
        {...props}
    />
);
