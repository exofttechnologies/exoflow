'use client';

import React, { useState } from 'react';
import { ArrowLeft, Search, SlidersHorizontal, Plus, X } from 'lucide-react';
import { PillButton, CircleButton } from '@/components/ui/button';

export interface PageMetric {
  value: string | number;
  label: string;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral' | 'lime' | 'orange';
}

export interface PageTopHeaderProps {
  title: string;
  backHref?: string;
  actionButton?: React.ReactNode;
  metrics?: PageMetric[];
  categoryLabel?: string;
  categoryCount?: string | number;
  filters?: string[];
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  onFilterIconClick?: () => void;
}

export function PageTopHeader({
  title,
  actionButton,
  metrics = [],
  categoryLabel,
  categoryCount,
  filters = [],
  activeFilter = 'All',
  onFilterChange,
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  onFilterIconClick,
}: PageTopHeaderProps) {
  const [showSearchInput, setShowSearchInput] = useState(false);

  // Helper to render the title with the illuminated lime ring on the letter 'O' (matching reference WORKSPACE)
  const renderTitle = (text: string) => {
    const oIndex = text.indexOf('O');
    if (oIndex !== -1) {
      const before = text.slice(0, oIndex);
      const after = text.slice(oIndex + 1);
      return (
        <span className="flex items-center tracking-tight">
          <span>{before}</span>
          <span className="relative inline-flex items-center justify-center mx-[1px]">
            <span className="text-neutral-950">O</span>
            <span className="absolute inset-0 m-auto w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-[2.5px] border-[#d4f940] bg-[#d4f940]/30 shadow-xs pointer-events-none" />
          </span>
          <span>{after}</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 tracking-tight">
        <span>{text}</span>
        <span className="inline-block w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-[2.5px] border-[#d4f940] bg-neutral-950 shadow-xs ml-0.5" />
      </span>
    );
  };

  return (
    <div className="space-y-3.5 sm:space-y-4 pb-1 select-none">
      {/* Row 1: Back Button, Title with illuminated ring, Action Button, and Top KPI Metrics */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
        {/* Left: Back Arrow + Title with illuminated accent + Action Button */}
        <div className="flex items-center justify-between sm:justify-start gap-2.5 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <CircleButton
              variant="white"
              size="sm"
              className="sm:w-10 sm:h-10"
              onClick={() => window.history.back()}
              title="Go Back"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-800" />
            </CircleButton>

            {/* Large Title with Illuminated Accent Ring */}
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-neutral-950 tracking-tight uppercase">
              {renderTitle(title)}
            </h1>
          </div>

          {actionButton && <div className="sm:ml-2">{actionButton}</div>}
        </div>

        {/* Right: Key Page Metrics (Mobile Swipeable Native Pills) */}
        {metrics.length > 0 && (
          <div className="flex items-center gap-4 sm:gap-8 overflow-x-auto scrollbar-none -mx-3.5 px-3.5 sm:mx-0 sm:px-0 py-1 touch-scroll">
            {metrics.map((m, idx) => (
              <div key={idx} className="flex items-baseline gap-2 shrink-0 bg-white/60 sm:bg-transparent px-3 py-1.5 sm:p-0 rounded-2xl border border-neutral-200/50 sm:border-none shadow-2xs sm:shadow-none">
                <span className="text-xl sm:text-3xl lg:text-4xl font-black text-neutral-950 tracking-tight leading-none">
                  {m.value}
                </span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-semibold text-neutral-500">{m.label}</span>
                    {m.trend && (
                      <span
                        className={`text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded-full leading-none shrink-0 ${
                          m.trendType === 'positive' || m.trendType === 'lime'
                            ? 'bg-[#d4f940] text-neutral-950'
                            : m.trendType === 'orange'
                            ? 'bg-[#fed7aa] text-[#c2410c]'
                            : m.trendType === 'negative'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-neutral-200 text-neutral-800'
                        }`}
                      >
                        {m.trend}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Row 2: Category Title, Underlined Count, Search Circle Button, Filter Circle Button, and Pill Filters */}
      {(categoryLabel || filters.length > 0) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
          {/* Category Label + Underlined Count */}
          <div className="flex items-center justify-between sm:justify-start gap-3 shrink-0">
            {categoryLabel && (
              <h2 className="text-sm sm:text-lg font-extrabold text-neutral-950">{categoryLabel}</h2>
            )}
            {categoryCount !== undefined && (
              <span className="text-xs font-extrabold text-neutral-800 underline underline-offset-4 decoration-neutral-950 decoration-1.5">
                {categoryCount}
              </span>
            )}
          </div>

          {/* Search, Filter Icons + Horizontal Pill Filter Row */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none -mx-3.5 px-3.5 sm:mx-0 sm:px-0 py-1 touch-scroll">
            {/* Search Icon Button & Expandable Input */}
            {onSearchChange && (
              <div className="flex items-center gap-1.5 shrink-0">
                {showSearchInput ? (
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      autoFocus
                      value={searchValue || ''}
                      onChange={(e) => onSearchChange(e.target.value)}
                      placeholder={searchPlaceholder}
                      className="pl-8 pr-7 py-1.5 rounded-full border border-neutral-300 bg-white text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-950 shadow-2xs w-40 sm:w-56"
                    />
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5" />
                    <button
                      onClick={() => {
                        setShowSearchInput(false);
                        onSearchChange('');
                      }}
                      className="absolute right-2 text-neutral-400 hover:text-neutral-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <CircleButton
                    variant="white"
                    size="sm"
                    onClick={() => setShowSearchInput(true)}
                    title="Search"
                  >
                    <Search className="w-3.5 h-3.5 text-neutral-700" />
                  </CircleButton>
                )}
              </div>
            )}

            {/* Filter / Sliders Icon Button */}
            <CircleButton
              variant="white"
              size="sm"
              onClick={onFilterIconClick}
              title="Filter Options"
              className="shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-700" />
            </CircleButton>

            {/* Filter Pills matching "All", "🔥 Hot Client", "Great interest", etc. */}
            {filters.map((f) => {
              const isActive = activeFilter === f;

              return (
                <button
                  key={f}
                  onClick={() => onFilterChange && onFilterChange(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-neutral-950 text-white sm:bg-white sm:text-neutral-950 shadow-sm border border-neutral-200/90 font-extrabold ring-1 ring-neutral-950/5'
                      : 'bg-white/80 text-neutral-600 hover:text-neutral-950 hover:bg-white'
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

