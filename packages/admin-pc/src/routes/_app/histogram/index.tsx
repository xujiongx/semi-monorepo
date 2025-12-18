import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Breadcrumb } from '@douyinfe/semi-ui';
import styles from './index.module.less';

export const Route = createFileRoute('/_app/histogram/')({
  component: HistogramComponent,
});

function HistogramComponent() {
  return (
    <>
        <Breadcrumb
            className={styles.breadcrumb}
            routes={['首页', '基础数据']}
        />
        <div className={styles.container}>
            基础数据
        </div>
    </>
  );
}
