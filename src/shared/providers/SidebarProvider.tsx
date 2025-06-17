'use client';

import { useState, createContext } from "react";
import { SidebarContextData, sidebarContextDataDefault } from "../models/sidebar";

export const SidebarContext = createContext<SidebarContextData>(sidebarContextDataDefault);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  const value: SidebarContextData = {
    isOpen,
    close,
    toggle,
  }

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};
