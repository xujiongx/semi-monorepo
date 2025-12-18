import React from 'react';
import { Layout, Nav, Button, Avatar } from '@douyinfe/semi-ui';
import { IconBell, IconHelpCircle } from '@douyinfe/semi-icons';
import styles from './index.module.less';

const { Header } = Layout;

export const AppHeader = () => {
    return (
        <Header className={styles.header}>
            <Nav
                mode="horizontal"
                footer={
                    <>
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
                        <Avatar color="orange" size="small">
                            Admin
                        </Avatar>
                    </>
                }
            ></Nav>
        </Header>
    );
};
