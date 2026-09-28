import React from 'react';
import { cn } from '../../lib/utils';

type AlertVariant = 'default' | 'destructive' | 'warning' | 'success';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: AlertVariant;
}

const variantClasses: Record<AlertVariant, string> = {
    default: 'border-border bg-card text-card-foreground',
    destructive: 'border-red-400/70 bg-card text-foreground',
    warning: 'border-amber-400/70 bg-card text-foreground',
    success: 'border-emerald-400/70 bg-card text-foreground',
};

export const Alert = ({ className, variant = 'default', ...props }: AlertProps) => (
    <div role="alert" className={cn('relative w-full border p-4 text-sm', variantClasses[variant], className)} {...props} />
);

export const AlertTitle = ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn('mb-1 font-semibold', className)} {...props}>{children}</h3>
);

export const AlertDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn('text-sm opacity-90', className)} {...props} />
);
