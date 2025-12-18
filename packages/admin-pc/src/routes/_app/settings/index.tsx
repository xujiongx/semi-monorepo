import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Breadcrumb } from '@douyinfe/semi-ui';
import styles from './index.module.less';

export const Route = createFileRoute('/_app/settings/')({
  component: SettingsComponent,
});

function SettingsComponent() {
  return (
    <>
        <Breadcrumb
            className={styles.breadcrumb}
            routes={['首页', '设置']}
        />
        <div className={styles.container}>
            设置
        </div>
    </>
  );
}
