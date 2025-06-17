'use client';

import { useContext } from 'react';
import { SidebarContextData } from '../models/sidebar';
import { SidebarContext } from '../providers/SidebarProvider';

export function useSidebar(): SidebarContextData {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }

  return context;
}
