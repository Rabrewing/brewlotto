'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type BrandedSelectOption = {
  value: string;
  label: string;
  description?: string;
};

interface BrandedSelectProps {
  id?: string;
  label: string;
  value: string;
  options: BrandedSelectOption[];
  onChange: (value: string) => void;
  className?: string;
}

export function BrandedSelect({
  id,
  label,
  value,
  options,
  onChange,
  className = '',
}: BrandedSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) || options[0],
    [options, value],
  );

  return (
    <div ref={rootRef} className={`relative ${className}`.trim()}>
      {id ? (
        <label htmlFor={id} className="mb-2 block text-[12px] uppercase tracking-[0.16em] text-white/35">
          {label}
        </label>
      ) : null}
      <button
        id={id}
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between rounded-[18px] border border-[#ffc742]/16 bg-[linear-gradient(145deg,rgba(28,18,14,0.96),rgba(9,9,10,0.98))] px-4 py-3 text-left text-white outline-none transition hover:border-[#ffc742]/34 focus:border-[#ffc742]/45"
      >
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-medium text-[#f7ddb3]">{selectedOption?.label || label}</span>
          {selectedOption?.description ? (
            <span className="mt-1 block text-[13px] text-white/48">{selectedOption.description}</span>
          ) : null}
        </span>
        <span className="ml-4 text-[#ffc742]">{open ? '▴' : '▾'}</span>
      </button>

      {open ? (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-[18px] border border-[#ffc742]/18 bg-[linear-gradient(180deg,rgba(17,12,10,0.98),rgba(8,8,8,0.98))] shadow-[0_20px_40px_rgba(0,0,0,0.45)]">
          <div className="max-h-72 overflow-y-auto p-2">
            {options.map((option) => {
              const isActive = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full flex-col items-start rounded-[14px] px-4 py-3 text-left transition ${
                    isActive
                      ? 'border border-[#ffc742]/28 bg-[#ffc742]/12'
                      : 'border border-transparent bg-transparent hover:border-[#ffc742]/16 hover:bg-white/[0.03]'
                  }`}
                >
                  <span className={`text-[15px] font-medium ${isActive ? 'text-[#ffe0a1]' : 'text-white/88'}`}>
                    {option.label}
                  </span>
                  {option.description ? (
                    <span className="mt-1 text-[13px] leading-6 text-white/48">{option.description}</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
