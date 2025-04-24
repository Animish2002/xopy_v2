import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  HelpCircle,
  Share2,
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

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "home",
    icon: Home,
  },
  {
    title: "View All Prints",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Download QR Code",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Add Pricing",
    url: "#",
    icon: Search,
  },
  {
    title: "View Pricing",
    url: "#",
    icon: HelpCircle,
  },
  {
    title: "Settings",
    url: "setting",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2">
          <span className=" text-lg">Customer portal</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menus</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
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
            <span>Contact Support</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <Share2 className="w-4 h-4" />
            <span>Share App</span>
          </a>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
