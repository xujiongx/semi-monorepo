import React, { useMemo } from "react";
import { Layout, Nav } from "@douyinfe/semi-ui";
import { IconSemiLogo } from "@douyinfe/semi-icons";
import {
  Outlet,
  createFileRoute,
  useLocation,
  useNavigate,
  redirect,
} from "@tanstack/react-router";
import { menuConfig, MenuItem } from "@/config/menu";
import { AppHeader } from "@/components/Header";
import { AppFooter } from "@/components/Footer";

const { Sider, Content } = Layout;

const AppComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKeys = useMemo(() => {
    const currentPath = location.pathname;
    
    const findKey = (items: MenuItem[]): string | null => {
      for (const item of items) {
        if (item.path === currentPath) return item.itemKey;
        if (item.items) {
          const childKey = findKey(item.items);
          if (childKey) return childKey;
        }
      }
      return null;
    };

    const key = findKey(menuConfig);
    return key ? [key] : [];
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
        <Nav.Item 
            itemKey={item.itemKey} 
            text={item.text} 
            icon={item.icon} 
            key={item.itemKey}
            onClick={() => item.path && navigate({ to: item.path })}
        />
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
            text: "时光储存库",
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
      </Layout>
    </Layout>
  );
};

export const Route = createFileRoute("/_app")({
  beforeLoad: ({ location }) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AppComponent,
});
