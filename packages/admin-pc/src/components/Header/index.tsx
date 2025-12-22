import React, { useMemo } from 'react';
import { Layout, Button, Avatar, Dropdown, Breadcrumb, Space } from '@douyinfe/semi-ui';
import { IconBell, IconHelpCircle, IconExit, IconHome } from '@douyinfe/semi-icons';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { menuConfig, MenuItem } from '@/config/menu';
import styles from './index.module.less';

const { Header } = Layout;

export const AppHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate({ to: '/login' });
    };

    const breadcrumbItems = useMemo(() => {
        const path = location.pathname;
        const items: { name: string; path?: string }[] = [{ name: '首页', path: '/home' }];

        if (path === '/home') return items;

        const findPath = (menuItems: MenuItem[], parents: MenuItem[] = []): boolean => {
            for (const item of menuItems) {
                if (item.path === path) {
                    parents.forEach(p => items.push({ name: p.text }));
                    items.push({ name: item.text });
                    return true;
                }
                if (item.items) {
                    if (findPath(item.items, [...parents, item])) return true;
                }
            }
            return false;
        };

        findPath(menuConfig);
        
        // Fallback for special pages not in menu (e.g. edit)
        if (path.startsWith('/content/edit/')) {
            items.push({ name: '内容管理' });
            items.push({ name: '文章编辑' });
        } else if (path === '/content/create') {
            items.push({ name: '内容管理' });
            items.push({ name: '新建文章' });
        }

        return items;
    }, [location.pathname]);

    return (
        <Header className={styles.header}>
            <div className={styles.left}>
                <Breadcrumb>
                    {breadcrumbItems.map((item, idx) => (
                        <Breadcrumb.Item 
                            key={idx}
                            icon={idx === 0 ? <IconHome /> : undefined}
                            onClick={() => item.path && navigate({ to: item.path })}
                            style={{ cursor: item.path ? 'pointer' : 'default' }}
                        >
                            {item.name}
                        </Breadcrumb.Item>
                    ))}
                </Breadcrumb>
            </div>
            
            <Space spacing={16} className={styles.right}>
                <Button
                    theme="borderless"
                    icon={<IconBell size="large" />}
                    style={{ color: 'var(--semi-color-text-2)' }}
                />
                <Button
                    theme="borderless"
                    icon={<IconHelpCircle size="large" />}
                    style={{ color: 'var(--semi-color-text-2)' }}
                />
                <Dropdown
                    position="bottomRight"
                    render={
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={handleLogout} icon={<IconExit />}>
                                退出登录
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    }
                >
                    <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <Avatar color="orange" size="small" style={{ margin: 4 }}>
                            Admin
                        </Avatar>
                        <span style={{ marginLeft: 8, color: 'var(--semi-color-text-2)', fontSize: 14 }}>管理员</span>
                    </div>
                </Dropdown>
            </Space>
        </Header>
    );
};
