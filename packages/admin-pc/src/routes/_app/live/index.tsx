import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Breadcrumb } from '@douyinfe/semi-ui';
import styles from './index.module.less';

export const Route = createFileRoute('/_app/live/')({
  component: LiveComponent,
});

function LiveComponent() {
  return (
    <>
        <Breadcrumb
            className={styles.breadcrumb}
            routes={['首页', '测试功能']}
        />
        <div className={styles.container}>
            测试功能
        </div>
    </>
  );
}
