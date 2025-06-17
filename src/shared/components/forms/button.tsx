import { FC } from "react";

interface ButtonProps {
  children: React.ReactNode;
  size?: string;
  onClick?: () => void;
}

export const Button: FC<ButtonProps> = ({ children, onClick, size }) => {
  return <button onClick={onClick} className={size}>{children}</button>;
}