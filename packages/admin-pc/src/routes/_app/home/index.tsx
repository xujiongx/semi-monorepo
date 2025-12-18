import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Breadcrumb, Skeleton } from '@douyinfe/semi-ui';
import styles from './index.module.less';

export const Route = createFileRoute('/_app/home/')({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <>
        <Breadcrumb
            className={styles.breadcrumb}
            routes={['首页', '概览']}
        />
        <div className={styles.container}>
           Home
        </div>
    </>
  );
}
