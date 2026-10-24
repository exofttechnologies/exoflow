import React from 'react';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'black' | 'lime' | 'white' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function PillButton({
  children,
  className,
  variant = 'black',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled,
  ...props
}: PillButtonProps) {
  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-4.5 py-2 text-xs font-semibold gap-2',
    lg: 'px-5 py-2.5 text-sm font-semibold gap-2.5',
  };

  const variantStyles = {
    black:
      'bg-neutral-950 text-white hover:bg-neutral-800 active:scale-[0.98] shadow-xs',
    lime:
      'bg-[#d4f940] text-neutral-950 hover:bg-[#c5ea34] font-bold active:scale-[0.98] shadow-xs',
    white:
      'bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 active:scale-[0.98] shadow-xs',
    outline:
      'bg-transparent text-neutral-800 border border-neutral-300 hover:bg-neutral-100/80 active:scale-[0.98]',
    ghost:
      'bg-transparent text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 active:scale-[0.98]',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-all duration-150 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
}

export interface CircleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'black' | 'lime' | 'white';
  size?: 'sm' | 'md' | 'lg';
}

export function CircleButton({
  children,
  className,
  variant = 'black',
  size = 'md',
  disabled,
  ...props
}: CircleButtonProps) {
  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const variantStyles = {
    black: 'bg-neutral-950 text-white hover:bg-neutral-800 active:scale-[0.96] shadow-xs',
    lime: 'bg-[#d4f940] text-neutral-950 hover:bg-[#c5ea34] active:scale-[0.96] shadow-xs',
    white:
      'bg-white text-neutral-800 border border-neutral-200 hover:bg-neutral-50 active:scale-[0.96] shadow-xs',
  };

  return (
    <button
      className={cn(
        'rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export interface SelectPillProps {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function SelectPill({ label, icon, onClick, className, children }: SelectPillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full sm:w-auto inline-flex items-center justify-between gap-3 px-4 py-2.5 rounded-full bg-white border border-neutral-200/90 text-xs font-semibold text-neutral-800 shadow-xs hover:border-neutral-400 active:scale-[0.99] transition-all cursor-pointer select-none',
        className
      )}
    >
      <div className="flex items-center gap-2 truncate">
        {icon && <span className="text-neutral-500 shrink-0">{icon}</span>}
        <span className="truncate">{label}</span>
      </div>
      {children || <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />}
    </button>
  );
}

export interface DateBadgePillProps {
  day: number | string;
  weekday: string;
  month: string;
  className?: string;
}

export function DateBadgePill({ day, weekday, month, className }: DateBadgePillProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white border border-neutral-200/80 shadow-xs select-none',
        className
      )}
    >
      <div className="w-6 h-6 rounded-full bg-neutral-950 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
        {day}
      </div>
      <div className="text-xs font-semibold text-neutral-900 leading-tight">
        <span>{weekday}, </span>
        <span className="text-neutral-500 font-normal">{month}</span>
      </div>
    </div>
  );
}

export interface DayPillProps {
  dayNumber: number | string;
  dayName: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function DayPill({ dayNumber, dayName, isActive = false, onClick, className }: DayPillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-11 py-2.5 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer select-none',
        isActive
          ? 'bg-[#d4f940] text-neutral-950 shadow-sm font-bold scale-105'
          : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-100',
        className
      )}
    >
      <span className="text-xs font-extrabold">{dayNumber}</span>
      <span className="text-[10px] uppercase tracking-wider font-semibold opacity-70">
        {dayName}
      </span>
    </button>
  );
}
