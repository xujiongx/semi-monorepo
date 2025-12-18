import React, { useMemo } from "react";
import { Layout, Nav } from "@douyinfe/semi-ui";
import { IconSemiLogo } from "@douyinfe/semi-icons";
import {
  Outlet,
  Link,
  createFileRoute,
  useLocation,
} from "@tanstack/react-router";
import { menuConfig, MenuItem } from "@/config/menu";
import { AppHeader } from "@/components/Header";
import { AppFooter } from "@/components/Footer";

const { Sider, Content } = Layout;

const AppComponent = () => {
  const location = useLocation();

  const selectedKeys = useMemo(() => {
    const currentPath = location.pathname;
    const matched = menuConfig.find((item) => item.path === currentPath);
    return matched ? [matched.itemKey] : ["Home"];
  }, [location.pathname]);

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item) => {
      if (item.items) {
        return (
          <Nav.Sub
            itemKey={item.itemKey}
            text={item.text}
            icon={item.icon}
            key={item.itemKey}
          >
            {renderMenuItems(item.items)}
          </Nav.Sub>
        );
      }
      return (
        <Link
          to={item.path}
          key={item.itemKey}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Nav.Item itemKey={item.itemKey} text={item.text} icon={item.icon} />
        </Link>
      );
    });
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider style={{ backgroundColor: "var(--semi-color-bg-1)" }}>
        <Nav
          selectedKeys={selectedKeys}
          style={{ maxWidth: 220, height: "100%" }}
          header={{
            logo: <IconSemiLogo style={{ fontSize: 36 }} />,
            text: "Admin PC",
          }}
          footer={{
            collapseButton: true,
          }}
        >
          {renderMenuItems(menuConfig)}
        </Nav>
      </Sider>
      <Layout>
        <AppHeader />
        <Content
          style={{
            padding: "24px",
            backgroundColor: "var(--semi-color-bg-0)",
          }}
        >
          <Outlet />
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export const Route = createFileRoute("/_app")({
  component: AppComponent,
});
