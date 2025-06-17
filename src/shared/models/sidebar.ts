import { createContext } from 'react';

export interface SidebarContextData {
  isOpen: boolean;
  close: () => void;
  toggle: () => void;
}

export const sidebarContextDataDefault: SidebarContextData = {
  isOpen: false,
  close: () => {},
  toggle: () => {},
};
