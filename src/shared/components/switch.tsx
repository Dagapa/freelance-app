import { FC, ReactNode } from 'react';

interface SwitchProps {
  iconOn: ReactNode;
  iconOff: ReactNode;
  isChecked: boolean;
  onChange: (checked: boolean) => void;
}

export const Switch: FC<SwitchProps> = ({ iconOn, iconOff, isChecked, onChange }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        value=""
        className="w-0 h-0"
        checked={isChecked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {iconOff}
      {iconOn}
    </label>
  );
};
