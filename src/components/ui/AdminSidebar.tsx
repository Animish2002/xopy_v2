import {
  Home,
  Users,
  ShoppingBag,
  FileText,
  BarChart2,
  Settings,
  HelpCircle,
  Share2,
  Database,
  Bell,
  Shield,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "./sidebar";
import logo from "../../assets/xopyLogo.png";

// Admin menu items
const adminItems = [
  {
    title: "Dashboard",
    url: "dashboard",
    icon: Home,
  },
  {
    title: "Manage Users",
    url: "users",
    icon: Users,
  },
  {
    title: "Shop Management",
    url: "shops",
    icon: ShoppingBag,
  },
  {
    title: "Print Reports",
    url: "reports",
    icon: FileText,
  },
  {
    title: "Analytics",
    url: "analytics",
    icon: BarChart2,
  },
  {
    title: "Database",
    url: "database",
    icon: Database,
  },
  {
    title: "Notifications",
    url: "notifications",
    icon: Bell,
  },
  {
    title: "Security",
    url: "security",
    icon: Shield,
  },
  {
    title: "System Settings",
    url: "settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2">
          <span className="text-lg">Admin Portal</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Controls</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={"/admin/" + item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto p-4 border-t">
        <div>
          <img src={logo} alt="logo" className="w-20" />
        </div>
        <div className="space-y-2">
          <a
            href="#"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Admin Support</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Portal</span>
          </a>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
