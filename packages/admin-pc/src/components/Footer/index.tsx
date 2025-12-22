import React from 'react';
import { Layout } from '@douyinfe/semi-ui';
import { IconSemiLogo } from '@douyinfe/semi-icons';
import styles from './index.module.less';
import { SITE_CONFIG } from '@/config/site';

const { Footer } = Layout;

export const AppFooter = () => {
    return (
        <Footer className={styles.footer}>
            <span className={styles.copyright}>
                <IconSemiLogo size="large" style={{ marginRight: '8px' }} />
                <span>{SITE_CONFIG.copyright}</span>
            </span>
            <span>
                <span className={styles.feedback}>反馈建议</span>
                <span>关于我们</span>
            </span>
        </Footer>
    );
};
