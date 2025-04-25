import * as React from "react";
import { SidebarProvider } from "../components/ui/sidebar";
import { AdminSidebar } from "../components/ui/AdminSidebar";
import { AppHeader } from "../components/ui/app-header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex flex-col flex-1">
          <AppHeader userName="Alex Smith" userRole="Customer Admin" />
          <main className="flex-1 p-4 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
