import { Header } from '@/shared/components/header'
import { SidebarProvider } from '@/shared/providers/SidebarProvider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-4 md:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
