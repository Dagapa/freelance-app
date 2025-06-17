import { useContext } from 'react';
import { SidebarContext } from '../components/SidebarContext';

export function useSidebar() {
  return useContext(SidebarContext);
}
