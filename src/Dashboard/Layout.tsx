import * as React from "react";
import { SidebarProvider } from "../components/ui/sidebar";
import { AppSidebar } from "../components/ui/app-sidebar";
import { AppHeader } from "../components/ui/app-header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const name = localStorage.getItem("userName");
  const role = localStorage.getItem("role");

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex flex-col flex-1">
        <AppHeader userName={name ?? ""} userRole={role?.toString() ?? undefined} />
          <main className="flex-1 md:p-4 p-1.5 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
