'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface CuteSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  label: string;
}

export function CuteSelect({ value, onChange, options, placeholder, label }: CuteSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-4 relative" ref={containerRef}>
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border-2 rounded-2xl px-6 py-4 font-black transition-all shadow-sm flex items-center justify-between group ${
          isOpen ? 'border-orange-200 ring-4 ring-orange-500/5' : 'border-orange-50 hover:border-orange-100'
        }`}
      >
        <span className={value ? 'text-gray-700' : 'text-gray-400'}>
          {value || placeholder}
        </span>
        <ChevronDown 
          size={18} 
          className={`transition-transform duration-300 text-orange-400 ${isOpen ? 'rotate-180' : ''}`} 
          strokeWidth={3}
        />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border-4 border-orange-50 rounded-[2rem] shadow-2xl z-[60] py-2 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
          <button
            onClick={() => {
              onChange('');
              setIsOpen(false);
            }}
            className="w-full text-left px-6 py-3 text-sm font-black text-gray-400 hover:bg-orange-50 hover:text-orange-500 transition-colors flex items-center justify-between"
          >
            {placeholder}
            {!value && <Check size={16} strokeWidth={3} />}
          </button>
          
          <div className="h-px bg-orange-50 mx-4 my-1" />
          
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full text-left px-6 py-3 text-sm font-black transition-colors flex items-center justify-between ${
                value === option 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-600 hover:bg-orange-50 hover:text-orange-500'
              }`}
            >
              {option}
              {value === option && <Check size={16} strokeWidth={3} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
