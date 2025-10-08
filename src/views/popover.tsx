import React, { useState, useRef, useEffect } from 'react';

interface PopoverProps {
  content: React.ReactNode;
  layout?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  children: React.ReactNode;
}

export function Popover({ 
    children,
    content, 
    layout = 'bottom', 
    className = ''
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && triggerRef.current && popoverRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();
      
      let top = 0;
      let left = 0;

      switch (layout) {
        case 'top':
          top = triggerRect.top - popoverRect.height - 8;
          left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
          break;
        case 'bottom':
          top = triggerRect.bottom + 8;
          left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
          break;
        case 'left':
          top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
          left = triggerRect.left - popoverRect.width - 8;
          break;
        case 'right':
          top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
          left = triggerRect.right + 8;
          break;
      }

      setPosition({ top, left });
    }
  }, [isOpen, layout]);


  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="cursor-pointer"
      >
        {children}
      </div>
      {isOpen && (
        <div
          ref={popoverRef}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className={`fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 ${className}`}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
