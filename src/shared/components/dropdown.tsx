import { useState, useRef, useEffect, ReactNode, FC } from 'react';

interface DropdownProps {
  trigger: ReactNode;
  content: ReactNode;
  align?: 'start' | 'end';
}

export const Dropdown: FC<DropdownProps> = ({ trigger, content, align = 'end' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const alignClass = align === 'start' ? 'left-0' : 'right-0';

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={toggleDropdown}>
        {trigger}
      </div>
      {isOpen && (
        <div
          className={`absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-background ring-black ring-opacity-5 focus:outline-none ${alignClass}`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};
