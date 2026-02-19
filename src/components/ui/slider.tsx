'use client';

import React, { useCallback, useRef, useEffect } from 'react';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  label: string;
  formatValue?: (value: number) => string;
  onChange: (value: number) => void;
  className?: string;
}

export function Slider({
  value,
  min,
  max,
  step,
  label,
  formatValue,
  onChange,
  className = '',
}: SliderProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingValue = useRef(value);

  const displayValue = formatValue ? formatValue(value) : String(value);

  const debouncedOnChange = useCallback(
    (newValue: number) => {
      pendingValue.current = newValue;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onChange(pendingValue.current);
      }, 300);
    },
    [onChange]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    debouncedOnChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let newValue = value;
    switch (e.key) {
      case 'PageUp':
        e.preventDefault();
        newValue = Math.min(max, value + 500);
        onChange(newValue);
        break;
      case 'PageDown':
        e.preventDefault();
        newValue = Math.max(min, value - 500);
        onChange(newValue);
        break;
    }
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={className}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={displayValue}
        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        style={{
          background: `linear-gradient(to right, hsl(var(--primary)) ${percentage}%, hsl(var(--muted)) ${percentage}%)`,
        }}
      />
    </div>
  );
}
