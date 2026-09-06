import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  variant = 'primary',
  size = 'sm',
  className,
  ...props
}: BadgeProps) {
  const variantStyles = {
    primary: 'bg-primary-light text-primary border-primary/20',
    secondary: 'bg-surface-elevated text-text-secondary border-border',
    accent: 'bg-accent-light text-accent border-accent/20',
    success: 'bg-success-light text-success border-success/20',
    warning: 'bg-warning-light text-warning border-warning/20',
    danger: 'bg-danger-light text-danger border-danger/20',
    neutral: 'bg-surface-hover text-text-muted border-border-subtle',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center font-medium rounded-md border tracking-wide uppercase font-mono',
          variantStyles[variant],
          sizeStyles[size],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
}
