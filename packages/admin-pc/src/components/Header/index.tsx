import React from 'react';
import { Layout, Button, Avatar, Dropdown } from '@douyinfe/semi-ui';
import { IconBell, IconHelpCircle, IconExit } from '@douyinfe/semi-icons';
import { useNavigate } from '@tanstack/react-router';
import styles from './index.module.less';

const { Header } = Layout;

export const AppHeader = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate({ to: '/login' });
    };

    return (
        <Header className={styles.header}>
            <Button
                theme="borderless"
                icon={<IconBell />}
                className={styles.icon}
            />
            <Button
                theme="borderless"
                icon={<IconHelpCircle />}
                className={styles.icon}
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
                <Avatar color="orange" size="small" style={{ cursor: 'pointer' }}>
                    Admin
                </Avatar>
            </Dropdown>
        </Header>
    );
};
