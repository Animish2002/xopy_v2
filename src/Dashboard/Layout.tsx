import * as React from "react";
import { SidebarProvider } from "../components/ui/sidebar";
import { AppSidebar } from "../components/ui/app-sidebar";
import { AppHeader } from "../components/ui/app-header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <AppHeader userName="Alex Smith" userRole="Customer Admin" />
          <main className="flex-1 p-4 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
