import React from 'react';
import { IconHome, IconHistogram, IconLive, IconSetting } from '@douyinfe/semi-icons';

export interface MenuItem {
  itemKey: string;
  text: string;
  icon: React.ReactNode;
  path?: string;
  items?: MenuItem[];
}

export const menuConfig: MenuItem[] = [
  {
    itemKey: 'Home',
    text: '首页',
    icon: <IconHome />,
    path: '/home',
  },
  {
    itemKey: 'Histogram',
    text: '基础数据',
    icon: <IconHistogram />,
    path: '/histogram',
  },
  {
    itemKey: 'Live',
    text: '测试功能',
    icon: <IconLive />,
    path: '/live',
  },
  {
    itemKey: 'Setting',
    text: '设置',
    icon: <IconSetting />,
    path: '/settings',
  },
];
