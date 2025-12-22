import React, { useMemo, useState, useEffect } from 'react';
import { Layout, Button, Avatar, Dropdown, Breadcrumb, Space } from '@douyinfe/semi-ui';
import { IconBell, IconHelpCircle, IconExit, IconHome, IconUser } from '@douyinfe/semi-icons';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { menuConfig, MenuItem } from '@/config/menu';
import request from '@/utils/request';
import styles from './index.module.less';

const { Header } = Layout;

export const AppHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userInfo, setUserInfo] = useState<{ nickname?: string; avatar_url?: string; email?: string }>({});

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) return;
            try {
                const data = await request.get('/user/profile');
                setUserInfo(data as any);
            } catch (error) {
                // Ignore error for header
            }
        };
        fetchProfile();
    }, []);

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
        } else if (path === '/profile') {
            items.push({ name: '个人中心' });
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
                            <Dropdown.Item onClick={() => navigate({ to: '/profile' })} icon={<IconUser />}>
                                个人中心
                            </Dropdown.Item>
                            <Dropdown.Item onClick={handleLogout} icon={<IconExit />}>
                                退出登录
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    }
                >
                    <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <Avatar 
                            color="orange" 
                            size="small" 
                            src={userInfo.avatar_url}
                            style={{ margin: 4 }}
                        >
                            {userInfo.nickname?.[0] || userInfo.email?.[0] || 'A'}
                        </Avatar>
                        <span style={{ marginLeft: 8, color: 'var(--semi-color-text-2)', fontSize: 14 }}>
                            {userInfo.nickname || userInfo.email?.split('@')[0] || '管理员'}
                        </span>
                    </div>
                </Dropdown>
            </Space>
        </Header>
    );
};
