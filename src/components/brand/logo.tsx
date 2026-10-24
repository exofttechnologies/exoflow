import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export function ExoftLogo({ className = '', size = 'md', showSubtitle = true }: LogoProps) {
  const iconSizes = {
    sm: { width: 24, height: 24, barW: 13, barH: 4.5, rx: 2.25 },
    md: { width: 32, height: 32, barW: 18, barH: 6, rx: 3 },
    lg: { width: 40, height: 40, barW: 22, barH: 7.5, rx: 3.75 },
  };

  const textSizes = {
    sm: { title: 'text-sm', subtitle: 'text-[10px]' },
    md: { title: 'text-base', subtitle: 'text-xs' },
    lg: { title: 'text-xl', subtitle: 'text-xs' },
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Brand Icon: Two slanted parallel capsules */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          width={iconSizes[size].width}
          height={iconSizes[size].height}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top slanted pill */}
          <rect
            x="4"
            y="13"
            width="22"
            height="6.5"
            rx="3.25"
            transform="rotate(-35 4 13)"
            fill="currentColor"
            className="text-neutral-950"
          />
          {/* Bottom slanted pill */}
          <rect
            x="11"
            y="23"
            width="22"
            height="6.5"
            rx="3.25"
            transform="rotate(-35 11 23)"
            fill="currentColor"
            className="text-neutral-950"
          />
        </svg>
      </div>

      <div>
        <div className={`font-bold tracking-tight text-neutral-900 leading-tight ${textSizes[size].title}`}>
          Exoft Flow
        </div>
        {showSubtitle && (
          <div className={`text-neutral-400 font-medium tracking-normal ${textSizes[size].subtitle}`}>
            Exoft Technologies
          </div>
        )}
      </div>
    </div>
  );
}
