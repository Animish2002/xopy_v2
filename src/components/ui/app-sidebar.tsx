import {
  Home,
  Settings,
  HelpCircle,
  Share2,
  Printer,
  QrCode,
  DollarSign,
  ClipboardList,
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
    url: "dashboard",
    icon: Home,
  },
  {
    title: "View All Prints",
    url: "view-prints",
    icon: Printer,
  },
  {
    title: "Download QR Code",
    url: "downloadQR",
    icon: QrCode,
  },
  {
    title: "Add Pricing",
    url: "add-pricing",
    icon: DollarSign,
  },
  {
    title: "View Pricing",
    url: "view-pricing",
    icon: ClipboardList,
  },
  {
    title: "Settings",
    url: "profile",
    icon: Settings,
  },
];

const name = localStorage.getItem("userName");

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2">
          <span className=" text-lg">Welcome back, {name}</span>
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
                    <a href={"/shopowner/" + item.url}>
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
            href="/shopowner/contact-support"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Contact Support</span>
          </a>
          <a
            
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            onClick={(e) => {
              e.preventDefault();
              navigator.share({
                title: "Xopy App",
                url: "https://www.xopy.in/auth/signin",
              });
            }}
          >
            <Share2 className="w-4 h-4" />
            <span>Share App</span>
          </a>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
