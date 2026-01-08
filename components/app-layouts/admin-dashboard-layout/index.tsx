"use client";
import React, { useState, useEffect } from "react";
import {
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  HomeOutlined,
  ShopOutlined,
  CalendarOutlined,
  StarOutlined,
  MailOutlined,
  AlertOutlined,
  HeartOutlined,
  SettingOutlined,
  LockOutlined,
  LogoutOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Layout, Menu, App, Drawer, message } from "antd";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import UserDropdown from "@/components/shared/user-menu/UserDropdown";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

// Function to create a MenuItem with a Next.js Link
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  href?: string
): MenuItem {
  return {
    key,
    icon,
    children,
    label: href ? <Link href={href}>{label}</Link> : label,
  } as MenuItem;
}

const adminItems: MenuItem[] = [
  getItem(
    "Dashboard",
    "admin-dashboard",
    <DashboardOutlined className="text-lg" />,
    undefined,
    "/admin-dashboard"
  ),
  getItem(
    "Profile",
    "profile",
    <UserOutlined className="text-lg" />,
    undefined,
    "/admin-dashboard/profile"
  ),
  getItem(
    "Listings",
    "listings",
    <HomeOutlined className="text-lg" />,
    [
      getItem(
        "Stays",
        "stays",
        <HomeOutlined className="text-base" />,
        undefined,
        "/admin-dashboard/stays"
      ),
      getItem(
        "Business",
        "business",
        <ApartmentOutlined className="text-base" />,
        undefined,
        "/admin-dashboard/business"
      ),
    ]
    // No href - parent menu with children should not be clickable
  ),
  getItem(
    "Bookings",
    "bookings",
    <CalendarOutlined className="text-lg" />,
    undefined,
    "/admin-dashboard/bookings"
  ),
  getItem(
    "Reviews",
    "reviews",
    <StarOutlined className="text-lg" />,
    undefined,
    "/admin-dashboard/reviews"
  ),
  getItem(
    "Airmail",
    "airmail",
    <MailOutlined className="text-lg" />,
    undefined,
    "/admin-dashboard/airmail"
  ),
  getItem(
    "Squawks",
    "squawks",
    <AlertOutlined className="text-lg" />,
    undefined,
    "/admin-dashboard/squawks"
  ),
  getItem(
    "Users",
    "users",
    <TeamOutlined className="text-lg" />,
    undefined,
    "/admin-dashboard/users"
  ),
  getItem(
    "Favorites",
    "favorites",
    <HeartOutlined className="text-lg" />,
    undefined,
    "/admin-dashboard/favorites"
  ),
  getItem(
    "Features",
    "features",
    <AppstoreOutlined className="text-lg" />,
    undefined,
    "/admin-dashboard/features"
  ),
  getItem(
    "Cancellation Policies",
    "cancellation-policy",
    <FileTextOutlined className="text-lg" />,
    undefined,
    "/admin-dashboard/cancellation-policy"
  ),
  {
    type: "divider",
    className: "my-3",
  },
  getItem(
    "Settings",
    "settings",
    <SettingOutlined className="text-lg" />,
    [
      getItem(
        "Change Password",
        "change-password",
        <LockOutlined className="text-base" />,
        undefined,
        "/admin-dashboard/settings?type=change_password"
      ),
    ]
    // No href - parent menu with children should not be clickable
  ),
  getItem(
    "Logout",
    "logout",
    <LogoutOutlined className="text-lg" />
    // No href - handled via onClick
  ),
];

const AdminDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([
    "admin-dashboard",
  ]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Detect mobile/tablet screens
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-collapse sidebar on desktop when resizing
      if (window.innerWidth >= 768) {
        setCollapsed(false);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const path = pathname;
    const pathSegments = path.split("/").filter((segment) => segment);

    // Determine the selected key based on the last segment of the path
    const lastSegment = pathSegments[pathSegments.length - 1];
    const newSelectedKeys = [lastSegment || "admin-dashboard"];
    setSelectedKeys(newSelectedKeys);

    // Automatically open the parent menu based on the path
    if (pathSegments.length > 1) {
      const parentKey = pathSegments[1];
      setOpenKeys([parentKey]);
    } else {
      setOpenKeys([]);
    }
  }, [pathname]);

  // Function to find the title from the menu items
  const getTitleFromPath = (path: string) => {
    const pathSegments = path.split("/").filter((segment) => segment);
    const lastSegment = pathSegments[pathSegments.length - 1];

    if (!lastSegment || lastSegment === "admin-dashboard") {
      return "Admin Dashboard";
    }

    // Find the item by key in the menu
    const findItem = (
      itemsArray: MenuItem[] | undefined
    ): string | undefined => {
      if (!itemsArray) return undefined;
      for (const item of itemsArray) {
        const antMenuItem = item as {
          key?: string;
          label?: React.ReactNode;
          children?: MenuItem[];
        };
        if (antMenuItem.key === lastSegment) {
          // Safely extract the label, handling strings and JSX elements
          if (typeof antMenuItem.label === "string") {
            return antMenuItem.label;
          }
          if (React.isValidElement(antMenuItem.label)) {
            const child = (antMenuItem.label as any).props.children;
            return typeof child === "string" ? child : undefined;
          }
          return undefined;
        }
        if (antMenuItem.children) {
          const childTitle = findItem(antMenuItem.children);
          if (childTitle) return childTitle;
        }
      }
      return undefined;
    };

    // First try to find the title from the menu items directly
    let title = findItem(adminItems);
    if (title) return title;

    // If not found in menu, format the segment as a title
    return (
      lastSegment.charAt(0).toUpperCase() +
      lastSegment.slice(1).replace(/-/g, " ")
    );
  };

  // Menu component to reuse in both sidebar and drawer
  const menuComponent = (
    <>
      <div className="flex items-center bg-[#f9f9f9] justify-center px-4 h-16 border-b border-gray-200">
        <Link href="/" className="flex items-center justify-center space-x-2">
          <Image
            src="/assets/logo/fly-inn-logo.png"
            alt="Logo"
            width={80}
            height={32}
            className="object-contain transition-all duration-300"
          />
        </Link>
      </div>

      <Menu
        theme="light"
        mode="inline"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={(keys) => setOpenKeys(keys as string[])}
        items={adminItems}
        className="px-2 py-4"
        onClick={async ({ key }) => {
          // Close drawer on mobile when menu item is clicked
          if (isMobile) {
            setDrawerOpen(false);
          }

          // Handle logout
          if (key === "logout") {
            try {
              message.loading("Signing out...");
              await signOut({ redirect: false });
              message.success("Signed out successfully!");
              window.location.href = "/auth/login";
            } catch (error) {
              console.error("Logout error:", error);
              message.error("Logout failed. Please try again.");
              window.location.href = "/auth/login";
            }
          }
        }}
      />
    </>
  );

  return (
    <App>
      <Layout hasSider={!isMobile} className="min-h-screen bg-gray-50">
        {/* Desktop Sidebar - Hidden on mobile */}
        {!isMobile && (
          <Sider
            width={256}
            className="border-r border-gray-200 bg-white h-screen sticky top-0 overflow-auto hidden md:block"
            trigger={null}
            collapsible
            collapsed={collapsed}
          >
            {menuComponent}
          </Sider>
        )}

        {/* Mobile Drawer */}
        <Drawer
          title={
            <div className="flex items-center justify-center">
              <Image
                src="/assets/logo/fly-inn-logo.png"
                alt="Logo"
                width={80}
                height={32}
                className="object-contain"
              />
            </div>
          }
          placement="left"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          bodyStyle={{ padding: 0 }}
          className="md:hidden"
          width={256}
        >
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            onOpenChange={(keys) => setOpenKeys(keys as string[])}
            items={adminItems}
            className="px-2 py-4"
            onClick={async ({ key }) => {
              setDrawerOpen(false);

              // Handle logout
              if (key === "logout") {
                try {
                  message.loading("Signing out...");
                  await signOut({ redirect: false });
                  message.success("Signed out successfully!");
                  window.location.href = "/auth/login";
                } catch (error) {
                  console.error("Logout error:", error);
                  message.error("Logout failed. Please try again.");
                  window.location.href = "/auth/login";
                }
              }
            }}
          />
        </Drawer>

        {/* Main Content */}
        <Layout className="bg-gray-50">
          {/* Modern Header */}
          <Header className="sticky top-0 z-10 w-full flex items-center justify-between bg-white px-4 h-16">
            <div className="flex items-center">
              <Button
                type="text"
                icon={
                  isMobile ? (
                    <MenuUnfoldOutlined className="text-gray-600" />
                  ) : collapsed ? (
                    <MenuUnfoldOutlined className="text-gray-600" />
                  ) : (
                    <MenuFoldOutlined className="text-gray-600" />
                  )
                }
                onClick={() => {
                  if (isMobile) {
                    setDrawerOpen(true);
                  } else {
                    setCollapsed(!collapsed);
                  }
                }}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
              />
              <h1 className="ml-4 text-xl font-semibold text-gray-800 hidden md:block">
                {getTitleFromPath(pathname)}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative rounded-full p-2 text-gray-500 transition hover:bg-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#AF2322]"></span>
              </button>

              <UserDropdown variant="dashboard" />
            </div>
          </Header>

          {/* Content Area */}
          <Content className="m-4">
            <div className="min-h-[calc(100vh-8rem)] rounded-xl  ">
              {children}
            </div>
          </Content>

          {/* Footer */}
          <Footer className="text-center py-4 bg-white border-t border-gray-200 text-gray-500">
            © {new Date().getFullYear()} Fly Inn. All rights reserved.
          </Footer>
        </Layout>
      </Layout>
    </App>
  );
};

export default AdminDashboardLayout;
